from django.urls import path
from . import views

urlpatterns = [
    path('embed-story-id/<int:story_id>/', views.storyid_to_pinecone, name='story to pinecone'),
    path('query/', views.query, name='query for similar stories'),
    path('scrape/', views.scrape, name='scrape url, embed, and upsert')
]