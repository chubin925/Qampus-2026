from django.db import models
import os
from uuid import uuid4
from django.utils import timezone
from django.conf import settings

def upload_filepath(instance, filename):
    today_str = timezone.now().strftime("%Y%m%d")
    file_basename = os.path.basename(filename)
    return f'{instance._meta.model_name}/{today_str}/{str(uuid4())}_{file_basename}'

class Category(models.Model):
    name = models.CharField(max_length= 50, unique= True)
    slug = models.SlugField(max_length= 100, unique= True)

    def __str__(self):
        return self.name
    
class Post(models.Model):
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='posts',
        null=True, 
        blank=True,
    )
        
    is_anonymous = models.BooleanField(default=False)
    title = models.CharField(max_length= 50)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add= True)
    category = models.ManyToManyField(Category, related_name="posts")    
    like_count = models.PositiveIntegerField(default=0)
    scrap_count = models.PositiveIntegerField(default=0)
    image = models.ImageField(upload_to='post_images/', blank=True, null=True)

    def __str__(self):
        return f'[{self.id}] {self.title}'
    

    
class Comment(models.Model):
    post = models.ForeignKey(to=Post, on_delete=models.CASCADE, related_name="comments")
    author = models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.CASCADE,related_name='comments',null=True,blank=True,)
    is_anonymous = models.BooleanField(default=False)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add = True)
    like_count = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f'[{self.id}] {self.content}'
    
class Reply(models.Model):
    comment = models.ForeignKey(Comment, on_delete=models.CASCADE, related_name="replies")
    author = models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.CASCADE,related_name='replies',null=True,blank=True,)
    is_anonymous = models.BooleanField(default=False)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add = True)
    like_count = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return f'[{self.id}] {self.content[:20]}'