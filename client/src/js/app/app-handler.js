import { ee } from '../helpers/event-emitter';
import { state } from '../state/state';
import { appElms } from './app-dom-elements';
import { getAlbumsData, getAlbumsCoverImages } from '../service/fetch-data';
import { alertHandle } from '../alerts/alerts-handler';

const appStart = async () => {
    try {
        const albumsData = await getAlbumsData();
        const albums = await getAlbumsCoverImages(albumsData);

        state.albums = albums.sort((a, b) => a.genre.localeCompare(b.genre));

        appElms.appPreloaderElm.classList.add('preloader--hidden');
        appElms.appBlockElm.classList.add('container--visible');

        ee.emit('app/started', albums);
    } catch (error) {
        alertHandle(error.message, 'error');

        appElms.appPreloaderElm.classList.add('preloader--static');
        appElms.appPreloaderElm.firstElementChild.textContent =
            'Service is unreachable. Please try again later';
    }
};

appStart();
