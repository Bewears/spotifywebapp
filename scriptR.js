// Get hash token 
const hash = window.location.hash
    .substring(1)
    .split('&')
    .reduce(function (initial, item) {
        if (item) {
            var parts = item.split('=');
            initial[parts[0]] = decodeURIComponent(parts[1]);
        }
        return initial;
    }, {});
window.location.hash = '';

let _token = hash.access_token;

const authEndpoint = 'https://accounts.spotify.com/authorize';

// Clieent ID connects to spotify developers dashboarde 
const clientId = 'f0d7eec2dc434d798222892db1bc3736';
const redirectUri = 'http://localhost:8080/rec.html';
const scopes = [
  'streaming',
  'user-read-private',
  'playlist-modify-public',
  'user-read-playback-state',
  'user-modify-playback-state'
];

// Redirects to login page if there is no token
if (!_token) {
    window.location = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join('%20')}&response_type=token`;
} else {

    setUpSliders();
    showUser();

}

function genreLimitAlert(state) {
    if (state == "on") {
        $('#genreLimitAlert').show();
    } else {
        $('#genreLimitAlert').hide();
    }
}


function setUpSliders() {
    const sliderConfig = {
        range: true,
        min: 0,
        max: 1,
        step: 0.01,
        values: [0, 1],
        stop: function () {
            getRecommendations()
        }
    }

    $("#valence-slider").slider(sliderConfig);
    $("#energy-slider").slider(sliderConfig);
    $("#acousticness-slider").slider(sliderConfig);
    $("#danceability-slider").slider(sliderConfig);
    $("#instrumentalness-slider").slider(sliderConfig);
    $("#liveness-slider").slider(sliderConfig);
    $("#speechiness-slider").slider(sliderConfig);

    $("#popularity-slider").slider({
        range: true,
        min: 0,
        max: 100,
        step: 1,
        values: [0, 100],
        stop: function () {
            getRecommendations()
        }
    });

    $("#tempo-slider").slider({
        range: true,
        min: 40,
        max: 200,
        step: 1,
        values: [40, 200],
        stop: function () {
            getRecommendations()
        }
    });

    $('#number-tracks').on('change', function () {
        getRecommendations();
    });
}

// Shows user name top left.
function showUser() {
    $.get('/user?token=' + _token, function (user) {
        $('#current-user').text(user.id);
    });
}

// Lets users log out if they want to.
function logout() {
    _token = null;
    window.open('https://accounts.spotify.com/logout');
    location.reload();
}



function getSliderValues() {
    let values = {};

    let min_valence = $('#valence-slider').slider('values', 0);
    let max_valence = $('#valence-slider').slider('values', 1);
    let min_energy = $('#energy-slider').slider('values', 0);
    let max_energy = $('#energy-slider').slider('values', 1);
    let min_acousticness = $('#acousticness-slider').slider('values', 0);
    let max_acousticness = $('#acousticness-slider').slider('values', 1);
    let min_danceability = $('#danceability-slider').slider('values', 0);
    let max_danceability = $('#danceability-slider').slider('values', 1);
    let min_instrumentalness = $('#instrumentalness-slider').slider('values', 0);
    let max_instrumentalness = $('#instrumentalness-slider').slider('values', 1);
    let min_liveness = $('#liveness-slider').slider('values', 0);
    let max_liveness = $('#liveness-slider').slider('values', 1);
    let min_speechiness = $('#speechiness-slider').slider('values', 0);
    let max_speechiness = $('#speechiness-slider').slider('values', 1);
    let min_popularity = $('#popularity-slider').slider('values', 0);
    let max_popularity = $('#popularity-slider').slider('values', 1);
    let min_tempo = $('#tempo-slider').slider('values', 0);
    let max_tempo = $('#tempo-slider').slider('values', 1);

    if ($('#mode-minor').is(':checked') && !$('#mode-major').is(':checked')) {
        values["target_mode"] = 0;
    }
    if ($('#mode-major').is(':checked') && !$('#mode-minor').is(':checked')) {
        values["target_mode"] = 1;
    }

    if (min_valence > 0) {
        values["min_valence"] = min_valence;
    }
    if (max_valence < 1) {
        values["max_valence"] = max_valence;
    }
    if (min_energy > 0) {
        values["min_energy"] = min_energy;
    }
    if (max_energy < 1) {
        values["max_energy"] = max_energy;
    }
    if (min_acousticness > 0) {
        values["min_acousticness"] = min_acousticness;
    }
    if (max_acousticness < 1) {
        values["max_acousticness"] = max_acousticness;
    }
    if (min_danceability > 0) {
        values["min_danceability"] = min_danceability;
    }
    if (max_danceability < 1) {
        values["max_danceability"] = max_danceability;
    }
    if (min_instrumentalness > 0) {
        values["min_instrumentalness"] = min_instrumentalness;
    }
    if (max_instrumentalness < 1) {
        values["max_instrumentalness"] = max_instrumentalness;
    }
    if (min_liveness > 0) {
        values["min_liveness"] = min_liveness;
    }
    if (max_liveness < 1) {
        values["max_liveness"] = max_liveness;
    }
    if (min_speechiness > 0) {
        values["min_speechiness"] = min_speechiness;
    }
    if (max_speechiness < 1) {
        values["max_speechiness"] = max_speechiness;
    }
    if (min_popularity > 0) {
        values["min_popularity"] = min_popularity;
    }
    if (max_popularity < 100) {
        values["max_popularity"] = max_popularity;
    }
    if (min_tempo > 40) {
        values["min_tempo"] = min_tempo;
    }
    if (max_tempo < 200) {
        values["max_tempo"] = max_tempo;
    }

    return values;
}

function getRecommendations() {

    // Constant of playlist legnth
    let limit = 20;

    // Get genres selected by user 
    let genres = [];
    $('#genre :selected').each(function () {
        genres.push($(this).val());
    });
    var glen = genres.legnth

    if (glen > 5) {
        $('#tracks').append('<h2>Too many genres. Pick less than 5!</h2>')
    } else {

    }

    let genresString = genres.join();
    localStorage.setItem('currentGenres', genresString);
    $('#current-genres').text(genresString);

    // Get attribute values
    let audioFeatures = getSliderValues();
    localStorage.setItem('currentFeatures', JSON.stringify(audioFeatures));
    $.get('/recommendations?limit=' + limit + '&seed_genres=' + genresString + '&' + $.param(audioFeatures) + '&token=' + _token, function (data) {
        $('#tracks').empty();
        let trackIds = [];
        let trackUris = [];
        if (data.tracks) {
            if (data.tracks.length > 0) {
                data.tracks.forEach(function (track) {
                    trackIds.push(track.id);
                    trackUris.push(track.uri);
                });
                localStorage.setItem('tracklist', trackUris.join());
                renderTracks(trackIds);
                play(trackUris.join());
            } else {
                $('#tracks').append('<h2>Sorry, there are no results. Please widen your search criteria.</h2>')
            }
        } else {
            $('#tracks').append('<h2>Select some genres, please.</h2>')
        }
    });
}


function renderTracks(ids) {
    $.get('/tracks?ids=' + ids.join() + '&token=' + _token, function (tracks) {
        tracks.forEach(function (track) {
            let image = track.album.images ? track.album.images[0].url : 'https://upload.wikimedia.org/wikipedia/commons/3/3c/No-album-art.png';
            let trackElement = '<div class="track-element" id="' + track.uri + '" ><div><img class="album-art" src="' + image + '"/><div><a href="https://open.spotify.com/track/' + track.id + '">' + track.name + '</a><p>' + track.artists[0].name + '</p></div></div></div>';
            $('#tracks').append(trackElement);
        })
    });
}

function makePlaylist() {
    if (localStorage.getItem('tracklist')) {
        $.post('/playlist?tracks=' + localStorage.getItem('tracklist') + '&genres=' + localStorage.getItem('currentGenres') + '&features=' + localStorage.getItem('currentFeatures') + '&token=' + _token);
        $('#notice').html('<div class="alert alert-success alert-dismissable" role="alert"> These songs have been made in to a playlist on your account named "sponline"<button type="button" class="close" data-dismiss="alert" aria-label="Close" onclick=""><span aria-hidden="true">&times;</span></button></div>');
    }
}

