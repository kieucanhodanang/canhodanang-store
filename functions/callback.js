
export async function onRequestGet(context) {
  const { request, env } = context;
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

  const page = (script) => new Response(
    `<!doctype html>
<html lang="vi">
<head><meta charset="utf-8"></head>
<body>
<p>Đang hoàn tất đăng nhập...</p>
<script>${script}</script>
</body>
</html>`,
    { headers }
  );

  const sendResult = (status, data) => {
    const payload = JSON.stringify(
      `authorization:github:${status}:${JSON.stringify(data)}`
    );

    return page(`
      (function () {
        const message = ${payload};
       
if (window.opener) {
  const origin = window.location.origin;

  window.addEventListener("message", function (event) {
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
}

        } else {
          document.body.textContent =
            "Vui lòng quay lại trang quản trị và thử lại.";
        }
      })();
    `);
  };

  if (error) {
    return sendResult("error", {
      message: "GitHub authorization failed"
    });
  }

  const cookie = request.headers.get("Cookie") || "";
  const savedState = cookie
    .split(";")
    .map(v => v.trim())
    .find(v => v.startsWith("cms_oauth_state="))
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
          code,
          redirect_uri: "https://canhodanang.store/callback",
          state
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
      token: data.access_token,
      provider: "github"
    });
  } catch (err) {
    return sendResult("error", {
      message: "Unable to complete GitHub login"
    });
  }
}
