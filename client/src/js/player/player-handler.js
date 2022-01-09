import { ee } from '../helpers/event-emitter';
import { state } from '../state/state';
import { playerElms } from '../dom/dom-elements';
import { getTrackFile } from '../service/fetch-data';
import {
    updatePlayerAfterAlbumSelection,
    hidePlayerHandler,
    updatePlayerAfterTrackSelection,
    currentTimeUpdateHandler,
} from './player-view-updates';

const updateSelectedTrack = (trackId) => {
    state.selectedTrack = state.selectedAlbum.tracklist.find(
        ({ id }) => id === trackId
    );

    playerElms.playerAudioElm.pause();
    playerElms.playerAudioElm.src = getTrackFile(
        state.selectedAlbum.id,
        state.selectedTrack.id
    );

    updatePlayerAfterTrackSelection();
};

const trackClickHandler = (e) => {
    const trackElm = e.target.closest('[data-track-id]');
    if (!trackElm) {
        return;
    }

    const trackId = trackElm.dataset.trackId;
    if (state.selectedTrack?.id !== trackId) {
        updateSelectedTrack(trackId);
    }

    if (playerElms.playerAudioElm.paused) {
        trackElm.classList.add('track--playing');
        playerElms.playerAudioElm.play();
    } else {
        trackElm.classList.remove('track--playing');
        playerElms.playerAudioElm.pause();
    }
};

const playerOnTimeUpdatedHandler = () => {
    currentTimeUpdateHandler();
    ee.emit('player/time-updated', playerElms.playerAudioElm.currentTime);
};

const progressClickHandler = (newCurrentTime) => {
    playerElms.playerAudioElm.currentTime = newCurrentTime;
};

const playingTrackEndsHandler = () => {
    const trackElm = playerElms.playerTracklistElm.querySelector(
        `[data-track-id="${state.selectedTrack.id}"]`
    );
    const trackIndex = state.selectedAlbum.tracklist.findIndex(
        (track) => track.id === state.selectedTrack.id
    );

    const nextTrack = state.selectedAlbum.tracklist[trackIndex + 1];
    if (nextTrack !== undefined) {
        const nextTrackElm = trackElm.nextElementSibling;

        updateSelectedTrack(nextTrackElm.dataset.trackId);

        nextTrackElm.classList.add('track--playing');
        playerElms.playerAudioElm.play();
    } else {
        playerElms.playerAudioElm.currentTime = 0;
        trackElm.classList.remove('track--playing');
    }
};

const rewindTrackProgress = (step) => {
    playerElms.playerAudioElm.currentTime += step;
};

const trackKeyboardHandler = (e) => {
    switch (e.key) {
        case 'Enter':
        case ' ':
            trackClickHandler(e);
            break;
        case 'Escape':
            hidePlayerHandler();
            break;
        case 'ArrowLeft':
            rewindTrackProgress(-10);
            break;
        case 'ArrowRight':
            rewindTrackProgress(10);
            break;
    }
};

ee.on('albums/album-selected', updatePlayerAfterAlbumSelection);

playerElms.playerHideElm.addEventListener('click', hidePlayerHandler);

playerElms.playerTracklistElm.addEventListener('click', trackClickHandler);

playerElms.playerAudioElm.addEventListener(
    'timeupdate',
    playerOnTimeUpdatedHandler
);

ee.on('player/progress-click', progressClickHandler);

playerElms.playerAudioElm.addEventListener('ended', playingTrackEndsHandler);

playerElms.playerBlockElm.addEventListener('keyup', trackKeyboardHandler);
