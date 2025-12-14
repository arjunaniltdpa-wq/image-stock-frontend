export const config = {
  matcher: "/photo/:path*",
};

export function middleware(req) {
  const ua = req.headers.get("user-agent") || "";

  const isBot =
    ua.includes("facebookexternalhit") ||
    ua.includes("Facebot") ||
    ua.includes("Pinterest") ||
    ua.includes("Twitterbot") ||
    ua.includes("WhatsApp") ||
    ua.includes("LinkedInBot") ||
    ua.includes("Slackbot");

  if (!isBot) {
    return; // normal users → load JS page
  }

  const url = new URL(req.url);
  const target = url.pathname;

  const ogUrl = new URL("/api/og", url.origin);
  ogUrl.searchParams.set("url", target);

  return Response.rewrite(ogUrl);
}
