const STORAGE_KEY = "qampusBoardPost";

const backButton = document.querySelector(".board-edit-back-button");
const completeButton = document.querySelector(".board-edit-complete-button");

const userName = document.querySelector(".board-edit-user-name");
const userTime = document.querySelector(".board-edit-user-time");

const titleInput = document.querySelector(".board-edit-title-input");
const contentTextarea = document.querySelector(".board-edit-content-textarea");
const contentLength = document.querySelector(".board-edit-content-length");

// 임시 기본 게시글 데이터
// Django 연동 전이라 localStorage 기준으로 수정 흐름만 구현
const defaultPost = {
  title: "질문",
  content: "질문질문",
  user: "질문자",
  time: "5/26 21:10",
};

// 저장된 게시글 불러오기
const getSavedPost = () => {
  const savedPost = localStorage.getItem(STORAGE_KEY);

  if (savedPost === null) {
    return defaultPost;
  }

  return JSON.parse(savedPost);
};

// 수정 페이지에 기존 게시글 값 넣기
const renderEditPost = () => {
  const post = getSavedPost();

  userName.textContent = post.user;
  userTime.textContent = post.time;

  titleInput.value = post.title;
  contentTextarea.value = post.content;

  contentLength.textContent = contentTextarea.value.length;
};

// 오늘 날짜 텍스트 만들기
const getTodayText = () => {
  const today = new Date();

  const month = today.getMonth() + 1;
  const date = today.getDate();
  const hour = String(today.getHours()).padStart(2, "0");
  const minute = String(today.getMinutes()).padStart(2, "0");

  return `${month}/${date} ${hour}:${minute}`;
};

// 글자 수 
const updateContentLength = () => {
  contentLength.textContent = contentTextarea.value.length;
};

// 수정완료
const updatePost = () => {
  const titleValue = titleInput.value.trim();
  const contentValue = contentTextarea.value.trim();

  if (titleValue === "") {
    alert("질문 제목을 입력해주세요.");
    titleInput.focus();
    return;
  }

  if (contentValue === "") {
    alert("질문 내용을 입력해주세요.");
    contentTextarea.focus();
    return;
  }

  const currentPost = getSavedPost();

  const editedPost = {
    ...currentPost,
    title: titleValue,
    content: contentValue,
    time: getTodayText(),
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(editedPost));

  alert("게시글이 수정되었습니다.");
  location.href = "./board-detail.html";
};

//뒤로가기
const goBack = () => {
  location.href = "./board-detail.html";
};

contentTextarea.addEventListener("input", updateContentLength);
completeButton.addEventListener("click", updatePost);
backButton.addEventListener("click", goBack);

renderEditPost();