document.addEventListener("DOMContentLoaded", function () {
  // ===== GSAP・ScrollTrigger 初期化 =====
  gsap.registerPlugin(ScrollTrigger);

  // // // ===== 初回ロード制御 =====
  // const isFirstLoad = sessionStorage.getItem('isFirstLoad');

  // // ===== ローディング後に実行するアニメーション =====
  // function runMvAnimation() {
  //   const header = document.querySelector('.header');
  //   const particleMv = document.querySelector('.particle__bg');
  //   const mvFlag = document.querySelector('.mv__flag');
  //   const mvScroll = document.querySelector('.mv__scroll');
  //   const mvCountdown = document.querySelector('.mv__countdown');

  //   if (!header || !particleMv || !mvFlag || !mvScroll || !mvCountdown) return;

  //   // 初期値リセット
  //   header.style.opacity = 0;
  //   particleMv.style.opacity = 0;

  //   const tl = gsap.timeline();

  //   tl.fromTo(header, {
  //     opacity: 0,
  //   }, {
  //     duration: 1,
  //     opacity: 1,
  //     ease: "power3.inOut",
  //   })
  //     .fromTo(particleMv, {
  //       opacity: 0,
  //     }, {
  //       duration: 1,
  //       opacity: 1,
  //       ease: "power3.inOut",
  //     }, "-=0.8")
  //     .fromTo(mvFlag, {
  //       opacity: 0,
  //       y: 40,
  //     }, {
  //       y: 0,
  //       duration: 0.8,
  //       opacity: 1,
  //       ease: "power2.out",
  //     }, "-=0.3")
  //     .fromTo(mvScroll, {
  //       opacity: 0,
  //       y: 40,
  //     }, {
  //       y: 0,
  //       duration: 0.8,
  //       opacity: 1,
  //       ease: "power2.out",
  //     }, "-=0.1")
  //     .fromTo(mvCountdown, {
  //       opacity: 0,
  //       y: 40,
  //     }, {
  //       y: 0,
  //       duration: 0.8,
  //       opacity: 1,
  //       ease: "power3.out",
  //     }, "-=0.8");
  // }

  // // ===== ページ読込時ローディングアニメーション =====
  // window.addEventListener('load', function () {
  //   const loader = document.querySelector('.js-loading');
  //   const loaderLogo = document.querySelector('.loading__logo');
  //   const header = document.querySelector('.header');
  //   const particleMv = document.querySelector('.js-particle-mv');
  //   const mvFlag = document.querySelector('.mv__flag');
  //   const mvScroll = document.querySelector('.mv__scroll');
  //   const mvCountdown = document.querySelector('.mv__countdown');

  //   if (!loader || !loaderLogo || !header || !particleMv || !mvFlag || !mvScroll || !mvCountdown) return;

  //   gsap.set([header, particleMv, mvFlag, mvScroll, mvCountdown], { opacity: 0 });

  //   if (!isFirstLoad) {
  //     loader.style.display = "grid";
  //     const tl = gsap.timeline();

  //     tl.to(loaderLogo, {
  //       duration: 1.3,
  //       opacity: 1,
  //       translateY: 0,
  //       ease: "power3.out",
  //     })
  //       .to(loader, {
  //         duration: 1,
  //         clipPath: "inset(0% 100% 0% 0%)",
  //         ease: "power2.inOut",
  //         onComplete: () => {
  //           loader.style.display = "none";
  //           runMvAnimation();
  //           sessionStorage.setItem('isFirstLoad', true);
  //         },
  //       });
  //   } else {
  //     loader.style.display = "none";
  //     runMvAnimation();
  //   }
  // });

  // ===== ページトップへ戻る =====
  const topBtn = document.querySelector('.js-totop');
  if (topBtn) {
    topBtn.addEventListener('click', function (event) {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ===== ハンバーガーメニュー =====
  const hamburger = document.querySelector(".js-hamburger");
  const drawer = document.querySelector(".js-drawer");
  const header = document.querySelector(".js-header");

  // ハンバーガーメニューを閉じる処理
  function closeHamburgerMenu() {
    document.body.classList.remove("is-noscroll");
    hamburger.classList.remove("is-open");
    drawer.classList.remove("is-open");
    hamburger.setAttribute("aria-expanded", "false");
    hamburger.setAttribute("aria-label", "メニューを開く");
  }

  if (hamburger && drawer && header) {
    // ハンバーガーボタンのクリックイベント
    hamburger.addEventListener("click", function () {
      const isOpen = drawer.classList.contains("is-open");
      if (isOpen) {
        document.body.classList.remove("is-noscroll");
        hamburger.setAttribute("aria-expanded", "false");
        hamburger.setAttribute("aria-label", "メニューを開く");
      } else {
        document.body.classList.add("is-noscroll");
        hamburger.setAttribute("aria-expanded", "true");
        hamburger.setAttribute("aria-label", "メニューを閉じる");
      }
      hamburger.classList.toggle("is-open");
      drawer.classList.toggle("is-open");
    });

    // ドロワー全体をクリックした場合に閉じる
    drawer.addEventListener("click", function () {
      closeHamburgerMenu();
    });

    // ドロワー内のリンクをクリックした場合に閉じる
    const drawerLinks = drawer.querySelectorAll("a[href]");
    drawerLinks.forEach(link => {
      link.addEventListener("click", function () {
        closeHamburgerMenu();
      });
    });
  }

  // ===== カウントダウン =====
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

  // 日付が変わるタイミングでカウントダウン更新
  setTimeout(function () {
    showRestTime();
    setInterval(showRestTime, 24 * 60 * 60 * 1000);
  }, timeUntilNextMidnight);

  // ===== Episodeスライダー =====
  function initEpisodeSwiper(swiperName, options = {}) {
    const defaultOptions = {
      loop: true,
      slidesPerView: "auto",
      spaceBetween: 20,
      speed: 6000,
      autoplay: {
        delay: 0,
        disableOnInteraction: false,
      },
      breakpoints: {
        768: {
          spaceBetween: 24,
        },
      },
    };

    const swiperOptions = { ...defaultOptions, ...options };
    const swiper = new Swiper(swiperName, swiperOptions);
    const swiperElement = document.querySelector(swiperName);

    if (swiperElement) {
      let currentTranslate = 0;

      swiperElement.addEventListener("mouseenter", () => {
        currentTranslate = swiper.getTranslate();
        swiper.setTranslate(currentTranslate);
        swiper.setTransition(0);
        swiper.autoplay.stop();
      });

      swiperElement.addEventListener("mouseleave", () => {
        const activeSlide = swiperElement.querySelector(".swiper-slide-active");
        if (activeSlide) {
          const slideStyle = window.getComputedStyle(activeSlide);
          const slideWidth = activeSlide.offsetWidth;
          const marginLeft = parseFloat(slideStyle.marginLeft) || 0;
          const marginRight = parseFloat(slideStyle.marginRight) || 0;
          const totalSlideWidth = slideWidth + marginLeft + marginRight;
          const isReverse = swiperOptions.autoplay.reverseDirection === true;
          const directionMultiplier = isReverse ? 1 : -1;

          // 停止位置から再開の位置を計算
          const diff = directionMultiplier * totalSlideWidth - (currentTranslate % totalSlideWidth);
          const diffTime = Math.abs(diff / totalSlideWidth);

          swiper.setTranslate(currentTranslate + diff);
          swiper.setTransition(swiperOptions.speed * diffTime);
        }
        swiper.autoplay.start();
      });
    }
  }

  // スライダー初期化
  initEpisodeSwiper('.js-top-swiper');
  initEpisodeSwiper('.js-bottom-swiper', {
    autoplay: {
      delay: 0,
      reverseDirection: true,
    },
  });

  // ===== ドラッグスクロール有効化 =====
  function enableSmoothMouseDragScroll(targetSelector) {
    const elements = document.querySelectorAll(targetSelector);
    let target = null;
    let velocity = { x: 0, y: 0 };
    let isDragging = false;

    function animateScroll() {
      if (target && !isDragging) {
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

  // ===== パーティクル初期化 =====
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

  // ===== ヘッダーの現在地表示 =====
  window.addEventListener("scroll", function () {
    const currentPosition = window.scrollY + document.querySelector(".js-header").offsetHeight + 200;

    document.querySelectorAll("section").forEach(function (section) {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const nextSectionTop = section.nextElementSibling
        ? section.nextElementSibling.offsetTop
        : document.body.scrollHeight;

      if (currentPosition >= sectionTop && currentPosition < nextSectionTop) {
        document.querySelectorAll(".header__nav-item").forEach(function (item) {
          item.classList.remove("is-current");
        });

        const id = section.getAttribute("id");
        const currentLink = document.querySelector(`.header__nav-item a[href="#${id}"]`);
        if (currentLink) {
          currentLink.parentElement.classList.add("is-current");
        }
      }
    });
  });

  // ===== ページ内リンクのスムーススクロール =====
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (event) {
      event.preventDefault();
      const headerHeight = document.querySelector(".js-header").offsetHeight;
      const href = anchor.getAttribute("href");
      const target = href === "#" || href === "" ? document.documentElement : document.querySelector(href);

      if (target) {
        const position = target.offsetTop - headerHeight;
        window.scrollTo({ top: position, behavior: "smooth" });
      }
    });
  });

  // ===== メッセージ関連フェードイン =====
  const messageTitle = document.querySelector(".message__title");
  const messageText = document.querySelector(".message__text-wrap");
  const messageTopImg = document.querySelector(".message__top-img");
  const messageMainImg = document.querySelector(".message__main-img");
  const messageBottomImg = document.querySelector(".message__bottom-img");

  if (messageTitle && messageText && messageTopImg && messageMainImg && messageBottomImg) {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: messageTitle,
        start: "top 80%",
      },
      defaults: {
        y: 30,
        opacity: 0,
        duration: 0.7,
        ease: "power2.out",
      },
    });

    tl.from(messageTitle, {})
      .from(messageMainImg, { stagger: 0.2 }, "-=0.5")
      .from(messageText, { stagger: 0.1 }, "-=0.5")
      .from(messageTopImg, { stagger: 0.2 }, "-=0.5")
      .from(messageBottomImg, { stagger: 0.2 }, "-=0.5");
  }

  // ===== ヒストリー関連フェードイン =====
  const historyTitle = document.querySelector(".history__title");
  const historyBg = document.querySelector(".history__wrapper");
  const historyIcon = document.querySelector(".history__scroll-guide");
  const historyList = document.querySelector(".history__timeline");

  if (historyTitle && historyBg && historyIcon && historyList) {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: historyTitle,
        start: "top 80%",
      },
      defaults: {
        y: 30,
        opacity: 0,
        duration: 0.7,
        ease: "power2.out",
      },
    });

    tl.from(historyTitle, {})
      .add(() => {
        historyBg.classList.add("js-fade-bg");
      }, "-=0.5")
      .from(historyIcon, {}, "-=0.5")
      .from(historyList, { duration: 0.9 }, "-=0.3");
  }

  // ===== エピソード関連フェードイン =====
  const episodeTitle = document.querySelector(".episode__title");
  const episodeText = document.querySelector(".episode__read");
  const episodeCompass = document.querySelector(".episode__container");
  const episodeContent = document.querySelector(".episode__content");

  if (episodeTitle && episodeText && episodeCompass && episodeContent) {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: episodeTitle,
        start: "top 80%",
      },
      defaults: {
        y: 30,
        opacity: 0,
        duration: 0.7,
        ease: "power2.out",
      },
    });

    tl.from(episodeTitle, {})
      .from([episodeText, episodeCompass], {}, "-=0.4")
      .from(episodeContent, {}, "-=0.3");
  }

  // ===== キャラクター関連フェードイン =====
  const characterImg = document.querySelector(".character__main-img");
  const characterTitle = document.querySelector(".character__title");
  const characterText = document.querySelector(".character__text");
  const characterButton = document.querySelector(".character__buttons");

  if (characterImg && characterTitle && characterText && characterButton) {
    const isSP = window.matchMedia("(max-width: 767px)").matches;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: characterImg,
        start: "top 80%",
      },
      defaults: {
        y: 30,
        opacity: 0,
        duration: 0.7,
        ease: "power2.out",
      },
    });

    if (isSP) {
      tl.from(characterTitle, {})
        .from(characterImg, { stagger: 0.2 }, "-=0.4")
        .from(characterText, { stagger: 0.2 }, "-=0.4")
        .from(characterButton, { stagger: 0.2 }, "-=0.4");
    } else {
      tl.from(characterImg, {})
        .from(characterTitle, { stagger: 0.2 }, "-=0.4")
        .from(characterText, { stagger: 0.2 }, "-=0.4")
        .from(characterButton, { stagger: 0.2 }, "-=0.4");
    }
  }

  // ===== その他フェードイン =====
  const fadeIns = document.querySelectorAll('.js-fade-in');
  fadeIns.forEach(fadeIn => {
    gsap.fromTo(
      fadeIn,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: "power2.out",
        scrollTrigger: {
          trigger: fadeIn,
          start: 'top 80%',
        },
      }
    );
  });
});
