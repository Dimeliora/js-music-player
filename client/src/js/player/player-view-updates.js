import { state } from '../state/state';
import { playerElms } from '../dom/dom-elements';
import { createTrackHTML } from '../dom/template-creators';
import { getFormattedDuration } from '../helpers/duration-formatter';

// Track title moving speed (if cutted) in px/sec
const TITLE_SHIFT_SPEED = 15;
const MIN_TITLE_SHIFT_SPEED = 7;

const getHiddenTitleWidth = (trackElm) => {
    const titleElm = trackElm.querySelector('[data-track-title]');
    const titleWrapperElm = trackElm.querySelector(
        '[data-track-title-wrapper]'
    );

    const titleElmWidth = parseInt(getComputedStyle(titleElm).width);
    const titleWrapperWidth = parseInt(getComputedStyle(titleWrapperElm).width);

    return Math.max(0, titleWrapperWidth - titleElmWidth);
};

const setStyleForTitleShiftAnimation = (titleShiftPos, trackElm) => {
    let titleShiftTime = titleShiftPos / TITLE_SHIFT_SPEED;
    titleShiftTime = Math.max(titleShiftTime, MIN_TITLE_SHIFT_SPEED);
    const titleFullShiftTime = titleShiftTime + 2 * (titleShiftTime / 3);

    trackElm.style.setProperty('--title-shift-pos', `${-titleShiftPos}px`);
    trackElm.style.setProperty('--title-shift-time', `${titleFullShiftTime}s`);
};

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

    playerElms.playerBlockElm.classList.add('player--active');
};

export const hidePlayerHandler = () => {
    playerElms.playerBlockElm.classList.remove('player--active');
};

export const updatePlayerAfterTrackSelection = (trackElm) => {
    [...playerElms.playerTracklistElm.children].forEach((child) => {
        child.classList.remove('track--playing');
        child.removeAttribute('style');
    });

    playerElms.playerTotalTimeElm.textContent = getFormattedDuration(
        state.selectedTrack.duration
    );

    const titleShiftPos = getHiddenTitleWidth(trackElm);

    if (titleShiftPos > 0) {
        setStyleForTitleShiftAnimation(titleShiftPos, trackElm);
    }
};

export const currentTimeUpdateHandler = () => {
    const current = playerElms.playerAudioElm.currentTime;

    playerElms.playerCurrentTimeElm.textContent = getFormattedDuration(current);
};
