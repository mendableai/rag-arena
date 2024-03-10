import os
from supabase import create_client, Client

# Load environment variables
SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_PRIVATE_KEY = os.getenv('SUPABASE_PRIVATE_KEY')

# Create a Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_PRIVATE_KEY)

def get_documents(collection_id: str = 'pg-essays'):
    # Assuming there's a table named 'documents' in Supabase
    print('getting documents')
    selected_fields = 'id, content, metadata, embedding, collection_id'
    data = supabase.table('documents').select(selected_fields).eq('collection_id', collection_id).execute()
    
    if not data.data:
        raise Exception(f"Failed to fetch documents: {data.error.message}")
    
    # Model the data as per the documents model
    documents = [{
        'id': doc['id'],
        'content': doc['content'],
        'metadata': doc['metadata'],
        'embedding': doc['embedding'],
        'collection_id': doc['collection_id']
    } for doc in data.data]
    
    return documents
