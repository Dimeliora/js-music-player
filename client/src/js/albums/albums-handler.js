import { ee } from '../helpers/event-emitter';
import {
    getAlbumsData,
    getAlbumsCoverImages,
    getAlbumTracklist,
} from '../service/fetch-data';
import { state } from '../state/state';
import { albumsElms } from '../dom/dom-elements';
import { createAlbumHTML } from '../dom/template-creators';
import { updateAlbumsActiveClass } from './albums-view-updates';

const chooseAlbumHandler = async (e) => {
    const albumElm = e.target.closest('[data-album-id]');
    if (!albumElm) {
        return;
    }

    const albumId = albumElm.dataset.albumId;
    const album = state.albums.find(({ id }) => id === albumId);
    if (album.tracklist === undefined) {
        album.tracklist = await getAlbumTracklist(albumId);
    }

    state.selectedAlbum = album;

    ee.emit('albums/album-selected');
};

const albumsKeyboardHandler = (e) => {
    switch (e.key) {
        case 'Enter':
        case ' ':
            chooseAlbumHandler(e);
            break;
    }
};

const albumsHandler = async () => {
    const albumsData = await getAlbumsData();

    state.albums = await getAlbumsCoverImages(albumsData);

    const albumsMarkup = state.albums
        .map((album) => createAlbumHTML(album))
        .join(' ');

    albumsElms.albumsGridElm.innerHTML = albumsMarkup;

    albumsElms.albumsGridElm.addEventListener('click', chooseAlbumHandler);

    albumsElms.albumsGridElm.addEventListener('keyup', albumsKeyboardHandler);

    ee.on('player/track-selected', updateAlbumsActiveClass)
};

albumsHandler();
