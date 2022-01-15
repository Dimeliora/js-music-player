const { Router } = require('express');

const {
    getAlbumsData,
    getAlbumsCoverImages,
    getAlbumsTracklist,
    checkAlbumTrackExistance,
    getAlbumTrack,
} = require('../controllers/albums.controller');

const albumsRouter = Router();

albumsRouter.get('/', getAlbumsData);

albumsRouter.get('/cover/:id', getAlbumsCoverImages);

albumsRouter.get('/tracklist/:id', getAlbumsTracklist);

albumsRouter.head('/:albumId/:trackId', checkAlbumTrackExistance);

albumsRouter.get('/:albumId/:trackId', getAlbumTrack);

exports.albumsRouter = albumsRouter;
