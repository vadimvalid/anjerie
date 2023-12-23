/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!**************************!*\
  !*** ./src/js/script.js ***!
  \**************************/
function toggleBurger() {
  const burger = document.querySelector(".burger");
  const menu = document.querySelector(".menu");

  burger.addEventListener("click", () => {
    burger.classList.toggle("open");
  });
}

if (window.matchMedia("(max-width: 768px)").matches) {
  toggleBurger();
}

/******/ })()
;
//# sourceMappingURL=script.js.map