"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV_HREFS = ["/", "/map", "/gacha", "/community", "/mypage"];

const variants = {
  enter: (dir: number) => ({ x: dir > 0 ? "100%" : "-100%" }),
  center: { x: 0 },
  exit: (dir: number) => ({ x: dir > 0 ? "-100%" : "100%", opacity: 0.15 }),
};

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

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
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 overflow-y-auto will-change-transform"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
