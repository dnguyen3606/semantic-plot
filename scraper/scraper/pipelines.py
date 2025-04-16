# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: https://docs.scrapy.org/en/latest/topics/item-pipeline.html


# useful for handling different item types with a single interface
from asgiref.sync import sync_to_async
from manager.models import Story, Chapter, Author, Tag
from scraper.items import StoryItem, ChapterItem

class DjangoPipeline:
    async def process_item(self, item, spider):
        if isinstance(item, StoryItem):
            await sync_to_async(self.handle_story)(item)
        elif isinstance(item, ChapterItem):
            await sync_to_async(self.handle_chapter)(item)

        
    def handle_story(self, item):
        author, _ = Author.objects.get_or_create(name = item['author'])
        story, _ = Story.objects.get_or_create(
            url=item['url'],
            defaults={
                'title': item['title'],
                'author': author,
                'summary': item['summary'],
                'timestamp': item['timestamp']
            }
        )
        for tag in item['tags']:
            tag_object ,_ = Tag.objects.get_or_create(title = tag)
            story.tags.add(tag_object)

    def handle_chapter(self, item):
        story, _ = Story.objects.get_or_create(url=item['story_url'])
        Chapter.objects.get_or_create(
            story = story,
            chapter_number = item['chapter_number'],
            defaults={
                'title': item['title'],
                'content': item['content'],
                'url': item['url'],
                'timestamp': item['timestamp']
            }
        )