import os, subprocess
from django.conf import settings
from background_task import background

from scrapy.crawler import CrawlerRunner
from scrapy.utils.project import get_project_settings
from twisted.internet import reactor, defer

from scraper.scraper.spiders.rrl_spider import RoyalRoadlSpiderSpider
from .models import Story
from .utils import embed_all_chapters, upsert

SCRAPER_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "scraper"))

@background(schedule=0)
def scrape_and_embed(url: str):
    result = subprocess.run(
        ["scrapy", "crawl", "rrl_spider", "-a", f"start_url={url}"],
        cwd=SCRAPER_DIR,
        capture_output=True,
        text=True
    )

    if result.returncode != 0:
        raise RuntimeError(f"Scrapy crawl failed:\n{result.stderr}")

    try:
        story = Story.objects.get(url=url)
    except Story.DoesNotExist:
        raise RuntimeError("Story not found in database after crawl")

    try:
        chapters = story.chapters.all().order_by("chapter_number")
        upsert(story, embed_all_chapters(chapters))
    except Exception as e:
        raise RuntimeError(f"Embedding or upsert failed: {e}")