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

  // カウントダウン
  function showRestTime() {
    const now = new Date();
    const goal = new Date(2025, 5, 10);

    const restMillisecond = goal.getTime() - now.getTime();
    const day = Math.ceil(restMillisecond / (1000 * 60 * 60 * 24)); // 日数を計算

    const countdownElement = document.getElementById('js-countdown');
    if (countdownElement) {
      countdownElement.textContent = day; // 要素が存在する場合のみ更新
    }
  }

  // 初回実行
  showRestTime();

  // 次の日付が変わるタイミングを計算
  const now = new Date();
  const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  const timeUntilNextMidnight = nextMidnight.getTime() - now.getTime();

  // 次の日付が変わるタイミングで最初の更新を設定
  setTimeout(function () {
    showRestTime(); // 日付が変わったら更新
    setInterval(showRestTime, 24 * 60 * 60 * 1000); // 以降は24時間ごとに更新
  }, timeUntilNextMidnight);


  // Episodeスライダー
  function initEpisodeSwiper(swiperName, options = {}) {
    const defaultOptions = {
      loop: true,
      slidesPerView: "auto",
      spaceBetween: 20,
      speed: 6000,
      autoplay: {
        delay: 0,
      },
    };

    const swiperOptions = { ...defaultOptions, ...options };
    const swiper = new Swiper(swiperName, swiperOptions);
  }

  initEpisodeSwiper('.js-top-swiper');
  initEpisodeSwiper('.js-bottom-swiper', {
    autoplay: {
      delay: 0,
      reverseDirection: true,
    },
  });

});

