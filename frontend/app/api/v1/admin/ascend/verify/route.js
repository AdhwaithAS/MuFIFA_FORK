import { NextResponse } from "next/server";
import { requireRole } from "@/utils/auth";

export async function GET(request) {
  try {
    const auth = requireRole(request, "superadmin", "admin", "viewer", "iglead");
    if (auth.error) {
      return NextResponse.json(
        { success: false, error: auth.message },
        { status: auth.status }
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
      `${supabaseUrl}/rest/v1/ascend_submissions?select=*,ascend_tasks(*),registrations(name,user_id,email,team,domain,avatar_url)&order=submitted_at.desc`,
      { method: "GET", headers }
    );

    if (!res.ok) {
      return NextResponse.json({ success: true, submissions: [] });
    }

    const submissions = await res.json();
    return NextResponse.json({ success: true, submissions });
  } catch (error) {
    console.error("Admin GET ascend/verify error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const auth = requireRole(request, "superadmin", "admin", "iglead");
    if (auth.error) {
      return NextResponse.json(
        { success: false, error: auth.message },
        { status: auth.status }
      );
    }

    const body = await request.json();
    const {
      submission_id,
      quality_score = 0,
      innovation_score = 0,
      status = "Graded",
      admin_feedback = "",
    } = body;

    if (!submission_id) {
      return NextResponse.json(
        { success: false, error: "Submission ID is required." },
        { status: 400 }
      );
    }

    const quality = Math.max(0, Math.min(5, Number(quality_score)));
    const innovation = Math.max(0, Math.min(5, Number(innovation_score)));
    const total_rating = quality + innovation; // Total rating out of 10

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
      quality_score: quality,
      innovation_score: innovation,
      total_rating,
      status: status || "Graded",
      admin_feedback,
      graded_at: new Date().toISOString(),
    };

    const res = await fetch(
      `${supabaseUrl}/rest/v1/ascend_submissions?id=eq.${encodeURIComponent(submission_id)}`,
      {
        method: "PATCH",
        headers,
        body: JSON.stringify(payload),
      }
    );

    if (!res.ok) {
      const errText = await res.text();
      console.error("Update ascend_submissions grade error:", errText);
      return NextResponse.json(
        { success: false, error: "Failed to update submission score" },
        { status: 500 }
      );
    }

    const updated = await res.json();
    return NextResponse.json({
      success: true,
      message: `Submission marked! Total Score: ${total_rating}/10 Stars`,
      submission: updated[0] || payload,
    });
  } catch (error) {
    console.error("Admin POST ascend/verify error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
