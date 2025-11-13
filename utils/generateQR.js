import QRCode from "qrcode";

// Generate QR code as Base64 string
export const generateQRCode = async (text) => {
  try {
    const qrData = await QRCode.toDataURL(text);
    return qrData; // returns base64 image string
  } catch (error) {
    console.error("QR Code generation error:", error);
    throw new Error("Could not generate QR code");
  }
};
