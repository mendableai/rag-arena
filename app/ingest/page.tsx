"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Assuming you have a similar Input component
import { Textarea } from "@/components/ui/textarea";
import { useState, type FormEvent } from "react";

export default function UploadDocumentsForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [document, setDocument] = useState("");
  const [author, setAuthor] = useState("");

  const ingest = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const response = await fetch("/api/ingest", {
      method: "POST",
      body: JSON.stringify({
        title,
        date,
        text: document,
        author,
      }),
    });
    if (response.ok) {
      setDocument("Uploaded!");
      setTitle("");
      setDate("");
    } else {
      const json = await response.json();
      setDocument(json.error || "Error uploading document");
    }
    setIsLoading(false);
  };

  return (
    <form onSubmit={ingest} className="flex flex-col max-w-3xl m-auto mb-4 mt-40 gap-4">
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
      />
      <Input
        value={date}
        onChange={(e) => setDate(e.target.value)}
        placeholder="Date"
      />
      <Input
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        placeholder="Author"
      />
      <Textarea
        value={document}
        onChange={(e) => setDocument(e.target.value)}
        placeholder="Document Text"
      ></Textarea>
      <Button type="submit" disabled={isLoading}>
        Upload
      </Button>
    </form>
  );
}
