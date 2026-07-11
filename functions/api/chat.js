export async function onRequestPost(context) {
  try {
    const { messages, model } = await context.request.json();
    
    // Retrieve the secret API key securely stored in Cloudflare's Environment
    const apiKey = context.env.OPENROUTER_API_KEY; 

    if (!apiKey) {
      return new Response(JSON.stringify({ error: "API Key not configured on server backend." }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
        "HTTP-Referer": "https://qabrcare.co.za",
        "X-Title": "QabrCare Serverless Portal"
      },
      body: JSON.stringify({ model, messages })
    });

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
