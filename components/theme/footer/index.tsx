import {
  MemoizedStars,
  TextRevealCard,
} from "@/components/ui/text-reveal-card";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <div className="flex items-center w-full justify-center">
      <div className="flex flex-row justify-evenly items-center max-w-7xl w-full center">
        <div>
          <TextRevealCard
            text=""
            revealText="Made by Mendable.ai"
            className="max-w-[300px] text-sm"
          ></TextRevealCard>
        </div>

        <div className="flex gap-5">
          <Link
            className="dark:text-white hover:opacity-80 ease-in-out transition-all duration-300 pr-1 "
            href={"https://mendable.ai/"}
            target="_BLANK"
          >
            <Image
              src="/images/mendable_logo_transparent.png"
              alt="Mendable Logo"
              className="rounded-md"
              width={23}
              height={23}
            />
          </Link>
          <Link
            className="dark:text-white hover:opacity-80 ease-in-out transition-all duration-300"
            href={"https://www.langchain.com/"}
            target="_BLANK"
          >
            🦜🔗
          </Link>
          <Link
            className="dark:text-white hover:opacity-80 ease-in-out transition-all duration-300"
            href={"https://nextjs.org/"}
            target="_BLANK"
          >
            Next.js
          </Link>
        </div>
      </div>
    </div>
  );
}
