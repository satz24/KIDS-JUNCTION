import { NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";

export const dynamic = "force-static";

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json();

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } },
      });

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      return NextResponse.json({ user: data.user, message: "Account created successfully" });
    }

    return NextResponse.json({
      message: "Demo signup successful. Configure Supabase for production auth.",
    });
  } catch {
    return NextResponse.json({ error: "Signup failed" }, { status: 500 });
  }
}
