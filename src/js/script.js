document.addEventListener("DOMContentLoaded", function () {

  // ページトップへ戻る
  const topBtn = document.querySelector('.js-totop');
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

  // パーティクル

  // カウントダウン
  function showRestTime() {
    const now = new Date();
    const goal = new Date(2025, 5, 10);

    const restMillisecond = goal.getTime() - now.getTime();
    const day = Math.ceil(restMillisecond / (1000 * 60 * 60 * 24));

    const countdownElement = document.getElementById('js-countdown');
    if (countdownElement) {
      countdownElement.textContent = day;
    }
  }

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
      breakpoints: {
        768: {
          spaceBetween: 24,
        },
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


  // ドラッグスクロール有効化
  function enableSmoothMouseDragScroll(targetSelector) {
    const elements = document.querySelectorAll(targetSelector);
    let target = null;
    let velocity = { x: 0, y: 0 };
    let isDragging = false;

    function animateScroll() {
      if (target && !isDragging) {
        // 慣性を減速
        velocity.x *= 0.8;
        velocity.y *= 0.8;

        target.element.scrollLeft += velocity.x;
        target.element.scrollTop += velocity.y;

        if (Math.abs(velocity.x) < 0.1 && Math.abs(velocity.y) < 0.1) {
          velocity = { x: 0, y: 0 };
          return;
        }

        requestAnimationFrame(animateScroll);
      }
    }

    elements.forEach((element) => {
      element.addEventListener("mousedown", (event) => {
        event.preventDefault();
        isDragging = true;
        target = {
          element: element,
          startX: event.clientX,
          startY: event.clientY,
          scrollLeft: element.scrollLeft,
          scrollTop: element.scrollTop,
        };
      });

      element.addEventListener("mousemove", (event) => {
        if (isDragging && target) {
          event.preventDefault();
          const moveX = target.startX - event.clientX;
          const moveY = target.startY - event.clientY;

          // 最小移動距離で慣性を無効化
          if (Math.abs(moveX) < 2 && Math.abs(moveY) < 2) {
            velocity = { x: 0, y: 0 };
            return;
          }

          velocity.x = moveX;
          velocity.y = moveY;

          target.element.scrollLeft = target.scrollLeft + moveX;
          target.element.scrollTop = target.scrollTop + moveY;
        }
      });

      element.addEventListener("mouseup", () => {
        isDragging = false;
        velocity = { x: 0, y: 0 };
        if (target) {
          requestAnimationFrame(animateScroll);
        }
      });

      element.addEventListener("mouseleave", () => {
        isDragging = false;
        velocity = { x: 0, y: 0 };
        if (target) {
          requestAnimationFrame(animateScroll);
        }
      });
    });

    document.addEventListener("mouseup", () => {
      isDragging = false;
      velocity = { x: 0, y: 0 };
      if (target) {
        requestAnimationFrame(animateScroll);
      }
    });
  }

  enableSmoothMouseDragScroll(".js-scroll");

  // パーティクル
  function initializeParticlesJS(elementId, colors) {
    particlesJS(elementId, {
      "particles": {
        "number": {
          "value": 30,
          "density": {
            "enable": true,
            "value_area": 3000
          }
        },
        "color": {
          "value": colors
        },
        "size": {
          "value": 25,
          "random": true
        },
        "move": {
          "enable": true,
          "speed": 2,
          "out_mode": "out"
        }
      },
      "retina_detect": true
    });
  }

  initializeParticlesJS("js-particle-secondary", ['#004664', '#002F43', '#E7F1F5', '#CCDAE0']);

  initializeParticlesJS("js-particle-primary", ['#AC0C2D', '#c5556c', '#b72a47', '#EDCCD4']);




  // json読み込み
  // 基本のrem変換関数
  const pxToRem = (px, base = 16) => px / base + "rem";

  // JSONファイルをフェッチして値を適用（開発時のみ有効）
  if (process.env.NODE_ENV === "development") {
    fetch("./src/data/timeline-data.json") // JSONのパスを開発環境用に設定
      .then(response => response.json())
      .then(data => {
        data.timelineItems.forEach(item => {
          const element = document.querySelector(`.history__timeline-item[data-id="${item.id}"]`);
          if (element) {
            element.style.setProperty("--width", pxToRem(item.width));
          }
        });
      })
      .catch(error => console.error("JSONの読み込みに失敗しました:", error));
  }

});
