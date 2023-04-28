const APILINK = 'http://localhost:8000/api/v1/reviews/';
//Here, instead of using themoviedb api, we're using the api that we made for the backend

const url = new URL(location.href);   //URL object to extract parameters
const movieId = url.searchParams.get('id');
const movieTitle = url.searchParams.get('title');

const movieAPILINK = `https://api.themoviedb.org/3/movie/${movieId}?api_key=9e7fa9ff865d1ce0fdce40e41b3a9dff&language=en-US`;

const main = document.getElementById('section');

fetch(movieAPILINK)
.then(res => res.json())
.then(function(data) {

    const title = document.getElementById('title');
    const top = document.getElementById('top');
    const visuals = document.getElementById('visuals');
    const poster = document.getElementById('poster');
    const video = document.getElementById('video');
    const genres = document.getElementById('genres');
    const rating = document.getElementsByClassName('rating')[0];
    const tagline = document.getElementById('tagline');
    const overview = document.getElementById('overview');
    const languages = document.getElementById('languages');
    const director = document.getElementById('director');
    const writers = document.getElementById('writers');
    const stars = document.getElementById('stars');
    const cast = document.getElementById('cast');
    const tab_name = document.getElementById('tab');

    title.innerHTML = `${movieTitle}`;

    year = data.release_date.substring(0, 4);
    top.innerHTML = `<i class="fa fa-calendar" class="icon"></i>&nbsp&nbsp${year}&nbsp&nbsp&nbsp&#x2022;&nbsp&nbsp&nbsp<i class="fa fa-clock-o" id="icon"></i>&nbsp&nbsp${data.runtime} min`;
    
    tab_name.innerHTML = `${movieTitle} (${year}) - UnRate`;

    poster.setAttribute('class', 'poster');
    poster.setAttribute('alt', `${data.title}`);
    poster.src = "https://image.tmdb.org/t/p/w1280" + data.poster_path;

    fetch(`https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=9e7fa9ff865d1ce0fdce40e41b3a9dff&language=en-US`)
    .then(res => res.json())
    .then(function(elements) {
        elements.results.forEach(element => {
            if (element.type === "Trailer"){
                let vid_key = element.key;
                video.src = "https://www.youtube.com/embed/"+vid_key+"?mute=1&autoplay=1&controls=1&rel=0&modestbranding=1&loop=1&fs=0&showInfo=0";
            }
        }); 
    })

    genres.setAttribute('class', 'genres');
    for(let i = 0; i < data.genres.length; i++) {
        console.log(data.genres[i].name);

        const genre = document.createElement('button');
        genre.setAttribute('class', 'genre');
        genre.innerText = data.genres[i].name;
                
        genre.addEventListener('click', (e) => {
            
        });
        genres.appendChild(genre);
    }
      
    if (data.vote_average != 0) {
        rating.innerHTML = `Rating: <span class="number"><b>⭐ ${data.vote_average.toString().substring(0, 3)}<span class="gray">/10<span></b></span><br>`;
        if(data.imdb_id !== "")
            rating.addEventListener('click', function(ev) {
                window.location.href = "https://www.imdb.com/title/"+data.imdb_id;
            });
    }

    if(data.overview !== "") {
        overview.innerText = data.overview;
    }

    languages.innerHTML = `Spoken Languages:&nbsp`;
    for(let i = 0; i < data.spoken_languages.length; i++) {
        if (i == 0 && data.spoken_languages.length == 1) languages.innerHTML = `<b>Spoken Language:&nbsp</b>${data.spoken_languages[i].english_name}`;
        else if (i == 0 && data.spoken_languages.length > 1) languages.innerHTML = `<b>Spoken Languages:&nbsp</b>${data.spoken_languages[i].english_name}`;
        else {
            languages.innerHTML += `,&nbsp${data.spoken_languages[i].english_name}`
        }
    }

    fetch(`https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=9e7fa9ff865d1ce0fdce40e41b3a9dff&language=en-US`)
    .then(res => res.json())
    .then(function(elements) {
        let i = 0;
        let j = 0;
        let k = 0;
        let x = 0;
        elements.cast.forEach(element => {
            if (i < 1 && (element.known_for_department === "Directing" || element.job === "Director")) {
                director.innerHTML = `<b>Director:</b>&nbsp${element.name}`;
                i++;
            }
            else if (j < 2 && (element.known_for_department === "Writing" || element.job === "Writer")) {
                if(j == 0) writers.innerHTML = `<b>Writers:</b>&nbsp${element.name}`;
                else writers.innerHTML += `,&nbsp${element.name}</b>`;
                j++;
            }
            else if (k < 3 && element.known_for_department === "Acting") {
                if(k == 0) stars.innerHTML = `<b>Stars:</b>&nbsp${element.name}`;
                else stars.innerHTML += `,&nbsp${element.name}</b>`;
                k++;
            }
            if ((x < 18) && (element.known_for_department === "Acting" && element.profile_path != null)) {
                const actor = document.createElement('div');
                actor.setAttribute('class', 'actor');
                
                const img = document.createElement('img');
                img.setAttribute('class', 'profile-pic');
                img.setAttribute('alt', `${element.name}`);
                img.src = 'https://image.tmdb.org/t/p/w1280' + element.profile_path;
                
                const actor_name = document.createElement('div');
                actor_name.innerText = `${element.name}`;
                actor_name.setAttribute('class', 'actor-name');
                
                const character = document.createElement('div');
                character.innerText = `${element.character}`;
                character.setAttribute('class', 'character');
                
                const text_value = document.createElement('div');
                text_value.setAttribute('class', 'text-value');

                text_value.appendChild(actor_name);
                text_value.appendChild(character);
                actor.appendChild(img);
                actor.appendChild(text_value);
                cast.appendChild(actor);

                x++;
            }
        });
        elements.crew.forEach(element => {
            if (i < 1 && (element.known_for_department === "Directing" || element.job === "Director")) {
                director.innerHTML += `<b>Director:</b>&nbsp${element.name}`;
                i++;
            }
            else if (j < 2 && (element.known_for_department === "Writing" || element.job === "Writer")) {
                if(j == 0) writers.innerHTML = `<b>Writers:</b>&nbsp${element.name}`;
                else writers.innerHTML += `,&nbsp${element.name}</b>`;
                j++;
            }
        });
    });

    if(data.tagline !== "") {
        document.getElementById('tag-div').style.display = "flex";
        tagline.innerText = data.tagline;
    }
});


const GENRE_DETAILS = 'https://api.themoviedb.org/3/genre/movie/list?api_key=9e7fa9ff865d1ce0fdce40e41b3a9dff&language=en-US';
let genre_list = [];
fetch(GENRE_DETAILS)
.then(res => res.json())
.then(function(data) {
    genre_list = data['genres'];
});

//Carousel slider to get similar movies
fetch(`https://api.themoviedb.org/3/movie/${movieId}/similar?api_key=9e7fa9ff865d1ce0fdce40e41b3a9dff&language=en-US&page=1`)
    .then(res => res.json())
    .then(function(element) {
        let x = 0;
        element.results.forEach(element => {
            const image = document.createElement('img');
            image.setAttribute('class', 'thumbnail');
            image.setAttribute('id', 'image');
            image.setAttribute('alt', `${element.title}`);

            const date = document.createElement('div');
            date.setAttribute('class', 'date');

            const rating = document.createElement('div');
            rating.setAttribute('id', 'rating');

            const genres = document.createElement('div');
            genres.setAttribute('id', 'genres');

            const info = document.createElement('div');
            info.setAttribute('id', 'info');

            const more_info = document.createElement('div');
            more_info.setAttribute('class', 'more_info');

            const div_card = document.createElement('div');
            div_card.setAttribute('class', 'card');

            const div_row = document.createElement('div');
            div_row.setAttribute('class', 'row');

            const div_column = document.createElement('div');
            div_column.setAttribute('class', 'column');
            
            const title = document.createElement('h3');
            title.setAttribute('class', 'title');

            title.innerHTML = `${element.title}<br><a href="movie.html?id=${element.id}&title=${element.title}">Reviews</a>`;
            image.src = 'https://image.tmdb.org/t/p/w1280' + element.poster_path;
            
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
                console.log(this_genre)
                genre.innerText = this_genre['name'];
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

            console.log(Math.floor(x/4)+1)
            document.getElementById(`carousel${Math.floor(x/4)+1}`).appendChild(div_row);
            x++;
        });
    });

//innerText and innerHTML have similar use except it's better to use innerText so you don't mess up the HTML of the page

const div_new = document.createElement('div');
div_new.innerHTML = `
    <div class='row'>
        <div class='column'>
            <div class='review-card'>
                <div class="input-conts">
                    <span class="long-cont">YOUR RATING</span> 
                    <span class="filler-text">Can't express your feelings in numbers? Leave it to AI!</span> 
                    <input type='text' id='new_rating' value='' placeholder="1-10">
                </div>
                <div class="input-conts">
                    <span class="long-cont">YOUR REVIEW</span>
                    <input type='text' id='new_headline' value='' placeholder="Write a headline for your review here">
                    <textarea id='new_review' value='' placeholder="Write your review here - in any language" rows="10"></textarea>
                </div>
                <div class="input-conts">
                    <span class="long-cont">Username</span>
                    <input type='text' id='new_user' value='' placeholder="Username">
                </div>
                <div><button id="submit" onclick='saveReview("new_rating", "new_headline", "new_review", "new_user")'>Submit</button></div>
            </div>
        </div>
    </div>`;
main.appendChild(div_new);
//Because we're not using any variables in the div_new innerHTML, it means that it was okay for us to write that HTML in the movie.html file also
//But for simplicity and ease of understanding, we wrote it out here

returnReviews(APILINK);

function returnReviews(url) {
    fetch(url + 'movie/' + movieId)
    .then(res => res.json())
    .then(function(data) {
        console.log(data);
        data.forEach(review => {
            const div_card = document.createElement('div');

            let review_data = `
            <div class='row'>
                <div class='column'>
                    <div class='saved-review-card' id='${review._id}'>
                        <div class="review-rating">
                            <span id="star-icon">&starf;</span>
                            <span class="review-number">
                                <h4>${review.rating}</h4>/10
                            <span>  
                        </div>
                        <div class="review-header">
                            <span class="headline"><strong>"${review.headline}"</strong></span>
                            <br/>
                            <div >
                                <span class="review-user">${review.user}</span>
                                &nbsp;
                                <span class="review-time">${review.review_time}</span>
                            </div>
                        </div>
                        <div>
                        <div class="review-content">
                            <div>
                                <span class="review-text">
                                    ${review.review}
                                </span>
                            </div>`

                            if (typeof(review.translation) !== "undefined" && review.translation != null && review.translation != "") {
                                review_data += `
                                    <br>
                                    <div>
                                        Translation:
                                        <span class="review-translation">
                                            <br>
                                            ${review.translation}
                                        </span>
                                    </div>`
                            }
                            
                            review_data += `
                        </div>
                        <br>
                        <div class="review-buttons">
                            <button id="edit-btn" onclick='editReview("${review._id}", "${review.rating}", "${review.headline}", "${review.review}", "${review.user}")'>Edit Review</button>
                            <button id="delete-btn" onclick='deleteReview("${review._id}")'>Delete Review</button>
                        </div>
                    </div>
                    </div>
                </div>
            </div>`;

            div_card.innerHTML = review_data;
            main.appendChild(div_card);
        });
    });
}

function editReview(id, rating, headline, review, user) {
    const element = document.getElementById(id);
    //id that we passed to edit function which is, in reality, the id of the div card
    const ratingInputId = 'rating' + id;
    const headlineInputId = 'headline' + id;
    const reviewInputId = 'review' + id;
    const userInputId = 'user' + id;
    //We make these ids so that there is a unique name for every html element on the page, to send it over to the backend

    element.innerHTML = `
    <p><strong>Rating: </strong>
        <input type='text' id='${ratingInputId}' value='${rating}'>
    </p>
    <p><strong>Headline: </strong>
        <input type='text' id='${headlineInputId}' value='${headline}'>
    </p>
    <p><strong>Review: </strong>
        <input type='text' id='${reviewInputId}' value='${review}'>
    </p>
    <p><strong>User: </strong>
        <input type='text' id='${userInputId}' value='${user}'>
    </p>
    <p>
        <a href='#' onclick='saveReview("${ratingInputId}", "${headlineInputId}", "${reviewInputId}", "${userInputId}", "${id}")'>Save</a>
    </p>`;
}

//Sending data over to backend to save
function saveReview(ratingInputId, headlineInputId, reviewInputId, userInputId, id='') {
    //id='' in params of this fn gives a default value to id (empty string) if no value is specified on function call
    const rating = document.getElementById(ratingInputId).value;
    const headline = document.getElementById(headlineInputId).value;
    const review = document.getElementById(reviewInputId).value;
    const user = document.getElementById(userInputId).value;

    //if id is not an empty string => if editReview called the save Review function
    if (id) {
        //fetch() is a js method that allows us to send an http request to a url and get response back
        //By default it makes use of the GET method, though you can explicitly specify what method you intend to use as shown below
        fetch(APILINK + id, {
            method: 'PUT', //Update review api route
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({'user': user, 'rating': rating, 'headline': headline, 'review': review, 'review_time': `${new Date().toLocaleString()}`}) //js command to get a string from an object
        }).then(res => res.json())
        .then(res => {
            console.log(res);
            location.reload(); //js method to reload the url because we now want to see the new review also
        });
    } else {
        fetch(APILINK + 'new', {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({'user': user, 'rating': rating, 'headline': headline, 'review': review, 'review_time': `${new Date().toLocaleString()}`, 'movieId': movieId})
        }).then(res => res.json())
        .then(res => {
            console.log(res);
            location.reload();
        });
    } 
}

function deleteReview(id) {
    fetch(APILINK + id, {
        method: 'DELETE'
    }).then(res => res.json())
    .then(res => {
        console.log(res);
        location.reload();
    });
}
    