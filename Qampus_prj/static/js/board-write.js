// 카테고리 선택 영역
const categoryItems = document.querySelectorAll(".select-category li");
const categorySelect = document.querySelector("#categorySelect");

// form
const form = document.querySelector("#createForm");

// 제목, 내용
const titleInput = document.querySelector(".form-title");
const contentInput = document.querySelector(".form-content");

// 카테고리 select 초기화
if (categorySelect) {
  categorySelect.value = "";
}

// 카테고리 클릭
categoryItems.forEach((item) => {
  item.addEventListener("click", () => {
    categoryItems.forEach((category) => {
      category.classList.remove("active");
    });

    item.classList.add("active");

    if (categorySelect) {
      categorySelect.value = item.dataset.id;
    }
  });
});

// 제출 전 검사
if (form) {
  form.addEventListener("submit", (event) => {
    const titleValue = titleInput.value.trim();
    const contentValue = contentInput.value.trim();

    // li에 active가 붙었는지 확인
    const activeCategory = document.querySelector(".select-category li.active");

    if (titleValue === "") {
      event.preventDefault();
      alert("제목을 입력해주세요.");
      titleInput.focus();
      return;
    }

    if (contentValue === "") {
      event.preventDefault();
      alert("내용을 입력해주세요.");
      contentInput.focus();
      return;
    }

    if (!activeCategory) {
      event.preventDefault();
      alert("카테고리를 선택해주세요.");
      return;
    }
  });
}
