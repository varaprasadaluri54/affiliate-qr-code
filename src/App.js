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
  none: {
    fgColor: "#000000",
    eyeColor: "#000000",
    qrStyle: "squares",
    eyeRadius: 0,
  },
  amazon: {
    fgColor: "#111111", // Amazon Dark Carbon
    eyeColor: "#FF9900", // Amazon Orange
    qrStyle: "dots",
    eyeRadius: 18,
  },
  myntra: {
    fgColor: "#3E4152", // Myntra Dark Charcoal
    eyeColor: "#FF3F6C", // Myntra Pink/Red
    qrStyle: "dots",
    eyeRadius: 22,
  },
  flipkart: {
    fgColor: "#2874F0", // Flipkart Blue
    eyeColor: "#FFE500", // Flipkart Yellow
    qrStyle: "squares",
    eyeRadius: 12,
  },
  meesho: {
    fgColor: "#333333", // Dark Gray
    eyeColor: "#F43397", // Meesho Pink
    qrStyle: "dots",
    eyeRadius: 20,
  }
};

export default function App() {
  const [inputValue, setInputValue] = useState("https://example.com");
  const [qrText, setQrText] = useState("https://example.com");
  const [logoKey, setLogoKey] = useState("none");
  const [isGenerating, setIsGenerating] = useState(false);
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [eyeColor, setEyeColor] = useState("#000000");
  const [qrStyle, setQrStyle] = useState("squares");
  const [eyeRadiusValue, setEyeRadiusValue] = useState(0);
  const [validationError, setValidationError] = useState("");
  const qrRef = useRef();

  const logos = {
    amazon: amazonLogo,
    myntra: myntraLogo,
    flipkart: flipkartLogo,
    meesho: meeshoLogo,
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

  const handleLogoChange = (e) => {
    const key = e.target.value;
    setLogoKey(key);

    // Auto-apply brand preset values
    if (brandPresets[key]) {
      const preset = brandPresets[key];
      setFgColor(preset.fgColor);
      setEyeColor(preset.eyeColor);
      setQrStyle(preset.qrStyle);
      setEyeRadiusValue(preset.eyeRadius);
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
      const image = canvas.toDataURL("image/png", 1.0);
      const anchor = document.createElement("a");
      anchor.href = image;
      anchor.download = `branded-qr-${logoKey}.png`;
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

      {/* SEO Header Section */}
      <header className="header">
        <h1 className="title">Professional Branded QR Code Generator</h1>
        <p className="subtitle">
          Create custom QR codes for Amazon, Flipkart, and Myntra affiliate links instantly.
        </p>
      </header>

      {/* Generator Tool Section */}
      <section className="tool-section" aria-label="QR Generator Tool">
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
              style={{ flex: 1, marginBottom: 0 }}
              aria-label="URL Input"
            />
            <button onClick={clearInput} className="clear-btn">
              Clear
            </button>
          </div>
          {validationError && <p className="validation-error">{validationError}</p>}

          <label htmlFor="logo-select" className="label" style={{ marginTop: "15px" }}>
            Choose Brand Logo
          </label>
          <select
            id="logo-select"
            value={logoKey}
            onChange={handleLogoChange}
            className="select"
            aria-label="Select Logo"
          >
            <option value="none">No Logo</option>
            <option value="amazon">Amazon</option>
            <option value="myntra">Myntra</option>
            <option value="flipkart">Flipkart</option>
            <option value="meesho">Meesho</option>
          </select>

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

          <div className="color-controls">
            <div className="color-input-wrapper">
              <label htmlFor="fg-color" className="label">
                Dots Color
              </label>
              <input
                id="fg-color"
                type="color"
                value={fgColor}
                onChange={(e) => setFgColor(e.target.value)}
                className="color-input"
              />
            </div>
            <div className="color-input-wrapper">
              <label htmlFor="eye-color" className="label">
                Eye Color
              </label>
              <input
                id="eye-color"
                type="color"
                value={eyeColor}
                onChange={(e) => setEyeColor(e.target.value)}
                className="color-input"
              />
            </div>
            <div className="color-input-wrapper">
              <label htmlFor="bg-color" className="label">
                BG Color
              </label>
              <input
                id="bg-color"
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="color-input"
              />
            </div>
          </div>
        </div>

        <div ref={qrRef} className="qr-display-area">
          {isGenerating ? (
            <div role="status">
              <div className="spinner"></div>
              <span className="sr-only">Generating...</span>
            </div>
          ) : (
            <div className="qr-wrapper">
              <QRCode
                value={qrText || " "}
                size={280}
                ecLevel="H"
                fgColor={fgColor}
                bgColor={bgColor}
                qrStyle={qrStyle}
                eyeRadius={currentEyeRadius}
                eyeColor={currentEyeColor}
                logoImage={logoKey !== "none" ? logos[logoKey] : undefined}
                logoWidth={60}
                logoHeight={60}
                logoPadding={5}
                logoPaddingStyle="circle"
                removeQrCodeBehindLogo={true}
                enableCORS={true}
              />
            </div>
          )}
        </div>

        <button
          onClick={downloadQR}
          className="download-btn"
          aria-label="Download Branded QR Code"
        >
          Download PNG
        </button>
      </section>

      {/* SEO Content Section */}
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
