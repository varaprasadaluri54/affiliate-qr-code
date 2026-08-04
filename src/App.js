import React, { useState, useRef, useCallback } from "react";
import { QRCode } from "react-qrcode-logo";
import debounce from "lodash.debounce";
import { Helmet } from "react-helmet-async";
import "./styles.css";

// Asset Imports
import amazonLogo from "./assets/amazon.png";
import myntraLogo from "./assets/myntra.png";
import flipkartLogo from "./assets/flipkart.png";
import meeshoLogo from "./assets/meesho.png";

const brandPresets = {
  custom: {
    id: "custom",
    name: "Custom QR",
    fgColor: "#000000",
    eyeColor: "#000000",
    qrStyle: "squares",
    eyeRadius: 0,
    logoKey: "none"
  },
  flipkart: {
    id: "flipkart",
    name: "Flipkart",
    fgColor: "#2874F0", // Flipkart Vibrant Blue
    eyeColor: "#FFE500", // Flipkart Yellow
    qrStyle: "dots",
    eyeRadius: 15,
    logoKey: "flipkart"
  },
  amazon: {
    id: "amazon",
    name: "Amazon",
    fgColor: "#000000", // Black dots
    eyeColor: "#FF9900", // Amazon Orange
    qrStyle: "dots",
    eyeRadius: 20,
    logoKey: "amazon"
  },
  myntra: {
    id: "myntra",
    name: "Myntra",
    fgColor: "#3E4152", // Myntra Charcoal
    eyeColor: "#FF3F6C", // Myntra Pink/Red
    qrStyle: "dots",
    eyeRadius: 20,
    logoKey: "myntra"
  },
  meesho: {
    id: "meesho",
    name: "Meesho",
    fgColor: "#333333", // Dark Grey
    eyeColor: "#F43397", // Meesho Pink
    qrStyle: "dots",
    eyeRadius: 20,
    logoKey: "meesho"
  }
};

export default function App() {
  const [selectedBrand, setSelectedBrand] = useState("flipkart"); // Default to Flipkart to match screenshot
  const [inputValue, setInputValue] = useState("https://example.com");
  const [qrText, setQrText] = useState("https://example.com");
  const [isGenerating, setIsGenerating] = useState(false);

  // Custom design overrides
  const [fgColor, setFgColor] = useState(brandPresets.flipkart.fgColor);
  const [bgColor, setBgColor] = useState("#ffffff");
  const [eyeColor, setEyeColor] = useState(brandPresets.flipkart.eyeColor);
  const [qrStyle, setQrStyle] = useState(brandPresets.flipkart.qrStyle);
  const [eyeRadiusValue, setEyeRadiusValue] = useState(brandPresets.flipkart.eyeRadius);
  const [validationError, setValidationError] = useState("");
  const [customLogo, setCustomLogo] = useState(null); // Custom uploaded logo file DataURL
  const qrRef = useRef();
  const fileInputRef = useRef();

  const logos = {
    amazon: amazonLogo,
    myntra: myntraLogo,
    flipkart: flipkartLogo,
    meesho: meeshoLogo,
    none: undefined
  };

  const debouncedUpdate = useCallback(
    debounce((value) => {
      setQrText(value);
      setIsGenerating(false);
    }, 600),
    []
  );

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    // Basic URL Validation
    if (value && !value.startsWith("http://") && !value.startsWith("https://")) {
      setValidationError("URL should start with http:// or https://");
    } else {
      setValidationError("");
    }

    if (value !== qrText) {
      setIsGenerating(true);
      debouncedUpdate(value);
    }
  };

  const handleBrandSelect = (brandId) => {
    setSelectedBrand(brandId);
    const preset = brandPresets[brandId];
    if (preset) {
      setFgColor(preset.fgColor);
      setEyeColor(preset.eyeColor);
      setQrStyle(preset.qrStyle);
      setEyeRadiusValue(preset.eyeRadius);
      // Reset custom logo if preset brand is selected (otherwise it stays in memory but user gets brand logo by default)
      if (brandId !== "custom") {
        setCustomLogo(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    }
  };

  const handleCustomLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setCustomLogo(event.target.result);
      // Auto-select "Custom QR" when custom logo is uploaded
      setSelectedBrand("custom");
    };
    reader.readAsDataURL(file);
  };

  const removeCustomLogo = () => {
    setCustomLogo(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const clearInput = () => {
    setInputValue("");
    setValidationError("");
    setIsGenerating(true);
    debouncedUpdate("");
  };

  const downloadQR = () => {
    if (!qrRef.current) return;
    const canvas = qrRef.current.querySelector("canvas");
    if (!canvas) return;
    try {
      // Create a high-quality destination canvas with rounded corners and a border
      const size = 320;
      const padding = 24;
      const radius = 24;
      const borderWidth = 1.5;

      const downloadCanvas = document.createElement("canvas");
      downloadCanvas.width = size;
      downloadCanvas.height = size;
      const ctx = downloadCanvas.getContext("2d");

      // Draw clear background
      ctx.clearRect(0, 0, size, size);

      // Path for rounded rectangle
      ctx.beginPath();
      ctx.moveTo(padding / 2 + radius, padding / 2);
      ctx.lineTo(size - padding / 2 - radius, padding / 2);
      ctx.quadraticCurveTo(size - padding / 2, padding / 2, size - padding / 2, padding / 2 + radius);
      ctx.lineTo(size - padding / 2, size - padding / 2 - radius);
      ctx.quadraticCurveTo(size - padding / 2, size - padding / 2, size - padding / 2 - radius, size - padding / 2);
      ctx.lineTo(padding / 2 + radius, size - padding / 2);
      ctx.quadraticCurveTo(padding / 2, size - padding / 2, padding / 2, size - padding / 2 - radius);
      ctx.lineTo(padding / 2, padding / 2 + radius);
      ctx.quadraticCurveTo(padding / 2, padding / 2, padding / 2 + radius, padding / 2);
      ctx.closePath();

      // Fill background
      ctx.fillStyle = bgColor || "#ffffff";
      ctx.fill();

      // Stroke border
      ctx.strokeStyle = "#e5e7eb";
      ctx.lineWidth = borderWidth;
      ctx.stroke();

      // Draw the QR Code centered inside the rounded card
      const qrSize = size - padding * 2;
      ctx.drawImage(canvas, padding, padding, qrSize, qrSize);

      const image = downloadCanvas.toDataURL("image/png", 1.0);
      const anchor = document.createElement("a");
      anchor.href = image;
      anchor.download = `branded-qr-${selectedBrand}.png`;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
    } catch (err) {
      console.error("Download error:", err);
    }
  };

  // Construct eye radius configuration based on state value
  const currentEyeRadius = [
    {
      outer: [eyeRadiusValue, eyeRadiusValue, eyeRadiusValue, eyeRadiusValue],
      inner: [Math.round(eyeRadiusValue / 2), Math.round(eyeRadiusValue / 2), Math.round(eyeRadiusValue / 2), Math.round(eyeRadiusValue / 2)]
    },
    {
      outer: [eyeRadiusValue, eyeRadiusValue, eyeRadiusValue, eyeRadiusValue],
      inner: [Math.round(eyeRadiusValue / 2), Math.round(eyeRadiusValue / 2), Math.round(eyeRadiusValue / 2), Math.round(eyeRadiusValue / 2)]
    },
    {
      outer: [eyeRadiusValue, eyeRadiusValue, eyeRadiusValue, eyeRadiusValue],
      inner: [Math.round(eyeRadiusValue / 2), Math.round(eyeRadiusValue / 2), Math.round(eyeRadiusValue / 2), Math.round(eyeRadiusValue / 2)]
    }
  ];

  // Construct eye color configuration based on state value
  const currentEyeColor = [
    { outer: eyeColor, inner: eyeColor },
    { outer: eyeColor, inner: eyeColor },
    { outer: eyeColor, inner: eyeColor }
  ];

  // Structured Data for Google Search (Schema.org)
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Free Branded QR Code Generator",
    description:
      "Generate high-quality branded QR codes for Amazon, Flipkart, and Myntra affiliate links. Boost trust and clicks with custom logo QR codes.",
    applicationCategory: "BusinessApplication",
    operatingSystem: "All",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  const activePreset = brandPresets[selectedBrand];
  const activeLogoKey = activePreset ? activePreset.logoKey : "none";

  return (
    <main className="container">
      <Helmet>
        {/* Standard SEO Meta Tags */}
        <title>Free Branded QR Code Generator | Amazon, Flipkart & Myntra</title>
        <meta
          name="description"
          content="Generate high-quality branded QR codes for your affiliate links. Add logos for Amazon, Flipkart, and Meesho to increase trust and clicks."
        />
        <meta
          name="keywords"
          content="QR code generator, branded QR code, Amazon affiliate tools, Flipkart QR code, custom logo QR, affiliate marketing tools"
        />
        <link rel="canonical" href="https://qr-generator.example.com" />

        {/* Social Media (Open Graph) */}
        <meta property="og:title" content="Free Branded QR Code Generator for Affiliates" />
        <meta
          property="og:description"
          content="Boost your affiliate sales with custom branded QR codes for Amazon, Flipkart and more."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://qr-generator.example.com" />
        <meta property="og:site_name" content="Branded QR Generator" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free Branded QR Code Generator for Affiliates" />
        <meta
          name="twitter:description"
          content="Create custom QR codes with brand logos to increase your affiliate conversion rates."
        />

        {/* Structured Data Script */}
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Helmet>

      {/* Brand Tabs at the very top */}
      <nav className="brand-tabs" aria-label="Brand Selector Tabs">
        {Object.values(brandPresets).map((preset) => {
          const isActive = selectedBrand === preset.id;
          return (
            <button
              key={preset.id}
              onClick={() => handleBrandSelect(preset.id)}
              className={`brand-tab brand-tab--${preset.id} ${isActive ? "active" : ""}`}
              aria-selected={isActive}
              role="tab"
            >
              {preset.name}
            </button>
          );
        })}
      </nav>

      {/* Main Container Layout */}
      <section className="tool-layout" aria-label="QR Generator Tool">
        {/* Left column: Input and customization */}
        <div className="input-section">
          <label htmlFor="qr-url" className="label">
            Destination URL
          </label>
          <div className="input-group">
            <input
              id="qr-url"
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              placeholder="Paste your link here..."
              className="input"
              aria-label="URL Input"
            />
            <button onClick={clearInput} className="clear-btn" aria-label="Clear Input">
              Clear
            </button>
          </div>
          {validationError && <p className="validation-error">{validationError}</p>}

              {/* Dynamic Affiliate Tips based on selection */}
              <div className="affiliate-helper-tip">
                <strong>💡 Tip for {brandPresets[selectedBrand]?.name || "Custom"}: </strong>
                {selectedBrand === "flipkart" && "Use your Flipkart EarnKaro or affiliate tag to ensure you receive payouts on every scan."}
                {selectedBrand === "amazon" && "Make sure your associate tag (e.g. yourname-21) is appended to the product URL."}
                {selectedBrand === "myntra" && "Create custom Myntra affiliate links via your partner dashboard to track conversions."}
                {selectedBrand === "meesho" && "Include your Meesho reseller/share link to track scanning customer purchases."}
                {selectedBrand === "custom" && "Paste any valid URL. You can upload any customized square/circular icon above!"}
              </div>

          <div className="advanced-options-header">
            <h3>Advanced Styling Controls</h3>
            <p className="help-text">Fine-tune your brand's QR style below</p>
          </div>

          {/* QR Design Settings Grid */}
          <div className="design-controls">
            <div className="control-group">
              <label htmlFor="qr-style" className="label">
                QR Code Style
              </label>
              <select
                id="qr-style"
                value={qrStyle}
                onChange={(e) => setQrStyle(e.target.value)}
                className="select"
              >
                <option value="squares">Standard Squares</option>
                <option value="dots">Modern Circular Dots</option>
              </select>
            </div>

            <div className="control-group">
              <label htmlFor="eye-radius" className="label">
                Eye Corner Roundness ({eyeRadiusValue}px)
              </label>
              <input
                id="eye-radius"
                type="range"
                min="0"
                max="30"
                value={eyeRadiusValue}
                onChange={(e) => setEyeRadiusValue(Number(e.target.value))}
                className="slider"
              />
            </div>
          </div>

          {/* Custom Icon/Logo Upload */}
          <div className="upload-section-container">
            <label className="label">Custom Icon / Logo</label>
            <div className="upload-controls">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleCustomLogoUpload}
                id="custom-logo-upload"
                className="sr-only"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current && fileInputRef.current.click()}
                className="upload-trigger-btn"
              >
                Choose Image File
              </button>
              {customLogo && (
                <button
                  type="button"
                  onClick={removeCustomLogo}
                  className="upload-remove-btn"
                >
                  Remove Logo
                </button>
              )}
            </div>
            {customLogo ? (
              <p className="upload-status-text success">✓ Custom Logo Active</p>
            ) : (
              <p className="upload-status-text">No custom file chosen (defaults to brand logo)</p>
            )}
          </div>

          <div className="color-controls">
            <div className="color-input-wrapper">
              <label htmlFor="fg-color" className="label">
                Dots Color
              </label>
              <div className="color-picker-container">
                <input
                  id="fg-color"
                  type="color"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  className="color-input"
                />
                <span className="color-hex">{fgColor}</span>
              </div>
            </div>
            <div className="color-input-wrapper">
              <label htmlFor="eye-color" className="label">
                Eye Color
              </label>
              <div className="color-picker-container">
                <input
                  id="eye-color"
                  type="color"
                  value={eyeColor}
                  onChange={(e) => setEyeColor(e.target.value)}
                  className="color-input"
                />
                <span className="color-hex">{eyeColor}</span>
              </div>
            </div>
            <div className="color-input-wrapper">
              <label htmlFor="bg-color" className="label">
                BG Color
              </label>
              <div className="color-picker-container">
                <input
                  id="bg-color"
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="color-input"
                />
                <span className="color-hex">{bgColor}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right column: QR Display Card & Download Button */}
        <div className="display-section">
          <div ref={qrRef} className="qr-display-card">
            {isGenerating ? (
              <div role="status" className="spinner-wrapper">
                <div className="spinner"></div>
                <span className="sr-only">Generating...</span>
              </div>
            ) : (
              <div className="qr-wrapper">
                <QRCode
                  value={qrText || " "}
                  size={260}
                  ecLevel="H"
                  fgColor={fgColor}
                  bgColor={bgColor}
                  qrStyle={qrStyle}
                  eyeRadius={currentEyeRadius}
                  eyeColor={currentEyeColor}
                  logoImage={customLogo || (activeLogoKey !== "none" ? logos[activeLogoKey] : undefined)}
                  logoWidth={58}
                  logoHeight={58}
                  logoPadding={4}
                  logoPaddingStyle="circle"
                  removeQrCodeBehindLogo={true}
                  enableCORS={true}
                />
              </div>
            )}
          </div>

          <button
            onClick={downloadQR}
            className="download-btn-vibrant"
            aria-label="Download Branded QR Code"
          >
            Download PNG
          </button>
        </div>
      </section>

      {/* SEO Content Section */}
      <hr className="divider" />
      <article className="seo-content">
        <h2>Why Use Branded QR Codes for Affiliate Marketing?</h2>
        <p>
          Boost your affiliate marketing conversion rates by using branded QR codes. Recognizable
          logos like <strong>Amazon</strong> and <strong>Flipkart</strong> increase user trust and
          click-through rates. When customers see a familiar marketplace logo inside a QR code, they
          are more likely to scan and shop.
        </p>
        <p>
          Our tool allows you to generate high-resolution PNGs with transparent logo overlays,
          perfect for social media, print flyers, or product packaging.
        </p>
      </article>
    </main>
  );
}
