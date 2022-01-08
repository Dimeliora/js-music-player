const path = require('path');

const { rootDir } = require('../helpers/root-dir');

exports.ALBUMS_DATA_FILE = path.resolve(rootDir, '../data', 'albumsData.json');

exports.ALBUMS_DIR = path.resolve(rootDir, '../data', 'music');
