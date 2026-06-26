from django.contrib import admin
from .models import Post, Category, Comment, Reply

admin.site.register(Post)
admin.site.register(Category)
admin.site.register(Reply)
admin.site.register(Comment)