import axios from 'axios';

const API_URL = 'https://pixabay.com/api/';
const API_KEY = '38831051-4c682304c811c7cc8e516c013';

export const getImages = async (query, page) => {
  try {
    const { data } = await axios(
      `${API_URL}?key=${API_KEY}&q=${query}&page=${page}&per_page=40&image_type=photo&orientation=horizontal&safesearch=true`
    );
    return data;
  } catch (error) {
      console.log(error.message);
  }
};
