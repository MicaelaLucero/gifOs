document.addEventListener("DOMContentLoaded", async () => {
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

  const renderMyGifs = gifs => {
    let $container = document.querySelector(".container_my_guifos");

    if (Array.isArray(gifs)) {
      for (let gif of gifs) {
        let img = document.createElement("img");
        img.setAttribute("width", "280");
        img.setAttribute("height", "296");
        img.setAttribute("style", "margin: 15px 15px 15px 50px");
        img.src = gif.images.downsized.url;
        img.alt = gif.title;
        $container.appendChild(img);
      }
    } else {
      let img = document.createElement("img");
      img.setAttribute("width", "280");
      img.setAttribute("height", "296");
      img.setAttribute("style", "margin: 15px 15px 15px 50px");
      img.src = gifs.images.downsized.url;
      img.alt = gifs.title;
      $container.appendChild(img);
    }
  };

  const myGifs = JSON.parse(localStorage.getItem("myGifs")) || [];
  localStorage.setItem("myGifs", JSON.stringify(myGifs));
  const gifs = await getData(`${api_url}?api_key=${api_key}&ids=${myGifs}`);
  renderMyGifs(gifs);
});
