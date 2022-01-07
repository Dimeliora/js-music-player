import { ee } from '../helpers/event-emitter';
import { playerElms } from '../dom/dom-elements';
import { state } from '../state/state';

ee.on('albums/album-selected', () => {
    const album = state.selectedAlbum;

    const albumCoverSrc = `url(${album.cover})`;
    playerElms.playerBlockElm.style.setProperty('--bg-image', albumCoverSrc);

    playerElms.playerThumbnailElm.src = album.cover;
    playerElms.playerThumbnailElm.alt = `${album.title} album cover`;
    
    playerElms.playerTitleElm.textContent = album.title;
    playerElms.playerArtistElm.textContent = album.artist;
    playerElms.playerGenreElm.textContent = album.genre;

    playerElms.playerBlockElm.classList.add('player--active');
});

playerElms.playerHideElm.addEventListener('click', () => {
    playerElms.playerBlockElm.classList.remove('player--active');
});
