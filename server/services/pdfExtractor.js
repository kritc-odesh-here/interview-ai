const { PDFParse } = require("pdf-parse");

/**
 * Extracts raw text from a PDF file buffer.
 * @param {Buffer} buffer - File buffer.
 * @returns {Promise<string>} - Extracted text.
 */
async function extractText(buffer) {
  try {
    const uint8Array = new Uint8Array(buffer);
    const parser = new PDFParse({ data: uint8Array });
    const result = await parser.getText();
    return result.text || "";
  } catch (err) {
    throw new Error("Failed to parse PDF content: " + err.message);
  }
}

module.exports = { extractText };
