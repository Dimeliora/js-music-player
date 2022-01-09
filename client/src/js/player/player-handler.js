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

            playerElms.playerAudioElm.src = getTrackFile(
                state.selectedAlbum.id,
                state.selectedTrack.id
            );

            updatePlayerAfterTrackSelection();
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

ee.on('albums/album-selected', updatePlayerAfterAlbumSelection);

playerElms.playerHideElm.addEventListener('click', hidePlayerHandler);

playerElms.playerTracklistElm.addEventListener('click', trackSelectHandler);

playerElms.playerAudioElm.addEventListener('timeupdate', () => {
    currentTimeUpdateHandler();

    ee.emit('player/time-updated', playerElms.playerAudioElm.currentTime);
});

ee.on('player/progress-click', (newCurrentTime) => {
    playerElms.playerAudioElm.currentTime = newCurrentTime;
});
