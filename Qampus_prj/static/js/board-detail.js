//좋아요, 스크랩 버튼
const likeBox = document.querySelector(".like-box");
const likeEmpty = document.querySelector(".like-img");
const likeFill = document.querySelector(".like-img-fill");
const scrapBox = document.querySelector(".scrap-box");

//댓글, 대댓글 좋아요 버튼
const commentLikeBoxes = document.querySelectorAll(".comment-like-box");

//수정,삭제 모달
const menuIcon = document.querySelector(".post-menu-icon");
const modal = document.querySelector(".post-option-modal");
const deleteBtn = document.querySelector(".post-option-modal .delete-button");

//댓글 수정,삭제 모달
const commentModal = document.querySelector(".comment-option-modal");
const commentEditBtn = document.querySelector(".comment-edit-button");
const commentDeleteBtn = document.querySelector(".comment-delete-button");

//댓글 목록
const commentList = document.querySelector(".comment-list");

//삭제확인 모달
const confirmOverlay = document.querySelector(".delete-confirm-overlay");
const btnNo = document.querySelector(".btn-no");
const btnYes = document.querySelector(".btn-yes");
const postDeleteForm = document.querySelector("#post-delete-form");

let modalTarget = "post";
let deleteTarget = null;



//좋아요, 스크랩 localStorage key
const postId = likeBox?.dataset.postId;
const SCRAP_STORAGE_KEY = `qampus-scrap-${postId}`;


//스크랩 초기 상태 반영
if (localStorage.getItem(SCRAP_STORAGE_KEY) === "true") {
  scrapBox?.classList.add("active");
}


//스크랩 클릭
scrapBox?.addEventListener("click", () => {
  const isScrapped = scrapBox.classList.toggle("active");

  if (isScrapped) {
    localStorage.setItem(SCRAP_STORAGE_KEY, "true");
  } else {
    localStorage.setItem(SCRAP_STORAGE_KEY, "false");
  }
});

//댓글, 대댓글 좋아요 구현
commentLikeBoxes.forEach((commentLikeBox) => {
  const likeType = commentLikeBox.dataset.likeType;
  const likeId = commentLikeBox.dataset.likeId;
  const storageKey = `qampus-${likeType}-like-${likeId}`;

  const commentLikeImg = commentLikeBox.querySelector(".comment-like-img");
  const commentLikeCount = commentLikeBox.querySelector(".comment-like-count");

  if (localStorage.getItem(storageKey) === "true") {
    commentLikeBox.classList.add("active");
    commentLikeImg.src = "/static/icons/heart-blue-fill.svg";
  }

  commentLikeBox.addEventListener("click", () => {
    const isLiked = commentLikeBox.classList.toggle("active");
    const currentLikeCount = Number(commentLikeCount.textContent.trim());

    if (isLiked) {
      commentLikeCount.textContent = currentLikeCount + 1;
      commentLikeImg.src = "/static/icons/heart-blue-fill.svg";
      localStorage.setItem(storageKey, "true");
    } else {
      commentLikeCount.textContent = Math.max(currentLikeCount - 1, 0);
      commentLikeImg.src = "/static/icons/heart-black.svg";
      localStorage.setItem(storageKey, "false");
    }
  });
});

//수정/삭제 모달 띄우기
const toggleModal = (event) => {
  event.stopPropagation();

  modalTarget = "post";

  modal?.classList.toggle("hidden");
  commentModal?.classList.add("hidden");
};

//댓글 점세개 모달 위치 잡기
const setCommentModalPosition = (targetButton) => {
  const iconPosition = targetButton.getBoundingClientRect();
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
  } else {
    modalLeft = maxLeft;
  }

  if (modalTop < minTop) {
    modalTop = minTop;
  } else {
    modalTop = iconPosition.top - modalHeight - 6;
  }

  commentModal.style.top = `${modalTop}px`;
  commentModal.style.left = `${modalLeft}px`;
  commentModal.style.right = "auto";
};

//댓글 점세개 모달 구현
const showCommentModal = (targetButton) => {
  const targetComment = targetButton.closest(".comment-item, .re-comment-item");

  if (
    modalTarget === targetComment &&
    commentModal.classList.contains("hidden") === false
  ) {
    commentModal.classList.add("hidden");
    return;
  }

  modalTarget = targetComment;

  setCommentModalPosition(targetButton);

  commentModal.classList.remove("hidden");
  modal?.classList.add("hidden");
};

///게시글 삭제 확인 모달 띄우기
const showPostDeleteConfirm = () => {
  modal?.classList.add("hidden");
  commentModal?.classList.add("hidden");

  deleteTarget = "post";
  confirmOverlay?.classList.remove("hidden");
};

//댓글 삭제 확인 모달 띄우기
const showCommentDeleteConfirm = () => {
  commentModal?.classList.add("hidden");

  deleteTarget = modalTarget;
  confirmOverlay?.classList.remove("hidden");
};

//삭제 취소 구현
const cancelDelete = () => {
  confirmOverlay?.classList.add("hidden");
  deleteTarget = null;
};

//삭제 확인 구현
const confirmDelete = (event) => {
  event.preventDefault();

  if (deleteTarget === "post") {
    postDeleteForm?.submit();
    return;
  }

  const deleteForm = deleteTarget?.querySelector(
    ".comment-delete-form, .reply-delete-form",
  );

  deleteForm?.submit();
};

//댓글 영역 클릭 이벤트 구현
commentList?.addEventListener("click", (event) => {
  const targetReplyBtn = event.target.closest(".reply-button");
  const targetEllipsis = event.target.closest(".comment-menu-button");

  if (targetReplyBtn) {
    const targetComment = targetReplyBtn.closest(".comment-item");
    const replyForm = targetComment?.querySelector(".reply-form");

    replyForm?.classList.toggle("hidden");

    const replyInput = replyForm?.querySelector("input");
    replyInput?.focus();
  }

  if (targetEllipsis) {
    event.stopPropagation();
    showCommentModal(targetEllipsis);
  }
});

//댓글 수정 버튼
commentEditBtn?.addEventListener("click", () => {
  if (modalTarget === "post") return;

  const editForm = modalTarget?.querySelector(
    ".comment-edit-form, .reply-edit-form",
  );

  editForm?.classList.toggle("hidden");

  const editInput = editForm?.querySelector("input");
  editInput?.focus();

  commentModal?.classList.add("hidden");
});

//댓글 삭제 버튼
commentDeleteBtn?.addEventListener("click", () => {
  if (modalTarget === "post") return;

  showCommentDeleteConfirm();
});

//댓글 점세개 모달 닫기
document.addEventListener("click", (event) => {
  if (
    !event.target.closest(".comment-menu-button") &&
    !event.target.closest(".post-menu-button") &&
    !event.target.closest(".post-modal")
  ) {
    modal?.classList.add("hidden");
    commentModal?.classList.add("hidden");
  }
});

menuIcon?.addEventListener("click", toggleModal);

deleteBtn?.addEventListener("click", () => {
  showPostDeleteConfirm();
});

btnNo?.addEventListener("click", cancelDelete);
btnYes?.addEventListener("click", confirmDelete);
