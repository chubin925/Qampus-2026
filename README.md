# 🎓 Qampus
 
> 멋쟁이사자처럼 토이프로젝트 — 대학생을 위한 익명 질문 게시판
 
<br>

## 📌 프로젝트 소개
 
**Qampus**는 대학생들의 자유롭게 질의응답 할 수 있는 캠퍼스 커뮤니티 웹 서비스입니다.  
카테고리별 게시판, 좋아요·스크랩·댓글 기능을 갖추고 있으며, 익명 게시 옵션을 제공합니다.

<br>

## 🛠 기술 스택
 
| 구분 | 기술 |
|------|------|
| Backend | Python 3, Django 5.2 |
| Database | SQLite3 |
| Frontend | Django Template, HTML/CSS/JS |
| 인증 | Django Auth (커스텀 User 모델) |
| 이미지 처리 | Pillow |
| 배포 | AWS EC2 + Gunicorn + GitHub Actions (CI/CD) |
| 환경 관리 | python-dotenv |



<br>

## 📁 프로젝트 구조
 
```
Qampus-2026/
├── Qampus_prj/
│   ├── Qampus/                  # 메인 게시판 앱
│   │   ├── models.py            # Post, Comment, Reply, Category
│   │   ├── views.py             # 게시글/댓글/좋아요/스크랩 뷰
│   │   ├── urls.py
│   │   └── templates/Qampus/    # base, main, detail, create, update 템플릿
│   ├── accounts/                # 회원 인증 앱
│   │   ├── models.py            # 커스텀 User (이메일 기반)
│   │   ├── views.py             # 회원가입, 로그인, 로그아웃
│   │   └── templates/accounts/  # login, signup 템플릿
│   ├── Qampus_prj/              # Django 설정
│   │   └── settings.py
│   ├── static/
│   │   ├── css/                 
│   │   ├── js/              
│   │   └── icons/             
│   ├── manage.py
│   └── requirements.txt
├── .github/
│   ├── workflows/deploy.yml     # EC2 자동 배포
│   └── ISSUE_TEMPLATE/         
└── README.md
```
 
<br>

## ⚙️ 주요 기능
 
### :clipboard: 게시판 기능
- 게시글 작성 / 수정 / 삭제 (본인만 가능합니다.)
- 이미지 첨부
- 익명 게시 옵션
- 최신순 / 추천순(좋아요 수) 정렬
- 카테고리 필터링
### 💬 댓글 & 대댓글
- 댓글 작성 / 수정 / 삭제
- 대댓글(Reply) 작성 / 수정 / 삭제
- 댓글 및 대댓글 익명 옵션
- 댓글 + 대댓글 합산 카운트 표시
### :heart: 좋아요 & 스크랩
- 게시글 좋아요 / 취소 (세션 기반)
- 게시글 스크랩 / 취소 (세션 기반)
- 댓글 및 대댓글 좋아요 / 취소
  
<br>


## 📋 이슈 & PR 컨벤션
 
| 타입 | 설명 |
|------|------|
| `feat` | 새 기능 추가 |
| `fix` | 버그 수정 |
| `init` | 초기 설정 |
| `refactor` | 코드 리팩토링 |
| `chore` | 그 외 작업 |
 
<br>
