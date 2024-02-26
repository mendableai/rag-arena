import { TextRevealCard } from "@/components/ui/text-reveal-card";
import Link from "next/link";

export default function Footer() {
  return (
    <div className="flex items-center mt-8 w-full justify-center border-t bg-[#080a0c]">
      <div className="flex flex-row justify-evenly items-center max-w-7xl w-full center">
        <div>
          <TextRevealCard
            text="Made by pure magic!"
            revealText="Made by Mendable.ai"
            className="max-w-[300px] text-sm"
          ></TextRevealCard>
        </div>
        <div className="flex gap-10">
            <Link className="text-white hover:opacity-80 ease-in-out transition-all duration-300" href={"https://mendable.ai/"} target="_BLANK">mendable.ai</Link>
            <Link className="text-white hover:opacity-80 ease-in-out transition-all duration-300" href={"https://www.langchain.com/"} target="_BLANK">langchain</Link>
            <Link className="text-white hover:opacity-80 ease-in-out transition-all duration-300" href={"https://nextjs.org/"} target="_BLANK">Next.js</Link>
        </div>
      </div>
    </div>
  );
}
