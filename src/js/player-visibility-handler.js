import { albumsElms, playerElms } from './dom-elements';

albumsElms.albumsGridElm.addEventListener('click', (e) => {
    const album = e.target.closest('[data-album-item]');

    if (!album) {
        return;
    }

    const albumCoverSrc = `url(${album.dataset.albumItem})`;
    playerElms.playerBlockElm.style.setProperty('--bg-image', albumCoverSrc);

    playerElms.playerBlockElm.classList.add('player--active');
});

playerElms.playerHideElm.addEventListener('click', () => {
    playerElms.playerBlockElm.classList.remove('player--active');
});
