const api_url = 'https://api.giphy.com/v1/gifs'
const api_key = 'GjMtnsYfw4yifaFLVJZhOp5AkyOojh4T'
const endpoints = {
    search: `${api_url}/search?api_key=${api_key}`,
    trending: `${api_url}/trending?api_key=${api_key}`,
    random: `${api_url}/random?api_key=${api_key}&tag=`,
    upload: `https://upload.giphy.com/v1/gifs?api_key=${api_key}`
}

const getData = async endpoint => {
    try {
        const res = await fetch(endpoint)
        const data = await res.json()
        return data.data
    } catch (error) {
        console.log(error)
    }
}

const source = (imgId, gifId) => {
    document.getElementById(imgId).src = 'https://i.giphy.com/media/' + gifId + '/giphy.webp'
 }

const getId = async (endpoint, imgId) => {
    try {
        const res = await fetch(endpoint)
        const data = await res.json()
        return source(imgId, data.data.id)
    } catch (error) {
        console.log(error)
    }
}

const renderGifs = (gifs) =>  {
    let $container = document.getElementById("search_container")
    $container.innerHTML = ''

    for (let gif of gifs){
        let div = document.createElement('div')
        let img = document.createElement('img')
        let fc = document.createElement('figcaption')

        img.setAttribute("width", "286")
        img.setAttribute("height", "296") 
        img.setAttribute("style", "margin: 15px 14px")
        img.src = gif.images.downsized.url
        img.alt = gif.title
    
        div.appendChild(img)
        div.appendChild(fc)
        $container.appendChild(div)
    }
}



