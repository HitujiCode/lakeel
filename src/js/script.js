document.addEventListener("DOMContentLoaded", function () {

  // ページトップへ戻る
  const topBtn = document.querySelector('.js-pageTop');
  if (topBtn) {
    topBtn.addEventListener('click', function (event) {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ハンバーガーメニュー
  const hamburger = document.querySelector(".js-hamburger");
  const drawer = document.querySelector(".js-drawer");
  const header = document.querySelector(".js-header");
  // const outer = document.querySelector(".outer");

  if (hamburger && drawer && header) {
    hamburger.addEventListener("click", function () {
      const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;

      if (drawer.classList.contains("is-open")) {
        header.style.width = "";
        drawer.style.width = "";
        document.body.classList.remove("is-noscroll");
        // outer.classList.remove("is-noscroll");
      } else {
        const headerWidth = header.offsetWidth;
        header.style.width = `calc(100% - ${scrollBarWidth}px)`;
        drawer.style.width = `calc(100% - ${scrollBarWidth}px)`;
        document.body.classList.add("is-noscroll");
        // outer.classList.add("is-noscroll");
      }

      hamburger.classList.toggle("is-open");
      drawer.classList.toggle("is-open");
    });

    drawer.addEventListener("click", function () {
      document.body.classList.remove("is-noscroll");
      // outer.classList.remove("is-noscroll");
      header.style.width = "";
      drawer.style.width = "";
      hamburger.classList.remove("is-open");
      drawer.classList.remove("is-open");
    });

    const drawerLinks = drawer.querySelectorAll("a[href]");
    drawerLinks.forEach(link => {
      link.addEventListener("click", function () {
        document.body.classList.remove("is-noscroll");
        // outer.classList.remove("is-noscroll");
        header.style.width = "";
        drawer.style.width = "";
        hamburger.classList.remove("is-open");
        drawer.classList.remove("is-open");
      });
    });
  }
});