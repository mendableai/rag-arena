"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AnimatePresence, motion } from "framer-motion";
import { Code } from "lucide-react";
import { CopyBlock, tomorrowNight } from "react-code-blocks";
import { TEXT_SPLITTER_CODE } from "../../code-templates/text-splitters";

export function CodeModal({
  name,
  code,
  codeExample,
  setLanguage,
  setLanguageDemo,
  ...props
}: {
  name: string;
  code: string;
  codeExample: { language: string; languageDemo: string };
  setLanguage: React.Dispatch<React.SetStateAction<string>>;
  setLanguageDemo: React.Dispatch<React.SetStateAction<string>>;
}) {
  type LanguageKey = keyof typeof TEXT_SPLITTER_CODE;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0.5 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { ease: "easeOut", duration: 0.2 } }}
        transition={{ ease: "easeIn", duration: 0.1 }}
        {...props}
      >
        <Dialog>
          <DialogTrigger asChild>
            <Button
              size="icon"
              variant="outline"
              className="h-7 w-7 rounded-[6px] [&_svg]:size-3.5"
            >
              <Code/>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Code for {name}</DialogTitle>
              <DialogDescription>
                Make changes to your profile here. Click save when youre done.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4">
              <Select
                onValueChange={(value) => {
                  const languageKey = value as LanguageKey;
                  setLanguageDemo(TEXT_SPLITTER_CODE[languageKey]);
                  setLanguage(languageKey);
                }}
                value={codeExample.language}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Languages</SelectLabel>
                    {Object.keys(TEXT_SPLITTER_CODE).map((language) => (
                      <SelectItem key={language} value={language}>
                        {language}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

                <CopyBlock
                  language={codeExample.language}
                  text={codeExample.languageDemo}
                  showLineNumbers={true}
                  theme={tomorrowNight}
                  codeBlock
                />
            </div>
            <DialogFooter>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>
    </AnimatePresence>
  );
}
