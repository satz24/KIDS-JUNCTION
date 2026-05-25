import { NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 401 });
      }

      return NextResponse.json({ user: data.user, message: "Signed in successfully" });
    }

    return NextResponse.json({
      message: "Demo login successful. Configure Supabase for production auth.",
    });
  } catch {
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
