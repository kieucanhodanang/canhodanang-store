
export async function onRequestGet(context) {
  const clientId = context.env.GITHUB_CLIENT_ID;

  if (!clientId) {
    return new Response("Missing GitHub Client ID", {
      status: 500
    });
  }

  const state = crypto.randomUUID();

  const redirectUri =
    "https://canhodanang.store/callback";

  const githubUrl = new URL(
    "https://github.com/login/oauth/authorize"
  );

  githubUrl.searchParams.set("client_id", clientId);
  githubUrl.searchParams.set("redirect_uri", redirectUri);
  githubUrl.searchParams.set("scope", "repo");
  githubUrl.searchParams.set("state", state);

  const headers = new Headers();

  headers.set("Location", githubUrl.toString());

  headers.append(
    "Set-Cookie",
    `cms_oauth_state=${state}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=600`
  );

  headers.set("Cache-Control", "no-store");

  return new Response(null, {
    status: 302,
    headers
  });
}
