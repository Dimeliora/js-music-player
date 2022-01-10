import { ee } from '../helpers/event-emitter';
import {
    getAlbumsData,
    getAlbumTracklist,
    getAlbumsCoverImages,
} from '../service/fetch-data';
import { state } from '../state/state';
import { albumsElms } from './albums-dom-elements';
import { createAlbumHTML } from './albums-template-creators';
import { updateAlbumsActiveClass } from './albums-view-updates';

const albumClickHandler = async (e) => {
    const albumElm = e.target.closest('[data-album-id]');
    if (!albumElm) {
        return;
    }

    const albumId = albumElm.dataset.albumId;
    if (state.selectedAlbum?.id === albumId) {
        ee.emit('albums/show-player');
        return;
    }

    const { selectedTrack, playingAlbum } = state;
    const album = state.albums.find(({ id }) => id === albumId);
    if (!album.tracklist) {
        album.tracklist = await getAlbumTracklist(albumId);
    }

    state.selectedAlbum = album;

    ee.emit('albums/album-selected', {
        album,
        selectedTrack,
        playingAlbum,
    });
};

const albumsKeyboardHandler = (e) => {
    switch (e.key) {
        case 'Enter':
        case ' ':
            albumClickHandler(e);
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

    albumsElms.albumsGridElm.addEventListener('click', albumClickHandler);

    albumsElms.albumsGridElm.addEventListener('keyup', albumsKeyboardHandler);

    ee.on('player/track-selected', updateAlbumsActiveClass);
};

albumsHandler();
