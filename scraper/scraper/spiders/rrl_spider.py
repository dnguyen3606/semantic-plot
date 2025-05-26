from datetime import datetime
import scrapy
from scraper.items import StoryItem, ChapterItem

# Example CLI 
# scrapy crawl rrl_spider -a start_url="https://www.royalroad.com/fictions/best-rated"
# scrapy crawl rrl_spider -a start_url="https://www.royalroad.com/fiction/some-story-slug"
class RoyalRoadlSpiderSpider(scrapy.Spider):
    name = "rrl_spider"
    allowed_domains = ["royalroad.com"]
    base = "https://www.royalroad.com"

    def __init__(self, start_url=None, *args, **kwargs):
        if not start_url:
            raise ValueError("start_url must be provided to start the spider. Provide -a 'url' after the command.")

        if not start_url.startswith("https://www.royalroad.com/fictions/") and not start_url.startswith("https://www.royalroad.com/fiction/"):
            raise ValueError(f"Invalid start_url: {start_url}. URL must lead to a RoyalRoad fictions list or fiction page.")
        
        super(RoyalRoadlSpiderSpider, self).__init__(*args, **kwargs)
        self.start_urls = [start_url]

        self.single_story = '/fiction/' in start_url

    # parse a page of a rrl list, tested on best-rated
    # for each story in the list, call parse_story to go to that story's page. We grab some stuff like title, url, tags, etc. beforehand.
    def parse(self, response):
        if self.single_story:
            return self.parse_story(response)
        else:
            return self.parse_story_list(response)
        
    def parse_story(self, response):
        story_item = StoryItem(
            title = response.css('h1.font-white::text').get().strip(),
            author = response.css('h4.font-white span a::text').get().strip(),
            summary = " ".join(response.css('div.hidden-content *::text').getall()).strip(),
            tags = response.css('.tags .fiction-tag::text').getall(),
            url = self.start_urls[0],
            timestamp = datetime.now().isoformat(),
        )
        yield story_item

        for idx, chapter in enumerate(response.css('tr.chapter-row')):
            chapter_title = chapter.css('a::text').get().strip()
            chapter_slug = chapter.css('a::attr(href)').get().strip()

            yield response.follow(chapter_slug, callback=self.parse_chapter, meta={
                'story_url': story_item['url'],
                'chapter_title': chapter_title,
                'chapter_url': self.base + chapter_slug,
                'chapter_number': idx + 1
            })

    def parse_story_list(self, response):
        for fiction in response.css('div.fiction-list-item.row'):
            title = fiction.css('h2.fiction-title a::text').get().strip()
            slug = fiction.css('h2.fiction-title a::attr(href)').get().strip()
            tags = [tag.strip() for tag in fiction.css('.tags .fiction-tag::text').getall()]
            summary = " ".join(fiction.xpath('.//div[contains(@class, "margin-top-10")]//text()').getall()).strip()

            yield response.follow(slug, callback=self.parse_story_from_list, meta={
                'title': title, 
                'tags': tags, 
                'summary': summary, 
                'url': self.base + slug
            })

    # parse a story on the story's page
    # grab author's name and yield a story item to the pipeline, then iterate and call parse_chapter on every chapter in chapter element.
    def parse_story_from_list(self, response):
        story_item = StoryItem(
            title = response.meta['title'],
            author = response.css('h4.font-white span a::text'),
            summary = response.meta['summary'],
            tags = response.meta['tags'],
            url = response.meta['url'],
            timestamp = datetime.now().isoformat(),
        )
        yield story_item

        for idx, chapter in enumerate(response.css('tr.chapter-row')):
            chapter_title = chapter.css('a::text').get().strip()
            chapter_slug = chapter.css('a::attr(href)').get().strip()

            yield response.follow(chapter_slug, callback=self.parse_chapter, meta={
                'story_url': story_item['url'],
                'chapter_title': chapter_title,
                'chapter_url': self.base + chapter_slug,
                'chapter_number': idx + 1
            })

    # parse a chapter on the chapter's page
    # grab chapter content, yield a chapter item to the pipeline.
    def parse_chapter(self, response):
        story_url = response.meta['story_url']
        chapter_title = response.meta['chapter_title']
        chapter_number = response.meta['chapter_number']
        chapter_url = response.meta['chapter_url']

        content = " ".join(response.css('div.chapter-content *::text').getall()).strip()

        chapter_item = ChapterItem(
            story_url = story_url,
            title = chapter_title,
            chapter_number = chapter_number,
            content = content,
            url = chapter_url,
            timestamp = datetime.now().isoformat(),
        )
        yield chapter_item
