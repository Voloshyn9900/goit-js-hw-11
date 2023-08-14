import Notiflix from 'notiflix';
import { getImages } from './pixabay-api';

const refs = {
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

refs.form.addEventListener('submit', onFormSubmit);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

let currentPage = 1;
let query = '';
let totalHits = 0;

refs.loadMoreBtn.disabled = true;
refs.loadMoreBtn.style.backgroundColor = 'gray';

function onFormSubmit(e) {
  e.preventDefault();

  currentPage = 1;
    query = e.currentTarget.elements.searchQuery.value;
    
    refs.gallery.innerHTML = "";

    // console.dir(e.currentTarget.elements); !!!!!
    if (query.trim() === "") {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        return;
    }
    getImages(query, currentPage).then(data => {
        if (data.hits.length !== 0) {
            createMarkup(data.hits);
            totalHits = Math.ceil((data.totalHits) / 40);
            // console.log(totalHits);
            refs.loadMoreBtn.removeAttribute("hidden")
            refs.loadMoreBtn.disabled = false;
            refs.loadMoreBtn.style.backgroundColor = '#008cff';
        } else {
            Notiflix.Notify.failure(
              'Sorry, there are no images matching your search query. Please try again.'
            );
        }
    });
}

function onLoadMore() {
    currentPage += 1;
    getImages(query, currentPage).then(data => {
        createMarkup(data.hits);
       if (currentPage >= totalHits) {
        //  console.log(totalHits);
         refs.loadMoreBtn.setAttribute('hidden', true);
         Notiflix.Notify.warning(
           `We're sorry, but you've reached the end of search results.`
         );
       } 
    });
}


function createMarkup(items) {
  const markup = items.map(
    ({
      webformatURL,
      largeImageURL,
      tags,
      likes,
      views,
      comments,
      downloads,
    }) => {
    return `
    <div class="photo-card">
        <img src="${webformatURL}" alt="${tags}" loading="lazy" width="320" height="200"/>
        <div class="info">
        <p class="info-item">
        <b>Likes </b>${likes}
        </p>
        <p class="info-item">
        <b>Views</b>${views}
        </p>
        <p class="info-item">
        <b>Comments </b>${comments}
        </p>
        <p class="info-item">
        <b>Downloads </b>${downloads}
        </p>
        </div>
    </div>`;
    }
    ).join("");
    refs.gallery.insertAdjacentHTML('beforeend', markup);
}

{
  /* <div class="photo-card">
  <img src="" alt="" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
    </p>
    <p class="info-item">
      <b>Views</b>
    </p>
    <p class="info-item">
      <b>Comments</b>
    </p>
    <p class="info-item">
      <b>Downloads</b>
    </p>
  </div>
</div>; */
}
