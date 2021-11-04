// Check hash for token
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

// Replace with your app's client ID, redirect URI and desired scopes
const clientId = 'f0d7eec2dc434d798222892db1bc3736';
const redirectUri = 'http://localhost:8080/find.html';
const scopes = [
  'streaming',
  'user-read-private',
  'playlist-modify-public',
  'user-read-playback-state',
  'user-modify-playback-state'
];

// If there is no token, redirect to Spotify authorization
if (!_token) {
    window.location = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join('%20')}&response_type=token`;
} else {

    let deviceId;
    let playbackSetting;

    // Page setup
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
        var trackIds = [];
        var trackUris = [];
        $('#tracks').append(trackIds + '<br>')
        let i = 0;
        do {
            i += 1;
            let title = data.tracks.items[i].name;
            let cover = data.tracks.items[i].album.images[1].url;
            let artist = data.tracks.items[i].artists[0].name;
            let trackid = data.tracks.items[i].id;
            trackIds.push(data.tracks.items[i].id)
            trackUris.push(data.tracks.items[i].uri)
            $.get('/audio-features?ids=' + trackid + '&token=' + _token, function (data) {
                var danceability = data.audio_features[0].danceability;
                var acousticness = data.audio_features[0].acousticness;
                let energy = data.audio_features[0].energy;
                let instrumentalness = data.audio_features[0].instrumentalness;
                let valence = data.audio_features[0].valence;
                let liveness = data.audio_features[0].liveness;
                $('#sear').append('<div class="mid col-sm-4 themed-grid-col d-flex track-elemen justify-content-center" id="go"> ' + title + ' By ' + artist + '</div><div id="' + [i] + '" class="col col-sm-4 themed-grid-col d-flex"><img class="img-fluid" src="' + cover + '"></div><div class="col col-sm-4 themed-grid-col d-flex"><div class="bet align-middle d-inline-flex">Danceability: ' + danceability + '<br>Acousticness: ' + acousticness + '<br>Energy: ' + energy + '<br>Liveness: ' + liveness + '<br>Instrumentalness: ' + instrumentalness + '<br>Valence: ' + valence + '</div></div></div>');
                $('#tracks').append(data.tracks.items[i].name + '<br>')
            });
        } while (i < 5)

    });
}

          //remove the searches
function cl() {
    let a = 0;
    do {
        a += 1;
        document.getElementById("" + a + "").remove();

    } while (a < 5);
}


function att() {
    $('#searhg').append('<h1>asasas</h1>' + '<br>')
    var id = '0tgVpDi06FyKpA1z0VMD4v'
    $.get('/audio-features?ids=' + id + '&token=' + _token, function (data) {
        alert(data.audio_features[0].energy);
    });
}







// let id = data.tracks.items[0].id;
/*

 $.get('/audio-features?ids=' + id + '&token=' + _token ", function ( data ):  
        $(".result").html(data); alert("Load was performed.")
    });
        
        
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
