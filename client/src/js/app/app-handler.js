import { ee } from '../helpers/event-emitter';
import { state } from '../state/state';
import { showApp, showError } from './app-view-updates';
import { getAlbumsData, getAlbumsCoverImages } from '../service/fetch-data';
import { alertHandle } from '../alerts/alerts-handler';

const appStart = async () => {
    try {
        const albumsData = await getAlbumsData();
        const albums = await getAlbumsCoverImages(albumsData);

        state.albums = albums.sort((a, b) => a.genre.localeCompare(b.genre));

        showApp();

        ee.emit('app/started', albums);
    } catch (error) {
        alertHandle(error.message, 'error');

        showError();
    }
};

appStart();
