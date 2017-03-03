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

  /* Load all needed elements for DOM manipulation
  --------------------------------------------------------------*/
  const elements = {
    movieList: document.getElementsByClassName('movie_list')[0],
    movieSingle: document.getElementsByClassName('movie_single')[0],
    errorPage: document.getElementsByClassName('error_page')[0],
    filters: document.getElementsByClassName('filters')[0],
    pageTitle: document.getElementById('page_title'),
    searchBlock: document.getElementsByClassName('search_block')[0],
    searchBtn: document.getElementById('search_button'),
    searchField: document.getElementById('search_query'),
    openSearch: document.getElementById('open_search'),
    randomButton: document.querySelector('[href="#random"]'),
    loader: document.querySelector('.loading')
  };

  /* Generate random numbers for the random page
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
        movieData.get(basicFilters.trending, 'trending');
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
      sections.showOrHideLoader('show');
      const getUrl = `https://api.themoviedb.org/3/${filter}${mainApiKey}`;
      const request = new XMLHttpRequest();
      request.open('GET', getUrl, true);
      request.onload = () => {
        if (request.status === 404 && window.location.hash === '#random') { // Automatic find new random movie if no results
          sections.reloadRandom();
        } else if (request.status >= 200 && request.status < 400) {
          let response = JSON.parse(request.responseText);
          if (!response.results) {
            this.cleanSingle(response);
          } else if (key === 'similar' || key === 'search' || key === 'first') { // Render list instantly without storing in in localStorage
            this.cleanList(response, key);
          } else {
            localStorage.setItem(key, JSON.stringify(response));
          }
        } else {
          window.location.hash = "error";
        }
      };
      request.onerror = () => {
        sections.showOrHideLoader('hide');
        movieList.classList.add('hidden');
        movieSingle.classList.add('hidden');
        errorPage.classList.remove('hidden');
      };
      request.send();
    },
    /* Clean movie list data and init. attributes for Transparency
    ---------------------------------------------------------------- */
    cleanList(movieList, key = 'basic') {
      movieList.results.map(function(movie) {
        movie.backdrop_path = utils.createBackdropPath(movie.backdrop_path); // Generates the backdrop path for each movie in the list
      });
      // Set attributes needed for Transparency
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
      // Set temporary search or similar list in local storage for sorting and filtering
      if (key === 'search' || key === 'similar') {
        localStorage.setItem(key, JSON.stringify(movieList));
      }
      sections.renderList(movieList.results, attributes);
    },
    /* Clean data for the single (detail) view
    ---------------------------------------------------------------- */
    cleanSingle(singleMovie) {
      singleMovie.poster_path = utils.createPosterPath(singleMovie.poster_path); // Create poster path
      singleMovie.budget = utils.formatCurrency(singleMovie.budget); // Amount to currency with € prefix
      singleMovie.revenue = utils.formatCurrency(singleMovie.revenue);
      singleMovie.runtime = utils.durationToHours(singleMovie.runtime); // Runtime from minutes to hours
      singleMovie.imdb_id = utils.createImdbUrl(singleMovie.imdb_id); // Generate IMDB url for the movie
      singleMovie.release_date = utils.formatReleaseDate(singleMovie.release_date); // Change date to normat format
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
            return `./assets/images/lang/${this.original_language}.png`; // Icon with flag of movie language
          }
        },
        imdb_url: {
          href: function() {
            return this.imdb_id
          }
        },
        similar_url: {
          href: function() {
            return `#movie/${this.id}/${this.title}/similar` // Link to similar movies
          }
        }
      };
      sections.renderSingle(singleMovie, attributes);
    },
    /* Filter functionality for movie lists
    ---------------------------------------------------------------- */
    filterList(movieList, type) {
      if (type === 'highest_rating') {
        // Return list ordered on highest rating to lowest rating
        movieList.results.sort(function(a, b) {
          return b.vote_average - a.vote_average;
        });
      } else if (type === 'higher_rating') {
        // Return list filtered items that have an higher rating than 5.5
        movieList.results = movieList.results.filter(function(movie) {
          return movie.vote_average > 5.5;
        });
      } else if (type === 'most_votes') {
        // Return list ordered on most votest to least votes
        movieList.results.sort(function(a, b) {
          return b.vote_count - a.vote_count;
        });
      } else if (type === 'most_popular') {
        // Return list ordered on most popular movies to least popular movies.
        movieList.results.sort(function(a, b) {
          return b.popularity.toFixed(1) - a.popularity.toFixed(1);
        });
      }
      movieData.cleanList(movieList)
    }
  };

  /* Functions for rendering the desired data
  ---------------------------------------------------------------- */
  const sections = {
    // Show the movieList, render data with transparency and hide loader after one second
    renderList(cleanedListData, attributes) {
      elements.movieList.classList.remove('hidden');
      elements.movieSingle.classList.add('hidden');
      elements.filters.classList.remove('hidden');
      Transparency.render(elements.movieList, cleanedListData, attributes);
      setTimeout(function() {
        sections.showOrHideLoader('hide');
      }, 1000);
    },
    // Show the movie detail page, render data with transparency and hide loader after one second
    renderSingle(cleanedSingleData, attributes) {
      elements.movieList.classList.add('hidden');
      elements.movieSingle.classList.remove('hidden');
      elements.filters.classList.add('hidden');
      Transparency.render(elements.movieSingle, cleanedSingleData, attributes);
      setTimeout(function() {
        sections.showOrHideLoader('hide');
      }, 1000);
    },
    // Reload random movie with random ID
    reloadRandom() {
      let random = Math.floor((Math.random() * randomNumber.two) + randomNumber.one);
      elements.pageTitle.innerHTML = 'Random movie';
      movieData.get(`movie/${random}?`, 'random');
    },
    // Highlight the active menu item
    highlightMenu(id) {
      let activeMenuItem = document.querySelector(`[href='#${id}']`);
      let oldActiveMenuItem = document.querySelector(`[aria-label='current']`);
      oldActiveMenuItem.setAttribute('aria-label', '');
      activeMenuItem.setAttribute('aria-label', 'current')
    },
    // Show or hide the loader
    showOrHideLoader(state) {
      if (state === 'show') {
        elements.loader.classList.remove('hidden')
      } else {
        elements.loader.classList.add('hidden');
      }
    }
  };

  /* Object with all utility methods
  ---------------------------------------------------------------- */
  const utils = {
    /* Method for creating the poster path
    ---------------------------------------------------------------- */
    createPosterPath(path) {
      if (!path) {
        return `./assets/images/no_poster.svg`;
      } else {
        return `https://image.tmdb.org/t/p/w500/${path}`;
      }
    },
    /* Method for creating the backdrop path
    ---------------------------------------------------------------- */
    createBackdropPath(path) {
      if (!path || path === './assets/images/no_picture.svg') {
        return './assets/images/no_picture.svg';
      } else if (path.startsWith('https://')) {
        return path;
      } else {
        return `https://image.tmdb.org/t/p/w500${path}`;
      }
    },
    /* Method that formats the number (3000000) to an amount in euro's using a regular expression
    ---------------------------------------------------------------- */
    formatCurrency(amount) {
      amount = amount.toFixed(0).replace(/./g, function(c, i, a) {
        return i && c !== "." && ((a.length - i) % 3 === 0) ? '.' + c : c;
      });
      return `€${amount},-`;
    },
    /* Method calculates duration from minutes to hours
    ---------------------------------------------------------------- */
    durationToHours(duration) {
      return `${(duration / 60).toFixed(1)} uur`
    },
    /* Method for concatting the IMDB URL with the ID of the movie.
    ---------------------------------------------------------------- */
    createImdbUrl(id) {
      return `http://www.imdb.com/title/${id}`;
    },
    /* Method for concatting the IMDB URL with the ID of the movie.
    ---------------------------------------------------------------- */
    formatReleaseDate(date) {
      let releaseDate = new Date(date);
      return `${releaseDate.getDate()}-${(releaseDate.getMonth() + 1)}-${releaseDate.getFullYear()}`
    }
  };

  const events = {

  }

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
      document.title = 'Trending movies'; // Change document title
      sections.highlightMenu('trending'); // Highlight actual menu item
      elements.pageTitle.innerHTML = 'Trending movies'; // Change page title
      let trending_data = JSON.parse(localStorage.getItem('trending')); // Get existing data from local storage
      movieData.cleanList(trending_data);
    },
    'toplist': () => {
      document.title = 'Top rated movies'
      sections.highlightMenu('toplist');
      elements.pageTitle.innerHTML = 'Top rated movies';
      let toplist_data = JSON.parse(localStorage.getItem('toplist'));
      movieData.cleanList(toplist_data);
    },
    'latest': () => {
      document.title = 'Latest movies'
      sections.highlightMenu('latest');
      elements.pageTitle.innerHTML = 'Latest movies';
      let latest_data = JSON.parse(localStorage.getItem('latest'));
      movieData.cleanList(latest_data);
    },
    'upcoming': () => {
      document.title = 'Upcoming movies'
      sections.highlightMenu('upcoming');
      elements.pageTitle.innerHTML = 'Upcoming movies';
      let upcoming_data = JSON.parse(localStorage.getItem('upcoming'));
      movieData.cleanList(upcoming_data);
    },
    'movie/:id/:title': (id, title) => {
      document.title = `Movie: ${title}`;
      elements.pageTitle.innerHTML = `Movie: ${title}`;
      movieData.get(`movie/${id}?`, 'single');
    },
    'random': () => {
      sections.highlightMenu('random');
      let random = Math.floor((Math.random() * randomNumber.one) + randomNumber.two);
      elements.pageTitle.innerHTML = 'Random movie';
      movieData.get(`movie/${random}?`, 'random');
    },
    'movie/:id/:title/similar': (id, title) => {
      document.title = `Movies like ${title}`;
      elements.pageTitle.innerHTML = `More like ${title}`;
      movieData.get(`movie/${id}/similar?`, 'similar');
      window.location.hash = "#similar";
    },
    'search/:query': (query) => {
      sections.highlightMenu('open_search');
      movieData.get(`search/movie?include_adult=false&page=1&query=${query}&language=en-US&`, 'search')
      window.location.hash = "#search";
    }
  });

  /* Event listners
  ---------------------------------------------------------------- */
  elements.randomButton.addEventListener("click", function() {
    if (window.location.hash === '#random') {
      sections.reloadRandom();
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

  /* Filter functionality
  --------------------------------------------------------------*/
  document.getElementById('highest_rating').addEventListener("click", function() {
    movieData.filterList(JSON.parse(localStorage.getItem(window.location.hash.replace(/^#+/, ""))), 'highest_rating');
  });

  document.getElementById('higher_rating').addEventListener("click", function() {
    movieData.filterList(JSON.parse(localStorage.getItem(window.location.hash.replace(/^#+/, ""))), 'higher_rating');
  });


  document.getElementById('most_votes').addEventListener("click", function() {
    movieData.filterList(JSON.parse(localStorage.getItem(window.location.hash.replace(/^#+/, ""))), 'most_votes');
  });

  document.getElementById('most_popular').addEventListener("click", function() {
    movieData.filterList(JSON.parse(localStorage.getItem(window.location.hash.replace(/^#+/, ""))), 'most_popular');
  });


  /* Initialize the application
  ---------------------------------------------------------------- */
  app.init();

}
