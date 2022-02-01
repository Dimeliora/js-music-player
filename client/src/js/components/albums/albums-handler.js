import playerState from '../../state/player-state';
import { ee } from '../../helpers/event-emitter';
import { getAlbumTracklist } from '../../service/fetch-data';
import { debounce } from '../../helpers/debounce';
import { isStringIncludes } from '../../helpers/is-string-includes';
import { albumsElms } from './albums-dom-elements';
import {
    createGenreBlockHTML,
    createAlbumHTML,
} from './albums-template-creators';
import {
    updateAlbumsActiveClass,
    setSquizeClassOnSearch,
    removeSquizeClassOnSearch,
    handleSearchButtonVisibility,
} from './albums-view-updates';
import { alertHandle } from '../alerts/alerts-handler';

const filterAlbums = (albums, template, props) => {
    if (template.trim() === '') {
        return albums;
    }

    return albums.filter((album) => {
        return props.some((prop) => isStringIncludes(album[prop], template));
    });
};

const albumSearchHandler = () => {
    const props = ['title', 'artist'];
    const template = albumsElms.albumsSearchElm.value.toLowerCase();
    const filteredAlbums = filterAlbums(playerState.albums, template, props);

    renderGenresSection(filteredAlbums, playerState.playingAlbum?.id);
};

const searchButtonVisibilityHandler = () => {
    handleSearchButtonVisibility(albumsElms.albumsSearchElm.value);
};

const clearSearchHandler = () => {
    albumsElms.albumsSearchElm.value = '';

    handleSearchButtonVisibility(albumsElms.albumsSearchElm.value);
    albumSearchHandler();
};

const albumClickHandler = async (e) => {
    const albumElm = e.target.closest('[data-album-id]');
    if (!albumElm) {
        return;
    }

    const albumId = albumElm.dataset.albumId;
    if (playerState.selectedAlbum?.id === albumId) {
        setSquizeClassOnSearch();

        ee.emit('albums/show-player');
        return;
    }

    try {
        const { selectedTrack, playingAlbum } = playerState;
        const album = playerState.albums.find(({ id }) => id === albumId);
        if (!album.tracklist) {
            album.tracklist = await getAlbumTracklist(albumId);
        }

        playerState.setSelectedAlbumData(album);

        setSquizeClassOnSearch();

        ee.emit('albums/album-selected', {
            album,
            selectedTrack,
            playingAlbum,
        });
    } catch (error) {
        alertHandle(error.message, 'error');
    }
};

const albumsKeyboardHandler = (e) => {
    switch (e.key) {
        case 'Enter':
        case ' ':
            e.preventDefault();
            albumClickHandler(e);
            break;
    }
};

const createGenresSectionHTML = (albums) => {
    const albumsByGenre = albums.reduce((acc, album) => {
        const { genre } = album;
        if (!acc[genre]) {
            acc[genre] = [];
        }

        acc[genre].push(album);
        return acc;
    }, {});

    let genreBlockMarkup = '';
    for (const genre in albumsByGenre) {
        const genreBlockTemplate = createGenreBlockHTML(genre);
        const albumsMarkup = albumsByGenre[genre]
            .map((album) => createAlbumHTML(album))
            .join(' ');

        genreBlockMarkup += genreBlockTemplate.replace(
            '{{albums}}',
            albumsMarkup
        );
    }

    return genreBlockMarkup;
};

const renderGenresSection = (albums, playingAlbumId) => {
    albumsElms.albumsGenresElm.innerHTML = createGenresSectionHTML(albums);

    updateAlbumsActiveClass(playingAlbumId);
};

ee.on('app/started', renderGenresSection);

ee.on('player/track-selected', updateAlbumsActiveClass);

ee.on('player/player-hide-out', removeSquizeClassOnSearch);

albumsElms.albumsSearchElm.addEventListener(
    'input',
    debounce(albumSearchHandler, 700)
);

albumsElms.albumsSearchElm.addEventListener(
    'input',
    searchButtonVisibilityHandler
);

albumsElms.albumsSearchClearElm.addEventListener('click', clearSearchHandler);

albumsElms.albumsGenresElm.addEventListener('click', albumClickHandler);

albumsElms.albumsGenresElm.addEventListener('keydown', albumsKeyboardHandler);
