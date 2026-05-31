document.addEventListener("DOMContentLoaded", () => {
  const ellipsisBtn = document.querySelector(".head-right > button");
  const ellipsisImg = ellipsisBtn.querySelector("img");
  const popupPostBtn = document.querySelector(".popupPostBtn");
  const howtolistBtn = document.querySelector("#howtolist");
  const howtolistPopup = document.querySelector(".howtolistPopup");
  const howtolistArrow = document.querySelector("#howtolist > img");
  const selectedLine = document.querySelector(".selected_line");


  // 팝업 버튼 (점세개)
  ellipsisBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const isHidden = getComputedStyle(popupPostBtn).display === "none";
    popupPostBtn.style.display = isHidden ? "flex" : "none";

    if (ellipsisImg) {
      ellipsisImg.src = isHidden
        ? "/static/icons/ellipsis-vertical-g.svg"
        : "/static/icons/ellipsis-vertical-b.svg";
    }
  });

  // 정렬 드롭다운
  howtolistBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const isHidden = getComputedStyle(howtolistPopup).display === "none";
    howtolistPopup.style.display = isHidden ? "flex" : "none";
    howtolistArrow.src = isHidden
      ? "/static/icons/upvector.svg"
      : "/static/icons/downvector.svg";
  });

  // 바깥 클릭 시 팝업 닫기
  document.addEventListener("click", (e) => {
    if (!popupPostBtn.contains(e.target)) {
      popupPostBtn.style.display = "none";

      if (ellipsisImg) {
        ellipsisImg.src = "/static/icons/ellipsis-vertical-b.svg";
      }
    }
    if (!howtolistPopup.contains(e.target)) {
      howtolistPopup.style.display = "none";
      howtolistArrow.src = "/static/icons/downvector.svg";
    }
  });

  const selectedCategory =
    document.querySelector(".selected_category");

  if (selectedCategory && selectedLine) {
    selectedLine.style.width =
      `${selectedCategory.offsetWidth}px`;

    selectedLine.style.marginLeft =
      `${selectedCategory.offsetLeft}px`;
  }
});