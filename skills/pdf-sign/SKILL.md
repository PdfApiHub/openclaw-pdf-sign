---
name: pdf-sign
description: "Sign PDFs with signature images or typed text. Add watermarks and check PDF metadata. Supports position presets, exact coordinates, all-pages stamping, date stamps, opacity control, and tiled watermarks. Powered by PDFAPIHub."
---

# PDF Sign

Sign PDFs with signature images or text-based signatures, add watermarks, and inspect PDF metadata — all via the PDFAPIHub API.

## Tools

| Tool | Description |
|------|-------------|
| `sign_pdf` | Stamp a signature image or typed text onto a PDF |
| `watermark_pdf` | Add text or image watermarks (single or tiled) |
| `pdf_info` | Check PDF metadata, page count, and encryption status |

## Setup

Get your **free API key** at [https://pdfapihub.com](https://pdfapihub.com).

Configure in `~/.openclaw/openclaw.json`:

```json
{
  "plugins": {
    "entries": {
      "pdf-sign": {
        "enabled": true,
        "env": {
          "PDFAPIHUB_API_KEY": "your-api-key-here"
        }
      }
    }
  }
}
```

Or set the environment variable: `export PDFAPIHUB_API_KEY=your-api-key`

## Usage Examples

**Sign with text:**
> Sign this PDF with "John Smith" in blue at the bottom-right: https://pdfapihub.com/sample.pdf

**Sign with image:**
> Stamp this signature image onto page 1 of the contract: signature.png onto contract.pdf

**Sign all pages with date:**
> Add my signature "Jane Doe" with today's date on all pages of this NDA

**Add CONFIDENTIAL watermark:**
> Add a tiled "CONFIDENTIAL" watermark to this document: https://pdfapihub.com/sample.pdf

**Add logo watermark:**
> Overlay our company logo at bottom-right with 20% opacity on every page

**APPROVED stamp:**
> Stamp "APPROVED" in red on the center of all pages

**Check PDF before signing:**
> Check if this PDF is encrypted before I sign it

## Documentation

Full API docs: [https://pdfapihub.com/docs](https://pdfapihub.com/docs)
