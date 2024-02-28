import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { NextRequest, NextResponse } from "next/server";

import supabase from "@/lib/supabase";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { SupabaseVectorStore } from "langchain/vectorstores/supabase";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { text, title, date, author } = body;

  if (process.env.NEXT_PUBLIC_DEMO === "true") {
    return NextResponse.json(
      {
        error: [
          "Ingest is not supported in demo mode.",
          "Please set up your own version of the repo here: https://github.com/langchain-ai/langchain-nextjs-template",
        ].join("\n"),
      },
      { status: 403 },
    );
  }

  try {
    const splitter = RecursiveCharacterTextSplitter.fromLanguage("markdown", {
      chunkSize: 500,
      chunkOverlap: 100,
    });

    const splitDocuments = await splitter.createDocuments([text]);

    const documentsWithMetadata = splitDocuments.map(doc => ({
      ...doc,
      metadata: { ...doc.metadata, title, date, author },
    }));

    const vectorstore = await SupabaseVectorStore.fromDocuments(
      documentsWithMetadata,
      new OpenAIEmbeddings(),
      {
        client: supabase,
        tableName: "documents",
        queryName: "match_documents",
      },
    );

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
