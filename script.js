const searchInput = document.querySelector(".search");
const searchButton = document.querySelector(".search-btn");
const searchForm = document.querySelector(".search-form");
const videoContainer = document.querySelector(".video .container");
const previewContainer = document.querySelector(".preview .container");

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  let inputValue = searchInput.value;
  if (inputValue === "") {
    videoContainer.innerHTML =
      '<p class="error">ERROR: Ваш запрос не имеет данных</p>';
    previewContainer.innerHTML = "";
    return false; // Прочитал в гугле, останавливает выполнение скрипта дальше
    // Нужно было чтобы надпись сразу не убиралась, ведь ответ с сервера ютуба приходит даже если значение инпута пустое
  }

  fetch(
    `https://www.googleapis.com/youtube/v3/search?part=snippet&key=AIzaSyAxvf_cxS2VCZwDCfdiH1ox1QjpNuyc8N4&q=${inputValue}&type=video`
  )
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data);
      // videoContainer.innerHTML = "";
      let check = data.items.length;
      console.log(check);
      if (check === 0) {
        videoContainer.innerHTML =
          '<p class="error">ERROR: Не найдено видео по вашему запросу, пожалуйста попробуйте другой запрос</p>';
        return false;
      }
      let videoID = data.items[0].id.videoId;

      console.log(videoID);
      videoContainer.innerHTML = `<iframe class="youtube-video" width="560" height="315" src="https://www.youtube.com/embed/${videoID}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen>`;
      data.items.forEach((element) => {
        let preview = element.snippet.thumbnails.medium.url; // Достаю превью
        previewContainer.innerHTML += `<div><img class="preview-img" src="${preview}"></div>`; // Вывожу превью на страницу

        let previewImg = document.querySelectorAll(".preview-img"); // Достаю все выведенные превью
        const result = [];
        previewImg.forEach((node) => {
          result.push(node); // Создаю массив из NodeArray
        });
        result.forEach((element) => {
          // Для каждой превью
          element.addEventListener("click", () => {
            const arrayFromUrl = element.src.split("/");
            const id = arrayFromUrl[arrayFromUrl.length - 2];
            videoContainer.innerHTML = ""; // Очищаю поле для видео и строчкой ниже вставляю новое видео
            videoContainer.innerHTML = `<iframe class="youtube-video" width="560" height="315" src="https://www.youtube.com/embed/${id}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen>`;
          }); // Проблема в том, что <iframe class="youtube-video" width="560" height="315" src="https://www.youtube.com/embed/${preview.split("/")[4]}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen>
          // считывает только последнюю  preview.split("/")[4]. Пытался preview перебрать с помощью foreach, но это не массив
        });
      });
    });
  previewContainer.innerHTML = "";
  searchInput.value = "";
  inputValue = "";
});
