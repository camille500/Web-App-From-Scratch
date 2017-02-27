/* Sources:
  - https://github.com/leonidas/transparency
  - http://projects.jga.me/routie/
  - http://stackoverflow.com/questions/149055/how-can-i-format-numbers-as-money-in-javascript
  - http://stackoverflow.com/questions/413439/how-to-dynamically-change-a-web-pages-title
  - https://www.themoviedb.org/
  - https://developers.themoviedb.org/3
*/

{
  'use strict';

  /* Load all needed elements from the DOM
  --------------------------------------------------------------*/
  const elements = {
    movieList:  document.getElementsByClassName('movie_list')[0],
    movieSingle: document.getElementsByClassName('movie_single')[0],
    pageTitle: document.getElementById('page_title'),
    searchBlock: document.getElementsByClassName('search_block')[0],
    searchBtn: document.getElementById('search_button'),
    searchField: document.getElementById('search_query'),
    openSearch: document.getElementById('open_search'),
    randomButton: document.querySelector('[href="#random"]')
  };

  /* Object with configuration data
  --------------------------------------------------------------*/
  const config = {
    location: window.location,
    hash: this.location.hash,
    apiKey: mainApiKey
  };

  /* All basic filters
  --------------------------------------------------------------*/
  const basicFilters = {
    trending: 'movie/popular?',
    toplist: 'movie/top_rated?',
    latest: 'movie/now_playing?',
    upcoming: 'movie/upcoming?'
  };

  /* Initialize the app: Get all the basic data
  --------------------------------------------------------------*/
  const app = {
    init() {
      if (!localStorage.getItem('popular') && !config.location.hash) {
        data.get(basicFilters.trending, 'first');
      } else if (!config.location.hash) {
        data.get(basicFilters.trending, 'popular');
        data.get(basicFilters.toplist, 'toplist');
        data.get(basicFilters.latest, 'latest');
        data.get(basicFilters.upcoming, 'upcoming');
      }
    }
  };

  /* Object with all data methods
  --------------------------------------------------------------*/
  const data = {
    get(filter, key) {

    }
  }

  app.init();

}
