export const config = {
  matcher: ["/photo/:path*"],
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

  if (!isBot) return;

  const ogUrl = new URL("/api/og", req.url);
  ogUrl.searchParams.set("url", req.url); // FULL URL REQUIRED

  return Response.rewrite(ogUrl);
}
