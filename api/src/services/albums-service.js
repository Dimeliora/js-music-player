const fs = require('fs/promises');
const { constants } = require('fs');

const FileError = require('../errors/file-error');
const {
    albumsDataFile,
    getAlbumFilePath,
} = require('../helpers/dir-path-heplers');

exports.getAlbumsDataService = async () => {
    try {
        const albumsDataJSON = await fs.readFile(albumsDataFile);

        const albumsData = JSON.parse(albumsDataJSON);

        const rootAlbumsData = albumsData.map((album) => {
            const filteredAlbumProps = Object.entries(album).filter(
                ([key]) => key !== 'tracklist'
            );

            return Object.fromEntries(filteredAlbumProps);
        });

        return rootAlbumsData;
    } catch (error) {
        throw new FileError('Albums data not found', 404);
    }
};

exports.getAlbumCoverImageService = async (albumId) => {
    const albumCoverImagePath = getAlbumFilePath(albumId, 'cover.jpg');

    await fs.access(albumCoverImagePath, constants.F_OK);

    return albumCoverImagePath;
};

exports.getAlbumTracklistService = async (albumId) => {
    try {
        const albumsDataJSON = await fs.readFile(albumsDataFile);
        const albumsData = JSON.parse(albumsDataJSON);

        const album = albumsData.find(({ id }) => id === albumId);

        return album.tracklist;
    } catch (error) {
        throw new FileError('Albums data not found', 404);
    }
};

exports.checkAlbumTrackExistanceService = async (albumId, trackId) => {
    const albumTrackPath = getAlbumFilePath(albumId, `${trackId}.mp3`);

    await fs.access(albumTrackPath, constants.F_OK);
};

exports.getAlbumTrackService = async (albumId, trackId) => {
    try {
        const albumTrackPath = getAlbumFilePath(albumId, `${trackId}.mp3`);

        const { size } = await fs.stat(albumTrackPath);

        return { path: albumTrackPath, size };
    } catch (error) {
        throw new FileError('Track file not found');
    }
};
