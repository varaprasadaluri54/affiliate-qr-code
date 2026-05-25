import React, { useState, useRef, useCallback } from "react";
import { QRCodeCanvas } from "qrcode.react";
import debounce from "lodash.debounce";
import { Helmet } from "react-helmet-async";
import "./styles.css";

// Asset Imports
import amazonLogo from "./assets/amazon.png";
import myntraLogo from "./assets/myntra.png";
import flipkartLogo from "./assets/flipkart.png";
import meeshoLogo from "./assets/meesho.png";

export default function App() {
  const [inputValue, setInputValue] = useState("https://www.amazon.com");
  const [qrText, setQrText] = useState("https://www.amazon.com");
  const [logoKey, setLogoKey] = useState("none");
  const [isGenerating, setIsGenerating] = useState(false);
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
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

  // Structured Data for Google Search (Schema.org)
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Free Branded QR Code Generator",
    url: "https://affiliateqrcodegenerate.netlify.app/",
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
        <link rel="canonical" href="https://affiliateqrcodegenerate.netlify.app/" />

        {/* Social Media (Open Graph) */}
        <meta property="og:title" content="Free Branded QR Code Generator for Affiliates" />
        <meta
          property="og:description"
          content="Boost your affiliate sales with custom branded QR codes for Amazon, Flipkart and more."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://affiliateqrcodegenerate.netlify.app/" />
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
            onChange={(e) => setLogoKey(e.target.value)}
            className="select"
            aria-label="Select Logo"
          >
            <option value="none">No Logo</option>
            <option value="amazon">Amazon</option>
            <option value="myntra">Myntra</option>
            <option value="flipkart">Flipkart</option>
            <option value="meesho">Meesho</option>
          </select>

          <div className="color-controls">
            <div className="color-input-wrapper">
              <label htmlFor="fg-color" className="label">
                FG Color
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
            <div>
              <QRCodeCanvas
                value={qrText || " "}
                size={280}
                level={"H"}
                fgColor={fgColor}
                bgColor={bgColor}
                includeMargin={false}
                imageSettings={
                  logoKey !== "none"
                    ? {
                        src: logos[logoKey],
                        height: 60,
                        width: 60,
                        excavate: true,
                        crossOrigin: "anonymous",
                      }
                    : undefined
                }
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
