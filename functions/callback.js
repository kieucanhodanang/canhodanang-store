
export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const error = url.searchParams.get("error");

  const headers = {
    "Content-Type": "text/html; charset=utf-8",
    "Cache-Control": "no-store",
    "Referrer-Policy": "no-referrer",
    "Set-Cookie":
      "cms_oauth_state=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0"
  };

  function sendResult(status, data) {
    const message =
      `authorization:github:${status}:${JSON.stringify(data)}`;

    const script = `
      (function () {
        const message = ${JSON.stringify(message)};
        const origin = window.location.origin;

        if (!window.opener) {
          document.body.textContent =
            "Khong tim thay cua so CMS.";
          return;
        }

        window.addEventListener("message", function (event) {
          if (event.source !== window.opener) return;
          if (event.origin !== origin) return;

          if (event.data === "authorizing:github") {
            window.opener.postMessage(message, origin);
            window.close();
          }
        });

        window.opener.postMessage(
          "authorizing:github",
          origin
        );
      })();
    `;

    return new Response(
      `<!doctype html>
<html lang="vi">
<head>
  <meta charset="utf-8">
  <title>GitHub Login</title>
</head>
<body>
  <p>Đang hoàn tất đăng nhập...</p>
  <script>${script}</script>
</body>
</html>`,
      { status: 200, headers }
    );
  }

  if (error) {
    return sendResult("error", {
      message: "GitHub authorization failed"
    });
  }

  const cookie = request.headers.get("Cookie") || "";

  const savedState = cookie
    .split(";")
    .map(item => item.trim())
    .find(item => item.startsWith("cms_oauth_state="))
    ?.slice("cms_oauth_state=".length);

  if (!code || !state || !savedState || state !== savedState) {
    return new Response("Invalid OAuth state", {
      status: 403,
      headers
    });
  }

  if (!env.GITHUB_CLIENT_ID || !env.GITHUB_CLIENT_SECRET) {
    return new Response("OAuth configuration missing", {
      status: 500,
      headers
    });
  }

  try {
    const response = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          client_id: env.GITHUB_CLIENT_ID,
          client_secret: env.GITHUB_CLIENT_SECRET,
          code: code,
          state: state,
          redirect_uri:
            "https://canhodanang.store/callback"
        })
      }
    );

    if (!response.ok) {
      throw new Error("GitHub token request failed");
    }

    const data = await response.json();

    if (!data.access_token) {
      throw new Error("No access token returned");
    }

    return sendResult("success", {
      token: data.access_token
    });

  } catch (err) {
    return sendResult("error", {
      message: "Unable to complete GitHub login"
    });
  }
}
