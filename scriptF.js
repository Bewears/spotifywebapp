// Get token 
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

// Set token
let _token = hash.access_token;

const authEndpoint = 'https://accounts.spotify.com/authorize';

// Program authentication
const clientId = 'f0d7eec2dc434d798222892db1bc3736';
const redirectUri = 'http://localhost:8080/find.html';
const scopes = [
  'streaming',
  'user-read-private',
  'playlist-modify-public',
  'user-read-playback-state',
  'user-modify-playback-state'
];

if (!_token) {
    window.location = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join('%20')}&response_type=token`;
} else {

    showUser();
}


function showUser() {
    $.get('/user?token=' + _token, function (user) {
        $('#current-user').text(user.id);
    });
}

function logout() {
    _token = null;
    window.open('https://accounts.spotify.com/logout');
    location.reload();
}


function att() {
    $('#tracks').append('<h1>asasas</h1>' + '<br>')
    var id = '0tgVpDi06FyKpA1z0VMD4v'
    $.get('/audio-features?ids=' + id + '&token=' + _token, function (popularity) {
        $(".result").html(popularity);
        alert("Load was performed." + data.danceability);

    });
}


function renderTracks(ids) {
    $.get('/tracks?ids=' + ids.join() + '&token=' + _token, function (tracks) {
        tracks.forEach(function (track) {
            let image = track.album.images ? track.album.images[0].url : 'https://upload.wikimedia.org/wikipedia/commons/3/3c/No-album-art.png';
            let trackElement = '<div class="track-element" id="' + track.uri + '" onclick="play(\'' + track.uri + '\');"><div><img class="album-art" src="' + image + '"/><div><a href="https://open.spotify.com/track/' + track.id + '">' + track.name + '</a><p>' + track.artists[0].name + '</p></div></div></div>';
            $('#tracks').append(trackElement);
        })
    });
}



function search() {
    var q2 = document.getElementById("sea").value;
    var limit2 = 6
    $.get('/search?q=' + q2 + '&type=track&limit=' + limit2 + '&token=' + _token, function (data) {
        let trackIds = [];
        let trackUris = [];
        $('#tracks').append(trackIds + '<br>')
        let i = 0;
        do {
            i += 1;
            let title = data.tracks.items[i].name;
            let cover = data.tracks.items[i].album.images[1].url;
            let artist = data.tracks.items[i].artists[0].name;
            $('#sear').append('<div id="' + [i] + '" id="go" class="col-sm-12 themed-grid-col"><img src="' + cover + '"></img>' + title + ' By ' + artist + '<div class="bet align-middle"><h5>Danceability: ' + data.Danceability + '</h5> <h5>Acousticness: ' + data.Acousticness + '</h5> <h5>Energy: ' + data.Energy + '</h5> <h5>Loudness: ' + data.Loudness + '</h5> <h5>Instrumentalness: ' + data.Instrumentalness + '</h5> <h5>Valence: ' + data.Valence + '</h5></div></div>')
            $('#tracks').append(data.tracks.items[i].name + '<br>')
            trackIds.push(data.tracks.items[i].id)
            trackUris.push(data.tracks.items[i].uri)

        } while (i < 5);

    });
}

function cl() {
    let a = 0;
    do {
        a += 1;
        document.getElementById("" + a + "").remove();

    } while (a < 5);
}





// let id = data.tracks.items[0].id;
/*
dict = {}
list = []
function search() {
    var q2 = 'happier'
    var limit2 = 5
    $.get('/search?q=' + q2 + '&type=track&limit=' + limit2 + '&token=' + _token, function (data) {
        $(".result").html(data);
        alert("Load was performed." + data.tracks.items);
        let beans = []
        $('#tracks').append()
    });
}

let a = data.tracks.items[i].album.images[0].url
            $('#tracks').append('<img src="' + a + '"></img>' + '<br>')

for (let i = 0; i < data.tracks.length; i++) {
            text += data.tracks.item[i].album.name + "<br>";
        }

        document.getElementById("demo").innerHTML = text;
        
        let title = data.tracks.items[0].name;
        let cover = data.tracks.items[0].album.images[1].url;
        let artist = data.tracks.items[0].artists[0].name;
        $('#1').append('<div>' + '<img src="' + cover + '"></img>' + title + ' By ' + artist + id)
           $('#tracks').empty();
        let i = 0;
        do {
            i += 1;
            console.log(data.tracks.items[i].name);
            $('#tracks').append(data.tracks.items[i].name + '<br>')
            trackIds.push(data.tracks.items[i].id)
            trackUris.push(data.tracks.items[i].uri)

        } while (i < 5);
*/
