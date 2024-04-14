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
  ...props
}: React.PropsWithChildren<
  {
    as?: React.ElementType;
    containerClassName?: string;
    className?: string;
    duration?: number;
    clockwise?: boolean;
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
    TOP: "radial-gradient(80.7% 50% at 50% 0%, #7B4F9D 0%, rgba(255, 255, 255, 0) 100%)",
    LEFT: "radial-gradient(86.6% 43.1% at 0% 50%, #7B4F9D 0%, rgba(255, 255, 255, 0) 100%)",
    BOTTOM:
      "radial-gradient(80.7% 50% at 50% 100%, #7B4F9D 0%, rgba(255, 255, 255, 0) 100%)",
    RIGHT:
      "radial-gradient(86.2% 41.199999999999996% at 100% 50%, #7B4F9D 0%, rgba(255, 255, 255, 0) 100%)",
  };

  useEffect(() => {
    if (hovered) {
      const interval = setInterval(() => {
        setDirection((prevState) => rotateDirection(prevState));
      }, duration * 1000);
      return () => clearInterval(interval);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hovered, duration]);

  return (
    <Tag
      onMouseEnter={() => {
        setHovered(true);
      }}
      onMouseLeave={() => {
        setHovered(false);
      }}
      className={cn(
        "relative flex rounded-full border  content-center  transition duration-500 bg-primary/20 items-center flex-col flex-nowrap gap-10 h-min justify-center overflow-visible p-px decoration-clone w-fit",
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
          `flex-none inset-0 overflow-hidden absolute z-0 rounded-[inherit] ${
            hovered ? "block" : "hidden"
          }`
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
          background: movingMap[direction],
        }}
        transition={{ ease: "linear", duration: duration ?? 1 }}
      />
      <div className="bg-black absolute z-1 flex-none inset-[2px] rounded-[100px]" />
    </Tag>
  );
}
