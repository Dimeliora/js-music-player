import { playerElms } from './player-dom-elements';
import { renderWaveForm } from './player-waveform-handler';
import { createTrackHTML } from './player-template-creators';
import { getFormattedDuration } from '../../helpers/duration-formatter';

const getHiddenTitleWidth = () => {
    const titleElm = playerElms.playerBlockElm.querySelector(
        '[data-player-current-track]'
    );
    const titleWrapElm = titleElm.parentElement;

    const titleWrapElmWidth = parseInt(getComputedStyle(titleWrapElm).width);
    const titleElmWidth = parseInt(getComputedStyle(titleElm).width);

    return Math.max(0, titleElmWidth - titleWrapElmWidth);
};

export const handleCurrentTrackTitleAnimation = () => {
    playerElms.playerCurrentTrackElm.removeAttribute('style');
    playerElms.playerCurrentTrackElm.classList.remove(
        'player__current-track-inner--animated'
    );

    const titleShiftPos = getHiddenTitleWidth();
    if (titleShiftPos > 0) {
        playerElms.playerCurrentTrackElm.style.setProperty(
            '--title-shift-pos',
            `${-titleShiftPos}px`
        );
        playerElms.playerCurrentTrackElm.classList.add(
            'player__current-track-inner--animated'
        );
    }
};

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

    showPlayer();
};

export const showPlayer = () => {
    playerElms.playerBlockElm.classList.add('player--active');
    playerElms.playerBlockElm.focus();

    document.body.classList.add('prevent-scroll');
};

export const hidePlayer = () => {
    playerElms.playerBlockElm.classList.remove('player--active');

    document.body.classList.remove('prevent-scroll');
};

export const updatePlayerViewAfterTrackSelection = (selectedTrack, album) => {
    playerElms.playerCurrentTrackElm.textContent = `${selectedTrack.title} - ${album.artist}`;
    handleCurrentTrackTitleAnimation();

    playerElms.playerTotalTimeElm.textContent = getFormattedDuration(
        selectedTrack.duration
    );

    [...playerElms.playerTracklistElm.children].forEach((child) => {
        if (child.dataset.trackId !== selectedTrack.id) {
            child.classList.remove('track--playing');
        } else {
            child.classList.add('track--playing');
        }
    });
};

export const setTrackPlayingClass = (trackElm) => {
    trackElm.classList.add('track--playing');
};

export const removeTrackPlayingClass = (trackElm) => {
    trackElm.classList.remove('track--playing');
};

export const currentTimeUpdateHandler = () => {
    const current = playerElms.playerAudioElm.currentTime;
    playerElms.playerCurrentTimeElm.textContent = getFormattedDuration(current);
};
