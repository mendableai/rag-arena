"use client";

import { Card } from "../../ui/card";

export default function DocumentPopUp() {
  return (
    <Card className="w-[250px] dark:bg-[#8559f4] dark:bg-opacity-40 fixed invisible md:visible md:bottom-10 md:left-10 text-center hover:scale-105">
      <span className="hover:cursor-pointer text-sm shadow-2xl">
        Sourced from{" "}
        <a
          href="https://paulgraham.com/articles.html"
          target="_blank"
          className="underline"
        >
          Paul Grahams essays
        </a>
      </span>
    </Card>
  );
}
