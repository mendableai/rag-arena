import os
from pathlib import Path

from dotenv import load_dotenv
from supabase import Client, create_client

env_path = Path(__file__).resolve().parent.parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_PRIVATE_KEY = os.getenv("NEXT_PUBLIC_SUPABASE_PRIVATE_KEY")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_PRIVATE_KEY)


def get_documents(collection_id: str = "pg-essays"):

    print("getting documents")
    selected_fields = "id, content, metadata, embedding, collection_id"
    data = (
        supabase.table("documents")
        .select(selected_fields)
        .eq("collection_id", collection_id)
        .execute()
    )

    if not data.data:
        raise Exception(f"Failed to fetch documents: {data.error.message}")

    documents = [
        {
            "id": doc["id"],
            "content": doc["content"],
            "metadata": doc["metadata"],
            "embedding": doc["embedding"],
            "collection_id": doc["collection_id"],
        }
        for doc in data.data
    ]

    return documents
