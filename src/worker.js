export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    // Set up common CORS headers for local/remote calls
    const headers = {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization"
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers });
    }

    try {
      const db = env.DB; // Bind D1 Database instance

      // --- ROUTE: GET OR POST GRAVES ---
      if (path === "/api/graves") {
        if (request.method === "GET") {
          if (!db) {
            return new Response(JSON.stringify({ error: "D1 database not yet bound to Pages project." }), { status: 500, headers });
          }
          const { results } = await db.prepare("SELECT * FROM graves").all();
          return new Response(JSON.stringify(results), { headers });
        }

        if (request.method === "POST") {
          const body = await request.json();
          const { id, name, surname, qabr, cemeteryId, lat, lng, dod, family, dual_grave, approved } = body;
          
          if (!db) {
            return new Response(JSON.stringify({ error: "D1 not bound. Mocking upload successful." }), { headers });
          }

          await db.prepare(
            "INSERT INTO graves (id, name, surname, qabr, cemeteryId, lat, lng, dod, family, dual_grave, approved) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
          ).bind(id, name, surname, qabr, cemeteryId, lat, lng, dod, family, dual_grave ? 1 : 0, approved ? 1 : 0).run();

          return new Response(JSON.stringify({ success: true, message: "Grave saved to D1 securely." }), { headers });
        }
      }

      // --- ROUTE: POST ORDERS ---
      if (path === "/api/orders") {
        if (request.method === "POST") {
          const body = await request.json();
          const { id, client_name, client_email, qty, tree_qty, gateway, target_details, total_price, debit_bank, debit_account } = body;

          if (!db) {
            return new Response(JSON.stringify({ success: true, message: "Order processed successfully (Mock)." }), { headers });
          }

          await db.prepare(
            "INSERT INTO orders (id, client_name, client_email, qty, tree_qty, gateway, target_details, total_price, debit_bank, debit_account) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
          ).bind(id, client_name, client_email, qty, tree_qty, gateway, target_details, total_price, debit_bank, debit_account).run();

          return new Response(JSON.stringify({ success: true, message: "Order recorded securely in Cloudflare D1 database." }), { headers });
        }
      }

      // --- ROUTE: SECURE OPENROUTER PROXY (Both Chat and Vision API) ---
      if (path === "/api/chat" && request.method === "POST") {
        const { messages, model } = await request.json();
        const apiKey = env.OPENROUTER_API_KEY;

        if (!apiKey) {
          return new Response(JSON.stringify({ error: "Server API Key not found. Please bind OPENROUTER_API_KEY." }), {
            status: 500,
            headers
          });
        }

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`,
            "HTTP-Referer": "https://qabrcare.co.za",
            "X-Title": "QabrCare Portal"
          },
          body: JSON.stringify({ model, messages })
        });

        const data = await response.json();
        return new Response(JSON.stringify(data), { headers });
      }

      // --- FALLBACK: If route isn't an API, serve your compiled React frontend files!
      return env.ASSETS.fetch(request);

    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), { status: 500, headers });
    }
  }
};