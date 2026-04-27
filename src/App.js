import React, { useState, useRef, useCallback } from "react";
import { QRCodeCanvas } from "qrcode.react";
import debounce from "lodash.debounce";
import { Helmet, HelmetProvider } from "react-helmet-async";

// Asset Imports
import amazonLogo from "./assets/amazon.png";
import myntraLogo from "./assets/myntra.png";
import flipkartLogo from "./assets/flipkart.png";
import meeshoLogo from "./assets/meesho.png";

export default function App() {
  const [inputValue, setInputValue] = useState("https://example.com");
  const [qrText, setQrText] = useState("https://example.com");
  const [logoKey, setLogoKey] = useState("none");
  const [isGenerating, setIsGenerating] = useState(false);
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
    if (value !== qrText) {
      setIsGenerating(true);
      debouncedUpdate(value);
    }
  };

  const downloadQR = () => {
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
    name: "Branded QR Code Generator",
    description:
      "Create custom QR codes with Amazon, Flipkart, and Myntra logos for affiliate marketing.",
    applicationCategory: "BusinessApplication",
    operatingSystem: "All",
  };

  return (
    <HelmetProvider>
      <main style={styles.container}>
        <Helmet>
          {/* Standard SEO Meta Tags */}
          <title>
            Free Branded QR Code Generator | Amazon, Flipkart & Myntra
          </title>
          <meta
            name="description"
            content="Generate high-quality branded QR codes for your affiliate links. Add logos for Amazon, Flipkart, and Meesho to increase trust and clicks."
          />
          <meta
            name="keywords"
            content="QR code generator, branded QR code, Amazon affiliate tools, Flipkart QR code, custom logo QR"
          />
          <link rel="canonical" href="https://yourwebsite.com" />

          {/* Social Media (Open Graph) */}
          <meta
            property="og:title"
            content="Branded QR Code Generator for Affiliates"
          />
          <meta
            property="og:description"
            content="Boost your affiliate sales with custom branded QR codes."
          />
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://yourwebsite.com" />

          {/* Structured Data Script */}
          <script type="application/ld+json">
            {JSON.stringify(structuredData)}
          </script>
        </Helmet>

        {/* SEO Header Section */}
        <header style={styles.header}>
          <h1 style={styles.title}>Professional Branded QR Code Generator</h1>
          <p style={styles.subtitle}>
            Create custom QR codes for Amazon, Flipkart, and Myntra affiliate
            links instantly.
          </p>
        </header>

        {/* Generator Tool Section */}
        <section style={styles.toolSection} aria-label="QR Generator Tool">
          <div style={styles.inputSection}>
            <label htmlFor="qr-url" style={styles.label}>
              Destination URL
            </label>
            <input
              id="qr-url"
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              placeholder="Paste your link here..."
              style={styles.input}
              aria-label="URL Input"
            />

            <label htmlFor="logo-select" style={styles.label}>
              Choose Brand Logo
            </label>
            <select
              id="logo-select"
              value={logoKey}
              onChange={(e) => setLogoKey(e.target.value)}
              style={styles.select}
              aria-label="Select Logo"
            >
              <option value="none">No Logo</option>
              <option value="amazon">Amazon</option>
              <option value="myntra">Myntra</option>
              <option value="flipkart">Flipkart</option>
              <option value="meesho">Meesho</option>
            </select>
          </div>

          <div ref={qrRef} style={styles.qrDisplayArea}>
            {isGenerating ? (
              <div style={styles.loaderBox} role="status">
                <div className="spinner"></div>
                <span className="sr-only">Generating...</span>
              </div>
            ) : (
              <div style={styles.canvasWrapper}>
                <QRCodeCanvas
                  value={qrText}
                  size={280}
                  level={"H"}
                  includeMargin={false}
                  imageSettings={
                    logoKey !== "none"
                      ? {
                          src: logos[logoKey],
                          height: 60,
                          width: 60,
                          excavate: false,
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
            style={styles.downloadBtn}
            aria-label="Download Branded QR Code"
          >
            Download PNG
          </button>
        </section>

        {/* SEO Content Section */}
        <article style={styles.seoContent}>
          <h2>Why Use Branded QR Codes for Affiliate Marketing?</h2>
          <p>
            Boost your affiliate marketing conversion rates by using branded QR
            codes. Recognizable logos like <strong>Amazon</strong> and{" "}
            <strong>Flipkart</strong>
            increase user trust and click-through rates. When customers see a
            familiar marketplace logo inside a QR code, they are more likely to
            scan and shop.
          </p>
          <p>
            Our tool allows you to generate high-resolution PNGs with
            transparent logo overlays, perfect for social media, print flyers,
            or product packaging.
          </p>
        </article>

        <style>{`
          .spinner {
            width: 40px;
            height: 40px;
            border: 4px solid #f3f3f3;
            border-top: 4px solid #3498db;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
          .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); border: 0; }
        `}</style>
      </main>
    </HelmetProvider>
  );
}

// ... styles remain the same as your provided code ...
const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "40px 20px",
    fontFamily: "'Inter', sans-serif",
    backgroundColor: "#f4f7f6",
    minHeight: "100vh",
  },
  header: { textAlign: "center", marginBottom: "40px" },
  title: { fontSize: "2rem", color: "#1a1a1a", marginBottom: "10px" },
  subtitle: { color: "#666", maxWidth: "500px" },
  label: {
    fontSize: "14px",
    fontWeight: "bold",
    color: "#444",
    marginBottom: "5px",
  },
  inputSection: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
    marginBottom: "30px",
    width: "100%",
    maxWidth: "340px",
  },
  input: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    outline: "none",
    marginBottom: "15px",
  },
  select: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    backgroundColor: "#fff",
    cursor: "pointer",
  },
  qrDisplayArea: {
    width: "320px",
    height: "320px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderRadius: "16px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
  },
  downloadBtn: {
    marginTop: "30px",
    padding: "16px 40px",
    backgroundColor: "#0070f3",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "16px",
  },
  seoContent: {
    marginTop: "60px",
    maxWidth: "700px",
    lineHeight: "1.6",
    color: "#444",
    borderTop: "1px solid #ddd",
    paddingTop: "40px",
  },
};
