from django.shortcuts import render, redirect
from .models import *
from django.shortcuts import get_object_or_404
from django.db.models import F
from django.db.models import Count, Q
import logging
from django.contrib.auth.decorators import login_required
from django.http import HttpResponseForbidden

logger = logging.getLogger(__name__)

@login_required
def main(request):
    category_slug = request.GET.get('category_slug', '')
    selected_sort = request.GET.get('sort', 'latest')

    print("category_slug:", category_slug)

    posts = Post.objects.annotate(
        total_comment_count=Count('comments', distinct=True) + Count('comments__replies', distinct=True)
    )    

    if category_slug:
        posts = posts.filter(category__slug=category_slug)
    if selected_sort == 'popular':
        posts = posts.order_by('-like_count', '-created_at')
    else:
        posts = posts.order_by('-created_at')

    return render(request, 'Qampus/main.html', {'posts': posts, 'selected_slug': category_slug, 'selected_sort':selected_sort})
    
@login_required
def create(request, slug=None):
    categories = Category.objects.all()

    if request.method == 'POST':
        logger.debug("FILES: %s", request.FILES)
        logger.debug("image: %s", request.FILES.get('image'))

        title = request.POST.get('title', '').strip()
        content = request.POST.get('content', '').strip()
        image = request.FILES.get('image')
        is_anonymous = request.POST.get('is_anonymous') == 'on'

        category_ids = request.POST.getlist('category')
        category_ids = [category_id for category_id in category_ids if category_id.strip()]

        if not title:
            return render(request, 'Qampus/create.html', {
                'categories': categories,
                'error': '제목을 입력해주세요.',
            })
        
        if len(title) > 50:
            return render(request, 'Qampus/create.html', {
                'categories': categories,
                'error': '제목은 50자 이내로 입력해주세요.',
            })

        if not content:
            return render(request, 'Qampus/create.html', {
                'categories': categories,
                'error': '내용을 입력해주세요.',
            })
        
        if len(content) > 1000:
            return render(request, 'Qampus/create.html', {
                'categories': categories,
                'error': '내용은 1000자 이내로 입력해주세요.',
            })

        if not category_ids:
            return render(request, 'Qampus/create.html', {
                'categories': categories,
                'error': '카테고리를 선택해주세요.',
            })

        post = Post.objects.create(
            title=title,
            content=content,
            image=image,
            author=request.user,
            is_anonymous=is_anonymous,
        )

        selected_categories = Category.objects.filter(id__in=category_ids)
        post.category.set(selected_categories)
        return redirect('Qampus:main')
    return render(request, 'Qampus/create.html', {'categories' : categories})

def detail(request, id):
    post = get_object_or_404(Post, id=id)
    categories = post.category.all()
    comments = post.comments.all().order_by('-created_at').prefetch_related('replies')
    comment_count = post.comments.count()
    reply_count = Reply.objects.filter(comment__post=post).count()
    total_comment_count = comment_count + reply_count
    like_count = post.like_count
    scrap_count = post.scrap_count

    return render(request, 'Qampus/detail.html', 
                {'post':post,
                'categories': categories,
                'comments': comments,
                'like_count': like_count,
                'scrap_count': scrap_count,
                'comment_count': total_comment_count,
                })

@login_required
def update(request, id):
    post = get_object_or_404(Post, id=id)
    categories = Category.objects.all()

    if post.author != request.user:
        return HttpResponseForbidden("수정 권한이 없습니다.")

    if request.method == 'POST':
        title = request.POST.get('title')
        content = request.POST.get('content')
        is_anonymous = request.POST.get('is_anonymous') == 'on'

        if not title:
            return render(request, 'Qampus/update.html', {
                'post': post,
                'categories': categories,
                'error': '제목을 입력해주세요.',
            })

        if len(title) > 50:
            return render(request, 'Qampus/update.html', {
                'post': post,
                'categories': categories,
                'error': '제목은 50자 이내로 입력해주세요.',
            })

        if not content:
            return render(request, 'Qampus/update.html', {
                'post': post,
                'categories': categories,
                'error': '내용을 입력해주세요.',
            })

        if len(content) > 1000:
            return render(request, 'Qampus/update.html', {
                'post': post,
                'categories': categories,
                'error': '내용은 1000자 이내로 입력해주세요.',
            })
        
        post.title = title
        post.content = content
        post.is_anonymous = is_anonymous
        image = request.FILES.get('image')
        category_ids = request.POST.getlist('category')

        if image:
            post.image.delete()
            post.image = image

        if category_ids:
            updated_categories = Category.objects.filter(id__in=category_ids)
            post.category.set(updated_categories)
        else:
            post.category.clear()
            
        post.save()
        return redirect('Qampus:detail', id=post.id)
    return render(request, 'Qampus/update.html', {'post':post, 'categories':categories})

@login_required
def delete(request, id):
    post = get_object_or_404(Post, id=id)

    if post.author != request.user:
        return HttpResponseForbidden("삭제 권한이 없습니다.")
    
    post.delete()
    return redirect('Qampus:main')

def category(request, slug):
    category = get_object_or_404(Category, slug=slug)
    posts = Post.objects.filter(category=category).order_by('-created_at')

    return render(request, 'Qampus/category.html', {'category':category, 'posts':posts})


#답변 CRUD
@login_required
def create_comment(request, post_id):
    post = get_object_or_404(Post, id=post_id)

    if request.method == "POST":
        content = request.POST.get("content")
        is_anonymous = request.POST.get("is_anonymous") == "on"

        if content:
            Comment.objects.create(
                post=post,
                content=content,
                author=request.user,
                is_anonymous=is_anonymous,
            )

    return redirect("Qampus:detail", post_id)

@login_required
def delete_comment(request, comment_id):
    comment = get_object_or_404(Comment, id=comment_id)
    post_id = comment.post.id

    comment.delete()

    return redirect("Qampus:detail", post_id)

@login_required
def update_comment(request, comment_id):
    comment = get_object_or_404(Comment, id=comment_id)
    post_id = comment.post.id

    if request.method == "POST":
        content = request.POST.get("content")

        if content:
            comment.content = content
            comment.save()

    return redirect("Qampus:detail", post_id)


#대댓글 CRUD
@login_required
def create_reply(request, comment_id):
    comment = get_object_or_404(Comment, id=comment_id)

    if request.method == "POST":
        content = request.POST.get("content")
        is_anonymous = request.POST.get("is_anonymous") == "on"


        if content:
            Reply.objects.create(
                comment=comment,
                content=content,
                author=request.user,
                is_anonymous=is_anonymous,
            )

    return redirect("Qampus:detail", comment.post.id)

@login_required
def update_reply(request, reply_id):
    reply = get_object_or_404(Reply, id=reply_id)

    if request.method == "POST":
        content = request.POST.get("content")

        if content:
            reply.content = content
            reply.save()

    return redirect("Qampus:detail", reply.comment.post.id)

@login_required
def delete_reply(request, reply_id):
    reply = get_object_or_404(Reply, id=reply_id)
    post_id = reply.comment.post.id

    reply.delete()

    return redirect("Qampus:detail", post_id)


#게시글 스크랩
@login_required
def scrap_post(request, post_id):
    post = get_object_or_404(Post, id=post_id)

    scrapped_posts = request.session.get('scrapped_posts', [])

    if post_id in scrapped_posts:
        if post.scrap_count > 0:
            Post.objects.filter(id=post_id).update(scrap_count=F('scrap_count') - 1)
        scrapped_posts.remove(post_id)
    else:
        Post.objects.filter(id=post_id).update(scrap_count=F('scrap_count') + 1)
        scrapped_posts.append(post_id)

    post.save()
    request.session['scrapped_posts'] = scrapped_posts

    return redirect('Qampus:detail', post.id)

#게시글 좋아요
@login_required
def like_post(request, post_id):
    post = get_object_or_404(Post, id=post_id)

    liked_posts = request.session.get('liked_posts', [])

    if post_id in liked_posts:
        if post.like_count > 0:
            Post.objects.filter(id=post_id).update(like_count=F('like_count') - 1)
        liked_posts.remove(post_id)
    else:
        Post.objects.filter(id=post_id).update(like_count=F('like_count') + 1)
        liked_posts.append(post_id)

    request.session['liked_posts'] = liked_posts
    request.session.modified = True
    return redirect('Qampus:detail', post.id)


#댓글/대댓글 좋아요
@login_required
def like_comment(request, comment_id):
    comment = get_object_or_404(Comment, id=comment_id)

    liked_comments = request.session.get('liked_comments', [])

    if comment_id in liked_comments:
        if comment.like_count > 0:
            Comment.objects.filter(id=comment_id).update(like_count=F('like_count') - 1)
        liked_comments.remove(comment_id)
    else:
        Comment.objects.filter(id=comment_id).update(like_count=F('like_count') + 1)
        liked_comments.append(comment_id)

    comment.save()
    request.session['liked_comments'] = liked_comments

    return redirect('Qampus:detail', comment.post.id)

@login_required
def like_reply(request, reply_id):
    reply = get_object_or_404(Reply, id=reply_id)

    liked_replies = request.session.get('liked_replies', [])

    if reply_id in liked_replies:
        if reply.like_count > 0:
            Reply.objects.filter(id=reply_id).update(like_count=F('like_count') - 1)
        liked_replies.remove(reply_id)
    else:
        Reply.objects.filter(id=reply_id).update(like_count=F('like_count') + 1)
        liked_replies.append(reply_id)

    reply.save()
    request.session['liked_replies'] = liked_replies
    return redirect('Qampus:detail', reply.comment.post.id)

