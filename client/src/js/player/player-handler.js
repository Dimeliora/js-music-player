import { ee } from '../helpers/event-emitter';
import { state } from '../state/state';
import { playerElms } from '../dom/dom-elements';
import { createTrackHTML } from '../dom/template-creators';
import { getTrackFile } from '../service/fetch-data';

const hidePlayerHandler = () => {
    playerElms.playerBlockElm.classList.remove('player--active');
};

const trackSelectHandler = (e) => {
    const trackElm = e.target.closest('[data-track-id]');
    if (!trackElm) {
        return;
    }

    const trackId = trackElm.dataset.trackId;

    if (e.target.closest('[data-track-play]')) {
        if (state.selectedTrack?.id !== trackId) {
            state.selectedTrack = state.selectedAlbum.tracklist.find(
                ({ id }) => id === trackId
            );

            [...playerElms.playerTracklistElm.children].forEach((child) => {
                child.classList.remove('track--playing');
            });

            playerElms.playerAudioElm.src = getTrackFile(
                state.selectedAlbum.id,
                state.selectedTrack.id
            );
        }

        trackElm.classList.add('track--playing');

        playerElms.playerAudioElm.play();
        return;
    }

    if (e.target.closest('[data-track-pause]')) {
        trackElm.classList.remove('track--playing');

        playerElms.playerAudioElm.pause();
        return;
    }
};

ee.on('albums/album-selected', () => {
    const album = state.selectedAlbum;

    const albumCoverSrc = `url(${album.cover})`;
    playerElms.playerBlockElm.style.setProperty('--bg-image', albumCoverSrc);

    playerElms.playerThumbnailElm.src = album.cover;
    playerElms.playerThumbnailElm.alt = `${album.title} album cover`;

    playerElms.playerTitleElm.textContent = album.title;
    playerElms.playerArtistElm.textContent = album.artist;
    playerElms.playerGenreElm.textContent = album.genre;

    let currentPlayingTrackId;
    if (state.selectedTrack && !playerElms.playerAudioElm.paused) {
        currentPlayingTrackId = state.selectedTrack.id;
    }

    const tracklistMarkup = album.tracklist
        .map((track, idx) =>
            createTrackHTML({
                ...track,
                artist: album.artist,
                index: idx + 1,
                isPlaying: track.id === currentPlayingTrackId,
            })
        )
        .join(' ');

    playerElms.playerTracklistElm.innerHTML = tracklistMarkup;

    playerElms.playerBlockElm.classList.add('player--active');
});

playerElms.playerHideElm.addEventListener('click', hidePlayerHandler);

playerElms.playerTracklistElm.addEventListener('click', trackSelectHandler);
