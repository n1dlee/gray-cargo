document.addEventListener("DOMContentLoaded", () => {
  function setupNavigation() {
    const navToggle = document.querySelector(".nav-toggle");
    const navClose = document.querySelector(".nav-close");
    const navDropdown = document.querySelector(".nav-dropdown");

    navToggle.addEventListener("click", () => {
      if (navDropdown.classList.contains("show")) {
        navDropdown.classList.remove("show");
        navToggle.classList.remove("show");
      } else {
        navDropdown.classList.add("show");
        navToggle.classList.add("show");
      }
    });

    navClose.addEventListener("click", () => {
      navDropdown.classList.remove("show");
    });

    document.addEventListener("click", (event) => {
      if (!event.target.closest(".nav-menu")) {
        navDropdown.classList.remove("show");
      }
    });
  }

  function addRandomShapes() {
    const shapes = ["circle", "square", "triangle"];
    const colors = ["#4831D4", "#CCF381", "#FFFFFF"];
    const container = document.querySelector(".hero-section");

    for (let i = 0; i < 20; i++) {
      const shape = document.createElement("div");
      shape.classList.add("shape", "hero-shape");
      const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
      shape.style.backgroundColor =
        colors[Math.floor(Math.random() * colors.length)];
      shape.style.width = `${Math.random() * 30 + 10}px`;
      shape.style.height = shape.style.width;
      shape.style.borderRadius =
        randomShape === "circle"
          ? "50%"
          : randomShape === "square"
          ? "0"
          : "0 50% 50% 50%";

      // Устанавливаем случайные left и top, убеждаемся, что фигуры внутри контейнера
      const containerRect = container.getBoundingClientRect();
      const maxLeft = containerRect.width - parseInt(shape.style.width);
      const maxTop = containerRect.height - parseInt(shape.style.height);
      shape.style.left = `${Math.random() * maxLeft}px`;
      shape.style.top = `${Math.random() * maxTop}px`;

      shape.style.animationDuration = `${Math.random() * 10 + 10}s`;
      shape.style.animationDelay = `${Math.random() * 5}s`;
      container.appendChild(shape);
    }
  }

  function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const targetId = this.getAttribute("href").substring(1);
        if (targetId) {
          const targetElement = document.getElementById(targetId);
          if (targetElement) {
            targetElement.scrollIntoView({ behavior: "smooth" });
          }
        }
      });
    });
  }

  function updateHeaderColor() {
    const logoLink = document.querySelector(".logo a");

    const currentSectionId = window.location.pathname.substring(1) || "hero";

    switch (currentSectionId) {
      case "hero":
      case "work":
        logoLink.style.color = "#ccf381";
        break;
      case "about":
      case "contact":
        logoLink.style.color = "#4831d4";
        break;
      default:
        logoLink.style.color = "#ccf381";
    }
  }

  function animateHeroElements() {
    const heroDescriptions = document.querySelectorAll(".hero-description");
    const ctaButton = document.querySelector(".cta-button");

    heroDescriptions.forEach((desc, index) => {
      desc.style.animationDelay = `${0.6 + index * 0.2}s`;
      desc.classList.add("animate-on-scroll");
    });

    ctaButton.style.animationDelay = `${1 + heroDescriptions.length * 0.2}s`;
    ctaButton.classList.add("animate-on-scroll");
  }

  function animateOnScroll() {
    const elements = document.querySelectorAll(".animate-on-scroll");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.animationName = "fadeInUp";
            entry.target.style.animationDuration = "0.8s";
            entry.target.style.animationFillMode = "forwards";
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    elements.forEach((element) => {
      observer.observe(element);
    });
  }

  function init() {
    setupNavigation();
    addRandomShapes();
    setupSmoothScroll();
    animateHeroElements();
    animateOnScroll();
    updateHeaderColor();
  }

  init();
});
