"use client";

import { AnimatePresence, motion } from "framer-motion";
import * as React from "react";

import { cn } from "@/lib/utils";
import { BlockCopyButton } from "./block-copy-button";
import { CodeModal } from "./code-modal";
import { type BlockCodeExample } from "./schema";

interface BlockChunkProps
  extends React.PropsWithChildren<{
    info?: BlockCodeExample;
    codeExample: { language: string; languageDemo: string };
    setLanguage: React.Dispatch<React.SetStateAction<string>>;
    setLanguageDemo: React.Dispatch<React.SetStateAction<string>>;
    disabled: boolean;
  }> {}

export function BlockChunk({
  info,
  children,
  codeExample,
  setLanguage,
  setLanguageDemo,
  disabled,
  ...props
}: BlockChunkProps) {
  if (!info) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        key={info.name}
        x-chunk-container={info.name}
        initial={{ opacity: 0.5 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { ease: "easeOut", duration: 0.2 } }}
        transition={{ ease: "easeIn", duration: 0.1 }}
        className={cn("group rounded-xl transition")}
        {...props}
      >
        <div className="relative z-30">{children}</div>
        {info.code && (
          <div className="absolute inset-x-0 top-0 z-20 flex px-4 py-3 opacity-0 transition-all duration-200 ease-in group-hover:-translate-y-12 group-hover:opacity-100">
            <div className="flex w-full items-center justify-end gap-2">
              <BlockCopyButton
                event="copy_chunk_code"
                name={info.name}
                code={info.code}
                disabled={disabled}
              />
              <CodeModal
                name={info.name}
                code={info.code}
                codeExample={codeExample}
                setLanguage={setLanguage}
                setLanguageDemo={setLanguageDemo}
                disabled={disabled}
              />
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
