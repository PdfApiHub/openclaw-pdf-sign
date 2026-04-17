import type { PluginEntry } from "@anthropic/openclaw-plugin-sdk";

const API_BASE = "https://pdfapihub.com/api";

async function callApi(
  endpoint: string,
  method: string,
  body: Record<string, unknown> | null,
  apiKey: string
): Promise<unknown> {
  const headers: Record<string, string> = {
    "CLIENT-API-KEY": apiKey,
  };
  const opts: RequestInit = { method, headers };

  if (body) {
    headers["Content-Type"] = "application/json";
    opts.body = JSON.stringify(body);
  }

  const res = await fetch(`${API_BASE}${endpoint}`, opts);

  if (!res.ok) {
    const text = await res.text();
    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(text);
    } catch {
      throw new Error(`PDFAPIHub API error (${res.status}): ${text}`);
    }
    throw new Error(
      `PDFAPIHub API error (${res.status}): ${(parsed as any).error || text}`
    );
  }

  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return res.json();
  }
  return {
    success: true,
    message: "Binary file returned",
    content_type: contentType,
  };
}

function getApiKey(config: Record<string, unknown>): string {
  const key =
    (config.apiKey as string) ||
    process.env.PDFAPIHUB_API_KEY ||
    process.env.CLIENT_API_KEY ||
    "";
  if (!key) {
    throw new Error(
      "PDFAPIHub API key not configured. Set it in plugin config, or as PDFAPIHUB_API_KEY environment variable. Get a free key at https://pdfapihub.com"
    );
  }
  return key;
}

function buildBody(params: Record<string, unknown>): Record<string, unknown> {
  const body: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) {
      body[key] = value;
    }
  }
  return body;
}

const plugin: PluginEntry = {
  id: "pdf-sign",
  name: "PDF Sign",
  register(api) {
    // ─── Sign PDF ────────────────────────────────────────────
    api.registerTool({
      name: "sign_pdf",
      description:
        "Stamp a signature image or text-based signature onto a PDF. Supports PNG/JPG/WebP signature images with transparency, typed text signatures with custom colors and font sizes, position presets (bottom-right, bottom-left, center, etc.) or exact X/Y coordinates in PDF points, all-pages mode, optional date stamps, and opacity control.",
      parameters: {
        type: "object",
        properties: {
          pdf_url: {
            type: "string",
            description: "URL to the PDF to sign.",
          },
          base64_pdf: {
            type: "string",
            description: "Base64-encoded PDF to sign.",
          },
          signature_url: {
            type: "string",
            description:
              "URL to the signature image (PNG/JPG/WebP with transparency support).",
          },
          base64_signature: {
            type: "string",
            description: "Base64-encoded signature image.",
          },
          sign_text: {
            type: "string",
            description:
              "Text-based signature (e.g. 'John Smith'). Used instead of a signature image.",
          },
          sign_color: {
            type: "string",
            description:
              "Text signature color as hex string. Default: '#000000'.",
          },
          font_size: {
            type: "number",
            description: "Text signature font size in points. Default: 48.",
          },
          date_stamp: {
            type: "boolean",
            description:
              "Append current UTC date below the signature. Default: false.",
          },
          page: {
            type: "number",
            description:
              "Page number to sign. Default: last page.",
          },
          all_pages: {
            type: "boolean",
            description: "Sign all pages. Default: false.",
          },
          position: {
            type: "string",
            enum: [
              "bottom-right",
              "bottom-left",
              "top-right",
              "top-left",
              "center",
              "bottom-center",
              "top-center",
            ],
            description:
              "Signature position preset. Default: 'bottom-right'.",
          },
          x: {
            type: "number",
            description:
              "Explicit X coordinate in PDF points. Overrides position preset.",
          },
          y: {
            type: "number",
            description:
              "Explicit Y coordinate in PDF points. Overrides position preset.",
          },
          width: {
            type: "number",
            description: "Signature width in points.",
          },
          height: {
            type: "number",
            description: "Signature height in points.",
          },
          opacity: {
            type: "number",
            description: "Signature opacity (0-1). Default: 1.",
          },
          output_format: {
            type: "string",
            enum: ["file", "url", "base64", "both"],
            description: "Output mode. Default: 'url'.",
          },
        },
      },
      async execute(params, context) {
        const apiKey = getApiKey(context.config);
        return callApi("/v1/sign-pdf", "POST", buildBody(params), apiKey);
      },
    });

    // ─── Watermark PDF ───────────────────────────────────────
    api.registerTool({
      name: "watermark_pdf",
      description:
        "Add a text or image watermark to a PDF or image. Supports tiled mode (repeat diagonally across every page), position presets (center, corners), custom text with color/opacity/angle/font size, or overlay a logo/stamp image (PNG with transparency). Auto-detects PDF vs image input.",
      parameters: {
        type: "object",
        properties: {
          file_url: {
            type: "string",
            description: "URL to a PDF or image file to watermark.",
          },
          base64_file: {
            type: "string",
            description: "Base64-encoded PDF or image.",
          },
          text: {
            type: "string",
            description:
              "Watermark text. Defaults to 'CONFIDENTIAL' when neither text nor watermark image is provided.",
          },
          color: {
            type: "string",
            description: "Text color as hex string. Default: '#000000'.",
          },
          opacity: {
            type: "number",
            description:
              "Watermark transparency (0 = invisible, 1 = fully opaque). Default: 0.15.",
          },
          angle: {
            type: "number",
            description:
              "Rotation angle in degrees (counter-clockwise). Default: 30.",
          },
          font_size: {
            type: "number",
            description:
              "Font size in points. Auto-calculated if omitted.",
          },
          position: {
            type: "string",
            enum: [
              "center",
              "top-left",
              "top-right",
              "bottom-left",
              "bottom-right",
              "top-center",
              "bottom-center",
            ],
            description: "Watermark placement. Default: 'center'.",
          },
          mode: {
            type: "string",
            enum: ["single", "tiled"],
            description:
              "'single' = one watermark at position (default). 'tiled' = repeat diagonally across entire page.",
          },
          watermark_image_url: {
            type: "string",
            description:
              "URL to a watermark image (logo/stamp). Overlays this image instead of text. PNG transparency supported.",
          },
          base64_watermark_image: {
            type: "string",
            description: "Base64-encoded watermark image.",
          },
          output_format: {
            type: "string",
            enum: ["file", "url", "base64", "both"],
            description: "Output mode. Default: 'url'.",
          },
        },
      },
      async execute(params, context) {
        const apiKey = getApiKey(context.config);
        return callApi("/v1/watermark", "POST", buildBody(params), apiKey);
      },
    });

    // ─── PDF Info ────────────────────────────────────────────
    api.registerTool({
      name: "pdf_info",
      description:
        "Get PDF metadata: encryption status, page count, file size, and document properties (title, author, subject, creator). Useful for checking a PDF before signing or watermarking.",
      parameters: {
        type: "object",
        properties: {
          url: {
            type: "string",
            description: "URL to a PDF file.",
          },
          base64_pdf: {
            type: "string",
            description: "Base64-encoded PDF.",
          },
        },
      },
      async execute(params, context) {
        const apiKey = getApiKey(context.config);
        return callApi("/v1/pdf/info", "POST", buildBody(params), apiKey);
      },
    });
  },
};

export default plugin;
