from django.db import models

class Category(models.Model):
    name = models.CharField(max_length= 50, unique= True)
    slug = models.SlugField(max_length= 100, unique= True)

    def __str__(self):
        return self.name

class Post(models.Model):
    title = models.CharField(max_length= 50)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add= True)
    category = models.ForeignKey(Category, null= True, blank=True, on_delete=models.SET_NULL)

    def __str__(self):
        return f'[{self.id}] self.title'
    