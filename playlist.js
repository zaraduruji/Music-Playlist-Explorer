document.addEventListener("DOMContentLoaded", function() {
    let modal = document.getElementById("playlist-modal");
    let closeModalButton = document.getElementById("close-modal");
    let editPlaylistModal = document.getElementById("editPlaylistForm");
    let closeEditPlaylistButton = document.getElementById("close-edit-playlist");
    let searchInput = document.getElementById("search-bar");

    function openModal(playlist) {
        document.querySelector(".modal-title").innerText = playlist.playlist_name;
        document.querySelector(".modal-creator").innerText = 'Creator: ' + playlist.playlist_creator;
        document.querySelector(".modal-cover").src = playlist.playlist_art;
        updateModalContent(playlist);

        modal.style.display = "block";
    }

    function updateModalContent(playlist) {
        let songList = document.querySelector(".modal-songs");
        songList.innerHTML = "";

        playlist.songs.forEach(function(song) {
            let songItem = document.createElement("div");
            songItem.classList.add("song");

            let songCover = document.createElement("img");
            songCover.src = song.cover_art;
            songCover.alt = "Song Cover";
            songCover.classList.add("song-cover");

            let songDetails = document.createElement("div");
            songDetails.classList.add("song-details");

            let songTitle = document.createElement("p");
            songTitle.textContent = song.title;
            songTitle.classList.add("song-title");

            let songArtist = document.createElement("p");
            songArtist.textContent = song.artist;
            songArtist.classList.add("song-artist");

            let songAlbum = document.createElement("p");
            songAlbum.textContent = song.album;
            songAlbum.classList.add("song-album");

            let songDuration = document.createElement("p");
            songDuration.textContent = song.duration;
            songDuration.classList.add("song-duration");

            songDetails.appendChild(songTitle);
            songDetails.appendChild(songArtist);
            songDetails.appendChild(songAlbum);
            songItem.appendChild(songCover);
            songItem.appendChild(songDetails);
            songItem.appendChild(songDuration);

            songList.appendChild(songItem);
        });

        let shuffleButton = document.createElement("button");
        shuffleButton.textContent = "Shuffle";
        shuffleButton.classList.add("shuffle-button");
        shuffleButton.addEventListener("click", function() {
            shufflePlaylist(playlist);
            updateModalContent(playlist);
        });

        let existingShuffleButton = modal.querySelector(".shuffle-button");
        if (existingShuffleButton) {
            existingShuffleButton.remove();
        }

        modal.querySelector(".modal-content").insertBefore(shuffleButton, modal.querySelector(".modal-songs"));
    }

    function shufflePlaylist(playlist) {
        for (let i = playlist.songs.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [playlist.songs[i], playlist.songs[j]] = [playlist.songs[j], playlist.songs[i]];
        }
    }

    closeModalButton.onclick = function() {
        modal.style.display = "none";
    };

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };

    function createPlaylistCard(playlist) {
        let card = document.createElement("div");
        card.classList.add("playlist-card");

        let img = document.createElement("img");
        img.src = playlist.playlist_art;
        img.alt = "Playlist Cover";
        img.classList.add("playlist-cover");

        let title = document.createElement("h2");
        title.textContent = playlist.playlist_name;
        title.classList.add("playlist-title");

        let creator = document.createElement("p");
        creator.textContent = 'Creator: ' + playlist.playlist_creator;
        creator.classList.add("playlist-creator");

        let likes = document.createElement("p");
        likes.classList.add("playlist-likes");

        let heart = document.createElement("span");
        heart.textContent = "❤️";
        heart.style.cursor = "pointer";
        heart.addEventListener("click", function(event) {
            event.stopPropagation();
            playlist.likeCount++;
            likesCount.textContent = playlist.likeCount;
        });

        let likesCount = document.createElement("span");
        likesCount.textContent = playlist.likeCount;

        likes.appendChild(heart);
        likes.appendChild(likesCount);

        let deleteButton = document.createElement("button");
        deleteButton.classList.add("delete-button");
        deleteButton.innerHTML = "&minus;";
        deleteButton.addEventListener("click", function(event) {
            event.stopPropagation();
            card.remove();
            let index = data.playlists.indexOf(playlist);
            if (index > -1) {
                data.playlists.splice(index, 1);
            }
        });

        let editButton = document.createElement("button");
        editButton.classList.add("edit-button");
        editButton.innerHTML = "&#9998;";
        editButton.addEventListener("click", function(event) {
            event.stopPropagation();
            openEditForm(playlist);
        });

        card.appendChild(img);
        card.appendChild(title);
        card.appendChild(creator);
        card.appendChild(likes);
        card.appendChild(deleteButton);
        card.appendChild(editButton);

        card.addEventListener("click", function() {
            openModal(playlist);
        });

        return card;
    }

    function openEditForm(playlist) {
        document.getElementById("editPlaylistName").value = playlist.playlist_name;
        document.getElementById("editCreatorName").value = playlist.playlist_creator;
        let editSongsContainer = document.getElementById("editSongsContainer");
        editSongsContainer.innerHTML = "";
        playlist.songs.forEach((song, index) => {
            let songDiv = document.createElement("div");
            songDiv.classList.add("edit-song");
            songDiv.innerHTML = `
                <label for="editSongTitle${index + 1}">Song ${index + 1} Title:</label>
                <input type="text" id="editSongTitle${index + 1}" name="editSongTitle${index + 1}" value="${song.title}" required>
                <label for="editSongArtist${index + 1}">Song ${index + 1} Artist:</label>
                <input type="text" id="editSongArtist${index + 1}" name="editSongArtist${index + 1}" value="${song.artist}" required>
                <label for="editSongDuration${index + 1}">Song ${index + 1} Duration:</label>
                <input type="text" id="editSongDuration${index + 1}" name="editSongDuration${index + 1}" value="${song.duration}" required>
                <button type="button" onclick="removeEditSong(${index})">Remove</button>
            `;
            editSongsContainer.appendChild(songDiv);
        });

        editPlaylistModal.style.display = "block";

        document.getElementById("editForm").onsubmit = function(e) {
            e.preventDefault();
            playlist.playlist_name = document.getElementById("editPlaylistName").value;
            playlist.playlist_creator = document.getElementById("editCreatorName").value;
            playlist.songs = [];
            document.querySelectorAll(".edit-song").forEach((songDiv, index) => {
                let song = {
                    title: songDiv.querySelector(`#editSongTitle${index + 1}`).value,
                    artist: songDiv.querySelector(`#editSongArtist${index + 1}`).value,
                    duration: songDiv.querySelector(`#editSongDuration${index + 1}`).value
                };
                playlist.songs.push(song);
            });
            editPlaylistModal.style.display = "none";
            document.getElementById("playlist-grid").innerHTML = "";
            data.playlists.forEach(function(playlist) {
                let card = createPlaylistCard(playlist);
                document.getElementById("add-playlist-button").insertAdjacentElement("beforebegin", card);
            });
        };
    }

    closeEditPlaylistButton.onclick = function() {
        editPlaylistModal.style.display = "none";
    };

    window.onclick = function(event) {
        if (event.target == editPlaylistModal) {
            editPlaylistModal.style.display = "none";
        }
    };

    function removeEditSong(index) {
        document.querySelector(`#editSongsContainer .edit-song:nth-child(${index + 1})`).remove();
    }

    data.playlists.forEach(function(playlist) {
        let card = createPlaylistCard(playlist);
        document.getElementById("add-playlist-button").insertAdjacentElement("beforebegin", card);
    });

    // Adding new playlist functionality
    let addPlaylistModal = document.getElementById("addPlaylistForm");
    let addPlaylistButton = document.getElementById("add-playlist-button");
    let closeAddPlaylistButton = document.getElementById("close-add-playlist");

    let openFormModal = function() {
        addPlaylistModal.style.display = "block";
    };

    addPlaylistButton.addEventListener("click", function() {
        window.scroll({ top: 0, behavior: "smooth" });
        openFormModal();
        console.log("Modal opened");
    });

    closeAddPlaylistButton.addEventListener("click", function() {
        addPlaylistModal.style.display = "none";
    });

    window.addEventListener("click", function(event) {
        if (event.target === addPlaylistModal) {
            addPlaylistModal.style.display = "none";
        }
    });

    document.getElementById("playlistForm").addEventListener("submit", function(event) {
        event.preventDefault();

        let playlistName = document.getElementById("playlistName").value;
        let creatorName = document.getElementById("creatorName").value;
        let songs = [];
        let songCount = (document.getElementById("songsContainer").childElementCount / 4);

        for (let i = 1; i <= songCount; i++) {
            let songTitle = document.getElementById("songTitle" + i).value;
            let songArtist = document.getElementById("songArtist" + i).value;
            let songDuration = document.getElementById("songDuration" + i).value;

            songs.push({
                title: songTitle,
                artist: songArtist,
                album: "",
                cover_art: "song-cover-placeholder.png",
                duration: songDuration
            });
        }

        let newPlaylist = {
            playlist_name: playlistName,
            playlist_creator: creatorName,
            playlist_art: "icons/addition symbol.jpg",
            likeCount: 0,
            songs: songs
        };

        data.playlists.push(newPlaylist);

        let newCard = createPlaylistCard(newPlaylist);
        document.getElementById("add-playlist-button").insertAdjacentElement("beforebegin", newCard);

        addPlaylistModal.style.display = "none";
        document.getElementById("playlistForm").reset();
    });

    let songCount = 1;
    window.addSong = function() {
        songCount++;
        let songsContainer = document.getElementById("songsContainer");

        let createInput = function(labelText, inputId, inputName) {
            let label = document.createElement("label");
            label.setAttribute("for", inputId);
            label.textContent = labelText;

            let input = document.createElement("input");
            input.setAttribute("type", "text");
            input.setAttribute("id", inputId);
            input.setAttribute("name", inputName);
            input.required = true;

            songsContainer.appendChild(label);
            songsContainer.appendChild(input);
        };

        createInput('Song ' + songCount + ' Title:', 'songTitle' + songCount, 'songTitle' + songCount);
        createInput('Song ' + songCount + ' Artist:', 'songArtist' + songCount, 'songArtist' + songCount);
        createInput('Song ' + songCount + ' Duration:', 'songDuration' + songCount, 'songDuration' + songCount);
    };

    searchInput.addEventListener("input", function() {
        let searchTerm = searchInput.value.toLowerCase();
        document.querySelectorAll(".playlist-card").forEach(function(card) {
            let title = card.querySelector(".playlist-title").textContent.toLowerCase();
            let creator = card.querySelector(".playlist-creator").textContent.toLowerCase();
            if (title.includes(searchTerm) || creator.includes(searchTerm)) {
                card.style.display = "block";
            } else {
                card.style.display = "none";
            }
        });
    });

});
