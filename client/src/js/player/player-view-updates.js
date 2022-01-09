import { state } from '../state/state';
import { playerElms } from '../dom/dom-elements';
import { createTrackHTML } from '../dom/template-creators';
import { getFormattedDuration } from '../helpers/duration-formatter';
import { renderWaveForm } from './player-waveform-handler';

export const updatePlayerAfterAlbumSelection = () => {
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

    requestAnimationFrame(() => renderWaveForm());

    playerElms.playerBlockElm.classList.add('player--active');
};

export const hidePlayerHandler = () => {
    playerElms.playerBlockElm.classList.remove('player--active');
};

export const updatePlayerAfterTrackSelection = () => {
    [...playerElms.playerTracklistElm.children].forEach((child) => {
        child.classList.remove('track--playing');
    });

    playerElms.playerTotalTimeElm.textContent = getFormattedDuration(
        state.selectedTrack.duration
    );
};

export const currentTimeUpdateHandler = () => {
    const current = playerElms.playerAudioElm.currentTime;

    playerElms.playerCurrentTimeElm.textContent = getFormattedDuration(current);
};
