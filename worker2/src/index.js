const courses = [
    {
        id: 1,
        title: "Cloudflare Workers 入門",
        description: "エッジで動くAPIを作り、デプロイまで体験します。",
        duration: "90分",
    },
    {
        id: 2,
        title: "Pages と Workers の連携",
        description: "静的サイトからWorker APIを安全に呼び出します。",
        duration: "60分",
    },
];

const events = [
    { id: 1, title: "Workers ハンズオン", date: "2026-09-20", status: "受付中" },
    { id: 2, title: "Cloudflare 運用相談会", date: "2026-10-03", status: "受付中" },
];

const jsonHeaders = {
    "content-type": "application/json; charset=UTF-8",
    "cache-control": "no-store",
};

function responseJson(data, status = 200, origin = "null") {
    return new Response(JSON.stringify(data), {
        status,
        headers: {
            ...jsonHeaders,
            "access-control-allow-origin": origin,
            "access-control-allow-methods": "GET, OPTIONS",
            "access-control-allow-headers": "content-type",
        },
    });
}

function allowedOrigin(request, env) {
    const requestOrigin = request.headers.get("origin");
    const configuredOrigin = env.ALLOWED_ORIGIN || "*";

    if (configuredOrigin === "*" || !requestOrigin) {
        return configuredOrigin;
    }

    return requestOrigin === configuredOrigin ? requestOrigin : "null";
}

export default {
    async fetch(request, env) {
        const url = new URL(request.url);
        const origin = allowedOrigin(request, env);

        if (request.method === "OPTIONS") {
            return responseJson({}, 204, origin);
        }

        if (request.method !== "GET") {
            return responseJson({ error: "Method not allowed" }, 405, origin);
        }

        if (url.pathname === "/api" || url.pathname === "/api/") {
            return responseJson({ ok: true, service: "senka-api" }, 200, origin);
        }

        if (url.pathname === "/api/course") {
            return responseJson({ courses }, 200, origin);
        }

        if (url.pathname === "/api/hello") {
            const name = url.searchParams.get("name");
            if (!name || !name.trim()) {
                return responseJson({ error: "name is required" }, 400, origin);
            }
            return responseJson({ message: `こんにちは、${name.trim()}さん` }, 200, origin);
        }

        if (url.pathname === "/api/fortune") {
            const fortunes = ["大吉", "中吉", "小吉", "吉"];
            const fortune = fortunes[Math.floor(Math.random() * fortunes.length)];
            return responseJson({ fortune }, 200, origin);
        }

        if (url.pathname === "/api/events") {
            return responseJson({ events }, 200, origin);
        }

        return responseJson({ error: "Not found" }, 404, origin);
    },
};
