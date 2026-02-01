/**
 * Premier Schools Exhibition - Landing Page
 * JavaScript for interactive components with full accessibility
 */

(function() {
  'use strict';

  // ========================================
  // Utility Functions
  // ========================================
  
  const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  const prefersReducedMotion = () => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  };

  // ========================================
  // Hero Slider Component
  // ========================================
  
  class HeroSlider {
    constructor(element) {
      this.slider = element;
      this.track = element.querySelector('.hero__track');
      this.slides = Array.from(element.querySelectorAll('.hero__slide'));
      this.prevBtn = element.querySelector('.hero__control--prev');
      this.nextBtn = element.querySelector('.hero__control--next');
      this.pauseBtn = element.querySelector('.hero__control--pause');
      this.indicators = Array.from(element.querySelectorAll('.hero__indicator'));
      
      this.currentIndex = 0;
      this.isPlaying = true;
      this.autoplayInterval = null;
      this.autoplayDelay = 5000;
      
      this.touchStartX = 0;
      this.touchEndX = 0;
      
      this.init();
    }
    
    init() {
      // Event listeners
      this.prevBtn.addEventListener('click', () => this.prev());
      this.nextBtn.addEventListener('click', () => this.next());
      this.pauseBtn.addEventListener('click', () => this.togglePlay());
      
      this.indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => this.goToSlide(index));
      });
      
      // Keyboard navigation
      this.slider.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          this.prev();
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          this.next();
        } else if (e.key === ' ') {
          e.preventDefault();
          this.togglePlay();
        }
      });
      
      // Touch/swipe support
      this.slider.addEventListener('touchstart', (e) => {
        this.touchStartX = e.changedTouches[0].screenX;
      });
      
      this.slider.addEventListener('touchend', (e) => {
        this.touchEndX = e.changedTouches[0].screenX;
        this.handleSwipe();
      });
      
      // Pause on hover
      this.slider.addEventListener('mouseenter', () => {
        if (this.isPlaying) {
          this.pause();
        }
      });
      
      this.slider.addEventListener('mouseleave', () => {
        if (this.isPlaying) {
          this.play();
        }
      });
      
      // Start autoplay if motion is not reduced
      if (!prefersReducedMotion()) {
        this.play();
      }
    }
    
    handleSwipe() {
      const swipeThreshold = 50;
      const diff = this.touchStartX - this.touchEndX;
      
      if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
          this.next();
        } else {
          this.prev();
        }
      }
    }
    
    goToSlide(index) {
      // Remove active class from current slide
      this.slides[this.currentIndex].classList.remove('hero__slide--active');
      this.indicators[this.currentIndex].classList.remove('hero__indicator--active');
      this.indicators[this.currentIndex].setAttribute('aria-selected', 'false');
      
      // Update index
      this.currentIndex = index;
      
      // Add active class to new slide
      this.slides[this.currentIndex].classList.add('hero__slide--active');
      this.indicators[this.currentIndex].classList.add('hero__indicator--active');
      this.indicators[this.currentIndex].setAttribute('aria-selected', 'true');
      
      // Announce to screen readers
      this.slider.setAttribute('aria-live', 'polite');
    }
    
    next() {
      const nextIndex = (this.currentIndex + 1) % this.slides.length;
      this.goToSlide(nextIndex);
    }
    
    prev() {
      const prevIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
      this.goToSlide(prevIndex);
    }
    
    play() {
      if (prefersReducedMotion()) return;
      
      this.autoplayInterval = setInterval(() => {
        this.next();
      }, this.autoplayDelay);
    }
    
    pause() {
      clearInterval(this.autoplayInterval);
    }
    
    togglePlay() {
      this.isPlaying = !this.isPlaying;
      
      const pauseIcon = this.pauseBtn.querySelector('.hero__pause-icon');
      const playIcon = this.pauseBtn.querySelector('.hero__play-icon');
      
      if (this.isPlaying) {
        this.play();
        pauseIcon.style.display = 'block';
        playIcon.style.display = 'none';
        this.pauseBtn.setAttribute('aria-label', 'Pause slideshow');
      } else {
        this.pause();
        pauseIcon.style.display = 'none';
        playIcon.style.display = 'block';
        this.pauseBtn.setAttribute('aria-label', 'Play slideshow');
      }
    }
  }

  // ========================================
  // School Logos Continuous Animation
  // ========================================
  
  class SchoolLogosAnimation {
    constructor() {
      this.tracks = Array.from(document.querySelectorAll('.schools__track'));
      this.init();
    }
    
    init() {
      this.tracks.forEach(track => {
        const slings = track.querySelectorAll('.schools__sling');
        
        // Pause animation on hover/focus
        track.addEventListener('mouseenter', () => {
          slings.forEach(sling => {
            sling.style.animationPlayState = 'paused';
          });
        });
        
        track.addEventListener('mouseleave', () => {
          slings.forEach(sling => {
            sling.style.animationPlayState = 'running';
          });
        });
        
        // Pause on focus for keyboard users
        track.addEventListener('focusin', () => {
          slings.forEach(sling => {
            sling.style.animationPlayState = 'paused';
          });
        });
        
        track.addEventListener('focusout', () => {
          slings.forEach(sling => {
            sling.style.animationPlayState = 'running';
          });
        });
        
        // Respect prefers-reduced-motion
        if (prefersReducedMotion()) {
          slings.forEach(sling => {
            sling.style.animationPlayState = 'paused';
          });
        }
      });
    }
  }

  // ========================================
  // Categories Mobile Slider
  // ========================================
  
  class CategoriesSlider {
    constructor(element) {
      this.container = element;
      this.track = element.querySelector('.categories__track');
      this.cards = Array.from(element.querySelectorAll('.categories__card'));
      this.prevBtn = element.querySelector('.categories__control--prev');
      this.nextBtn = element.querySelector('.categories__control--next');
      this.dots = Array.from(element.querySelectorAll('.categories__dot'));
      
      this.currentIndex = 0;
      this.cardWidth = 0;
      
      this.init();
    }
    
    init() {
      // Only activate on mobile/tablet
      this.updateCardWidth();
      
      if (this.prevBtn && this.nextBtn) {
        this.prevBtn.addEventListener('click', () => this.prev());
        this.nextBtn.addEventListener('click', () => this.next());
      }
      
      if (this.dots.length > 0) {
        this.dots.forEach((dot, index) => {
          dot.addEventListener('click', () => this.goToCard(index));
        });
      }
      
      // Touch/swipe support
      let touchStartX = 0;
      let touchEndX = 0;
      
      this.track.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
      });
      
      this.track.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        this.handleSwipe(touchStartX, touchEndX);
      });
      
      // Update on resize
      window.addEventListener('resize', debounce(() => {
        this.updateCardWidth();
        this.goToCard(this.currentIndex);
      }, 250));
      
      // Intersection Observer for scroll position
      if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const index = this.cards.indexOf(entry.target);
              this.updateDots(index);
            }
          });
        }, {
          root: this.track,
          threshold: 0.5
        });
        
        this.cards.forEach(card => observer.observe(card));
      }
    }
    
    updateCardWidth() {
      if (window.innerWidth < 1024) {
        this.cardWidth = this.track.scrollWidth / this.cards.length;
      }
    }
    
    handleSwipe(startX, endX) {
      const swipeThreshold = 50;
      const diff = startX - endX;
      
      if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
          this.next();
        } else {
          this.prev();
        }
      }
    }
    
    goToCard(index) {
      if (window.innerWidth >= 1024) return; // Desktop - no sliding
      
      this.currentIndex = index;
      const scrollPosition = this.cardWidth * index;
      
      this.track.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      });
      
      this.updateDots(index);
    }
    
    updateDots(index) {
      if (this.dots.length === 0) return;
      
      this.dots.forEach((dot, i) => {
        if (i === index) {
          dot.classList.add('categories__dot--active');
          dot.setAttribute('aria-selected', 'true');
        } else {
          dot.classList.remove('categories__dot--active');
          dot.setAttribute('aria-selected', 'false');
        }
      });
    }
    
    next() {
      const maxIndex = this.cards.length - 1;
      const nextIndex = Math.min(this.currentIndex + 1, maxIndex);
      this.goToCard(nextIndex);
    }
    
    prev() {
      const prevIndex = Math.max(this.currentIndex - 1, 0);
      this.goToCard(prevIndex);
    }
  }

  // ========================================
  // Exhibition Slider Component
  // ========================================
  
  class ExhibitionSlider {
    constructor(element) {
      this.slider = element;
      this.track = element.querySelector('.exhibition__track');
      this.slides = Array.from(element.querySelectorAll('.exhibition__slide'));
      this.prevBtn = element.querySelector('.exhibition__control--prev');
      this.nextBtn = element.querySelector('.exhibition__control--next');
      this.indicators = Array.from(element.querySelectorAll('.exhibition__indicator'));
      
      this.currentIndex = 0;
      this.autoplayInterval = null;
      this.autoplayDelay = 6000;
      this.isPlaying = true;
      
      this.touchStartX = 0;
      this.touchEndX = 0;
      
      this.init();
    }
    
    init() {
      // Event listeners
      this.prevBtn.addEventListener('click', () => this.prev());
      this.nextBtn.addEventListener('click', () => this.next());
      
      this.indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => this.goToSlide(index));
      });
      
      // Keyboard navigation
      this.slider.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          this.prev();
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          this.next();
        }
      });
      
      // Touch/swipe support
      this.slider.addEventListener('touchstart', (e) => {
        this.touchStartX = e.changedTouches[0].screenX;
      });
      
      this.slider.addEventListener('touchend', (e) => {
        this.touchEndX = e.changedTouches[0].screenX;
        this.handleSwipe();
      });
      
      // Pause on hover
      this.slider.addEventListener('mouseenter', () => {
        this.pause();
      });
      
      this.slider.addEventListener('mouseleave', () => {
        if (this.isPlaying) {
          this.play();
        }
      });
      
      // Start autoplay if motion is not reduced
      if (!prefersReducedMotion()) {
        this.play();
      }
    }
    
    handleSwipe() {
      const swipeThreshold = 50;
      const diff = this.touchStartX - this.touchEndX;
      
      if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
          this.next();
        } else {
          this.prev();
        }
      }
    }
    
    goToSlide(index) {
      // Remove active class from current slide
      this.slides[this.currentIndex].classList.remove('exhibition__slide--active');
      this.indicators[this.currentIndex].classList.remove('exhibition__indicator--active');
      this.indicators[this.currentIndex].setAttribute('aria-selected', 'false');
      
      // Update index
      this.currentIndex = index;
      
      // Add active class to new slide
      this.slides[this.currentIndex].classList.add('exhibition__slide--active');
      this.indicators[this.currentIndex].classList.add('exhibition__indicator--active');
      this.indicators[this.currentIndex].setAttribute('aria-selected', 'true');
    }
    
    next() {
      const nextIndex = (this.currentIndex + 1) % this.slides.length;
      this.goToSlide(nextIndex);
    }
    
    prev() {
      const prevIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
      this.goToSlide(prevIndex);
    }
    
    play() {
      if (prefersReducedMotion()) return;
      
      this.autoplayInterval = setInterval(() => {
        this.next();
      }, this.autoplayDelay);
    }
    
    pause() {
      clearInterval(this.autoplayInterval);
    }
  }

  // ========================================
  // Smooth Scroll for Anchor Links
  // ========================================
  
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        // Ignore if it's just "#"
        if (href === '#') return;
        
        const target = document.querySelector(href);
        
        if (target) {
          e.preventDefault();
          
          const headerHeight = document.querySelector('.header').offsetHeight;
          const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
          
          window.scrollTo({
            top: targetPosition,
            behavior: prefersReducedMotion() ? 'auto' : 'smooth'
          });
          
          // Set focus to target for accessibility
          target.setAttribute('tabindex', '-1');
          target.focus();
        }
      });
    });
  }

  // ========================================
  // Lazy Loading Images (Performance)
  // ========================================
  
  function initLazyLoading() {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
            }
            observer.unobserve(img);
          }
        });
      });
      
      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });
    }
  }

  // ========================================
  // Header Scroll Behavior
  // ========================================
  
  function initHeaderScroll() {
    const header = document.querySelector('.header');
    let lastScroll = 0;
    
    window.addEventListener('scroll', debounce(() => {
      const currentScroll = window.pageYOffset;
      
      if (currentScroll > lastScroll && currentScroll > 100) {
        // Scrolling down
        header.style.transform = 'translateY(-100%)';
      } else {
        // Scrolling up
        header.style.transform = 'translateY(0)';
      }
      
      lastScroll = currentScroll;
    }, 100));
  }

  // ========================================
  // Stats Counter Animation
  // ========================================
  
  function initStatsAnimation() {
    const stats = document.querySelectorAll('.stats__item');
    
    if ('IntersectionObserver' in window) {
      const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            statsObserver.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.2
      });
      
      stats.forEach(stat => {
        statsObserver.observe(stat);
      });
    }
  }

  // ========================================
  // Accessibility Enhancements
  // ========================================
  
  function initAccessibility() {
    // Announce dynamic content changes to screen readers
    const liveRegions = document.querySelectorAll('[aria-live]');
    liveRegions.forEach(region => {
      // Ensure live regions are properly announced
      region.setAttribute('aria-atomic', 'true');
    });
    
    // Ensure all interactive elements are keyboard accessible
    const interactiveElements = document.querySelectorAll('button, a, input, select, textarea');
    interactiveElements.forEach(el => {
      if (!el.hasAttribute('tabindex') && el.tagName !== 'A') {
        el.setAttribute('tabindex', '0');
      }
    });
  }

  // ========================================
  // Initialize All Components
  // ========================================
  
  function init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
      return;
    }
    
    // Initialize Hero Slider
    const heroSlider = document.querySelector('.hero__slider');
    if (heroSlider) {
      new HeroSlider(heroSlider);
    }
    
    // Initialize School Logos Animation
    new SchoolLogosAnimation();
    
    // Initialize Categories Slider
    const categoriesSlider = document.querySelector('.categories__slider');
    if (categoriesSlider) {
      new CategoriesSlider(categoriesSlider);
    }
    
    // Initialize Exhibition Slider
    const exhibitionSlider = document.querySelector('.exhibition__slider');
    if (exhibitionSlider) {
      new ExhibitionSlider(exhibitionSlider);
    }
    
    // Initialize other features
    initSmoothScroll();
    initLazyLoading();
    initHeaderScroll();
    initStatsAnimation();
    initAccessibility();
    
    // Log initialization for debugging
    console.log('Premier Schools Exhibition - Landing Page Initialized');
  }
  
  // Start initialization
  init();
  
})();