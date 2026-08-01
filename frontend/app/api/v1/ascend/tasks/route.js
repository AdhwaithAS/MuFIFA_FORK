import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { success: false, error: "Database not configured" },
        { status: 503 }
      );
    }

    const { searchParams } = new URL(request.url);
    const domain = searchParams.get("domain");

    const headers = {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
    };

    let queryUrl = `${supabaseUrl}/rest/v1/ascend_tasks?select=*&is_active=eq.true&order=created_at.desc`;
    if (domain && domain !== "All") {
      queryUrl += `&domain=eq.${encodeURIComponent(domain)}`;
    }

    const res = await fetch(queryUrl, { method: "GET", headers });

    if (!res.ok) {
      console.error("Fetch ascend_tasks failed:", await res.text());
      return NextResponse.json({ success: true, tasks: [] });
    }

    const tasks = await res.json();
    return NextResponse.json({ success: true, tasks });
  } catch (error) {
    console.error("GET ascend/tasks error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
