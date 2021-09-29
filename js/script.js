window.addEventListener("DOMContentLoaded", () => {
  // ページ内遷移をなめらかに挙動させるためのスクリプト
  // aタグでのページ内での遷移するリンクを取得
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  const anchorLinksArr = Array.prototype.slice.call(anchorLinks);

  anchorLinksArr.forEach((link) => {
    // ページ内遷移用のリンクをクリックした際
    link.addEventListener("click", (e) => {
      e.preventDefault();
      // 遷移対象セクションのid,エレメントを取得
      const targetId = link.hash;
      const targetElement = document.querySelector(targetId);
      // 遷移対象セクションの高さを取得
      const targetOffsetTop =
        window.pageYOffset + targetElement.getBoundingClientRect().top;
      // なめらかに遷移
      window.scrollTo({
        top: targetOffsetTop,
        behavior: "smooth",
      });
    });
  });
});
