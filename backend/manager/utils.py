import json, os
import numpy as np
from datetime import datetime

from pinecone import Pinecone
from openai import OpenAI
from transformers import AutoTokenizer

# init secrets, ml/ai things
PINECONE=os.getenv('PINECONE')
pc = Pinecone(api_key=PINECONE)
index = pc.Index("story")
client = OpenAI(
    base_url="https://api.studio.nebius.com/v1/",
    api_key=os.environ.get("NB_KEY")
)
tokenizer = AutoTokenizer.from_pretrained(
        "Qwen/Qwen3-Embedding-8B",
        padding_side="left",
    )


def embed(text: str):
    try:
        response = client.embeddings.create(
            model="Qwen/Qwen3-Embedding-8B",
            input=text,
        )
        return np.array(json.loads(response.to_json())['data'][0]['embedding'], dtype=float).tolist()
    except Exception as error:
        raise RuntimeError(f"Embedding failed: {error}\\ for text: {text}")

def chunk_text(text: str, max_tokens=32000, overlap=0):
    tokens = tokenizer.encode(text, add_special_tokens=True)
    if len(tokens) <= max_tokens:
        return [text]
    
    chunks = []
    start = 0
    while start < len(tokens):
        end = min(start + max_tokens, len(tokens))
        chunk_tokens = tokens[start:end]
        chunk_text = tokenizer.decode(chunk_tokens, skip_special_tokens=True)
        chunks.append(chunk_text)
        if end == len(tokens):
            break
        start = end - overlap 
    return chunks

# for embedding a collection of chapters
def embed_all_chapters(chapters):
    content = " ".join([chapter.content for chapter in chapters])
    chunks = chunk_text(content, max_tokens=2048, overlap=512)
    embeddings = [embed(chunk) for chunk in chunks]

    return embeddings

# for upserting specifically a story embedding with its story id
def upsert(story, embeddings):
    for i, embedding in enumerate(embeddings):
        index.upsert(
            vectors=[
                {
                    "id": f"{story.title}_{i}",
                    "values": embedding,
                    "metadata": {"id": story.id, "timestamp": datetime.now().isoformat()}
                }
            ]
        )