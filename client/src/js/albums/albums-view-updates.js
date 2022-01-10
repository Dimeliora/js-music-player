import { albumsElms } from './albums-dom-elements';

export const updateAlbumsActiveClass = ({ albumId }) => {
    const albums =
        albumsElms.albumsGenresElm.querySelectorAll('[data-album-id]');

    albums.forEach((album) => {
        if (album.dataset.albumId !== albumId) {
            album.classList.remove('album--active');
        } else {
            album.classList.add('album--active');
        }
    });
};
