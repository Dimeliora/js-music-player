import playerState from '../../state/player-state';
import { ee } from '../../helpers/event-emitter';
import { playerElms } from './player-dom-elements';
import { getTrackFile } from '../../service/fetch-data';
import {
    showPlayer,
    hidePlayer,
    setTrackPlayingClass,
    removeTrackPlayingClass,
    currentTimeUpdateHandler,
    updatePlayerAfterAlbumSelection,
    handleCurrentTrackTitleAnimation,
    updatePlayerViewAfterTrackSelection,
} from './player-view-updates';
import { alertHandle } from '../alerts/alerts-handler';

const progressTimeUpdateHandler = (newCurrentTime) => {
    playerElms.playerAudioElm.currentTime = newCurrentTime;
};

const trackKeyboardHandler = (e) => {
    switch (e.key) {
        case 'Enter':
        case ' ':
            e.preventDefault();
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

const rewindTrackProgress = (step) => {
    playerElms.playerAudioElm.currentTime += step;
};

const hidePlayerHandler = () => {
    ee.emit('player/player-hide-out');
    hidePlayer();
};

const updateSelectedTrackAndAudio = async (album, trackId) => {
    try {
        const trackFileSource = await getTrackFile(album.id, trackId);

        const selectedTrack = album.tracklist.find(({ id }) => id === trackId);

        playerState.setSelectedTrack(selectedTrack);
        playerState.setPlayingAlbum(album);

        playerElms.playerAudioElm.src = trackFileSource;

        updatePlayerViewAfterTrackSelection(playerState.selectedTrack, album);

        ee.emit('player/track-selected', playerState.playingAlbum.id);
    } catch (error) {
        throw new Error(error.message);
    }
};

const trackClickHandler = async (e) => {
    const trackElm = e.target.closest('[data-track-id]');
    if (!trackElm) {
        return;
    }

    const trackId = trackElm.dataset.trackId;
    try {
        if (playerState.selectedTrack?.id !== trackId) {
            await updateSelectedTrackAndAudio(
                playerState.selectedAlbum,
                trackId
            );
        }

        if (playerElms.playerAudioElm.paused) {
            setTrackPlayingClass(trackElm);
            playerElms.playerAudioElm.play();
        } else {
            removeTrackPlayingClass(trackElm);
            playerElms.playerAudioElm.pause();
        }
    } catch (error) {
        alertHandle(error.message, 'error');
    }
};

const audioSrcChangeHandler = () => {
    ee.emit('player/audio-source-changed');
};

const playerTimeUpdatedHandler = () => {
    currentTimeUpdateHandler();
    ee.emit('player/time-updated', playerElms.playerAudioElm.currentTime);
};

const playingTrackEndsHandler = async () => {
    const trackIndex = playerState.playingAlbum.tracklist.findIndex(
        (track) => track.id === playerState.selectedTrack.id
    );
    const nextTrack = playerState.playingAlbum.tracklist[trackIndex + 1];

    try {
        if (nextTrack) {
            await updateSelectedTrackAndAudio(
                playerState.playingAlbum,
                nextTrack.id
            );
            playerElms.playerAudioElm.play();
        } else {
            const trackElm = playerElms.playerTracklistElm.querySelector(
                `[data-track-id="${playerState.selectedTrack.id}"]`
            );
            if (trackElm) {
                trackElm.classList.remove('track--playing');
            }

            playerElms.playerAudioElm.currentTime = 0;
        }
    } catch (error) {
        alertHandle(error.message, 'error');

        playerState.setSelectedTrack(nextTrack);
        playingTrackEndsHandler();
    }
};

const audioDataBufferingHandler = () => {
    const buffered = playerElms.playerAudioElm.buffered;

    ee.emit('player/data-buffering', buffered.end(buffered.length - 1));
};

ee.on('albums/album-selected', updatePlayerAfterAlbumSelection);

ee.on('albums/show-player', showPlayer);

ee.on('progress/time-update', progressTimeUpdateHandler);

playerElms.playerBlockElm.addEventListener('keydown', trackKeyboardHandler);

playerElms.playerHideElm.addEventListener('click', hidePlayerHandler);

playerElms.playerTracklistElm.addEventListener('click', trackClickHandler);

playerElms.playerAudioElm.addEventListener('emptied', audioSrcChangeHandler);

playerElms.playerAudioElm.addEventListener(
    'timeupdate',
    playerTimeUpdatedHandler
);

playerElms.playerAudioElm.addEventListener('ended', playingTrackEndsHandler);

playerElms.playerAudioElm.addEventListener(
    'progress',
    audioDataBufferingHandler
);

window.addEventListener('resize', handleCurrentTrackTitleAnimation);
