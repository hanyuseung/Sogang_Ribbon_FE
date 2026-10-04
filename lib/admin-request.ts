import { supabase } from "@/lib/supabase";

export async function adminRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error("로그인이 만료됐어요. 다시 로그인해 주세요.");
  const headers = new Headers(options.headers);
  headers.set("Authorization", `Bearer ${session.access_token}`);
  if (options.body) headers.set("Content-Type", "application/json");
  const response = await fetch(path, { ...options, headers, cache: "no-store" });
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(typeof body?.error === "string" ? body.error : "요청에 실패했어요. 다시 시도해 주세요.");
  }
  return response.json() as Promise<T>;
}
