import { albumsElms, playerElms } from '../dom/dom-elements';
import { state } from '../state/state';

albumsElms.albumsGridElm.addEventListener('click', (e) => {
    const albumElm = e.target.closest('[data-album-id]');

    if (!albumElm) {
        return;
    }

    const albumId = albumElm.dataset.albumId;
    const { cover } = state.albums.find(({ id }) => id === albumId);

    const albumCoverSrc = `url(${cover})`;
    playerElms.playerBlockElm.style.setProperty('--bg-image', albumCoverSrc);

    playerElms.playerBlockElm.classList.add('player--active');
});

playerElms.playerHideElm.addEventListener('click', () => {
    playerElms.playerBlockElm.classList.remove('player--active');
});
