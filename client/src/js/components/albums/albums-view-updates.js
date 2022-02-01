import { albumsElms } from './albums-dom-elements';

export const updateAlbumsActiveClass = (albumId) => {
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

export const setSquizeClassOnSearch = () => {
    albumsElms.albumsSearchElm.parentElement.classList.add(
        'header__search--player-opened'
    );
};

export const removeSquizeClassOnSearch = () => {
    albumsElms.albumsSearchElm.parentElement.classList.remove(
        'header__search--player-opened'
    );
};

export const handleSearchButtonVisibility = (template) => {
    if (template.length > 0) {
        albumsElms.albumsSearchElm.parentElement.classList.add(
            'header__search--not-empty'
        );
    } else {
        albumsElms.albumsSearchElm.parentElement.classList.remove(
            'header__search--not-empty'
        );
    }
};
