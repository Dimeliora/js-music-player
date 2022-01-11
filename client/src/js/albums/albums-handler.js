import { ee } from '../helpers/event-emitter';
import {
    getAlbumsData,
    getAlbumTracklist,
    getAlbumsCoverImages,
} from '../service/fetch-data';
import { state } from '../state/state';
import { debounce } from '../helpers/debounce';
import { albumsElms } from './albums-dom-elements';
import {
    createGenreBlockHTML,
    createAlbumHTML,
} from './albums-template-creators';
import { updateAlbumsActiveClass } from './albums-view-updates';

const hasStringMatch = (str, match) => str.toLowerCase().includes(match);

const filterAlbums = (albums, template, props) => {
    if (template.trim() === '') {
        return albums;
    }

    return albums.filter((album) => {
        return props.some((prop) => hasStringMatch(album[prop], template));
    });
};

const albumSearchHandler = (e) => {
    const props = ['title', 'artist'];
    const template = e.target.value.toLowerCase();
    const filteredAlbums = filterAlbums(state.albums, template, props);

    renderGenresSectionContent(filteredAlbums, state.playingAlbum?.id);
};

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

const renderGenresSectionContent = (albums, playingAlbumId) => {
    albumsElms.albumsGenresElm.innerHTML = createGenresSectionHTML(albums);

    updateAlbumsActiveClass(playingAlbumId);
};

const albumsHandler = async () => {
    const albumsData = await getAlbumsData();
    const albums = await getAlbumsCoverImages(albumsData);

    state.albums = albums.sort((a, b) => a.genre.localeCompare(b.genre));

    renderGenresSectionContent(state.albums);

    albumsElms.albumsSearchElm.addEventListener(
        'input',
        debounce(albumSearchHandler, 700)
    );

    albumsElms.albumsGenresElm.addEventListener('click', albumClickHandler);

    albumsElms.albumsGenresElm.addEventListener(
        'keydown',
        albumsKeyboardHandler
    );

    ee.on('player/track-selected', updateAlbumsActiveClass);
};

albumsHandler();
