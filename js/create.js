document.addEventListener("DOMContentLoaded", async () => {
  // Constants

  const $button_start = document.querySelector(".button_start");
  const $pop_up1 = document.querySelector(".container_pop_up1");
  const $pop_up2 = document.querySelector(".container_pop_up2");
  const $pop_up3 = document.querySelector(".container_pop_up3");
  const $pop_up4 = document.querySelector(".container_pop_up4");
  const $pop_up5 = document.querySelector(".container_pop_up5");
  const $pop_up6 = document.querySelector(".container_pop_up6");
  const $my_guifos = document.querySelector(".my_guifos");
  const $button_capture = document.querySelector("#button_capture");
  const $video_container = document.querySelector("#video_container");
  const $video_container2 = document.querySelector("#video_container2");
  const $video_container3 = document.querySelector("#video_container3");
  const $button_ready = document.querySelector("#button_ready");
  const $button_repeat = document.querySelector(".button_repeat");
  const $button_upload = document.querySelector(".button_upload");
  const $container_img_info = document.querySelector(".container_img_info3");
  const $button_ready2 = document.querySelector(".button_ready2");
  const img = document.createElement("img");
  const $a = document.querySelector(".a_download");
  const minutesLabel = document.getElementById("minutes");
  const secondsLabel = document.getElementById("seconds");
  let recorder = null;
  let blob = null;

  // Functions for click

  $button_start.addEventListener("click", async () => {
    $pop_up2.style.display = "block";
    $pop_up1.style.display = "none";
    $my_guifos.style.display = "none";
    let stream = await getMedia();
    $video_container.srcObject = stream;
    $video_container.play();
  });

  $button_capture.addEventListener("click", async () => {
    $pop_up2.style.display = "none";
    $pop_up3.style.display = "block";
    $video_container.style.display = "block";
    recorder = await startRecord(recorder, $video_container2);
    Clock.start();
  });

  $button_ready.addEventListener("click", async () => {
    $pop_up3.style.display = "none";
    $pop_up4.style.display = "block";
    await stopRecord(recorder, $video_container2);
    let blob = await recorder.getBlob();
    preview(blob);
    img.style.display = "block";
    Clock.reset();
  });

  $button_repeat.addEventListener("click", async () => {
    $pop_up4.style.display = "none";
    img.src = URL.revokeObjectURL(blob);
    $video_container3.style.display = "block";
    img.style.display = "none";
    recorder = await startRecord(recorder, $video_container2);
    $pop_up3.style.display = "block";
    Clock.restart();
  });

  $button_upload.addEventListener("click", async () => {
    $pop_up5.style.display = "block";
    $pop_up4.style.display = "none";
    let blob = await recorder.getBlob();
    let response = await sendGif(blob);
    const gif = await getData(`${api_url}/${response.id}?api_key=${api_key}`);
    renderLastGif(gif);
    renderOtherGif(gif);
    $pop_up5.style.display = "none";
    $pop_up6.style.display = "block";
    $my_guifos.style.display = "block";
  });

  $button_ready2.addEventListener("click", async () => {
    $pop_up6.style.display = "none";
  });

  $a.addEventListener("click", async () => {
    let blob = await recorder.getBlob();
    const blobUrl = URL.createObjectURL(blob);
    $a.setAttribute("href", blobUrl);
  });

  document.querySelector(".button_copy").addEventListener("click", async () => {
    let input = document.createElement("input");
    let blob = await recorder.getBlob();
    const blobUrl = URL.createObjectURL(blob);
    input.setAttribute("value", blobUrl);
    document.body.appendChild(input);
    input.select();
    document.execCommand("copy");
    document.body.removeChild(input);
  });

  // Permissions for use the camera and obtain the stream

  const getMedia = async () => {
    let stream = null;
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: {
          height: { max: 480 }
        },
        audio: false
      });
      return stream;
    } catch (err) {
      return "Unable to capture your camera. Without permissions";
    }
  };

  // Functions for the recorder

  const startRecord = async (recorder, container) => {
    let stream = await getMedia();
    container.srcObject = stream;
    container.play();
    recorder = new RecordRTCPromisesHandler(stream, {
      type: "gif",
      frameRate: 1,
      quality: 10,
      width: 360,
      hidden: 240,
      onGifRecordingStarted: function() {
        console.log(recorder)
      }
    });
    recorder.startRecording();
    return recorder;
  };

  const stopRecord = async (recorder, container) => {
    container.pause();
    await recorder.stopRecording();
    const stream = container.srcObject;
    const tracks = stream.getTracks();
    tracks.forEach(function(track) {
      track.stop();
    });
    container.srcObject = null;
    return blob;
  };

  const upload = async (endpoint, body) => {
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        mode: "cors",
        body: body
      });
      const data = await res.json();
      return data.data;
    } catch (error) {
      console.log(error);
    }
  };

  const sendGif = async blob => {
    const form = new FormData();
    form.append("file", blob, "myGifs.gif");
    console.log(form.get("file"));
    const response = await upload(endpoints.upload, form);
    const actualGifs = JSON.parse(localStorage.getItem("myGifs")) || [];
    const newGifs = [...actualGifs, response.id];
    console.log(newGifs);
    localStorage.setItem("myGifs", JSON.stringify(newGifs));
    if (Array.isArray(newGifs)) {
      await getData(`${api_url}?api_key=${api_key}&ids=${newGifs}`);
    } else {
      await getData(`${api_url}/${response.id}?api_key=${api_key}`);
    }
    return response;
  };

  const preview = blob => {
    $video_container3.style.display = "none";
    img.src = URL.createObjectURL(blob);
    img.setAttribute("width", "832");
    img.setAttribute("height", "434");
    $container_img_info.appendChild(img);
  };

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

  const renderLastGif = gif => {
    let $container = document.querySelector(".container_last_gif");
    let img = document.createElement("img");
    img.setAttribute("width", "365");
    img.setAttribute("height", "191");
    img.setAttribute("style", "opacity: 0.3");
    img.src = gif.images.downsized.url;
    img.alt = gif.title;
    $container.appendChild(img);
  };

  const renderOtherGif = gif => {
    let img = document.createElement("img");
    img.setAttribute("width", "280");
    img.setAttribute("height", "298");
    img.setAttribute("style", "margin: 15px 15px 15px 50px");
    img.src = gif.images.downsized.url;
    img.alt = gif.title;
    $my_guifos.appendChild(img);
  };

  // Showing the gallery from the beginnning

  const myGifs = JSON.parse(localStorage.getItem("myGifs")) || [];
  localStorage.setItem("myGifs", JSON.stringify(myGifs));
  const gifs = await getData(`${api_url}?api_key=${api_key}&ids=${myGifs}`);
  renderMyGifs(gifs);

  // Functions for timer 

  const Clock = {
    totalSeconds: 0,
    start: function() {
      if (!this.interval) {
        let self = this;
        function pad(val) {
          return val > 9 ? val : "0" + val;
        }
        this.interval = setInterval(function() {
          self.totalSeconds += 1;

          minutesLabel.innerHTML = pad(
            Math.floor((self.totalSeconds / 60) % 60)
          );
          secondsLabel.innerHTML = pad(parseInt(self.totalSeconds % 60));
        }, 1000);
      }
    },

    reset: function() {
      Clock.totalSeconds = null;
      clearInterval(this.interval);
      minutesLabel.innerHTML = "00";
      secondsLabel.innerHTML = "00";
      delete this.interval;
    },

    restart: function() {
      this.reset();
      Clock.start();
    }
  };
});
