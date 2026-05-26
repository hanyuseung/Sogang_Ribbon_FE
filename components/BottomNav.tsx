"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Map, Shuffle, Trophy, User } from "lucide-react";

const NAV_ITEMS = [
  { href: "/", icon: Home, label: "홈" },
  { href: "/map", icon: Map, label: "지도" },
  { href: "/gacha", icon: Shuffle, label: "뭐먹" },
  { href: "/award", icon: Trophy, label: "어워드" },
  { href: "/mypage", icon: User, label: "마이" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50">
      <div className="mx-4 mb-4 bg-white/90 backdrop-blur-md rounded-2xl shadow-[0_4px_24px_rgba(43,27,34,0.14)] border border-[#f0e0e8]">
        <ul className="flex items-center h-16">
          {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
            const isActive = pathname === href;

            return (
              <li key={href} className="flex-1 flex justify-center">
                <Link href={href} className="flex flex-col items-center gap-1 py-2 group">
                  <Icon
                    size={22}
                    strokeWidth={isActive ? 2.5 : 2.0}
                    className={`transition-colors duration-200 ${
                      isActive ? "text-[#d6336c]" : "text-[#7a5965] group-hover:text-[#d6336c]"
                    }`}
                  />
                  <span
                    className={`text-[11px] font-medium leading-none transition-colors duration-200 ${
                      isActive ? "text-[#d6336c]" : "text-[#7a5965] group-hover:text-[#d6336c]"
                    }`}
                  >
                    {label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
