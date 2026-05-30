document.addEventListener("DOMContentLoaded", () => {
  const ellipsisBtn = document.querySelector(".head-right > button");
  const ellipsisImg = ellipsisBtn.querySelector("img");
  const popupPostBtn = document.querySelector(".popupPostBtn");
  const postBtn = document.querySelector(".postBtn");
  const howtolistBtn = document.querySelector("#howtolist");
  const howtolistPopup = document.querySelector(".howtolistPopup");
  const recommendBtn = document.querySelector(".recommend");
  const recentBtn = document.querySelector(".recent");
  const howtolistText = document.querySelector("#howtolist > p");
  const howtolistArrow = document.querySelector("#howtolist > img");
  const categories = document.querySelectorAll(".selected_category, .category");
  const selectedLine = document.querySelector(".selected_line");
  const posts = document.querySelectorAll(".bigBoxForpost");
  const emptyMsg = document.querySelector(".none-post-notice");

  // 초기 빈 상태 문구 숨기기
  emptyMsg.style.display = "none";

  // 팝업 버튼 (점세개)
  ellipsisBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const isHidden = getComputedStyle(popupPostBtn).display === "none";
    popupPostBtn.style.display = isHidden ? "flex" : "none";

    if (ellipsisImg) {
      ellipsisImg.src = isHidden
        ? "static/icons/ellipsis-vertical-g.svg"
        : "static/icons/ellipsis-vertical-b.svg";
    }
  });

  // 정렬 드롭다운
  howtolistBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const isHidden = getComputedStyle(howtolistPopup).display === "none";
    howtolistPopup.style.display = isHidden ? "flex" : "none";
    howtolistArrow.src = isHidden
      ? "static/icons/upvector.svg"
      : "static/icons/downvector.svg";
  });

  // 바깥 클릭 시 팝업 닫기
  document.addEventListener("click", (e) => {
    if (!popupPostBtn.contains(e.target)) {
      popupPostBtn.style.display = "none";

      if (ellipsisImg) {
        ellipsisImg.src = "static/icons/ellipsis-vertical-b.svg";
      }
    }
    if (!howtolistPopup.contains(e.target)) {
      howtolistPopup.style.display = "none";
      howtolistArrow.src = "static/icons/downvector.svg";
    }
  });

  // 추천순
  recommendBtn.addEventListener("click", () => {
    recommendBtn.style.backgroundColor = "#2173F1";
    recommendBtn.style.color = "#FFFFFF";
    recentBtn.style.backgroundColor = "#F2F5FA";
    recentBtn.style.color = "#000000";
    howtolistText.textContent = "추천순";
    howtolistPopup.style.display = "none";
    howtolistArrow.src = "static/icons/downvector.svg";
  });

  // 최신순
  recentBtn.addEventListener("click", () => {
    recentBtn.style.backgroundColor = "#2173F1";
    recentBtn.style.color = "#FFFFFF";
    recommendBtn.style.backgroundColor = "#F2F5FA";
    recommendBtn.style.color = "#000000";
    howtolistText.textContent = "최신순";
    howtolistPopup.style.display = "none";
    howtolistArrow.src = "static/icons/downvector.svg";
  });

  // 카테고리 탭
  categories.forEach((category) => {
    category.addEventListener("click", () => {
      // 텍스트 색상 변경
      categories.forEach((c) => {
        c.style.color = "#7B7B7B";
      });
      category.style.color = "#000000";

      // underline 이동
      const categoryLeft = category.getBoundingClientRect().left;
      const navLeft = category
        .closest(".navigation")
        .getBoundingClientRect().left;
      selectedLine.style.marginLeft = `${categoryLeft - navLeft}px`;
      selectedLine.style.width = `${category.offsetWidth}px`;

      // 게시글 필터링
      const selected = category.textContent.trim();
      let hasPost = false;

      posts.forEach((post) => {
        if (selected === "전체" || post.dataset.category === selected) {
          post.style.display = "block";
          hasPost = true;
        } else {
          post.style.display = "none";
        }
      });

      // 빈 상태 문구 토글
      if (!hasPost) {
        emptyMsg.style.display = "flex";
      } else {
        emptyMsg.style.display = "none";
      }
    });
  });

  // 질문 올리기 버튼
  popupPostBtn.addEventListener("click", () => {
    window.location.href = "../pages/board-write.html";
  });

  postBtn.addEventListener("click", () => {
    window.location.href = "../pages/board-write.html";
  });
  // 게시글 클릭 시 상세 페이지로 이동
  posts.forEach((post) => {
    post.addEventListener("click", () => {
      const title = post.querySelector(".postTitle").textContent.trim();
      const content = post.querySelector(".postContent").textContent.trim();
      const postInfo = post.querySelector(".postInfo div").textContent.trim();

      const postInfoParts = postInfo.split("·");

      const selectedPost = {
        title: title,
        content: content,
        time: postInfoParts[0].trim(),
        user: postInfoParts[1].trim(),
        category: post.dataset.category,
      };

      localStorage.setItem("qampusBoardPost", JSON.stringify(selectedPost));

      window.location.href = "./board-detail.html";
    });
  });
});
