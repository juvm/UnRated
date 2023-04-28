const APILINK = `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=9e7fa9ff865d1ce0fdce40e41b3a9dff&page=1`;
const IMG_PATH = 'https://image.tmdb.org/t/p/w1280';
const SEARCHAPI = 'https://api.themoviedb.org/3/search/movie?&api_key=9e7fa9ff865d1ce0fdce40e41b3a9dff&query=';

const GENRE_DETAILS = 'https://api.themoviedb.org/3/genre/movie/list?api_key=9e7fa9ff865d1ce0fdce40e41b3a9dff&language=en-US';
let genre_list;
fetch(GENRE_DETAILS)
.then(res => res.json())
.then(function(data) {
    genre_list = data['genres'];
});

const main = document.getElementById('section');
const form = document.getElementById('form');
const search = document.getElementById('query');
const tab_name = document.getElementById('tab');

const sidebar = document.getElementById('sidebar');

returnMovies(APILINK); //Get popular movies for homepage

function returnMovies(url) {
    fetch(url)
    .then(res => res.json())
    .then(function(element) {
        console.log(element.results); //debug in dev console
        element.results.forEach(element => {
            
            const image = document.createElement('img');
            image.setAttribute('class', 'thumbnail');
            image.setAttribute('id', 'image');
            image.setAttribute('alt', `${element.title}`);

            const date = document.createElement('div');
            date.setAttribute('class', 'date');

            const rating = document.createElement('div');
            rating.setAttribute('class', 'rating');

            const genres = document.createElement('div');
            genres.setAttribute('class', 'genres');

            const info = document.createElement('div');
            info.setAttribute('class', 'info');

            const more_info = document.createElement('div');
            more_info.setAttribute('class', 'more_info');

            const div_card = document.createElement('div');
            div_card.setAttribute('class', 'card');

            const div_row = document.createElement('div');
            div_row.setAttribute('class', 'row');

            const div_column = document.createElement('div');
            div_column.setAttribute('class', 'column');
            
            const title = document.createElement('h3');
            title.setAttribute('id', 'title');

            title.innerHTML = `${element.title}<br><a href="movie.html?id=${element.id}&title=${element.title}">Reviews</a>`;
            image.src = IMG_PATH + element.poster_path;
            
            if (element.release_date) date.innerText = `${element.release_date}`;
            else date.innerText = 'No Information';

            if (element.vote_average != 0) {
                rating.innerHTML = `<span class="number"><b>⭐ ${element.vote_average.toString().substring(0, 3)}</b></span><br>IMDb`;
            }

            for(let i = 0; i < element.genre_ids.length; i++) {
                console.log(element.genre_ids[i]);

                const genre = document.createElement('button');
                genre.setAttribute('class', 'genre');
                
                let this_genre = genre_list.find(obj => obj.id === element.genre_ids[i]);
                genre.innerText = this_genre['name'];
                
                const link = `https://api.themoviedb.org/3/discover/movie?api_key=9e7fa9ff865d1ce0fdce40e41b3a9dff&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_genres=${element.genre_ids[i]}&with_watch_monetization_types=flatrate`;
                genre.addEventListener('click', (e) => {
                    main.innerHTML = '';
                    returnGenre(link, this_genre['name']);
                });
                genres.appendChild(genre);
            }

            info.appendChild(rating);
            info.appendChild(date);
            info.appendChild(image);
            more_info.appendChild(genres);
            more_info.appendChild(title);
            div_card.appendChild(info);
            div_card.appendChild(more_info);
            div_column.appendChild(div_card);
            div_row.appendChild(div_column);

            main.appendChild(div_row);
        });
    });
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const title_container = document.getElementById('cont-1');
    title_container.innerHTML = '';
    main.innerHTML = '';

    const searchItem = search.value;
    
    if (searchItem) {
        returnMovies(SEARCHAPI + searchItem);
        search.value = '';
        search.blur();
        title_container.innerHTML += `<h1>Search results for "${searchItem}"</h1>`;
    }
    else {
        search.value = '';
        title_container.innerHTML += `<h1>Search Movies</h1>
        <p><h3 style="color:gray">Search UnRate by typing a word or phrase in the search box at the top of this page.</h3></p>`;
    }
    tab_name.innerHTML = 'Find - UnRate';
})

function returnGenre(url, genre_name) {
    returnMovies(url);
    tab_name.innerHTML = `Top 20 ${genre_name} Movies - UnRate`;
    const title_container = document.getElementById('cont-1');
    title_container.innerHTML = '';
    title_container.innerHTML = `<h1>${genre_name} Movies<h1>`;
}

function menu() {
    if (sidebar.style.display === 'block') {
        sidebar.style.display = 'none';
    } else {
        sidebar.style.display = 'block';
  }
}

//Now Playing in India
function nowPlaying() {
    main.innerHTML = '';
    tab_name.innerHTML = 'Now Playing in India - UnRate';
    const title_container = document.getElementById('cont-1');
    title_container.innerHTML = '';
    title_container.innerHTML = `<h1>Now playing in India<h1>`;
    const url = 'https://api.themoviedb.org/3/movie/now_playing?api_key=9e7fa9ff865d1ce0fdce40e41b3a9dff&language=en-US&page=1&region=in';
    returnMovies(url);
}

//Popular in India
function popularIndia() {
    main.innerHTML = '';
    tab_name.innerHTML = 'UnRate: Rate & Review your favourite Movies';
    const title_container = document.getElementById('cont-1');
    title_container.innerHTML = '';
    title_container.innerHTML = `<h1>Popular in India<h1>`;
    const url = 'https://api.themoviedb.org/3/movie/popular?api_key=9e7fa9ff865d1ce0fdce40e41b3a9dff&language=en-US&page=1&region=in';
    returnMovies(url);
}

//Top Rated
function topRated() {
    main.innerHTML = '';
    tab_name.innerHTML = 'Top Rated Movies - UnRate';
    const title_container = document.getElementById('cont-1');
    title_container.innerHTML = '';
    title_container.innerHTML = `<h1>Top rated movies of all time<h1>`;
    const url = 'https://api.themoviedb.org/3/movie/top_rated?api_key=9e7fa9ff865d1ce0fdce40e41b3a9dff&language=en-US&page=1';
    returnMovies(url);
}

//Upcoming
function upcoming() {
    main.innerHTML = '';
    tab_name.innerHTML = 'Upcoming Movies - UnRate';
    const title_container = document.getElementById('cont-1');
    title_container.innerHTML = '';
    title_container.innerHTML = `<h1>Soon to release in India<h1>`;
    const url = 'https://api.themoviedb.org/3/movie/upcoming?api_key=9e7fa9ff865d1ce0fdce40e41b3a9dff&language=en-US&page=1&region=in';
    returnMovies(url);
}

function openForm() {
    document.getElementById('signin-form').style.display='flex';
    // When the user clicks anywhere outside of the form, close it
    document.addEventListener('mouseup', function(e) {
        var signin_content = document.getElementById('signin-inner');
        if (!signin_content.contains(e.target)) {
            closeForm();
        }
    });
}

function closeForm() {
    document.getElementById('signin-form').style.display = 'none';
}


function toLogin() {
    window.location.href = 'index.html';
}

function toSignup() {
    window.location.href = 'signup.html';
}