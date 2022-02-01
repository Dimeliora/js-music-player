const { Router } = require('express');

const {
    getAlbumsData,
    getAlbumCoverImage,
    getAlbumTracklist,
    checkAlbumTrackExistance,
    getAlbumTrack,
} = require('../controllers/albums-controller');

const albumsRouter = Router();

albumsRouter.get('/', getAlbumsData);

albumsRouter.get('/cover/:id', getAlbumCoverImage);

albumsRouter.get('/tracklist/:id', getAlbumTracklist);

albumsRouter.head('/:albumId/:trackId', checkAlbumTrackExistance);

albumsRouter.get('/:albumId/:trackId', getAlbumTrack);

module.exports = albumsRouter;
