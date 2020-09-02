document.addEventListener("DOMContentLoaded", async () => {
  document.querySelector(".night").addEventListener("click", () => {
    const body = document.querySelector("body");
    body.classList.add("dark");
    body.classList.remove("light");
    localStorage.setItem("color-theme", "dark-mode");
  });

  document.querySelector(".day").addEventListener("click", () => {
    const body = document.querySelector("body");
    body.classList.add("light");
    body.classList.remove("dark");
    localStorage.setItem("color-theme", "light-mode");
  });

  const search_input = document.querySelector("#search_input");
  const search_button = document.querySelector("#search_button");
  const write_input = document.querySelector(".write_input");
  const watch1 = document.querySelector(".watch_more1");
  const watch2 = document.querySelector(".watch_more2");
  const watch3 = document.querySelector(".watch_more3");
  const watch4 = document.querySelector(".watch_more4");

  search_input.addEventListener("keyup", () => {
    write_input.style.display = "block";
  });

  const gifs = await getData(`${endpoints.search}`);
  renderGifs(gifs);

  const anotherGifs = await getData(`${endpoints.trending}`);
  const trendingGifs = anotherGifs.splice(0, 16);
  renderGifs(trendingGifs);

  search_input.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      search_button.click();
    }
  });

  search_button.addEventListener("click", async e => {
    write_input.style.display = "none";
    let value = search_input.value.trim();
    if (!value) return;

    const gifs = await getData(`${endpoints.search}&q=${value}`);
    renderGifs(gifs);

    scroll = document.getElementById("search_container");
    scroll.scrollIntoView({ behavior: "smooth" });
  });

  const gifRandom = (tag, imgId) => {
    getId(`${endpoints.random}` + tag, imgId);
  };

  watch1.addEventListener("click", async () => {
    const gifs = await getData(`${endpoints.search}&q=desencanto`);
    renderGifs(gifs);
  });
  watch2.addEventListener("click", async () => {
    const gifs = await getData(`${endpoints.search}&q=futurama`);
    renderGifs(gifs);
  });
  watch3.addEventListener("click", async () => {
    const gifs = await getData(`${endpoints.search}&q=simpsons`);
    renderGifs(gifs);
  });
  watch4.addEventListener("click", async () => {
    const gifs = await getData(`${endpoints.search}&q=dibujos animados`);
    renderGifs(gifs);
  });

  gifRandom("desencanto", "img1");
  gifRandom("futurama", "img2");
  gifRandom("simpsons", "img3");
  gifRandom("dibujos animados", "img4");

  const body = document.querySelector("body");
  const bodyclass = localStorage.getItem("color-theme");

  let activateThemes = bodyclass => {
    if (bodyclass == "dark-mode") {
      body.classList.add("dark");
      body.classList.remove("light");
    } else if (bodyclass == "light-mode") {
      body.classList.add("light");
      body.classList.remove("dark");
    } else {
      body.classList.add("light");
    }
  };

  activateThemes(bodyclass);
});
