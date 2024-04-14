/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import aplyToast from "@/lib/aplyToaster";
import { AnimatePresence, motion } from "framer-motion";
import { Code } from "lucide-react";
import { useEffect, useState } from "react";
import { CopyBlock, tomorrowNight } from "react-code-blocks";
import {
  LLMLanguages,
  LLMOption
} from "../../code-templates/get-llm-code-sample";
import {
  RetrieverLanguages,
  RetrieverOption
} from "../../code-templates/retriever-code-sample";
import {
  SplitOptionLanguages
} from "../../code-templates/text-splitter-code-sample";
import {
  VectorStoreLanguages
} from "../../code-templates/vector-store-code-sample";
import {
  useSelectedPlaygroundLlmStore,
  useSelectedPlaygroundRetrieverStore,
  useSelectedSplitOptionStore,
  useSelectedVectorStore,
} from "../../lib/globals";
import {
  LanguageOption,
  SplitOption,
  VectorStoreOption,
} from "../../lib/types";
import { updateLanguageAndDemo } from "../utils/update-language-and-demo";

export function CodeModal({
  name,
  code,
  codeExample,
  setLanguage,
  setLanguageDemo,
  disabled,
  ...props
}: {
  name: string;
  code: string;
  codeExample: { language: string; languageDemo: string };
  setLanguage: React.Dispatch<React.SetStateAction<string>>;
  setLanguageDemo: React.Dispatch<React.SetStateAction<string>>;
  disabled: boolean;
}) {
  const { selectedSplitOption } = useSelectedSplitOptionStore();

  const { selectedVectorStore } = useSelectedVectorStore();

  const { selectedPlaygroundRetriever } = useSelectedPlaygroundRetrieverStore();

  const { selectedPlaygroundLlm } = useSelectedPlaygroundLlmStore();

  const [link, setLink] = useState("");

  useEffect(() => {
    if (name === "Text Splitter" && selectedSplitOption) {
      const optionLinks =
        SplitOptionLanguages[selectedSplitOption as SplitOption];
      const languageLink = optionLinks.find(
        (option) => option.language === codeExample.language
      )?.link;

      if (!languageLink) {
        aplyToast("No link found");
        return;
      }
      setLink(languageLink);
    }

    if (name === "Vector Store" && selectedVectorStore) {
      const optionLinks =
        VectorStoreLanguages[selectedVectorStore as VectorStoreOption];
      const languageLink = optionLinks.find(
        (option) => option.language === codeExample.language
      )?.link;

      if (!languageLink) {
        aplyToast("No link found");
        return;
      }
      setLink(languageLink);
    }

    if (name === "Retriever" && selectedPlaygroundRetriever) {
      const optionLinks =
        RetrieverLanguages[selectedPlaygroundRetriever as RetrieverOption];
      const languageLink = optionLinks.find(
        (option) => option.language === codeExample.language
      )?.link;

      if (!languageLink) {
        aplyToast("No link found");
        return;
      }
      setLink(languageLink);
    }

    if (name === "LLM" && selectedPlaygroundLlm) {
      const optionLinks = LLMLanguages[selectedPlaygroundLlm as LLMOption];
      const languageLink = optionLinks?.find(
        (option) => option.language === codeExample.language
      )?.link;

      if (!languageLink) {
        aplyToast("No link found");
        return;
      }
      setLink(languageLink);
    }

    updateLanguageAndDemo(
      name,
      codeExample.language as LanguageOption,
      selectedSplitOption as SplitOption,
      selectedVectorStore as VectorStoreOption,
      selectedPlaygroundRetriever as RetrieverOption,
      selectedPlaygroundLlm as LLMOption,
      setLanguageDemo,
      setLanguage
    );
  }, [
    selectedSplitOption,
    selectedVectorStore,
    selectedPlaygroundRetriever,
    selectedPlaygroundLlm,
    codeExample.language,
  ]);

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
              className="h-7 w-7 rounded-[6px] [&_svg]:size-3.5 bg-primary"
              disabled={disabled}
            >
              <Code />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Code for {name}</DialogTitle>
              <DialogDescription>
                {name === "Text Splitter"
                  ? "Select a language to see the code for Text Splitter"
                  : name === "Vector Store"
                  ? "Select a language to see the code for Vector Store"
                  : name === "Retriever"
                  ? "Select a language to see the code for Retriever"
                  : "Select a language to see the code for LLM"}
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <Select
                  onValueChange={async (value) => {
                    const languageKey = value as LanguageOption;
                    await updateLanguageAndDemo(
                      name,
                      languageKey,
                      selectedSplitOption as SplitOption,
                      selectedVectorStore as VectorStoreOption,
                      selectedPlaygroundRetriever as RetrieverOption,
                      selectedPlaygroundLlm as LLMOption,
                      setLanguageDemo,
                      setLanguage
                    );
                  }}
                  value={codeExample.language}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Languages</SelectLabel>

                      {name === "Text Splitter" &&
                        SplitOptionLanguages[
                          selectedSplitOption as SplitOption
                        ]?.map((language, index) => (
                          <SelectItem key={index} value={language.language}>
                            {language.language}
                          </SelectItem>
                        ))}

                      {name === "Vector Store" &&
                        VectorStoreLanguages[
                          selectedVectorStore as VectorStoreOption
                        ]?.map((language, index) => (
                          <SelectItem key={index} value={language.language}>
                            {language.language}
                          </SelectItem>
                        ))}

                      {name === "Retriever" &&
                        RetrieverLanguages[
                          selectedPlaygroundRetriever as RetrieverOption
                        ]?.map((language, index) => (
                          <SelectItem key={index} value={language.language}>
                            {language.language}
                          </SelectItem>
                        ))}

                      {name === "LLM" &&
                        LLMLanguages[selectedPlaygroundLlm as LLMOption]?.map(
                          (language, index) => (
                            <SelectItem key={index} value={language.language}>
                              {language.language}
                            </SelectItem>
                          )
                        )}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <a
                  href={link}
                  target="_blank"
                  className="text-sm text-primary hover:text-primary/80 cursor-pointer"
                >
                  Full documentation
                </a>
              </div>
              <div className="max-h-[350px] overflow-auto">
                <CopyBlock
                  language={codeExample.language}
                  text={codeExample.languageDemo}
                  showLineNumbers={true}
                  theme={tomorrowNight}
                  codeBlock
                />
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>
    </AnimatePresence>
  );
}
