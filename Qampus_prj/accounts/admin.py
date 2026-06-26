from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    ordering = ['email'] 
    list_display = ['email', 'nickname', 'is_staff']
    fieldsets = (
        (None, {'fields': ('email', 'nickname', 'password')}),
        ('권한', {'fields': ('is_staff', 'is_superuser', 'groups', 'user_permissions')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'nickname', 'password1', 'password2'),
        }),
    )
    search_fields = ['email', 'nickname']