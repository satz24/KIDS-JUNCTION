import { NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";

export const dynamic = "force-static";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/login`,
      });

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
    }

    return NextResponse.json({
      message: "If an account exists, a password reset link has been sent.",
    });
  } catch {
    return NextResponse.json({ error: "Request failed" }, { status: 500 });
  }
}
