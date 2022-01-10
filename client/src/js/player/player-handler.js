import { ee } from '../helpers/event-emitter';
import { state } from '../state/state';
import { playerElms } from './player-dom-elements';
import { getTrackFile } from '../service/fetch-data';
import {
    showPlayerHandler,
    hidePlayerHandler,
    currentTimeUpdateHandler,
    updatePlayerAfterAlbumSelection,
    updatePlayerViewAfterTrackSelection,
} from './player-view-updates';

const updateSelectedTrackAndPlayer = (album, trackId) => {
    state.selectedTrack = album.tracklist.find(({ id }) => id === trackId);

    updatePlayerViewAfterTrackSelection(state.selectedTrack);

    playerElms.playerAudioElm.src = getTrackFile(album.id, trackId);

    state.playingAlbum = album;
    ee.emit('player/track-selected', { albumId: state.playingAlbum.id });
};

const trackClickHandler = (e) => {
    const trackElm = e.target.closest('[data-track-id]');
    if (!trackElm) {
        return;
    }

    const trackId = trackElm.dataset.trackId;
    if (state.selectedTrack?.id !== trackId) {
        updateSelectedTrackAndPlayer(state.selectedAlbum, trackId);
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
    ee.emit('player/time-updated', {
        currentTime: playerElms.playerAudioElm.currentTime,
    });
};

const progressTimeUpdateHandler = ({ newCurrentTime }) => {
    playerElms.playerAudioElm.currentTime = newCurrentTime;
};

const playingTrackEndsHandler = () => {
    const trackIndex = state.playingAlbum.tracklist.findIndex(
        (track) => track.id === state.selectedTrack.id
    );
    const nextTrack = state.playingAlbum.tracklist[trackIndex + 1];

    if (nextTrack) {
        updateSelectedTrackAndPlayer(state.playingAlbum, nextTrack.id);
        playerElms.playerAudioElm.play();
    } else {
        const trackElm = playerElms.playerTracklistElm.querySelector(
            `[data-track-id="${state.selectedTrack.id}"]`
        );
        if (trackElm) {
            trackElm.classList.remove('track--playing');
        }

        playerElms.playerAudioElm.currentTime = 0;
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

ee.on('albums/show-player', showPlayerHandler);

ee.on('progress/time-update', progressTimeUpdateHandler);

playerElms.playerBlockElm.addEventListener('keyup', trackKeyboardHandler);

playerElms.playerHideElm.addEventListener('click', hidePlayerHandler);

playerElms.playerTracklistElm.addEventListener('click', trackClickHandler);

playerElms.playerAudioElm.addEventListener(
    'timeupdate',
    playerOnTimeUpdatedHandler
);

playerElms.playerAudioElm.addEventListener('ended', playingTrackEndsHandler);
