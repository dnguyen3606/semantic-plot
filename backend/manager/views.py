import json
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
import numpy as np
from .models import Story
from pinecone import Pinecone
from datetime import datetime
import os
from openai import OpenAI
from transformers import AutoTokenizer

PINECONE=os.getenv('PINECONE')
pc = Pinecone(api_key=PINECONE)
index = pc.Index("story")
client = OpenAI(
    base_url="https://api.studio.nebius.com/v1/",
    api_key=os.environ.get("NB_KEY")
)
tokenizer = AutoTokenizer.from_pretrained("intfloat/e5-mistral-7b-instruct")

def embed(text: str):
    try:
        response = client.embeddings.create(
            model="intfloat/e5-mistral-7b-instruct",
            input=text,
        )
        return np.array(json.loads(response.to_json())['data'][0]['embedding'], dtype=float).tolist()
    except Exception as error:
        return JsonResponse({"error": error}, status=503)

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

def storyid_to_pinecone(request, story_id: int):
    story = get_object_or_404(Story, id=story_id)
    chapters = story.chapters.all().order_by('chapter_number')

    upsert(story, embed_all_chapters(chapters))

    return JsonResponse({"message": "chapters processed successfully"})

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

def query(request):
    content = request.body.decode('utf-8')
    content_embedding = embed(content)

    unique_results = {}
    while len(unique_results) < 3:
        excluded_ids = list(unique_results.keys())
        filter_query = {"id": {"$nin": excluded_ids}}

        response = index.query(
            vector=content_embedding,
            top_k=3,
            include_metadata=True,
            include_values=False,
            filter=filter_query
        )
        for match in response["matches"]:
            book_id = match["metadata"]["id"]
            if book_id not in unique_results:
                unique_results[book_id] = match

    stories = []
    for book_id, match in unique_results.items():
        story = get_object_or_404(Story, id=book_id)
        stories.append({
            "id": story.id,
            "title": story.title,
            "summary": story.summary,
            "score": match["score"], 
        })

    return JsonResponse(stories, safe=False)

    