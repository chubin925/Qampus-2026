// 카테고리 선택영역
const categoryItems = document.querySelectorAll(".select-category li");
const categorySelect = document.querySelector("#categorySelect");
/* form title, content */
const titleInput = document.querySelector(".form-title");
const contentInput = document.querySelector(".form-content");
const postOkBtn = document.querySelector(".post-ok-btn");


categoryItems.forEach((item, index) => {
  item.addEventListener("click", () => {

    categoryItems.forEach((category) => {
      category.classList.remove("active");
    });

    item.classList.add("active");

    const options = categorySelect.options;

    for (let i = 0; i < options.length; i++) {
      options[i].selected = false;
    }

    options[index].selected = true;
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
});