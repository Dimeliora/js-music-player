const { Router } = require('express');

const {
    getAlbumsData,
    getAlbumsCoverImages,
    getAlbumsTracklist,
    getAlbumTrack,
} = require('../controllers/albums.controller');

const albumsRouter = Router();

albumsRouter.get('/', getAlbumsData);

albumsRouter.get('/cover/:id', getAlbumsCoverImages);

albumsRouter.get('/tracklist/:id', getAlbumsTracklist);

albumsRouter.get('/:albumId/:trackId', getAlbumTrack);

exports.albumsRouter = albumsRouter;
