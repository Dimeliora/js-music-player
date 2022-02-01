const path = require('path');

const rootDir = path.dirname(
    require.main.filename || process.mainModule.filename
);

const albumsDataFile = path.resolve(rootDir, '../data', 'albumsData.json');

const albumsDir = path.resolve(rootDir, '../data', 'music');

const getAlbumFilePath = (albumId, filename) =>
    path.resolve(albumsDir, albumId, filename);

module.exports = {
    rootDir,
    albumsDataFile,
    albumsDir,
    getAlbumFilePath,
};
