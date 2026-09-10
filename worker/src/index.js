// 学科紹介API（架空データ）
// ルーティング:
//   GET /api/course        学科情報
//   GET /api/hello?name=山田 名前付き挨拶（name必須。空なら400）
//   GET /api/fortune       おみくじ（ランダム）
//   GET /api/events        イベント一覧（配列）
// 上記以外は404。

const COURSE = {
  course: "IT",
  name: "情報システム学科",
  message: "Hello Workers",
  subjects: ["Web開発", "データベース", "ネットワーク", "クラウド"],
};

const EVENTS = [
  { id: 1, title: "オープンキャンパス", date: "2026-10-05", place: "本館" },
  { id: 2, title: "学科説明会", date: "2026-10-19", place: "3号館" },
  { id: 3, title: "作品発表会", date: "2026-11-09", place: "ホール" },
];

const FORTUNES = ["大吉", "中吉", "小吉", "吉", "末吉", "凶"];

function corsHeaders(env) {
  const origin = (env && env.ALLOWED_ORIGIN) || "*";
  return {
    "access-control-allow-origin": origin,
    "access-control-allow-methods": "GET, OPTIONS",
    "access-control-allow-headers": "Content-Type",
  };
}

function json(data, status, env) {
  return new Response(JSON.stringify(data), {
    status: status || 200,
    headers: {
      "content-type": "application/json; charset=UTF-8",
      ...corsHeaders(env),
    },
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const { pathname } = url;

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(env) });
    }

    if (pathname === "/" || pathname === "/api") {
      return json({ status: "running", message: "workers-backend" }, 200, env);
    }

    if (pathname === "/api/course") {
      return json(COURSE, 200, env);
    }

    if (pathname === "/api/hello") {
      const name = (url.searchParams.get("name") || "").trim();
      if (!name) {
        return json({ error: "name is required" }, 400, env);
      }
      return json({ message: `こんにちは、${name}さん！` }, 200, env);
    }

    if (pathname === "/api/fortune") {
      const result = FORTUNES[Math.floor(Math.random() * FORTUNES.length)];
      return json({ result }, 200, env);
    }

    if (pathname === "/api/events") {
      return json({ events: EVENTS }, 200, env);
    }

    return json({ error: "not found" }, 404, env);
  },
};
