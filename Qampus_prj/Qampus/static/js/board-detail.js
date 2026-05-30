//좋아요 영역, 하트 이미지, 좋아요 갯수
const likeBtn = document.querySelector(".like-box");
const likeImg = document.querySelector(".like-img");
const filLikeImg = document.querySelector(".like-img-fill");
const likeNum = document.querySelector(".like-num");

//스크랩 영역, 스크랩 이미지
const scrapBtn = document.querySelector(".scrap-box");
const scrapImg = document.querySelector(".scrap-img");
const filScrapImg = document.querySelector(".scrap-img-fill");
const scrapText = document.querySelector(".scrap-text");
const scrapCancel = document.querySelector(".scrap-text-none");

//댓글 입력창, 댓글 input, 등록 버튼
const cmtBox = document.querySelector(".input-comment-box");
const cmtInput = document.querySelector(".input-comment");
const subMitBtn = document.querySelector(".submit");

//뎃글 총 갯수
const cmtCount = document.querySelector(".comment-count");
const commentNum = document.querySelector(".comment-num");

//댓글 없을 때 영역
const emptyComment = document.querySelector(".empty-comment");
const commentList = document.querySelector(".comment-list");

//수정,삭제 모달
const menuIcon = document.querySelector(".post-menu-icon");

const modal = document.querySelector(".post-modal");
const editBtn = document.querySelector(".edit-button");
const deleteBtn = document.querySelector(".delete-button");

//댓글 좋아요기능
const commentLikeBox = document.querySelector(".comment-like-box");
const commentLikeCount = document.querySelector(".comment-like-count");
const activeLike = document.querySelector(".comment-like-active");
const defaultLike = document.querySelector(".comment-like-img");

//삭제확인 모달
const confirmOverlay = document.querySelector(".delete-confirm-overlay");
const btnNo = document.querySelector(".btn-no");
const btnYes = document.querySelector(".btn-yes");

//댓글 템플릿 영역
const commentTemplate = document.querySelector(".comment-item").cloneNode(true);
const reCommentTemplate = document
  .querySelector(".re-comment-item")
  .cloneNode(true);

//수정데이터 반영
const STORAGE_KEY = "qampusBoardPost";

const postTitle = document.querySelector(".content-detail h4");
const postContent = document.querySelector(".content-detail p");
const postUserName = document.querySelector(".user-one");
const postUserTime = document.querySelector(".user-time");

//상세 페이지 뒤로가기 버튼
const detailBackButton = document.querySelector(".detail-back-button");

let isLikeClicked = false;
let isScrapClicked = false;

let comments = [];
let isCommentLiked = false;

//대댓글, 수정, 삭제 상태 변수
let replyTarget = null;
let editTarget = null;
let modalTarget = "post";
let deleteTarget = null;

//좋아요 버튼 구현
const likeBox = () => {
  if (isLikeClicked === false) {
    isLikeClicked = true;
    likeImg.style.display = "none";
    filLikeImg.style.display = "block";
    likeNum.textContent = Number(likeNum.textContent) + 1;
  } else {
    isLikeClicked = false;
    likeImg.style.display = "block";
    filLikeImg.style.display = "none";
    likeNum.textContent = Number(likeNum.textContent) - 1;
  }
};

//스크랩 버튼 구현
const scrapBox = () => {
  if (isScrapClicked === false) {
    isScrapClicked = true;
    scrapImg.style.display = "none";
    filScrapImg.style.display = "block";
    scrapCancel.style.display = "block";
  } else {
    isScrapClicked = false;
    scrapImg.style.display = "block";
    filScrapImg.style.display = "none";
    scrapCancel.style.display = "none";
  }
};

//댓글 구현
const addComment = () => {
  const commentValue = cmtInput.value.trim();

  if (commentValue === "") {
    alert("댓글을 입력해주세요.");
    return;
  }

  //입력값 확인용 - 연동 전 수정 예정입니다.
  //alert(commentValue);

  comments.push(commentValue);

  emptyComment.classList.add("hidden");
  commentList.classList.remove("hidden");

  //답변 갯수 구현
  cmtCount.textContent = `답변 ${comments.length}개`;
  commentNum.textContent = comments.length;

  cmtInput.value = "";
};

//수정/삭제 모달 띄우기
const toggleModal = () => {
  modalTarget = "post";
  modal.classList.remove("comment-option-modal");

  modal.style.top = "";
  modal.style.left = "";
  modal.style.right = "";

  modal.classList.toggle("hidden");
};

//수정 버튼 페이지 이동
editBtn.addEventListener("click", () => {
  if (modalTarget === "post") {
    const currentPost = {
      title: postTitle.textContent,
      content: postContent.textContent,
      user: postUserName.textContent,
      time: postUserTime.textContent,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(currentPost));
    location.href = "./board-edit.html";
  } else {
    const commentText = modalTarget.querySelector(".comment-content-text");

    editTarget = modalTarget;
    cmtInput.value = commentText.textContent;
    cmtInput.placeholder = "댓글을 수정해주세요";
    cmtInput.focus();

    modal.classList.add("hidden");
  }
});

//댓글 좋아요 구현
const toggleLike = (targetLikeBox) => {
  const targetLikeCount = targetLikeBox.querySelector(".comment-like-count");
  const targetLikeImg = targetLikeBox.querySelector(".comment-like-img");

  const currentLike = Number(targetLikeCount.textContent);
  const isLiked = targetLikeBox.dataset.liked === "true";

  if (isLiked === false) {
    targetLikeBox.dataset.liked = "true";
    targetLikeCount.textContent = currentLike + 1;
    targetLikeImg.src = "../assets/icons/heart-blue-fill.svg";
  } else if (isLiked === true) {
    targetLikeBox.dataset.liked = "false";
    targetLikeCount.textContent = currentLike - 1;
    targetLikeImg.src = "../assets/icons/heart-black.svg";
  }
};

//댓글 목록 초기화
commentList.innerHTML = "";

//오늘 날짜 구현
const getTodayText = () => {
  const today = new Date();

  const year = String(today.getFullYear()).slice(2);
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const date = String(today.getDate()).padStart(2, "0");

  return `${year}/${month}/${date}`;
};

//답변 갯수 다시 세기
const updateCommentCount = () => {
  const totalCount = document.querySelectorAll(
    ".comment-list .comment-item, .comment-list .re-comment-item",
  ).length;

  cmtCount.textContent = `답변 ${totalCount}개`;
  commentNum.textContent = totalCount;

  if (totalCount === 0) {
    emptyComment.classList.remove("hidden");
    commentList.classList.add("hidden");
  } else {
    emptyComment.classList.add("hidden");
    commentList.classList.remove("hidden");
  }
};

//댓글 좋아요 초기화
const resetCommentLike = (comment) => {
  const likeBox = comment.querySelector(".comment-like-box");
  const likeCount = comment.querySelector(".comment-like-count");
  const likeImg = comment.querySelector(".comment-like-img");

  likeBox.dataset.liked = "false";
  likeCount.textContent = 0;
  likeImg.src = "../assets/icons/heart-black.svg";
};

//댓글 화면에 추가
const addCommentView = () => {
  const commentValue = cmtInput.value.trim();

  if (commentValue === "") {
    alert("댓글을 입력해주세요.");
    return;
  }

  if (editTarget !== null) {
    const editText = editTarget.querySelector(".comment-content-text");

    editText.textContent = commentValue;

    editTarget = null;
    cmtInput.value = "";
    cmtInput.placeholder = "답변을 입력해보세요";

    return;
  }

  const newComment =
    replyTarget === null
      ? commentTemplate.cloneNode(true)
      : reCommentTemplate.cloneNode(true);

  const commentText = newComment.querySelector(".comment-content-text");
  const commentDate = newComment.querySelector(".comment-etc > p");

  commentText.textContent = commentValue;
  commentDate.textContent = getTodayText();

  resetCommentLike(newComment);

  if (replyTarget === null) {
    commentList.appendChild(newComment);
  } else {
    replyTarget.insertAdjacentElement("afterend", newComment);
    replyTarget = null;
    cmtInput.placeholder = "답변을 입력해보세요";
  }

  comments.push(commentValue);

  updateCommentCount();

  cmtInput.value = "";
};

//대댓글 입력 모드 구현
const setReplyMode = (targetReplyBtn) => {
  replyTarget = targetReplyBtn.closest(".comment-item");
  editTarget = null;
  cmtInput.placeholder = "답글을 입력해보세요";
  cmtInput.focus();
};

//댓글 점세개 모달 위치 잡기
const setCommentModalPosition = (targetEllipsis) => {
  const iconPosition = targetEllipsis.getBoundingClientRect();
  const app = document.querySelector(".app");
  const appPosition = app.getBoundingClientRect();

  const modalWidth = 130;
  const modalHeight = 77;
  const gap = 8;

  let modalTop = iconPosition.bottom + 6;
  let modalLeft = iconPosition.right - modalWidth;

  const minLeft = appPosition.left + gap;
  const maxLeft = appPosition.right - modalWidth - gap;

  const minTop = appPosition.top + gap;
  const maxTop = appPosition.bottom - modalHeight - gap;

  if (modalLeft < minLeft) {
    modalLeft = minLeft;
  }

  if (modalLeft > maxLeft) {
    modalLeft = maxLeft;
  }

  if (modalTop < minTop) {
    modalTop = minTop;
  }

  if (modalTop > maxTop) {
    modalTop = iconPosition.top - modalHeight - 6;
  }

  modal.classList.add("comment-option-modal");
  modal.style.top = `${modalTop}px`;
  modal.style.left = `${modalLeft}px`;
  modal.style.right = "auto";
};

//댓글 점세개 모달 구현
const showCommentModal = (targetEllipsis) => {
  const targetComment = targetEllipsis.closest(
    ".comment-item, .re-comment-item",
  );

  if (
    modalTarget === targetComment &&
    modal.classList.contains("hidden") === false
  ) {
    modal.classList.add("hidden");
    return;
  }

  modalTarget = targetComment;
  setCommentModalPosition(targetEllipsis);
  modal.classList.remove("hidden");
};

///게시글 삭제 확인 모달 띄우기
const showPostDeleteConfirm = () => {
  modal.classList.add("hidden");
  deleteTarget = "post";
  confirmOverlay.classList.remove("hidden");
};

//댓글 삭제 확인 모달 띄우기
const showCommentDeleteConfirm = () => {
  modal.classList.add("hidden");
  deleteTarget = modalTarget;
  confirmOverlay.classList.remove("hidden");
};

//삭제 취소 구현
const cancelDelete = () => {
  confirmOverlay.classList.add("hidden");
  deleteTarget = null;
};

//삭제 확인 구현
const confirmDelete = () => {
  if (deleteTarget === "post") {
    alert("게시글이 삭제되었습니다.");
    location.href = "./board-list.html";
  } else {
    deleteTarget.remove();
    deleteTarget = null;
    confirmOverlay.classList.add("hidden");
    updateCommentCount();
  }
};

//댓글 영역 클릭 이벤트 구현
commentList.addEventListener("click", (event) => {
  const targetLikeBox = event.target.closest(".comment-like-box");
  const targetReplyBtn = event.target.closest(".reply-button");
  const targetEllipsis = event.target.closest(".comment-ellipsis-img");

  if (targetLikeBox) {
    toggleLike(targetLikeBox);
  }
  if (targetReplyBtn) {
    setReplyMode(targetReplyBtn);
  }

  if (targetEllipsis) {
    showCommentModal(targetEllipsis);
  }
});

//댓글 점세개 모달 닫기
document.addEventListener("click", (event) => {
  if (
    !event.target.closest(".comment-ellipsis-img") &&
    !event.target.closest(".post-modal") &&
    !event.target.closest(".post-menu-icon")
  ) {
    modal.classList.add("hidden");
  }
});

//수정된 게시글
const renderSavedPost = () => {
  const savedPost = localStorage.getItem(STORAGE_KEY);

  if (savedPost === null) {
    return;
  }

  const post = JSON.parse(savedPost);

  postTitle.textContent = post.title;
  postContent.textContent = post.content;
  postUserName.textContent = post.user;
  postUserTime.textContent = post.time;
};

likeBtn.addEventListener("click", likeBox);
scrapBtn.addEventListener("click", scrapBox);
subMitBtn.addEventListener("click", addCommentView);
menuIcon.addEventListener("click", toggleModal);

if (detailBackButton !== null) {
  detailBackButton.addEventListener("click", () => {
    location.href = "./board-list.html";
  });
}

deleteBtn.addEventListener("click", () => {
  if (modalTarget === "post") {
    showPostDeleteConfirm();
  } else {
    showCommentDeleteConfirm();
  }
});

btnNo.addEventListener("click", cancelDelete);
btnYes.addEventListener("click", confirmDelete);

updateCommentCount();
renderSavedPost();
