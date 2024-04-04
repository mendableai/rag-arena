"use client";
import React, { useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useTheme } from "../theme/header/theme-provider";

type Direction = "TOP" | "LEFT" | "BOTTOM" | "RIGHT";

export function HoverBorderGradient({
  children,
  containerClassName,
  className,
  as: Tag = "button",
  duration = 1,
  clockwise = true,
  stopAnimation,
  withHighlight,
  ...props
}: React.PropsWithChildren<
  {
    as?: React.ElementType;
    containerClassName?: string;
    className?: string;
    duration?: number;
    clockwise?: boolean;
    stopAnimation?: boolean;
    withHighlight?: boolean;
  } & React.HTMLAttributes<HTMLElement>
>) {
  const [hovered, setHovered] = useState<boolean>(false);
  const [direction, setDirection] = useState<Direction>("TOP");

  const rotateDirection = (currentDirection: Direction): Direction => {
    const directions: Direction[] = ["TOP", "LEFT", "BOTTOM", "RIGHT"];
    const currentIndex = directions.indexOf(currentDirection);
    const nextIndex = clockwise
      ? (currentIndex - 1 + directions.length) % directions.length
      : (currentIndex + 1) % directions.length;
    return directions[nextIndex];
  };

  const { theme } = useTheme();

  const movingMap: Record<Direction, string> = {
    TOP:
      theme === "dark"
        ? "radial-gradient(80.7% 50% at 50% 0%, hsl(0, 0%, 100%) 0%, rgba(255, 255, 255, 0) 100%)"
        : "radial-gradient(80.7% 50% at 50% 0%, hsl(0, 0%, 0%) 0%, rgba(0, 0, 0, 0) 100%)",
    LEFT:
      theme === "dark"
        ? "radial-gradient(86.6% 43.1% at 0% 50%, hsl(0, 0%, 100%) 0%, rgba(255, 255, 255, 0) 100%)"
        : "radial-gradient(86.6% 43.1% at 0% 50%, hsl(0, 0%, 0%) 0%, rgba(0, 0, 0, 0) 100%)",
    BOTTOM:
      theme === "dark"
        ? "radial-gradient(80.7% 50% at 50% 100%, hsl(0, 0%, 100%) 0%, rgba(255, 255, 255, 0) 100%)"
        : "radial-gradient(80.7% 50% at 50% 100%, hsl(0, 0%, 0%) 0%, rgba(0, 0, 0, 0) 100%)",
    RIGHT:
      theme === "dark"
        ? "radial-gradient(86.2% 41.199999999999996% at 100% 50%, hsl(0, 0%, 100%) 0%, rgba(255, 255, 255, 0) 100%)"
        : "radial-gradient(86.2% 41.199999999999996% at 100% 50%, hsl(0, 0%, 0%) 0%, rgba(0, 0, 0, 0) 100%)",
  };

  const highlight = withHighlight
    ? ""
    : "radial-gradient(75% 181.15942028985506% at 50% 50%, #7B4F9D 0%, rgba(255, 255, 255, 0) 100%)";

  useEffect(() => {
    if (!hovered && !stopAnimation) {
      const interval = setInterval(() => {
        setDirection((prevState) => rotateDirection(prevState));
      }, duration * 1000);
      return () => clearInterval(interval);
    }
  }, [hovered, stopAnimation, duration]);

  return (
    <Tag
      onMouseEnter={(event: React.MouseEvent<HTMLDivElement>) => {
        if (!stopAnimation) {
          setHovered(true);
        }
      }}
      onMouseLeave={() => {
        if (!stopAnimation) {
          setHovered(false);
        }
      }}
      className={cn(
        "relative flex rounded-full border  content-center hover:bg-black/10 transition duration-500 bg-primary/20 items-center flex-col flex-nowrap gap-10 h-min justify-center overflow-visible p-px decoration-clone w-fit",
        containerClassName
      )}
      {...props}
    >
      <div
        className={cn(
          "text-white z-10 dark:bg-[#080a0c] bg-white px-4 py-2 rounded-[inherit]",
          className,
          "min-w-full"
        )}
      >
        {children}
      </div>
      <motion.div
        className={cn(
          "flex-none inset-0 overflow-hidden absolute z-0 rounded-[inherit]"
        )}
        style={{
          filter: "blur(2px)",
          position: "absolute",
          width: "100%",
          height: "100%",
          background: "#000 !important",
        }}
        initial={{ background: movingMap[direction] }}
        animate={{
          background:
            hovered || stopAnimation
              ? [movingMap[direction], highlight]
              : movingMap[direction],
        }}
        transition={{ ease: "linear", duration: duration ?? 1 }}
      />
      <div className="bg-black absolute z-1 flex-none inset-[2px] rounded-[100px]" />
    </Tag>
  );
}
