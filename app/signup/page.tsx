"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { containsProfanity } from "@/lib/profanity";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (containsProfanity(nickname)) {
      setError("닉네임에 사용할 수 없는 단어가 포함되어 있어요.");
      return;
    }
    if (password.length < 6) {
      setError("비밀번호는 6자 이상이어야 해요.");
      return;
    }

    setIsLoading(true);

    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { nickname } },
    });

    if (authError) {
      setError(authError.message ?? "회원가입에 실패했어요. 다시 시도해 주세요.");
      setIsLoading(false);
      return;
    }

    setDone(true);
  };

  if (done) {
    return (
      <div className="min-h-full bg-[#fff8fb] flex flex-col items-center justify-center px-5 text-center">
        <div className="text-4xl mb-4">📬</div>
        <h2 className="text-lg font-black text-[#2b1b22] mb-2">이메일을 확인해 주세요</h2>
        <p className="text-sm text-[#7a5965] leading-relaxed mb-6">
          {email}로 인증 메일을 발송했어요.<br />
          인증 후 로그인할 수 있어요.
        </p>
        <Link
          href="/login"
          className="px-6 py-2.5 bg-[#d6336c] text-white text-sm font-bold rounded-full"
        >
          로그인 하러 가기
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-[#fff8fb] flex flex-col items-center justify-center px-5">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-3xl font-black text-[#d6336c] mb-1">🎀 서강리본</div>
          <p className="text-sm text-[#7a5965]">이메일로 가입해 주세요</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-sm border border-[#f3d5df] flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#2b1b22]">닉네임</label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="사용할 닉네임을 입력해 주세요"
              required
              className="w-full px-4 py-3 rounded-xl border border-[#f3d5df] bg-[#fff8fb] text-sm text-[#2b1b22] placeholder-[#c4a0b0] focus:outline-none focus:border-[#d6336c] transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#2b1b22]">이메일</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
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
              placeholder="6자 이상 입력해 주세요"
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
            {isLoading ? "가입 중..." : "회원가입"}
          </button>
        </form>

        <p className="text-center text-sm text-[#7a5965] mt-5">
          이미 계정이 있으신가요?{" "}
          <Link href="/login" className="font-bold text-[#d6336c]">
            로그인
          </Link>
        </p>
      </div>
    </div>
  );
}
