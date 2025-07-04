import re

from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from background_task.models import Task

from .models import Story
from .tasks import scrape_and_embed
from .utils import embed, embed_all_chapters, upsert, index

#soon to be deprecated
def storyid_to_pinecone(request, story_id: int):
    story = get_object_or_404(Story, id=story_id)
    chapters = story.chapters.all().order_by('chapter_number')

    upsert(story, embed_all_chapters(chapters))

    return Response({"message": "chapters processed successfully"}, status=status.HTTP_200_OK)

@api_view(["POST"])
def query(request):
    content = request.data.get('content')
    if not content:
        return Response({'error': "Request missing 'content'"}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        content_embedding = embed(content)
    except RuntimeError as e:
        return Response({'error': str(e)}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

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
            "url": story.url,
        })

    return Response(stories, status=status.HTTP_200_OK)


ROYALROAD_URL_PATTERN = re.compile(r"^https://www\.royalroad\.com/fiction/\d+/[\w-]+/?$")
@api_view(["POST"])
def scrape(request):
    url = request.data.get('url')
    if not url:
        return Response({'error': "Request missing 'url'"}, status=status.HTTP_400_BAD_REQUEST)
    
    if not ROYALROAD_URL_PATTERN.match(url):
        return Response({'error': "URL must be a valid RoyalRoad fiction URL (e.g., https://www.royalroad.com/fiction/your-story-slug)"}, status=status.HTTP_400_BAD_REQUEST)
    
    if Task.objects.filter(
        task_name='manager.tasks.scrape_and_embed',
        task_params__contains=f'"{url}"',
    ).exists():
        return Response({'status': "URL already queued for scraping."}, status=status.HTTP_200_OK)

    try:
        scrape_and_embed(url)

        return Response({
            'status': "scheduled",
            'url': url,
        }, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)