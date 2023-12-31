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

function onFormSubmit(e) {
  e.preventDefault();

  currentPage = 1;
  query = e.currentTarget.elements.searchQuery.value;
  
  refs.loadMoreBtn.classList.add('is-hidden');
  refs.gallery.innerHTML = '';

  // console.dir(e.currentTarget.elements); !!!!!
  if (query.trim() === '') {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }
  getImages(query, currentPage).then(data => {
    if (data.hits.length !== 0) {
      createMarkup(data.hits);
      totalHits = Math.ceil(data.totalHits / 40);
      // console.log('onFormSubmit currentPage', currentPage);
      // console.log('onFormSubmit totalHits', totalHits);
      // refs.loadMoreBtn.removeAttribute("hidden")
      // refs.loadMoreBtn.classList.remove('is-hidden'); // после отрисовки
    } else {
      refs.loadMoreBtn.classList.add('is-hidden');
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
    // console.log('onLoadMore currentPage', currentPage);
    // console.log('onLoadMore totalHits', totalHits);

    if (currentPage >= totalHits) {
      //  console.log('if onLoadMore currentPage', currentPage);
      //  console.log('if onLoadMore totalHits', totalHits);
      refs.loadMoreBtn.classList.add('is-hidden');
      Notiflix.Notify.warning(
        `We're sorry, but you've reached the end of search results.`
      );
    }
  });
}

function createMarkup(items) {
  const markup = items
    .map(
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
    )
    .join('');
  refs.gallery.insertAdjacentHTML('beforeend', markup);
  refs.loadMoreBtn.classList.remove('is-hidden');
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
