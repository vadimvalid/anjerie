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

const textAnimations = () => {
  const headers = document.querySelectorAll(".header-animated");
  const options = {
    root: null,
    threshold: 0.1,
  };

  const headerObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const { target } = entry;

        const titles = target.querySelectorAll("h1,h2");

        const { delay = 0 } = target.dataset;

        for (let i = 0; i < titles.length; i++) {
          let titleElement = titles[i];

          titleElement.style.animationName = "headerAnimation";
          titleElement.style.animationDuration = `1s`;
          titleElement.style.animationFillMode = "forwards";
        }
      }
    });
  }, options);

  headers.forEach((header) => headerObserver.observe(header));
};

const blockAnimatons = () => {
  const blocks = document.querySelectorAll(".items .item");

  const objOptions = {
    root: null,
    threshold: 0.3,
  };

  const blockObserver = new IntersectionObserver(callBackFunction, objOptions);

  blocks.forEach((block) => {
    if (block) {
      blockObserver.observe(block);
    }
  });

  function callBackFunction(entries, observer) {
    entries.forEach((entry) => {
      const curBlockName = entry.target.getAttribute("class");
      if (entry.isIntersecting) {
        entry.target.classList.remove("hidden");
      } else {
        entry.target.classList.add("hidden");
      }
    });
  }
};

textAnimations();
blockAnimatons();
