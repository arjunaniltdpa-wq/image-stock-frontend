import { NextResponse } from "next/server";

const BOT_REGEX =
  /facebookexternalhit|Facebot|Twitterbot|Pinterest|Slackbot|LinkedInBot|WhatsApp|Telegram|Discordbot/i;

export async function middleware(req) {
  const ua = req.headers.get("user-agent") || "";
  const url = req.nextUrl;

  // Only handle /photo pages
  if (!url.pathname.startsWith("/photo/")) {
    return NextResponse.next();
  }

  // Only bots get OG HTML
  if (!BOT_REGEX.test(ua)) {
    return NextResponse.next();
  }

  // Extract slug + id
  const slug = url.pathname.replace("/photo/", "");
  const idMatch = slug.match(/([a-f0-9]{24})$/i);
  const imageId = idMatch ? idMatch[1] : null;

  if (!imageId) {
    return NextResponse.next();
  }

  // Fetch image metadata from your API
  let img;
  try {
    const res = await fetch(
      `https://api.pixeora.com/api/images/slug/${slug}`,
      { headers: { "User-Agent": "OG-Bot" } }
    );
    if (!res.ok) throw new Error("API failed");
    const data = await res.json();
    img = data.image || data.data || data;
  } catch (e) {
    return NextResponse.next();
  }

  if (!img || !img.fileName) {
    return NextResponse.next();
  }

  const title = img.title || "Free HD Image – Pixeora";
  const desc =
    img.description ||
    "Download high-quality HD wallpapers and royalty-free images.";
  const imageUrl = `https://cdn.pixeora.com/${encodeURIComponent(
    img.fileName
  )}`;
  const pageUrl = `https://pixeora.com/photo/${slug}`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${title}</title>

<link rel="canonical" href="${pageUrl}" />

<meta property="og:type" content="article" />
<meta property="og:site_name" content="Pixeora" />
<meta property="og:url" content="${pageUrl}" />
<meta property="og:title" content="${title}" />
<meta property="og:description" content="${desc}" />
<meta property="og:image" content="${imageUrl}" />
<meta property="og:image:secure_url" content="${imageUrl}" />
<meta property="og:image:type" content="image/jpeg" />

<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${title}" />
<meta name="twitter:description" content="${desc}" />
<meta name="twitter:image" content="${imageUrl}" />

</head>
<body>
<img src="${imageUrl}" alt="${title}" />
</body>
</html>`;

  return new Response(html, {
    headers: { "Content-Type": "text/html" },
  });
}

export const config = {
  matcher: "/photo/:path*",
};
