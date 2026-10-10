const NAME_LIMIT = 24;
const MESSAGE_LIMIT = 72;
const GUESTBOOK_PAGE_SIZE = 50;
const RATE_LIMIT_POSTS = 3;
const RATE_LIMIT_WINDOW = "-10 minutes";

function json(data, status = 200) {
  return Response.json(data, {
    status,
    headers: { "Cache-Control": "no-store" }
  });
}

function cleanText(value, limit) {
  return String(value ?? "")
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, limit);
}

async function hashIp(ip, salt) {
  const bytes = new TextEncoder().encode(`${salt}:${ip}`);
  const digest = await crypto.subtle.digest("SHA-256", bytes);

  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function readVisits(env) {
  const row = await env.DB.prepare("SELECT visits FROM counter WHERE id = 1").first();
  return json({ visits: row.visits });
}

async function recordVisit(env) {
  const row = await env.DB
    .prepare("UPDATE counter SET visits = visits + 1 WHERE id = 1 RETURNING visits")
    .first();
  return json({ visits: row.visits });
}

async function listEntries(env) {
  const { results } = await env.DB
    .prepare("SELECT id, name, message, created_at FROM guestbook ORDER BY created_at DESC, id DESC LIMIT ?")
    .bind(GUESTBOOK_PAGE_SIZE)
    .all();
  return json({ entries: results });
}

async function createEntry(request, env) {
  let body;

  try {
    body = await request.json();
  } catch {
    return json({ error: "Send JSON, webmaster." }, 400);
  }

  // Honeypot: real visitors never see or fill this field.
  if (body.website) {
    return json({ ok: true }, 201);
  }

  const name = cleanText(body.name, NAME_LIMIT);
  const message = cleanText(body.message, MESSAGE_LIMIT);

  if (!name || !message) {
    return json({ error: "Steve needs both a name and a message." }, 400);
  }
  const ip = request.headers.get("CF-Connecting-IP") || "unknown";
  const ipHash = await hashIp(ip, env.IP_SALT || "steve-zone-9000");

  const recent = await env.DB
    .prepare("SELECT COUNT(*) AS posts FROM guestbook WHERE ip_hash = ? AND created_at > datetime('now', ?)")
    .bind(ipHash, RATE_LIMIT_WINDOW)
    .first();

  if (recent.posts >= RATE_LIMIT_POSTS) {
    return json({ error: "Whoa there. Steve needs a minute to read. Try again in 10 minutes." }, 429);
  }

  const entry = await env.DB
    .prepare("INSERT INTO guestbook (name, message, ip_hash) VALUES (?, ?, ?) RETURNING id, name, message, created_at")
    .bind(name, message, ipHash)
    .first();

  return json({ entry }, 201);
}

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);
    const route = `${request.method} ${pathname}`;

    try {
      switch (route) {
        case "GET /api/visit":
          return await readVisits(env);
        case "POST /api/visit":
          return await recordVisit(env);
        case "GET /api/guestbook":
          return await listEntries(env);
        case "POST /api/guestbook":
          return await createEntry(request, env);
      }
    } catch (error) {
      console.error(error);
      return json({ error: "The server tripped over a modem cord." }, 500);
    }

    if (pathname.startsWith("/api/")) {
      return json({ error: "Not found" }, 404);
    }

    return env.ASSETS ? env.ASSETS.fetch(request) : new Response("Not found", { status: 404 });
  }
};
