"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import type { PanInfo } from "framer-motion";
import { useState } from "react";

const NAV_HREFS = ["/", "/map", "/gacha", "/community", "/mypage"];
const SWIPE_DISTANCE = 80;
const SWIPE_VELOCITY = 400;

const variants = {
  enter: (dir: number) => ({ x: dir > 0 ? "100%" : "-100%" }),
  center: { x: 0 },
  exit: (dir: number) => ({ x: dir > 0 ? "-100%" : "100%", opacity: 0.15 }),
};

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  // pathname 변화를 렌더 중 감지해 방향을 동기적으로 계산
  // React 공식 패턴: 렌더 중 setState로 이전 값 추적
  // → React가 첫 render 출력을 버리고 즉시 새 state로 재render하므로 타이밍 문제 없음
  const [prevPathname, setPrevPathname] = useState(pathname);
  const [direction, setDirection] = useState(1);

  if (pathname !== prevPathname) {
    const prevIdx = NAV_HREFS.indexOf(prevPathname);
    const currIdx = NAV_HREFS.indexOf(pathname);
    const newDir =
      prevIdx !== -1 && currIdx !== -1 ? (currIdx > prevIdx ? 1 : -1) : direction;
    setDirection(newDir);
    setPrevPathname(pathname);
  }

  function handleDragEnd(_: PointerEvent, info: PanInfo) {
    const { offset, velocity } = info;
    const currentIdx = NAV_HREFS.indexOf(pathname);
    if (currentIdx === -1) return;

    const swipeLeft = offset.x < -SWIPE_DISTANCE || velocity.x < -SWIPE_VELOCITY;
    const swipeRight = offset.x > SWIPE_DISTANCE || velocity.x > SWIPE_VELOCITY;

    if (swipeLeft && currentIdx < NAV_HREFS.length - 1) {
      router.push(NAV_HREFS[currentIdx + 1]);
    } else if (swipeRight && currentIdx > 0) {
      router.push(NAV_HREFS[currentIdx - 1]);
    }
  }

  return (
    <div className="flex-1 min-h-0 relative overflow-hidden">
      <AnimatePresence mode="sync" initial={false} custom={direction}>
        <motion.div
          key={pathname}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
          drag="x"
          dragDirectionLock
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.3}
          dragMomentum={false}
          onDragEnd={handleDragEnd}
          className="absolute inset-0 overflow-y-auto will-change-transform"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
