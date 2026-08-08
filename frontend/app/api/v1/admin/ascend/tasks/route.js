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
      `${supabaseUrl}/rest/v1/ascend_tasks?select=*&order=created_at.desc`,
      { method: "GET", headers }
    );

    if (!res.ok) {
      return NextResponse.json({ success: true, tasks: [] });
    }

    const tasks = await res.json();
    return NextResponse.json({ success: true, tasks });
  } catch (error) {
    console.error("Admin GET ascend/tasks error:", error);
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
      company_name,
      company_logo = "",
      domain = "Coder",
      title,
      description,
      requirements = "",
      perks = "",
      deadline = null,
    } = body;

    if (!company_name || !title || !description) {
      return NextResponse.json(
        { success: false, error: "Company name, title, and description are required." },
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
      "Content-Type": "application/json",
      Prefer: "return=representation",
    };

    const payload = {
      company_name,
      company_logo,
      domain,
      title,
      description,
      requirements,
      perks,
      deadline: deadline ? new Date(deadline).toISOString() : null,
      is_active: true,
      created_at: new Date().toISOString(),
    };

    const res = await fetch(`${supabaseUrl}/rest/v1/ascend_tasks`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Create ascend_tasks error:", errText);
      return NextResponse.json(
        { success: false, error: "Failed to create company task" },
        { status: 500 }
      );
    }

    const created = await res.json();
    return NextResponse.json({
      success: true,
      message: "Company task created successfully!",
      task: created[0] || payload,
    });
  } catch (error) {
    console.error("Admin POST ascend/tasks error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

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
        { success: false, error: "Task ID is required for deletion." },
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
      `${supabaseUrl}/rest/v1/ascend_tasks?id=eq.${id}`,
      { method: "DELETE", headers }
    );

    if (!res.ok) {
      const errText = await res.text();
      console.error("Delete ascend_tasks error:", errText);
      return NextResponse.json(
        { success: false, error: "Failed to delete task." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Company task deleted successfully!",
    });
  } catch (error) {
    console.error("Admin DELETE ascend/tasks error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
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
      id,
      company_name,
      company_logo = "",
      domain = "Coder",
      title,
      description,
      requirements = "",
      perks = "",
      deadline = null,
      is_active = true,
    } = body;

    if (!id || !company_name || !title || !description) {
      return NextResponse.json(
        { success: false, error: "Task ID, company name, title, and description are required." },
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
      "Content-Type": "application/json",
      Prefer: "return=representation",
    };

    const payload = {
      company_name,
      company_logo,
      domain,
      title,
      description,
      requirements,
      perks,
      deadline: deadline ? new Date(deadline).toISOString() : null,
      is_active: Boolean(is_active),
    };

    const res = await fetch(`${supabaseUrl}/rest/v1/ascend_tasks?id=eq.${id}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Update ascend_tasks error:", errText);
      return NextResponse.json(
        { success: false, error: "Failed to update company task" },
        { status: 500 }
      );
    }

    const updated = await res.json();
    return NextResponse.json({
      success: true,
      message: "Company task updated successfully!",
      task: updated[0] || payload,
    });
  } catch (error) {
    console.error("Admin PUT ascend/tasks error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
