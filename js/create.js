document.addEventListener("DOMContentLoaded", async () => {
    
const $button_start = document.querySelector(".button_start")
const $pop_up1 = document.querySelector(".container_pop_up1")
const $pop_up2 = document.querySelector(".container_pop_up2")
const $pop_up3 = document.querySelector(".container_pop_up3")
const $input_my_guifos = document.querySelector(".input_my_guifos")
const $button_capture = document.querySelector("#button_capture")
const $button_camera = document.querySelector(".button_camera")
const $video_container = document.querySelector("#video_container")
const $button_ready = document.querySelector("#button_ready")
const $button_clock = document.querySelector(".button_clock")
const $input_ready = document.querySelector(".input_ready")
const $button_container_ready = document.querySelector(".button_container_ready")
const $button_container2= document.querySelector(".button_container2")
const $button_container_repeat= document.querySelector(".button_container_repeat")
const $button_repeat= document.querySelector(".button_repeat")
const $button_upload= document.querySelector(".button_upload")
const $container_img_info = document.querySelector(".container_img_info")
const $button_ready2 = document.querySelector(".button_ready2")
const img = document.createElement('img')
let recorder = null;
let blob = null;
 
$button_start.addEventListener('click', () => {
    $pop_up2.style.display = 'block'
    $pop_up1.style.display = 'none'
    $input_my_guifos.style.display = 'none'

})

$button_capture.addEventListener('click', async () => {

    $button_container2.style.display = 'none'
    $button_capture.style.visibility = 'none'
    $button_camera.style.display = 'none'
    $button_container_ready.style.display = 'block'
    $button_ready.style.display = 'block'
    $button_clock.style.display = 'block'
    $input_ready.style.display = 'block'

    recorder = await startRecord(recorder, $video_container)

})

$button_ready.addEventListener('click', async () => {

    await stopRecord(recorder, $video_container)
    img.style.display = 'block'
})

$button_repeat.addEventListener('click', async () => {

    $button_container_repeat.style.display = 'none'
    $button_repeat.style.display = 'none'
    $button_upload.style.display = 'none'
    img.src = URL.revokeObjectURL(blob)
    $video_container.style.display = 'block'
    img.style.display = 'none'
    recorder = await startRecord(recorder, $video_container)
    $button_container_ready.style.display = 'block'
    $button_ready.style.display = 'block'
    $button_clock.style.display = 'block'
    $input_ready.style.display = 'block'
})

$button_upload.addEventListener('click', async () => {
    $pop_up3.style.display="block"
    $button_repeat.style.display="none"
    $button_upload.style.display="none"
    $pop_up2.style.display="none"
    let blob = await recorder.getBlob()  
    let response = await sendGif(blob)
    $pop_up3.style.display="none" 
    $pop_up1.style.display="block"
    $input_my_guifos.style.display="block"  
    document.querySelector('.title_message').innerHTML = 'Guifo subido con éxito';
    document.querySelector('.img_info').style.display = 'none'
    document.querySelector('.text_info').style.display = 'none'
    document.querySelector('.button_cancel').style.display = 'none'
    document.querySelector('.button_start').style.display = 'none'
    document.querySelector('.success').style.display = 'block'
    document.querySelector('.button_copy').style.display = 'block'
    document.querySelector('.button_download').style.display = 'block'
    document.querySelector('.button_ready2').style.display = 'block'
})

$button_ready2.addEventListener('click', () => {
    $pop_up1.style.display='none'
})

const getMedia = async () => {
    let stream = null 
    try {
        stream = await navigator.mediaDevices.getUserMedia({
            video: {
                height: { max: 480 }
            },
            audio: false
        })
        return stream
    } catch(err) {
        return 'Unable to capture your camera. Without permissions'
    }
}

const startRecord = async (recorder, container) => {
    let stream = await getMedia() 
    container.srcObject = stream
    container.play()
    recorder = new RecordRTCPromisesHandler(stream, {
        type: 'gif',
        frameRate: 1,
        quality: 10,
        width: 360,
        hidden: 240,
        onGifRecordingStarted: function() {
            document.querySelector('.title_message').innerHTML = 'Capturando tu guifo';
        }
        });
    recorder.startRecording();
    return recorder;
 }

 const stopRecord = async (recorder, container) => {

    $button_container_ready.style.display = 'none'
    $button_ready.style.display = 'none'
    $button_clock.style.display = 'none'
    $input_ready.style.display = 'none'
    document.querySelector('.title_message').innerHTML = 'Vista previa'
    $button_container_repeat.style.display = 'block'
    $button_repeat.style.display = 'block'
    $button_upload.style.display = 'block'

    container.pause()
    container.srcObject = null
    
    await recorder.stopRecording()
    let blob = await recorder.getBlob()  
    preview(blob)  
    return blob
}

const upload = async (endpoint, body) => {
    try {
        const res = await fetch(endpoint, {
            method: 'POST',
            mode: 'cors',
            body: body
        })
        const data = await res.json()
        return data.data
    } catch (error) {
        console.log(error)
    }
}


const sendGif = async blob => {
    const form= new FormData()
    form.append('file', blob, 'myGifs.gif')
    console.log(form.get('file'))
    const response = await upload(endpoints.upload, form)    
    const actualGifs = JSON.parse(localStorage.getItem('myGifs')) || []
    const newGifs = [...actualGifs, response.id]
    console.log(newGifs)
    localStorage.setItem('myGifs', JSON.stringify(newGifs))
    const gif = await getData(`${api_url}?api_key=${api_key}&ids=${newGifs}`)
    renderMyGif(gif)
    return response
}

const renderMyGif = (gifs)  => {
    let $container = document.querySelector(".container_my_guifos")

    if(Array.isArray(gifs)) { 
        for(let gif of gifs) {

            let img = document.createElement('img')
            img.setAttribute("width", "832")
            img.setAttribute("height", "434") 
            img.src = gif.images.downsized.url
            img.alt = gif.title
            $container.appendChild(img)
        }
    } else {

            let img = document.createElement('img')
            img.setAttribute("width", "832")
            img.setAttribute("height", "434") 
            img.src = gifs.images.downsized.url
            img.alt = gifs.title
            $container.appendChild(img)
    }
}

const preview = (blob) => {
    $video_container.style.display = 'none'
    img.src = URL.createObjectURL(blob)
    img.setAttribute("width", "832")
    img.setAttribute("height", "434") 
    $container_img_info.appendChild(img)  
}
})