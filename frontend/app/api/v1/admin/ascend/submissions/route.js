import { NextResponse } from "next/server";
import { requireRole } from "@/utils/auth";

export async function DELETE(request) {
  try {
    const auth = requireRole(request, "superadmin", "admin", "iglead");
    if (auth.error) {
      return NextResponse.json(
        { success: false, error: auth.message },
        { status: auth.status }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Submission ID is required" },
        { status: 400 }
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
      `${supabaseUrl}/rest/v1/ascend_submissions?id=eq.${encodeURIComponent(id)}`,
      { method: "DELETE", headers }
    );

    if (!res.ok) {
      const errText = await res.text();
      console.error("Admin Delete ascend_submissions error:", errText);
      return NextResponse.json(
        { success: false, error: "Failed to delete submission." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Student submission deleted successfully by admin",
    });
  } catch (error) {
    console.error("Admin DELETE ascend/submissions error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
