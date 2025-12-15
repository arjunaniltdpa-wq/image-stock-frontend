export default async function handler(req) {
  try {
    const url = new URL(req.url, "https://pixeora.com");
    const slug = url.pathname.replace("/photo/", "");

    if (!slug) throw new Error("Missing slug");

    const apiRes = await fetch(
      `https://api.pixeora.com/api/images/slug/${slug}`,
      { cache: "no-store" }
    );

    if (!apiRes.ok) throw new Error("API failed");

    const data = await apiRes.json();
    const img = data.image || data;

    if (!img?.fileName) throw new Error("No image");

    const imageUrl = `https://cdn.pixeora.com/${encodeURIComponent(img.fileName)}`;
    const pageUrl = `https://pixeora.com/photo/${slug}`;

    const title = img.title || "Free HD Image – Pixeora";
    const desc =
      img.description ||
      "Download high-quality HD wallpapers, 4K backgrounds and royalty-free stock images.";

    return new Response(`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>

<title>${escape(title)}</title>
<link rel="canonical" href="${pageUrl}" />

<meta property="og:type" content="article"/>
<meta property="og:title" content="${escape(title)}"/>
<meta property="og:description" content="${escape(desc)}"/>
<meta property="og:url" content="${pageUrl}"/>

<!-- 🔥 THIS IS THE MAIN IMAGE -->
<meta property="og:image" content="${imageUrl}"/>
<meta property="og:image:secure_url" content="${imageUrl}"/>
<meta property="og:image:width" content="1200"/>
<meta property="og:image:height" content="630"/>

<meta name="twitter:card" content="summary_large_image"/>
<meta name="twitter:image" content="${imageUrl}"/>

</head>
<body></body>
</html>`, {
      headers: { "content-type": "text/html; charset=utf-8" }
    });

  } catch (e) {
    return new Response(`<!DOCTYPE html>
<html>
<head>
<meta property="og:image" content="https://cdn.pixeora.com/preview.jpg"/>
</head>
</html>`, {
      headers: { "content-type": "text/html; charset=utf-8" }
    });
  }
}

function escape(str = "") {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
