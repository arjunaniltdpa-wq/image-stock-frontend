import { NextResponse } from "next/server";

export const config = {
  matcher: ["/photo/:path*"],
};

export default async function middleware(req) {
  const ua = req.headers.get("user-agent") || "";

  const isBot =
    /facebookexternalhit|Twitterbot|Pinterest|Slackbot|WhatsApp|LinkedInBot|TelegramBot/i.test(
      ua
    );

  // 👤 Normal users → serve app normally
  if (!isBot) {
    return NextResponse.next();
  }

  const url = new URL(req.url);
  const slug = url.pathname.replace("/photo/", "").trim();
  if (!slug) return NextResponse.next();

  try {
    const metaRes = await fetch(
      `https://api.pixeora.com/api/og-meta?slug=${encodeURIComponent(slug)}`,
      { cache: "no-store" }
    );

    if (!metaRes.ok) return NextResponse.next();

    const og = await metaRes.json();

    const title = escape(og.title || "Pixeora Free HD Image");
    const desc = escape(og.description || "Download free HD images from Pixeora");
    const image = og.image || "https://pixeora.com/images/og-default.jpg";

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>${title}</title>
<link rel="canonical" href="${og.url}" />

<meta property="og:type" content="website" />
<meta property="og:site_name" content="Pixeora" />
<meta property="og:title" content="${title}" />
<meta property="og:description" content="${desc}" />
<meta property="og:url" content="${og.url}" />
<meta property="og:image" content="${image}" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />

<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${title}" />
<meta name="twitter:description" content="${desc}" />
<meta name="twitter:image" content="${image}" />

<!-- Human redirect -->
<meta http-equiv="refresh" content="0; url=${og.url}" />
</head>
<body></body>
</html>`;

    return new Response(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
      },
    });
  } catch (e) {
    return NextResponse.next();
  }
}

function escape(str = "") {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
