const form = document.querySelector("#updatePostForm");

const backButton = document.querySelector(".post-cancel-button");

const titleInput = document.querySelector(".form-title");
const contentTextarea = document.querySelector(".form-content");

const categoryItems = document.querySelectorAll(".select-category li");
const categoryInput = document.querySelector("#categoryInput");

// 카테고리 클릭
categoryItems.forEach((item) => {
  item.addEventListener("click", () => {
    categoryItems.forEach((category) => {
      category.classList.remove("active");
    });

    item.classList.add("active");

    if (categoryInput) {
      categoryInput.value = item.dataset.categoryId;
    }
  });
});

const activeCategory = document.querySelector(".select-category li.active");

if (activeCategory && categoryInput) {
  categoryInput.value = activeCategory.dataset.categoryId;
}

// 뒤로가기
if (backButton) {
  backButton.addEventListener("click", () => {
    history.back();
  });
}

// 제출 전 검사
if (form) {
  form.addEventListener("submit", (event) => {
    const titleValue = titleInput.value.trim();
    const contentValue = contentTextarea.value.trim();

    if (titleValue === "") {
      event.preventDefault();
      alert("질문 제목을 입력해주세요.");
      titleInput.focus();
      return;
    }

    if (contentValue === "") {
      event.preventDefault();
      alert("질문 내용을 입력해주세요.");
      contentTextarea.focus();
      return;
    }

    if (categoryInput && categoryInput.value === "") {
      event.preventDefault();
      alert("카테고리를 선택해주세요.");
    }
  });
}
