// netlify/functions/reservations.js
import { getStore } from "@netlify/blobs";

export default async (req) => {
  const store = getStore("reservations"); // creates/uses a store named "reservations"

  if (req.method === "GET") {
    // read the current list (or return empty)
    const json = await store.get("list.json", { type: "json" });
    return new Response(JSON.stringify(json || { names: [] }), {
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });
  }

  if (req.method === "POST") {
    const { name } = await req.json();
    if (!name || !name.trim()) {
      return new Response(JSON.stringify({ error: "Name required" }), { status: 400 });
    }
    const current = (await store.get("list.json", { type: "json" })) || { names: [] };
    current.names.push(name.trim());

    await store.setJSON("list.json", current);
    return new Response(JSON.stringify({ ok: true }), {
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });
  }

  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
      }
    });
  }

  return new Response("Method not allowed", { status: 405 });
}

export const config = { path: "/.netlify/functions/reservations" };
