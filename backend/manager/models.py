from django.db import models

class Author(models.Model):
    name = models.CharField(max_length=255)

    class Meta:
        db_table = "author"

    def __str__(self):
        return self.name
    
class Tag(models.Model):
    title = models.CharField(max_length=255)
    
    class Meta:
        db_table = "tag"

    def __str__(self):
        return self.title

class Story(models.Model):
    title = models.CharField(max_length=255)
    author = models.ForeignKey(Author, max_length=255, related_name="stories", on_delete=models.SET_NULL, blank=True, null=True)
    summary = models.TextField(blank=True, null=True)
    tags = models.ManyToManyField(Tag)
    url = models.URLField(unique=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "story"

    def __str__(self):
        return self.title
    
class Chapter(models.Model):
    story = models.ForeignKey(Story, related_name="chapters", on_delete=models.CASCADE)
    chapter_number = models.PositiveIntegerField()
    title = models.CharField(max_length=255, blank=True, null=True)
    content = models.TextField()
    url = models.URLField(unique=True) 
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('story', 'chapter_number')
        db_table = "chapter"

    def __str__(self):
        return f"Chapter {self.chapter_number}: {self.title or 'Untitled'}"