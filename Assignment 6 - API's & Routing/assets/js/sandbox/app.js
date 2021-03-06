/* Sources:
  - http://handlebarsjs.com/
  - http://projects.jga.me/routie/
  - http://stackoverflow.com/questions/149055/how-can-i-format-numbers-as-money-in-javascript
  - http://stackoverflow.com/questions/413439/how-to-dynamically-change-a-web-pages-title
  - https://www.themoviedb.org/
  - https://developers.themoviedb.org/3
*/

(() => {
  "use strict"
  const movieList = document.getElementsByClassName('movie_list')[0];
  const movieSingle = document.getElementsByClassName('movie_single')[0];

  const app = {
    init() {
      // window.location.hash = 'trending';
    },
    getData(filter) {
      const request = new XMLHttpRequest();
      const apiKey = '?api_key=76244b12adc0042d55a0f0f57905f0be';
      const getUrl = `https://api.themoviedb.org/3/${filter}${apiKey}`;

      request.open('GET', getUrl, true);
      request.onload = () => {
        if (request.status >= 200 && request.status < 400) {
          let data = JSON.parse(request.responseText);
          cleanData.init(data);
        } else {
          window.location.hash = 'random';
        }
      };
      request.onerror = () => {
        console.error('Error');
      };
      request.send();
    }
  };

  const cleanData = {
    init(originalData) {
      if (!originalData.results) {
        this.cleanSingle(originalData);
      } else {
        this.cleanList(originalData);
      }
    },

    cleanList(data) {
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

    cleanSingle(data) {
      data.poster_path = `https://image.tmdb.org/t/p/w500/${data.poster_path}`;
      data.budget = formatCurrency(data.budget);
      data.revenue = formatCurrency(data.revenue);
      data.runtime = `${(data.runtime / 60).toFixed(1)} uur`;
      data.imdb_id = `http://www.imdb.com/title/${data.imdb_id}`;
      data.production_companies.name = 'hola'
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

  const showList = (cleanedData, attributes) => {
    movieList.classList.remove('hidden');
    movieSingle.classList.add('hidden');
    Transparency.render(movieList, cleanedData, attributes);
  };

  const showSingle = (cleanedData, attributes) => {
    movieSingle.classList.remove('hidden');
    movieList.classList.add('hidden');
    Transparency.render(movieSingle, cleanedData, attributes);
  }

  routie({
    'trending': () => {
      document.title = 'Trending movies';
      app.getData('movie/popular');
    },
    'toplist': () => {
      document.title = 'Top rated movies'
      app.getData('movie/top_rated');
    },
    'latest': () => {
      document.title = 'Latest movies'
      app.getData('movie/now_playing');
    },
    'upcoming': () => {
      document.title = 'Upcoming movies'
      app.getData('movie/upcoming');
    },
    'movie/:id/:title': (id, title) => {
      document.title = `Movie: ${title}`;
      app.getData(`movie/${id}`);
    },
    'random': () => {
      let random = Math.floor((Math.random() * 1000) + 100);
      app.getData(`movie/${random}`);
    },
    'movie/:id/:title/similar': (id, title) => {
      document.title = `Movies like: ${title}`;
      app.getData(`movie/${id}/similar`);
    }
  });

  const formatCurrency = amount => {
    amount = amount.toFixed(0).replace(/./g, function(c, i, a) {
      return i && c !== "." && ((a.length - i) % 3 === 0) ? '.' + c : c;
    });
    return `€${amount},-`;
  };

  app.init();

})();
