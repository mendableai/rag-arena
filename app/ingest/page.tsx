"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState, type FormEvent } from "react";

export default function UploadDocumentsForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [document, setDocument] = useState("");
  const ingest = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const response = await fetch("/api/ingest", {
      method: "POST",
      body: JSON.stringify({
        text: document,
      }),
    });
    if (response.status === 200) {
      setDocument("Uploaded!");
    } else {
      const json = await response.json();
      if (json.error) {
        setDocument(json.error);
      }
    }
    setIsLoading(false);
  };
  return (
    <form onSubmit={ingest} className="flex max-w-3xl m-auto mb-4 mt-40 gap-4">
      <Textarea
        value={document}
        onChange={(e) => setDocument(e.target.value)}
      ></Textarea>

      <Button type="submit" disabled={isLoading}>
        Upload
      </Button>
    </form>
  );
}
