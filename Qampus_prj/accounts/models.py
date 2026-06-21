from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    username = None 
    email = models.EmailField('이메일', unique=True)
    nickname = models.CharField('닉네임', max_length=20, unique=True)

    USERNAME_FIELD = 'email' 
    REQUIRED_FIELDS = ['nickname'] 
    def __str__(self):
        return self.nickname