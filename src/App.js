import React, { useState, useRef, useCallback } from "react";
import { QRCodeCanvas } from "qrcode.react";
import debounce from "lodash.debounce";

// Imports
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

  // Debounce: Wait 600ms after typing stops to update QR
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
      setIsGenerating(true); // Trigger loader in the QR spot
      debouncedUpdate(value);
    }
  };

  const downloadQR = () => {
    const canvas = qrRef.current.querySelector("canvas");
    if (!canvas) return;

    // Create a temporary link to trigger download
    try {
      // Ensuring the canvas is 'clean' by the time we call this
      const image = canvas.toDataURL("image/png", 1.0);
      const anchor = document.createElement("a");
      anchor.href = image;
      anchor.download = `qr-code-${logoKey}.png`;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
    } catch (err) {
      console.error("Security Error:", err);
      alert(
        "Canvas is tainted. Try this: Right-click the QR code and 'Save Image As' instead, or move images to the PUBLIC folder."
      );
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={{ color: "#333" }}>Custom QR Generator</h2>

      <div style={styles.inputSection}>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Paste link here..."
          style={styles.input}
        />

        <select
          value={logoKey}
          onChange={(e) => setLogoKey(e.target.value)}
          style={styles.select}
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
          <div style={styles.loaderBox}>
            <div className="spinner"></div>
          </div>
        ) : (
          <div style={styles.canvasWrapper}>
              <QRCodeCanvas
                value={qrText}
                size={280}
                level={"H"} // Must stay High
                includeMargin={false}
                imageSettings={{
                  src: logos[logoKey],
                  height: 60,
                  width: 60,
                  excavate: false, // Turn this OFF
                  crossOrigin: "anonymous",
                }}
              />
            </div>
        )}
      </div>

      <button onClick={downloadQR} style={styles.downloadBtn}>
        Download
      </button>

      {/* Simple CSS Spinner */}
      <style>{`
        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #3498db;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "40px",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f4f7f6",
    minHeight: "100vh",
  },
  inputSection: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginBottom: "30px",
    width: "100%",
    maxWidth: "320px",
  },
  input: {
    padding: "12px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    outline: "none",
  },
  select: {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    cursor: "pointer",
  },
  qrDisplayArea: {
    width: "300px",
    height: "300px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff", // This provides the "white space" now
    borderRadius: "12px",
    padding: "10px", // CONTROL your white space here
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
    overflow: "hidden",
  },
  canvasWrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  loaderBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  downloadBtn: {
    marginTop: "30px",
    padding: "14px 28px",
    backgroundColor: "#2c3e50",
    color: "#fff",
    border: "none",
    borderRadius: "50px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};
