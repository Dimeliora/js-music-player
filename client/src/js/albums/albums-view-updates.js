import { albumsElms } from '../dom/dom-elements';

export const updateAlbumsActiveClass = (albumId) => {
    [...albumsElms.albumsGridElm.children].forEach((child) => {
        if (child.dataset.albumId !== albumId) {
            child.classList.remove('album--active');
        } else {
            child.classList.add('album--active');
        }
    });
};
