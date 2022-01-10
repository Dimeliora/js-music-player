import { playerElms } from './player-dom-elements';
import { renderWaveForm } from './player-waveform-handler';
import { createTrackHTML } from './player-template-creators';
import { getFormattedDuration } from '../helpers/duration-formatter';

export const updatePlayerAfterAlbumSelection = ({
    album,
    selectedTrack,
    playingAlbum,
}) => {
    const albumCoverSrc = `url(${album.cover})`;
    playerElms.playerBlockElm.style.setProperty('--bg-image', albumCoverSrc);

    playerElms.playerThumbnailElm.src = album.cover;
    playerElms.playerThumbnailElm.alt = `${album.title} album cover`;

    playerElms.playerTitleElm.textContent = album.title;
    playerElms.playerArtistElm.textContent = album.artist;
    playerElms.playerGenreElm.textContent = album.genre;

    let currentPlayingTrackId;
    if (selectedTrack && !playerElms.playerAudioElm.paused) {
        currentPlayingTrackId = selectedTrack.id;
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

    if (!playingAlbum) {
        requestAnimationFrame(() => renderWaveForm());
    }

    showPlayerHandler();
    playerElms.playerBlockElm.focus();
};

export const showPlayerHandler = () => {
    playerElms.playerBlockElm.classList.add('player--active');
};

export const hidePlayerHandler = () => {
    playerElms.playerBlockElm.classList.remove('player--active');
};

export const updatePlayerViewAfterTrackSelection = (selectedTrack) => {
    [...playerElms.playerTracklistElm.children].forEach((child) => {
        if (child.dataset.trackId !== selectedTrack.id) {
            child.classList.remove('track--playing');
        } else {
            child.classList.add('track--playing');
        }
    });

    playerElms.playerTotalTimeElm.textContent = getFormattedDuration(
        selectedTrack.duration
    );
};

export const currentTimeUpdateHandler = () => {
    const current = playerElms.playerAudioElm.currentTime;

    playerElms.playerCurrentTimeElm.textContent = getFormattedDuration(current);
};
