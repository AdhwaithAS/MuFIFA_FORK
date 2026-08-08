import { NextResponse } from "next/server";
import { verifyToken } from "@/utils/auth";

const PLAYER_COOKIE = "player_token";

function getPlayerFromReq(request) {
  const cookieHeader = request.headers.get("cookie") || "";
  const match = cookieHeader.match(
    new RegExp(`(?:^|;\\s*)${PLAYER_COOKIE}=([^;]*)`)
  );
  if (!match) return null;
  const token = match[1];
  return verifyToken(token);
}

export async function GET(request) {
  try {
    const player = getPlayerFromReq(request);
    if (!player || !player.user_id) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_KEY;
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { success: false, error: "Database not configured" },
        { status: 503 }
      );
    }

    const headers = {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
    };

    const res = await fetch(
      `${supabaseUrl}/rest/v1/ascend_registrations?user_id=eq.${encodeURIComponent(player.user_id)}&limit=1`,
      { method: "GET", headers }
    );

    if (!res.ok) {
      return NextResponse.json({ success: true, registered: false, registration: null });
    }

    const data = await res.json();
    if (data && data.length > 0) {
      return NextResponse.json({ success: true, registered: true, registration: data[0] });
    }

    return NextResponse.json({ success: true, registered: false, registration: null });
  } catch (error) {
    console.error("GET ascend/register error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const player = getPlayerFromReq(request);
    if (!player || !player.user_id) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      seeking_internship = true,
      primary_domain = "Coder",
      portfolio_url = "",
      github_url = "",
      linkedin_url = "",
      skills = "",
    } = body;

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_KEY;
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { success: false, error: "Database not configured" },
        { status: 503 }
      );
    }

    const headers = {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates,return=representation",
    };

    const payload = {
      user_id: player.user_id,
      seeking_internship: Boolean(seeking_internship),
      primary_domain,
      portfolio_url,
      github_url,
      linkedin_url,
      skills,
      registered_at: new Date().toISOString(),
    };

    const res = await fetch(`${supabaseUrl}/rest/v1/ascend_registrations`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Supabase ascend_registrations insert error:", errText);
      return NextResponse.json(
        { success: false, error: "Failed to save registration" },
        { status: 500 }
      );
    }

    const saved = await res.json();
    return NextResponse.json({
      success: true,
      message: "Successfully registered for Ascend!",
      registration: saved[0] || payload,
    });
  } catch (error) {
    console.error("POST ascend/register error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const player = getPlayerFromReq(request);
    if (!player || !player.user_id) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      seeking_internship = true,
      portfolio_url = "",
      github_url = "",
      linkedin_url = "",
      skills = "",
    } = body;

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_KEY;
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { success: false, error: "Database not configured" },
        { status: 503 }
      );
    }

    const headers = {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    };

    const payload = {
      seeking_internship: Boolean(seeking_internship),
      portfolio_url,
      github_url,
      linkedin_url,
      skills,
      updated_at: new Date().toISOString(),
    };

    // Note: primary_domain is intentionally omitted from PUT updates to lock the domain after initial registration.

    const res = await fetch(
      `${supabaseUrl}/rest/v1/ascend_registrations?user_id=eq.${encodeURIComponent(player.user_id)}`,
      {
        method: "PATCH",
        headers,
        body: JSON.stringify(payload),
      }
    );

    if (!res.ok) {
      const errText = await res.text();
      console.error("Supabase ascend_registrations update error:", errText);
      return NextResponse.json(
        { success: false, error: "Failed to update profile" },
        { status: 500 }
      );
    }

    const saved = await res.json();
    return NextResponse.json({
      success: true,
      message: "Candidate profile updated successfully!",
      registration: saved[0] || payload,
    });
  } catch (error) {
    console.error("PUT ascend/register error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
