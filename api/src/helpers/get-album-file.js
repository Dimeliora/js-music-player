const path = require('path');

const { ALBUMS_DIR } = require('../constants/paths');

exports.getAlbumFile = (albumDirname, filename) =>
    path.resolve(ALBUMS_DIR, albumDirname, filename);
