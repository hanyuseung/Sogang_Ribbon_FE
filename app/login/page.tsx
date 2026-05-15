"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      if (authError.message.includes("Email not confirmed")) {
        setError("이메일 인증이 완료되지 않았어요. 메일함을 확인해 주세요.");
      } else {
        setError("이메일 또는 비밀번호가 올바르지 않아요.");
      }
      setIsLoading(false);
      return;
    }

    router.push(searchParams.get("redirect") ?? "/");
  };

  return (
    <div className="min-h-full bg-[#fff8fb] flex flex-col items-center justify-center px-5">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-3xl font-black text-[#d6336c] mb-1">🎀 서강리본</div>
          <p className="text-sm text-[#7a5965]">서강대학교 맛집을 발견하세요</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-sm border border-[#f3d5df] flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#2b1b22]">이메일</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@sogang.ac.kr"
              required
              className="w-full px-4 py-3 rounded-xl border border-[#f3d5df] bg-[#fff8fb] text-sm text-[#2b1b22] placeholder-[#c4a0b0] focus:outline-none focus:border-[#d6336c] transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#2b1b22]">비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력해 주세요"
              required
              className="w-full px-4 py-3 rounded-xl border border-[#f3d5df] bg-[#fff8fb] text-sm text-[#2b1b22] placeholder-[#c4a0b0] focus:outline-none focus:border-[#d6336c] transition-colors"
            />
          </div>

          {error && (
            <p className="text-xs text-red-500 text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-[#d6336c] text-white text-sm font-bold rounded-xl disabled:opacity-60 transition-opacity"
          >
            {isLoading ? "로그인 중..." : "로그인"}
          </button>
        </form>

        <p className="text-center text-sm text-[#7a5965] mt-5">
          아직 계정이 없으신가요?{" "}
          <Link href="/signup" className="font-bold text-[#d6336c]">
            회원가입
          </Link>
        </p>
      </div>
    </div>
  );
}
