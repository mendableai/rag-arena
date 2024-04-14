import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { useEffect, useState } from "react";
import { getTextSplitterCode } from "../code-templates/text-splitter-code-sample";
import { useSelectedSplitOptionStore } from "../lib/globals";
import { BlockChunk } from "./animate-blocks.tsx";
import CustomPlaygroundIngestion from "./custom-ingestion";

export default function TextSplitterBox() {
  const [language, setLanguage] = useState("python");
  const [languageDemo, setLanguageDemo] = useState("");

  useEffect(() => {
    async function fetchInitialCode() {
      const initialCode = await getTextSplitterCode(
        "split_by_character",
        "python",
        ""
      );
      setLanguageDemo(initialCode);
    }
    fetchInitialCode();
  }, []);

  const blockInfo = {
    name: "Text Splitter",
    code: languageDemo,
  };

  const {selectedSplitOption} = useSelectedSplitOptionStore();

  return (
    <BlockChunk
      info={blockInfo}
      codeExample={{ languageDemo, language }}
      setLanguage={setLanguage}
      setLanguageDemo={setLanguageDemo}
      disabled={selectedSplitOption === ""}
    >
      <Card className={`relative border-none`}>
        <Badge
          variant={"outline"}
          className="-left-6 -top-4 absolute bg-primary text-white"
        >
          1
        </Badge>
        <CardHeader>Text Splitter</CardHeader>
        <CardContent className="flex gap-4">
          <CustomPlaygroundIngestion />
        </CardContent>
        <CardFooter className="flex justify-between"></CardFooter>
      </Card>
    </BlockChunk>
  );
}
