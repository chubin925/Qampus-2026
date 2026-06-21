from django.shortcuts import render, redirect
from .forms import *
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth import login as auth_login
from django.contrib.auth import logout as auth_logout
from Qampus.models import Post
from django.contrib.auth.decorators import login_required

# Create your views here.
def signup(request):
    if request.method == 'GET':
        form = SignUpForm()
        return render(request, 'accounts/signup.html', {'form': form})

    form = SignUpForm(request.POST)
    if form.is_valid():
        form.save()
        return redirect('accounts:login')
    else:
        return render(request, 'accounts/signup.html', {'form': form})

def login(request):
    if request.method == 'GET':
        return render(request, 'accounts/login.html', {'form': AuthenticationForm()})

    form = AuthenticationForm(request, request.POST)
    if form.is_valid():
        auth_login(request, form.user_cache)
        return redirect('Qampus:main')
    return render(request, 'accounts/login.html', {'form': form})

def logout(request):
    if request.user.is_authenticated:
        auth_logout(request)
    return redirect('Qampus:main')

@login_required
def mypage(request):
    return render(request, 'accounts/mypage.html')

@login_required
def user_info(request):
    return render(request, 'accounts/user-info.html')

@login_required
def mypost(request):
    posts = Post.objects.filter(author=request.user).order_by('-created_at')
    return render(request, 'accounts/mypost.html', {'posts': posts})

@login_required
def myscrap(request):
    scraped_posts = request.user.scraped_posts.all().order_by('-id')
    return render(request, 'accounts/myscrap.html', {'scraped_posts': scraped_posts})