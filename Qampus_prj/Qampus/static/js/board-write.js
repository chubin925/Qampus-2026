// 카테고리 선택영역
const categoryItems = document.querySelectorAll(".select-category li");

/* form title, content */
const titleInput = document.querySelector(".form-title");
const contentInput = document.querySelector(".form-content");
const postOkBtn = document.querySelector(".post-ok-btn");

//뒤로가기 아이콘
const backBtn = document.querySelector(".post-cancel-icon");

categoryItems.forEach((item) => {
  item.addEventListener("click", () => {
    categoryItems.forEach((category) => {
      category.classList.remove("active");
    });

    item.classList.add("active");
  });
});

postOkBtn.addEventListener("click", () => {
  const titleValue = titleInput.value.trim();
  const contentValue = contentInput.value.trim();

  if (titleValue === "") {
    alert("제목을 입력하세요.");
    titleInput.focus();
    return;
  }

  if (contentValue === "") {
    alert("내용을 입력하세요.");
    titleInput.focus();
    return;
  }

  alert("작성 완료");
});

backBtn.addEventListener("click", () => {
  location.href = "./board-list.html";
});
