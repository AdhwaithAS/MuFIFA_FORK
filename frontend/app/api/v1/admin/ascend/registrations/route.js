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

    // Fetch ascend registrations with player details
    const res = await fetch(
      `${supabaseUrl}/rest/v1/ascend_registrations?select=*,registrations(name,user_id,email,team,phone,avatar_url)&order=registered_at.desc`,
      { method: "GET", headers }
    );

    let registrations = [];
    if (res.ok) {
      registrations = await res.json();
    } else {
      // Fallback without embedded join if relation fails
      const fallbackRes = await fetch(
        `${supabaseUrl}/rest/v1/ascend_registrations?select=*&order=registered_at.desc`,
        { method: "GET", headers }
      );
      if (fallbackRes.ok) {
        registrations = await fallbackRes.json();
      }
    }

    // Also fetch submissions count for minimal stats
    let totalSubmissions = 0;
    const subRes = await fetch(
      `${supabaseUrl}/rest/v1/ascend_submissions?select=id`,
      { method: "GET", headers }
    );
    if (subRes.ok) {
      const subs = await subRes.json();
      totalSubmissions = Array.isArray(subs) ? subs.length : 0;
    }

    // Compute minimal stats
    const totalRegistered = registrations.length;

    // Today's count (comparison by YYYY-MM-DD in UTC / ISO string)
    const todayStr = new Date().toISOString().split("T")[0];
    const todayCount = registrations.filter((r) => {
      if (!r.registered_at) return false;
      return r.registered_at.startsWith(todayStr);
    }).length;

    const internshipSeekers = registrations.filter(
      (r) => r.seeking_internship !== false
    ).length;

    const domainBreakdown = {
      Coder: 0,
      Creative: 0,
      Management: 0,
      Maker: 0,
    };
    registrations.forEach((r) => {
      if (r.primary_domain && domainBreakdown[r.primary_domain] !== undefined) {
        domainBreakdown[r.primary_domain]++;
      }
    });

    const stats = {
      totalRegistered,
      todayCount,
      internshipSeekers,
      totalSubmissions,
      domainBreakdown,
    };

    return NextResponse.json({
      success: true,
      registrations,
      stats,
    });
  } catch (error) {
    console.error("Admin GET ascend/registrations error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
