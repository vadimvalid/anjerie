function toggleBurger() {
  const burger = document.querySelector(".burger");
  const header = document.querySelector(".header .wrapper");

  burger.addEventListener("click", () => {
    burger.classList.toggle("open");
    header.classList.toggle("open");
  });
}

if (window.matchMedia("(max-width: 768px)").matches) {
  toggleBurger();
}
