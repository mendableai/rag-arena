import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { useState } from "react";
import { TEXT_SPLITTER_CODE } from "../code-templates/text-splitters";
import { BlockChunk } from "./animate-blocks.tsx";
import CustomPlaygroundIngestion from "./custom-ingestion";

export default function TextSplitterBox() {
  const mockBlockChunk = {
    name: "Example Block",
    description: "This is an example block for demonstration purposes.",
    file: "path/to/VectorStoreBox.tsx",
    code: "const VectorStoreBox = () => <div>Vector Store</div>;",
    container: {
      className: "example-container-class",
    },
  };

  const [language, setLanguage] = useState("jsx");
  const [languageDemo, setLanguageDemo] = useState(TEXT_SPLITTER_CODE["jsx"]);

  return (
    <BlockChunk
      key={"whatever"}
      chunk={mockBlockChunk}
      codeExample={{ languageDemo, language }}
      setLanguage={setLanguage}
      setLanguageDemo={setLanguageDemo}
    >
      <Card className={`relative  border-none`}>
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
