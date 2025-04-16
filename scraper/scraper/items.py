# Define here the models for your scraped items
#
# See documentation in:
# https://docs.scrapy.org/en/latest/topics/items.html

import scrapy

class StoryItem(scrapy.Item):
    title = scrapy.Field()
    author = scrapy.Field()
    summary = scrapy.Field()
    tags = scrapy.Field()
    url = scrapy.Field()
    timestamp = scrapy.Field()

class ChapterItem(scrapy.Item):
    story_url = scrapy.Field()
    title = scrapy.Field()
    chapter_number = scrapy.Field()
    content = scrapy.Field()
    url = scrapy.Field()
    timestamp = scrapy.Field()