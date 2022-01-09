import { ee } from '../helpers/event-emitter';
import {
    getAlbumsData,
    getAlbumsCoverImages,
    getAlbumTracklist,
} from '../service/fetch-data';
import { state } from '../state/state';
import { albumsElms } from '../dom/dom-elements';
import { createAlbumHTML } from '../dom/template-creators';

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

    if (state.selectedAlbum !== album) {
        state.selectedAlbum = album;
        ee.emit('albums/album-selected');
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
};

albumsHandler();
