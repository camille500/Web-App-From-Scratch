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
    movieList: document.getElementsByClassName('movie_list')[0],
    movieSingle: document.getElementsByClassName('movie_single')[0],
    pageTitle: document.getElementById('page_title'),
    searchBlock: document.getElementsByClassName('search_block')[0],
    searchBtn: document.getElementById('search_button'),
    searchField: document.getElementById('search_query'),
    openSearch: document.getElementById('open_search'),
    randomButton: document.querySelector('[href="#random"]')
  };

  /* Generate random numbers
  --------------------------------------------------------------*/
  const randomNumber = {
    one: Math.floor((Math.random() * 10) + 25),
    two: Math.floor((Math.random() * 720) + 123)
  }

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
      if (window.location.hash != '#random') {
        movieData.get(basicFilters.trending, 'popular');
        movieData.get(basicFilters.toplist, 'toplist');
        movieData.get(basicFilters.latest, 'latest');
        movieData.get(basicFilters.upcoming, 'upcoming');
      }
    }
  };

  /* Object with all data methods
  --------------------------------------------------------------*/
  const movieData = {
    get(filter, key) {
      const getUrl = `https://api.themoviedb.org/3/${filter}${mainApiKey}`;
      const request = new XMLHttpRequest();
      request.open('GET', getUrl, true);
      request.onload = () => {
        if (request.status === 404) {

          console.log('error');

        } else if (request.status >= 200 && request.status < 400) {
          let response = JSON.parse(request.responseText);
          if (!response.results) {
            this.cleanSingle(response);
          } else if (key === 'similar' || key === 'first' || key === 'search') {
            this.cleanList(response);
          } else {
            localStorage.setItem(key, JSON.stringify(response));
          }
        } else {
          config.location = 'error';
        }
      };
      request.onerror = () => {
        console.error('Error');
      };
      request.send();
    },
    /* Clean movie list data and init. attributes for Transparency
    ---------------------------------------------------------------- */
    cleanList(movieList) {
      movieList.results.map(function(movie) {
        if (!movie.backdrop_path) {
          movie.backdrop_path = './assets/images/no_picture.svg';
        } else {
          movie.backdrop_path = `https://image.tmdb.org/t/p/w500/${movie.backdrop_path}`;
        }
      });
      let attributes = {
        movie_image: {
          src: function() {
            return this.backdrop_path;
          },
          alt: function() {
            return this.title;
          }
        },
        title_url: {
          href: function() {
            return `#movie/${this.id}/${this.title}`;
          }
        }
      }
      sections.renderList(movieList.results, attributes);
    },
    /* Clean data for the single (detail) view
    ---------------------------------------------------------------- */
    cleanSingle(singleMovie) {
      let releaseDate = new Date(singleMovie.release_date);
      if(!singleMovie.poster_path) {
        singleMovie.poster_path = `./assets/images/no_poster.svg`;
      } else {
        singleMovie.poster_path = `https://image.tmdb.org/t/p/w500/${singleMovie.poster_path}`;
      }
      singleMovie.budget = this.formatCurrency(singleMovie.budget);
      singleMovie.revenue = this.formatCurrency(singleMovie.revenue);
      singleMovie.runtime = `${(singleMovie.runtime / 60).toFixed(1)} uur`;
      singleMovie.imdb_id = `http://www.imdb.com/title/${singleMovie.imdb_id}`;
      singleMovie.release_date = `${releaseDate.getDate()}-${(releaseDate.getMonth() + 1)}-${releaseDate.getFullYear()}`
      let attributes = {
        movie_image: {
          src: function() {
            return this.poster_path;
          },
          alt: function() {
            return this.title;
          }
        },
        lang_image: {
          src: function() {
            return `./assets/images/lang/${this.original_language}.png`;
          }
        },
        imdb_url: {
          href: function() {
            return this.imdb_id
          }
        },
        similar_url: {
          href: function() {
            return `#movie/${this.id}/${this.title}/similar`
          }
        }
      };
      sections.renderSingle(singleMovie, attributes);
    },
    /* Filter functionality for movie lists
    ---------------------------------------------------------------- */
    filterList(movieList) {

    },
    /* Format currency with regular expressions
    ---------------------------------------------------------------- */
    formatCurrency(amount) {
      amount = amount.toFixed(0).replace(/./g, function(c, i, a) {
        return i && c !== "." && ((a.length - i) % 3 === 0) ? '.' + c : c;
      });
      return `€${amount},-`;
    }
  };

  /* Functions for rendering the desired data
  ---------------------------------------------------------------- */
  const sections = {
    renderList(cleanedListData, attributes) {
      elements.movieList.classList.remove('hidden');
      elements.movieSingle.classList.add('hidden');
      Transparency.render(elements.movieList, cleanedListData, attributes);
    },
    renderSingle(cleanedSingleData, attributes) {
      elements.movieSingle.classList.remove('hidden');
      elements.movieList.classList.add('hidden');
      Transparency.render(elements.movieSingle, cleanedSingleData, attributes);
    }
  };

  /* Routie for the router handling
  --------------------------------------------------------------*/
  routie({
    '': () => {
      window.location.hash = 'trending';
      if (!localStorage.getItem('trending')) {
        movieData.get(basicFilters.trending, 'first')
      }
    },
    'trending': () => {
      document.title = 'Trending movies';
      elements.pageTitle.innerHTML = '&nbsp; - &nbsp; Trending movies';
      let trending_data = JSON.parse(localStorage.getItem('popular'));
      movieData.cleanList(trending_data);
    },
    'toplist': () => {
      document.title = 'Top rated movies'
      elements.pageTitle.innerHTML = '&nbsp; - &nbsp; Top rated movies';
      let toplist_data = JSON.parse(localStorage.getItem('toplist'));
      movieData.cleanList(toplist_data);
    },
    'latest': () => {
      document.title = 'Latest movies'
      elements.pageTitle.innerHTML = '&nbsp; - &nbsp; Latest movies';
      let latest_data = JSON.parse(localStorage.getItem('latest'));
      movieData.cleanList(latest_data);
    },
    'upcoming': () => {
      document.title = 'Upcoming movies'
      elements.pageTitle.innerHTML = '&nbsp; - &nbsp; Upcoming movies';
      let upcoming_data = JSON.parse(localStorage.getItem('upcoming'));
      movieData.cleanList(upcoming_data);
    },
    'movie/:id/:title': (id, title) => {
      document.title = `Movie: ${title}`;
      elements.pageTitle.innerHTML = `&nbsp; - &nbsp; ${title}`;
      movieData.get(`movie/${id}?`, 'single');
    },
    'random': () => {
      let random = Math.floor((Math.random() * randomNumber.one) + randomNumber.two);
      elements.pageTitle.innerHTML = '&nbsp; - &nbsp; Random';
      movieData.get(`movie/${random}?`, 'random');
    },
    'movie/:id/:title/similar': (id, title) => {
      document.title = `Movies like: ${title}`;
      elements.pageTitle.innerHTML = `&nbsp; - &nbsp; More like ${title}`;
      movieData.get(`movie/${id}/similar?`, 'similar');
    },
    'search/:query': (query) => {
      movieData.get(`search/movie?include_adult=false&page=1&query=${query}&language=en-US&`, 'search')
    }
  });

  /* Initialize the application
  ---------------------------------------------------------------- */
  app.init();

  /* Event listners
  ---------------------------------------------------------------- */
  elements.randomButton.addEventListener("click", function() {
    if (window.location.hash === '#random') {
      let random = Math.floor((Math.random() * randomNumber.two) + randomNumber.one);
      elements.pageTitle.innerHTML = '&nbsp; - &nbsp; Random';
      movieData.get(`movie/${random}?`, 'random');
    }
  });

  /* Handeling of searchButton click
--------------------------------------------------------------*/
  elements.searchBtn.addEventListener("click", function() {
    elements.searchBlock.style.display = 'none';
    window.location = `#search/${elements.searchField.value.toLowerCase()}`;
  });

  /* Handeling to show the search block
  --------------------------------------------------------------*/
  elements.openSearch.addEventListener("click", function() {
    elements.searchBlock.style.display = 'block';
  });

}
