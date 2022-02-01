import playerState from '../state/player-state';
import { ee } from '../helpers/event-emitter';
import { showApp, showError } from './app-view-updates';
import { getAlbumsData, getAlbumsCoverImages } from '../service/fetch-data';
import { alertHandle } from '..//components/alerts/alerts-handler';

const appStart = async () => {
    try {
        const albumsData = await getAlbumsData();
        const albums = await getAlbumsCoverImages(albumsData);

        const sortedAlbums = albums.sort((a, b) =>
            a.genre.localeCompare(b.genre)
        );

        playerState.setAlbumsData(sortedAlbums);

        showApp();

        ee.emit('app/started', albums);
    } catch (error) {
        alertHandle(error.message, 'error');

        showError();
    }
};

appStart();
