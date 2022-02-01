const fs = require('fs');

const FileError = require('../errors/file-error');
const {
    getAlbumsDataService,
    getAlbumCoverImageService,
    getAlbumTracklistService,
    checkAlbumTrackExistanceService,
    getAlbumTrackService,
} = require('../services/albums-service');

exports.getAlbumsData = async (_, res) => {
    try {
        const rootAlbumsData = await getAlbumsDataService();

        res.status(200).json(rootAlbumsData);
    } catch (error) {
        if (error instanceof FileError) {
            return res.status(error.status).send({ message: error.message });
        }

        res.status(500).send({
            message: 'Service error. Please, try later',
        });
    }
};

exports.getAlbumCoverImage = async (req, res) => {
    try {
        const albumCoverImagePath = await getAlbumCoverImageService(
            req.params.id
        );

        res.status(200).sendFile(albumCoverImagePath);
    } catch (error) {
        res.sendStatus(404);
    }
};

exports.getAlbumTracklist = async (req, res) => {
    try {
        const albumTracklistData = await getAlbumTracklistService(
            req.params.id
        );

        res.status(200).json(albumTracklistData);
    } catch (error) {
        if (error instanceof FileError) {
            return res.status(error.status).send({ message: error.message });
        }

        res.status(500).send({
            message: 'Service error. Please, try later',
        });
    }
};

exports.checkAlbumTrackExistance = async (req, res) => {
    try {
        await checkAlbumTrackExistanceService(
            req.params.albumId,
            req.params.trackId
        );

        res.sendStatus(200);
    } catch (error) {
        res.sendStatus(404);
    }
};

exports.getAlbumTrack = async (req, res) => {
    try {
        const { path, size } = await getAlbumTrackService(
            req.params.albumId,
            req.params.trackId
        );

        res.writeHead(200, {
            'Accept-Ranges': 'bytes',
            'Content-Type': 'audio/mpeg',
            'Content-Length': size,
        });

        fs.createReadStream(path).pipe(res);
    } catch (error) {
        if (error instanceof FileError) {
            return res.status(error.status).send({ message: error.message });
        }

        res.status(500).send({
            message: 'Service error. Please, try later',
        });
    }
};
