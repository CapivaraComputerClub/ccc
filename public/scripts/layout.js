document.addEventListener("DOMContentLoaded", function () {
  const navLinks = document.querySelectorAll(".nav-link");
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const sidebar = document.getElementById("sidebar");
  const mobileOverlay = document.getElementById("mobile-overlay");

  mobileMenuBtn.addEventListener("click", function () {
    sidebar.classList.toggle("-translate-x-full");
    mobileOverlay.classList.toggle("hidden");
  });

  mobileOverlay.addEventListener("click", function () {
    sidebar.classList.add("-translate-x-full");
    mobileOverlay.classList.add("hidden");
  });

  let actualPath = window.location.pathname;
  console.log("Actual Path:", actualPath);
  navLinks.forEach((link) => {
    if (link.getAttribute("href") === actualPath) {
      link.classList.add("active");
      link.classList.add(
        "bg-accent/10",
        "border-l-2",
        "border-accent",
        "rounded-r"
      );
      link.classList.remove("text-muted");

      const linkIcon = link.querySelector("i");
      if (linkIcon) {
        linkIcon.classList.remove("text-muted");
        linkIcon.classList.add("text-accent");
      }
    } else {
      link.classList.remove("active");
      link.classList.remove(
        "bg-accent/10",
        "border-l-2",
        "border-accent",
        "rounded-r"
      );
      link.classList.add("text-muted");

      const linkIcon = link.querySelector("i");
      if (linkIcon) {
        linkIcon.classList.add("text-muted");
        linkIcon.classList.remove("text-accent");
      }
    }
  });
});
