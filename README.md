# PDF Sign — OpenClaw Plugin

Sign PDF documents with signature images or typed text using the [PDFAPIHub](https://pdfapihub.com) API. This OpenClaw plugin gives your AI agent the ability to stamp signatures, add watermarks, and inspect PDF metadata.

## What It Does

Overlay signature images or text-based signatures onto PDFs — perfect for contracts, agreements, approvals, and official documents. Also includes watermarking and PDF metadata inspection.

### Features

- **Image Signatures** — Stamp PNG/JPG/WebP signature images with transparency support
- **Text Signatures** — Typed text signatures with custom color and font size
- **Position Presets** — bottom-right, bottom-left, top-right, top-left, center, top-center, bottom-center
- **Exact Coordinates** — Precise X/Y positioning in PDF points
- **All-Pages Mode** — Apply signature or stamp to every page
- **Date Stamps** — Append current UTC date below the signature
- **Opacity Control** — Adjustable transparency (0-1) for subtle or bold stamps
- **Text Watermarks** — Add CONFIDENTIAL, DRAFT, APPROVED, or custom text
- **Image Watermarks** — Overlay logos or stamps with PNG transparency
- **Tiled Watermarks** — Repeat watermark diagonally across entire page
- **PDF Metadata** — Check page count, encryption status, and document properties

## Tools

| Tool | Description |
|------|-------------|
| `sign_pdf` | Stamp a signature image or typed text onto a PDF |
| `watermark_pdf` | Add text or image watermarks (single or tiled) |
| `pdf_info` | Check PDF metadata, page count, and encryption status |

## Installation

```bash
openclaw plugins install clawhub:pdf-sign
```

## Configuration

Add your API key in `~/.openclaw/openclaw.json`:

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

Get your **free API key** at [https://pdfapihub.com](https://pdfapihub.com).

## Usage Examples

Just ask your OpenClaw agent:

- *"Sign this contract with 'John Smith' in blue at the bottom-right"*
- *"Stamp my signature image onto page 1 of this agreement"*
- *"Add 'Jane Doe' signature with today's date on all pages of this NDA"*
- *"Add a CONFIDENTIAL watermark to this document"*
- *"Check if this PDF is encrypted before signing"*

## Use Cases

- **Contract Signing** — Stamp signatures onto contracts and agreements
- **Approval Stamps** — Add APPROVED/REJECTED text stamps with date
- **Letter Signing** — Add typed or handwritten signatures to official letters
- **Invoice Authorization** — Sign invoices or purchase orders
- **Notary/Certification** — Stamp certification marks or notary seals
- **Document Protection** — Add CONFIDENTIAL or DRAFT watermarks before sharing

## API Documentation

Full API docs: [https://pdfapihub.com/docs](https://pdfapihub.com/docs)

## License

MIT
