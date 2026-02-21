/**
 * ProfileApp — 프로필 사이트 인터랙션 관리
 */
class ProfileApp {
  constructor() {
    this.cacheElements();
    this.bindEvents();
    this.initIntersectionObserver();
  }

  /** DOM 요소 캐싱 */
  cacheElements() {
    this.nav = document.getElementById('nav');
    this.hamburger = document.getElementById('hamburger');
    this.mobileMenu = document.getElementById('mobileMenu');
    this.navLinks = document.querySelectorAll('.nav-link');
    this.mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    this.sections = document.querySelectorAll('section[id]');
    this.skillBars = document.querySelectorAll('.skill-bar-fill');
  }

  /** 이벤트 바인딩 */
  bindEvents() {
    // 스크롤 이벤트 (쓰로틀링 적용)
    let scrollTicking = false;
    window.addEventListener('scroll', () => {
      if (!scrollTicking) {
        requestAnimationFrame(() => {
          this.handleNavScroll();
          this.updateActiveNav();
          scrollTicking = false;
        });
        scrollTicking = true;
      }
    });

    // 햄버거 메뉴 토글
    this.hamburger.addEventListener('click', () => this.handleMobileMenu());

    // 네비게이션 링크 부드러운 스크롤
    this.navLinks.forEach(link => {
      link.addEventListener('click', (e) => this.handleSmoothScroll(e));
    });
  }

  /** 스크롤 시 네비게이션 글래스모피즘 전환 */
  handleNavScroll() {
    if (window.scrollY > 50) {
      this.nav.classList.add('scrolled');
    } else {
      this.nav.classList.remove('scrolled');
    }
  }

  /** 모바일 햄버거 메뉴 토글 */
  handleMobileMenu() {
    this.hamburger.classList.toggle('active');
    this.mobileMenu.classList.toggle('open');
  }

  /** 부드러운 앵커 스크롤 + 모바일 메뉴 닫기 */
  handleSmoothScroll(e) {
    const href = e.currentTarget.getAttribute('href');
    if (!href.startsWith('#')) return;

    e.preventDefault();
    const target = document.querySelector(href);
    if (!target) return;

    // 네비게이션 높이 보정
    const navHeight = this.nav.offsetHeight;
    const targetPosition = target.offsetTop - navHeight;

    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });

    // 모바일 메뉴 열려있으면 닫기
    if (this.mobileMenu.classList.contains('open')) {
      this.hamburger.classList.remove('active');
      this.mobileMenu.classList.remove('open');
    }
  }

  /** IntersectionObserver로 섹션 진입 애니메이션 */
  initIntersectionObserver() {
    const observerOptions = {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');

          // 스킬 섹션 진입 시 바 애니메이션
          if (entry.target.closest('#skills')) {
            this.animateSkillBars();
          }

          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // 애니메이션 대상 요소 관찰
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      observer.observe(el);
    });
  }

  /** 스킬 바 채움 애니메이션 */
  animateSkillBars() {
    this.skillBars.forEach((bar, index) => {
      setTimeout(() => {
        bar.classList.add('animated');
      }, index * 200);
    });
  }

  /** 현재 스크롤 위치에 맞는 네비게이션 항목 하이라이트 */
  updateActiveNav() {
    const scrollPos = window.scrollY + window.innerHeight / 3;

    let currentSection = '';
    this.sections.forEach(section => {
      if (section.offsetTop <= scrollPos) {
        currentSection = section.getAttribute('id');
      }
    });

    this.navLinks.forEach(link => {
      const sectionId = link.getAttribute('data-section');
      if (sectionId === currentSection) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }
}

// DOMContentLoaded 시 앱 초기화
document.addEventListener('DOMContentLoaded', () => {
  new ProfileApp();
});
