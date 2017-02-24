/* Sources:
  - http://projects.jga.me/routie/
  - http://stackoverflow.com/questions/149055/how-can-i-format-numbers-as-money-in-javascript
  - http://stackoverflow.com/questions/413439/how-to-dynamically-change-a-web-pages-title
  - https://www.themoviedb.org/
  - https://developers.themoviedb.org/3
*/

/* TODO:
    - Search on keywords/genres
    - Search for movies.
    - Placeholder image for movies without img.
    - Random movie -> catch errors and show other movie
    - Reload random movie
*/

(() => {
  "use strict"

  /* Saving sections to variables
  --------------------------------------------------------------*/
  const movieList = document.getElementsByClassName('movie_list')[0];
  const movieSingle = document.getElementsByClassName('movie_single')[0];
  const pageTitle = document.getElementById('page_title');

  /* All standard filters for displaying movies
  --------------------------------------------------------------*/
  const allFilters = {
    trending: 'movie/popular',
    toplist: 'movie/top_rated',
    latest: 'movie/now_playing',
    upcoming: 'movie/upcoming'
  };

  /* Initialize app - Get al standard data and save it in localStorage
  --------------------------------------------------------------*/
  const app = {
    init() {
      if (!localStorage.getItem('popular') && !window.location.hash) {
        getData(allFilters.trending, 'first');
      } else {
        getData(allFilters.trending, 'popular');
        getData(allFilters.toplist, 'toplist');
        getData(allFilters.latest, 'latest');
        getData(allFilters.upcoming, 'upcoming');
      }

      this.startPage();
    },
    startPage() {
      if (!window.location.hash) {
        window.location.hash = "trending";
      }
    }
  }

  /* Function for getting data from the API
  --------------------------------------------------------------*/
  const getData = (filter, key) => {
    const request = new XMLHttpRequest();
    const apiKey = '?api_key=76244b12adc0042d55a0f0f57905f0be';
    const getUrl = `https://api.themoviedb.org/3/${filter}${apiKey}`;

    request.open('GET', getUrl, true);
    request.onload = () => {
      if (request.status >= 200 && request.status < 400) {
        let data = request.responseText;
        let checkData = JSON.parse(request.responseText);
        checkData.key = key;
        if (!checkData.results) {
          cleanData.init(checkData);
        } else if (checkData.key === 'similar' || checkData.key === 'first') {
          cleanData.init(checkData);
        } else {
          localStorage.setItem(key, data);
        }
      } else {
        window.location.hash = 'random';
      }
    };
    request.onerror = () => {
      console.error('Error');
    };
    request.send();
  };

  /* Check if the data is list or single, and clean up
  --------------------------------------------------------------*/
  const cleanData = {
    init(originalData) {
      if (!originalData.results) {
        this.single(originalData);
      } else {
        this.list(originalData);
      }
    },

    /* If its 'list' data, map trough it and config the properties & atrributes
    --------------------------------------------------------------*/
    list(data) {
      data.results.map(function(el) {
        el.backdrop_path = `https://image.tmdb.org/t/p/w500/${el.backdrop_path}`;
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
      showList(data.results, attributes);
    },

    /* If its 'single' data, config all the properties and attributes
    --------------------------------------------------------------*/
    single(data) {
      data.poster_path = `https://image.tmdb.org/t/p/w500/${data.poster_path}`;
      data.budget = formatCurrency(data.budget);
      data.revenue = formatCurrency(data.revenue);
      data.runtime = `${(data.runtime / 60).toFixed(1)} uur`;
      data.imdb_id = `http://www.imdb.com/title/${data.imdb_id}`;
      let attributes = {
        movie_image: {
          src: function() {
            return this.poster_path;
          },
          alt: function() {
            return this.title;
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
      showSingle(data, attributes);
    }
  };

  /* Function for rendering list data into HTML
  --------------------------------------------------------------*/
  const showList = (cleanedData, attributes) => {
    movieList.classList.remove('hidden');
    movieSingle.classList.add('hidden');
    Transparency.render(movieList, cleanedData, attributes);
  };

  /* Function for rendering single data into HTML
  --------------------------------------------------------------*/
  const showSingle = (cleanedData, attributes) => {
    movieSingle.classList.remove('hidden');
    movieList.classList.add('hidden');
    Transparency.render(movieSingle, cleanedData, attributes);
  }

  /* Routie for the router handling
  --------------------------------------------------------------*/
  routie({
    'trending': () => {
      document.title = 'Trending movies';
      pageTitle.innerHTML = '&nbsp; - &nbsp; Trending movies';
      let trending_data = JSON.parse(localStorage.getItem('popular'));
      cleanData.list(trending_data);
    },
    'toplist': () => {
      document.title = 'Top rated movies'
      pageTitle.innerHTML = '&nbsp; - &nbsp; Top rated movies';
      let toplist_data = JSON.parse(localStorage.getItem('toplist'));
      cleanData.list(toplist_data);
    },
    'latest': () => {
      document.title = 'Latest movies'
      pageTitle.innerHTML = '&nbsp; - &nbsp; Latest movies';
      let latest_data = JSON.parse(localStorage.getItem('latest'));
      cleanData.list(latest_data);
    },
    'upcoming': () => {
      document.title = 'Upcoming movies'
      pageTitle.innerHTML = '&nbsp; - &nbsp; Upcoming movies';
      let upcoming_data = JSON.parse(localStorage.getItem('upcoming'));
      cleanData.list(upcoming_data);
    },
    'movie/:id/:title': (id, title) => {
      document.title = `Movie: ${title}`;
      pageTitle.innerHTML = `&nbsp; - &nbsp; ${title}`;
      getData(`movie/${id}`, 'single');
    },
    'random': () => {
      let random = Math.floor((Math.random() * 1000) + 100);
      pageTitle.innerHTML = '&nbsp; - &nbsp; Random';
      getData(`movie/${random}`, 'random');
    },
    'movie/:id/:title/similar': (id, title) => {
      document.title = `Movies like: ${title}`;
      pageTitle.innerHTML = `&nbsp; - &nbsp; More like: ${title}`;
      getData(`movie/${id}/similar`, 'similar');
    },
    'genre/:genre_id/movies': (id, title) => {
      console.log(id);
    }
  });

  /* Formatting currency (example: 3000000 > €3.000.000,-)
  --------------------------------------------------------------*/
  const formatCurrency = amount => {
    amount = amount.toFixed(0).replace(/./g, function(c, i, a) {
      return i && c !== "." && ((a.length - i) % 3 === 0) ? '.' + c : c;
    });
    return `€${amount},-`;
  };

  /* Initialize app, get list data and overwrite localStorage if there is.
  --------------------------------------------------------------*/
  app.init();

})();
