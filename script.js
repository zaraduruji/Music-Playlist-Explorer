document.addEventListener("DOMContentLoaded", function() {
    const featuredCover = document.getElementById("featured-cover");
    const featuredTitle = document.getElementById("featured-title");
    const featuredSongs = document.getElementById("featured-songs");

    function getRandomPlaylist() {
        const randomIndex = Math.floor(Math.random() * data.playlists.length);
        return data.playlists[randomIndex];
    }

    function displayPlaylist(playlist) {
        featuredCover.src = playlist.playlist_art;
        featuredTitle.textContent = playlist.playlist_name;
        featuredSongs.innerHTML = '';

        playlist.songs.forEach(song => {
            const songItem = document.createElement("li");
            songItem.innerHTML = `
                <img src="${song.cover_art}" alt="Song Cover">
                <div>
                    <p>${song.title}</p>
                    <p>${song.artist}</p>
                </div>
            `;
            featuredSongs.appendChild(songItem);
        });
    }

    const randomPlaylist = getRandomPlaylist();
    displayPlaylist(randomPlaylist);
});
