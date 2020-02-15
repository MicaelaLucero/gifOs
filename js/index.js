document.addEventListener("DOMContentLoaded", async () => {
  document.querySelector(".night").addEventListener("click", () => {
    const body = document.querySelector("body");
    body.classList.add("dark");
    body.classList.remove("light");
  })

  document.querySelector(".day").addEventListener("click", () => {
    const body = document.querySelector("body");
    body.classList.add("light");
    body.classList.remove("dark");
  })


  const search_input = document.querySelector("#search_input");
  const search_button = document.querySelector("#search_button");
  const write_input = document.querySelector(".write_input")

  search_input.addEventListener('keyup', () => {
    write_input.style.display = 'block'
  })

  const gifs = await getData(`${endpoints.search}`);
  renderGifs(gifs);

  const anotherGifs = await getData(`${endpoints.trending}`)
  const trendingGifs = anotherGifs.splice(0, 15)
  renderGifs(trendingGifs)

  search_button.addEventListener("click", async e => {
    write_input.style.display = 'none'
    let value = search_input.value.trim();
    if (!value) return;

    const gifs = await getData(`${endpoints.search}&q=${value}`);
    renderGifs(gifs);

    scroll = document.getElementById("search_container")
    scroll.scrollIntoView({behavior: 'smooth'})
  })

  const gifRandom = (tag, imgId) => {getId(`${endpoints.random}` + tag, imgId)}

  gifRandom('desencanto', 'img1')
  gifRandom('futurama', 'img2')
  gifRandom('simpsons', 'img3')
  gifRandom('dibujos animados', 'img4')
})
