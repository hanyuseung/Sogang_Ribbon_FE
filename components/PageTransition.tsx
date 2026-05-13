"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const NAV_HREFS = [
  "/gacha",
  "/map",
  "/",
  "/community",
  "/mypage",
];

const variants = {
  enter: (dir: number) => ({
    x: dir > 0 ? "100%" : "-100%",
  }),

  center: {
    x: 0,
  },

  exit: (dir: number) => ({
    x: dir > 0 ? "-100%" : "100%",
    opacity: 0.15,
  }),
};

export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const [displayPath, setDisplayPath] = useState(pathname);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    if (pathname === displayPath) return;

    const prevIdx = NAV_HREFS.indexOf(displayPath);
    const currIdx = NAV_HREFS.indexOf(pathname);

    if (prevIdx !== -1 && currIdx !== -1) {
      setDirection(currIdx > prevIdx ? 1 : -1);
    }

    setDisplayPath(pathname);
  }, [pathname, displayPath]);

  return (
    <div className="flex-1 min-h-0 relative overflow-hidden">
      <AnimatePresence
        mode="wait"
        initial={false}
        custom={direction}
      >
        <motion.div
          key={displayPath}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            duration: 0.22,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="absolute inset-0 overflow-y-auto will-change-transform"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}