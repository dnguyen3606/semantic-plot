from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from .models import Story
from pinecone import Pinecone
from datetime import datetime
import os
from huggingface_hub import InferenceClient

PINECONE=os.getenv('PINECONE')
pc = Pinecone(api_key=PINECONE)
index = pc.Index("story")
hf_client = InferenceClient(
    provider="hf-inference",
    api_key=os.getenv('HF_KEY')
)

def storyid_to_pinecone(story_id):
    story = get_object_or_404(Story, id=story_id)
    chapters = story.chapters.all().order_by('chapter_number')

    upsert(story, embed_all_chapters(chapters))

    return JsonResponse({"message": "chapters processed successfully"})

# for embedding a collection of chapters
def embed_all_chapters(chapters):
    content = " ".join([chapter.content for chapter in chapters])
    content_embedding = hf_client.feature_extraction(
        text=content,
        model="mixedbread-ai/mxbai-embed-large-v1",
    )

    return content_embedding

# for upserting specifically a story embedding with its story id
def upsert(story, embedding):
    index.upsert(
        vectors=[
            {
                "id": story.title,
                "values": embedding,
                "metadata": {"id": story.id, "timestamp": datetime.now().isoformat()}
            }
        ]
    )

def query(request):
    content = request.body.decode('utf-8')
    content_embedding = hf_client.feature_extraction(
        text=content,
        model="mixedbread-ai/mxbai-embed-large-v1",
    )
    content_embedding = content_embedding.tolist()

    response = index.query(vector=content_embedding, top_k=5, include_metadata=True)
    matches = [
        {
            "id": match["metadata"]["id"],
            "score": match["score"],
        }
        for match in response["matches"]
    ]

    stories = []
    for match in matches:
        story = get_object_or_404(Story, id=match["id"])
        stories.append({
            "id": story.id,
            "title": story.title,
            "summary": story.summary,
            "score": match["score"], 
        })

    return JsonResponse(stories, safe=False)

    