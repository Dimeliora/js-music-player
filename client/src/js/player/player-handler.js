import { ee } from '../helpers/event-emitter';
import { playerElms } from '../dom/dom-elements';
import { createTrackHTML } from '../dom/template-creators';
import { state } from '../state/state';

const hidePlayerHandler = () => {
    playerElms.playerBlockElm.classList.remove('player--active');
};

const trackSelectHandler = (e) => {};

ee.on('albums/album-selected', () => {
    const album = state.selectedAlbum;

    const albumCoverSrc = `url(${album.cover})`;
    playerElms.playerBlockElm.style.setProperty('--bg-image', albumCoverSrc);

    playerElms.playerThumbnailElm.src = album.cover;
    playerElms.playerThumbnailElm.alt = `${album.title} album cover`;

    playerElms.playerTitleElm.textContent = album.title;
    playerElms.playerArtistElm.textContent = album.artist;
    playerElms.playerGenreElm.textContent = album.genre;

    const tracklistMarkup = album.tracklist
        .map((track, idx) =>
            createTrackHTML({
                ...track,
                artist: album.artist,
                index: idx + 1,
            })
        )
        .join(' ');

    playerElms.playerTracklistElm.innerHTML = tracklistMarkup;

    playerElms.playerBlockElm.classList.add('player--active');
});

playerElms.playerHideElm.addEventListener('click', hidePlayerHandler);

playerElms.playerTracklistElm.addEventListener('click', trackSelectHandler);
