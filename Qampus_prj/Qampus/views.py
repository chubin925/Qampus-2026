from django.shortcuts import render, redirect
from .models import Category, Post
from django.shortcuts import get_object_or_404

def main(request):
    category_slug = request.POST.get('category_slug', '')
    sort = request.POST.get('sort', 'latest')

    if category_slug:
        posts = Post.objects.filter(category__slug=category_slug).order_by('-created_at')
    else:
        posts = Post.objects.all().order_by('-created_at')

    if sort == 'popular':
        posts = posts.order_by('-likes')
    else:
        posts = posts.order_by('-created_at')

    return render(request, 'Qampus/main.html', {'posts': posts, 'selected_slug': category_slug, 'sort':sort})
    
def create(request, slug=None):
    if request.method == 'POST':
        title = request.POST.get('title')
        content = request.POST.get('content')
        category_id = request.POST.get('category')

        Post.objects.create(
            title = title,
            content = content,
            category_id = category_id,
        )
        return redirect('Qampus:main')
    categories = Category.objects.all()
    return render(request, 'Qampus/create.html', {'categories' : categories})

def detail(request, id):
    post = get_object_or_404(Post, id=id)

    if request.method == 'POST':
        content = request.POST.get('content')
    return render(request, 'Qampus/detail.html', {'post':post})

def update(request, id):
    post = get_object_or_404(Post, id=id)

    if request.method == 'POST':
        post.title = request.POST.get('title')
        post.content = request.POST.get('content')
        post.save()
        return redirect('Qampus:detail', id)
    categories = Category.objects.all()
    return render(request, 'Qampus/update.html', {'post':post, 'categories':categories})

def delete(request, id):
    post = get_object_or_404(Post, id=id)
    post.delete()
    return redirect('Qampus:main')

def category(request, slug):
    category = Category.objects.get(slug=slug)
    posts = Post.objects.filter(category=category).order_by('-created_at')

    return render(request, 'Qampus/category.html', {'category':category, 'posts':posts})
