import { getAlbumsData, getAlbumsCoverImages } from '../service/fetch-data';
import { state } from '../state/state';
import { albumsElms } from '../dom/dom-elements';
import { createAlbumHTML } from '../dom/template-creators';

const albumsHandler = async () => {
    const albumsData = await getAlbumsData();

    state.albums = await getAlbumsCoverImages(albumsData);

    const albumsMarkup = state.albums
        .map((album) => createAlbumHTML(album))
        .join(' ');

    albumsElms.albumsGridElm.innerHTML = albumsMarkup;
};

albumsHandler();
