document.addEventListener("DOMContentLoaded", function () {
  // ===== GSAP・ScrollTrigger 初期化 =====
  gsap.registerPlugin(ScrollTrigger);

  // ===== 初回ロード制御 =====
  const isFirstLoad = sessionStorage.getItem('isFirstLoad');

  // ===== 初期要素取得 =====
  function getElements() {
    return {
      loader: document.querySelector('.js-loading'),
      loaderLogo: document.querySelector('.loading__logo'),
      outer: document.querySelector('.outer'),
      header: document.querySelector('.header'),
      particleMv: document.querySelector('.particle__bg'),
      mvFlag: document.querySelector('.mv__flag'),
      mvScroll: document.querySelector('.mv__scroll'),
      mvCountdown: document.querySelector('.mv__countdown'),
    };
  }

  // ===== ローディング後に実行するアニメーション =====
  function runMvAnimation(elements) {
    const { outer, header, particleMv, mvFlag, mvScroll, mvCountdown } = elements;

    if (!outer || !header || !particleMv || !mvFlag || !mvScroll || !mvCountdown) return;

    // 初期値リセット
    outer.style.opacity = 1;

    const tl = gsap.timeline();

    tl.fromTo(header, {
      opacity: 0,
    }, {
      duration: 1,
      opacity: 1,
      ease: "power3.inOut",
    })
      .fromTo(particleMv, {
        opacity: 0,
      }, {
        duration: 1,
        opacity: 1,
        ease: "power3.inOut",
      }, "-=0.8")
      .fromTo(mvFlag, {
        opacity: 0,
        y: 40,
      }, {
        y: 0,
        duration: 0.8,
        opacity: 1,
        ease: "power2.out",
      }, "-=0.3")
      .fromTo(mvScroll, {
        opacity: 0,
        y: 40,
      }, {
        y: 0,
        duration: 0.8,
        opacity: 1,
        ease: "power2.out",
      }, "-=0.1")
      .fromTo(mvCountdown, {
        opacity: 0,
        y: 40,
      }, {
        y: 0,
        duration: 0.8,
        opacity: 1,
        ease: "power3.out",
      }, "-=0.8");
  }

  // ===== ページ読込時ローディングアニメーション =====
  window.addEventListener('load', function () {
    const elements = getElements();
    const { loader, loaderLogo, header, particleMv, mvFlag, mvScroll, mvCountdown } = elements;

    if (!loader || !loaderLogo || !header || !particleMv || !mvFlag || !mvScroll || !mvCountdown) return;

    gsap.set([header, particleMv, mvFlag, mvScroll, mvCountdown], { opacity: 0 });

    if (!isFirstLoad) {
      loader.style.display = "grid";
      const tl = gsap.timeline();

      tl.to(loaderLogo, {
        duration: 1.3,
        opacity: 1,
        translateY: 0,
        ease: "power3.out",
      })
        .to(loader, {
          duration: 1,
          clipPath: "inset(0% 100% 0% 0%)",
          ease: "power2.inOut",
          onComplete: () => {
            loader.style.display = "none";
            runMvAnimation(elements);
            sessionStorage.setItem('isFirstLoad', true);
          },
        });
    } else {
      loader.style.display = "none";
      runMvAnimation(elements);
    }
  });

  // ===== ページトップへ戻る =====
  const topBtn = document.querySelector('.js-totop');
  if (topBtn) {
    topBtn.addEventListener('click', function (event) {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ===== ハンバーガーメニュー =====
  // ===== 初期要素取得 =====
  function getHamburgerElements() {
    return {
      hamburger: document.querySelector(".js-hamburger"),
      drawer: document.querySelector(".js-drawer"),
      header: document.querySelector(".js-header"),
      drawerLinks: document.querySelectorAll(".js-drawer a[href]"),
    };
  }

  function closeHamburgerMenu(elements) {
    const { hamburger, drawer } = elements;

    // フォーカスをハンバーガーボタンに戻す
    hamburger.focus();

    document.body.classList.remove("is-noscroll");
    hamburger.classList.remove("is-open");
    drawer.classList.remove("is-open");
    hamburger.setAttribute("aria-expanded", "false");
    hamburger.setAttribute("aria-label", "メニューを開く");

    // inert 属性でアクセシビリティを確保
    drawer.setAttribute("inert", "");
    drawer.removeAttribute("aria-hidden");
  }

  function openHamburgerMenu(elements) {
    const { hamburger, drawer } = elements;

    document.body.classList.add("is-noscroll");
    hamburger.classList.add("is-open");
    drawer.classList.add("is-open");
    hamburger.setAttribute("aria-expanded", "true");
    hamburger.setAttribute("aria-label", "メニューを閉じる");

    // inert 属性を解除
    drawer.removeAttribute("inert");
    drawer.setAttribute("aria-hidden", "false");
  }

  function initHamburgerMenu() {
    const elements = getHamburgerElements();
    const { hamburger, drawer, drawerLinks } = elements;

    if (hamburger && drawer) {
      // ハンバーガーボタンのクリックイベント
      hamburger.addEventListener("click", function () {
        const isOpen = drawer.classList.contains("is-open");
        if (isOpen) {
          closeHamburgerMenu(elements);
        } else {
          openHamburgerMenu(elements);
        }
      });

      // ドロワー全体をクリックした場合に閉じる
      drawer.addEventListener("click", function () {
        closeHamburgerMenu(elements);
      });

      // ドロワー内のリンクをクリックした場合に閉じる
      drawerLinks.forEach(link => {
        link.addEventListener("click", function () {
          closeHamburgerMenu(elements);
        });
      });
    }
  }

  initHamburgerMenu();

  // ===== パーティクル初期化 =====
  particlesJS("js-particle-secondary", {
    "particles": {
      "number": {
        "value": 50,
        "density": {
          "enable": true,
          "value_area": 2500
        }
      },
      "color": {
        "value": ['#004664', '#002F43', '#E7F1F5', '#CCDAE0']
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

  particlesJS("js-particle-primary", {
    "particles": {
      "number": {
        "value": 30,
        "density": {
          "enable": true,
          "value_area": 3000
        }
      },
      "color": {
        "value": ['#AC0C2D', '#c5556c', '#b72a47', '#EDCCD4']
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

  // ===== スクロールしたらヘッダーにクラス付与 =====
  document.addEventListener('scroll', function () {
    const header = document.querySelector('.js-header');
    const scrollTop = window.scrollY || document.documentElement.scrollTop;

    if (scrollTop > 0) {
      header.classList.add('is-scroll');
    } else {
      header.classList.remove('is-scroll');
    }
  });

  // ===== ヘッダーの現在地表示 =====
  const sections = document.querySelectorAll('section');
  const navItems = document.querySelectorAll('.header__nav-item');

  const updateCurrentNav = () => {
    let currentSection = null;

    // 現在のセクションを検出
    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      if (rect.top < window.innerHeight / 2 && rect.bottom > window.innerHeight / 2) {
        currentSection = section.id;
      }
    });

    navItems.forEach((item) => {
      const link = item.querySelector('a');
      if (link && link.getAttribute('href').substring(1) === currentSection) {
        item.classList.add('is-current');
      } else {
        item.classList.remove('is-current');
      }
    });
  };

  window.addEventListener('scroll', updateCurrentNav);
  window.addEventListener('resize', updateCurrentNav);

  updateCurrentNav();

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

  // ===== Episodeスライダー =====
  Splide.defaults = {
    type: 'loop',
    fixedWidth: "20.625rem",
    focus: 'center',
    arrows: false,
    gap: 20,
  };

  let splideInstances = [];

  // Splide を初期化して配列に格納
  document.querySelectorAll('.splide').forEach(splide => {
    const instance = new Splide(splide, {
      autoScroll: {
        speed: splide.classList.contains('js-top-slider') ? 1 : -1,
      },
    }).mount(window.splide.Extensions);

    splideInstances.push(instance);
  });

  // ===== モーダル =====
    const flipCards = document.querySelectorAll(".flip-card");
    const modals = document.querySelectorAll(".modal");
    const closeButtons = document.querySelectorAll(".modal__close");
    let isModalAnimating = false;

    // バックドロップクリックでモーダルを閉じる
    function handleBackdropClick(event) {
      if (event.target.classList.contains('modal')) {
        closeModal(event.target);
      }
    }

    // キーボードのEscキーでモーダルを閉じる
    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        event.preventDefault();
        const modal = document.querySelector('.modal[data-active="true"]');
        if (modal) {
          closeModal(modal);
        }
      }
    }

    // モーダルを開く関数
    async function openModal(modal) {
      if (isModalAnimating || modal.dataset.active === "true") return;
      isModalAnimating = true;

      // スライダーを一時停止
      splideInstances.forEach(instance => instance.Components.AutoScroll.pause());

      modals.forEach(m => m.removeAttribute("data-active"));
      modal.setAttribute("data-active", "true");

      // イベントリスナーを追加
      document.addEventListener('keydown', handleKeyDown);
      modal.addEventListener('click', handleBackdropClick);

      // CSSアニメーションの時間に合わせる
      await new Promise(resolve => setTimeout(resolve, 300));
      isModalAnimating = false;
    }

    // モーダルを閉じる関数
    async function closeModal(modal) {
      if (isModalAnimating || modal.dataset.active !== "true") return;
      isModalAnimating = true;

      // スライダーを再開
      splideInstances.forEach(instance => instance.Components.AutoScroll.play());

      modal.removeAttribute("data-active");

      // CSSアニメーションの時間に合わせる
      await new Promise(resolve => setTimeout(resolve, 300));

      // イベントリスナーを削除
      document.removeEventListener('keydown', handleKeyDown);
      modal.removeEventListener('click', handleBackdropClick);

      isModalAnimating = false;
    }

    // モーダルを開くイベントの設定
    flipCards.forEach(card => {
      card.addEventListener("click", () => {
        const modalId = card.getAttribute("data-modal-open");
        const modal = document.getElementById(modalId);
        if (modal) {
          openModal(modal);
        }
      });
    });

    // モーダルを閉じるイベントの設定
    closeButtons.forEach(button => {
      button.addEventListener("click", (event) => {
        const modal = event.target.closest(".modal");
        if (modal) {
          closeModal(modal);
        }
      });
    });

  // ===== メッセージ関連フェードイン =====
  const messageElements = {
    title: document.querySelector(".message__title"),
    text: document.querySelector(".message__text-wrap"),
    topImg: document.querySelector(".message__top-img"),
    mainImg: document.querySelector(".message__main-img"),
    bottomImg: document.querySelector(".message__bottom-img"),
  };

  if (
    messageElements.title &&
    messageElements.text &&
    messageElements.topImg &&
    messageElements.mainImg &&
    messageElements.bottomImg
  ) {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: messageElements.title,
        start: "top 80%",
      },
      defaults: {
        y: 30,
        opacity: 0,
        duration: 0.7,
        ease: "power2.out",
      },
    });

    tl.from(messageElements.title, {})
      .from(messageElements.mainImg, {}, "-=0.5")
      .from(messageElements.text, {}, "-=0.5")
      .from(messageElements.topImg, {}, "-=0.5")
      .from(messageElements.bottomImg, {}, "-=0.5");
  }

  // ===== ヒストリー関連フェードイン =====
  const historyElements = {
    title: document.querySelector(".history__title"),
    bg: document.querySelector(".history__wrapper"),
    list: document.querySelector(".history__content"),
  };

  if (historyElements.title && historyElements.bg && historyElements.list) {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: historyElements.title,
        start: "top 80%",
      },
      defaults: {
        y: 30,
        opacity: 0,
        duration: 0.7,
        ease: "power2.out",
      },
    });

    tl.from(historyElements.title, {})
      .add(() => {
        historyElements.bg.classList.add("js-fade-bg");
      }, "-=0.5")
      .from(historyElements.list, {}, "-=0.2");
  }


  // ===== エピソード関連フェードイン =====
  const episodeElements = {
    title: document.querySelector(".episode__title"),
    text: document.querySelector(".episode__read"),
    compass: document.querySelector(".episode__container"),
    content: document.querySelector(".episode__content"),
  };

  if (episodeElements.title && episodeElements.text && episodeElements.compass && episodeElements.content) {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: episodeElements.title,
        start: "top 80%",
      },
      defaults: {
        y: 30,
        opacity: 0,
        duration: 0.7,
        ease: "power2.out",
      },
    });

    tl.from(episodeElements.title, {})
      .from([episodeElements.text, episodeElements.compass], {}, "-=0.4")
      .from(episodeElements.content, {}, "-=0.3");
  }


  // ===== キャラクター関連フェードイン =====
  const characterElements = {
    img: document.querySelector(".character__main-img"),
    title: document.querySelector(".character__title"),
    text: document.querySelector(".character__text"),
    button: document.querySelector(".character__buttons"),
  };

  if (characterElements.img && characterElements.title && characterElements.text && characterElements.button) {
    const isSP = window.matchMedia("(max-width: 767px)").matches;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: characterElements.img,
        start: "top 80%",
      },
      defaults: {
        y: 30,
        opacity: 0,
        duration: 0.7,
        ease: "power2.out",
      },
    });

    // アニメーションの順番を設定
    const animationOrder = isSP
      ? [characterElements.title, characterElements.img, characterElements.text, characterElements.button]
      : [characterElements.img, characterElements.title, characterElements.text, characterElements.button];

    // アニメーションを順番に適用
    animationOrder.forEach((element, index) => {
      tl.from(element, {}, index === 0 ? undefined : "-=0.4");
    });
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
