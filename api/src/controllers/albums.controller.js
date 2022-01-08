const fs = require('fs');

const { ALBUMS_DATA_FILE } = require('../constants/paths');
const { getAlbumFile } = require('../helpers/get-album-file');

exports.getAlbumsData = (_, res) => {
    fs.readFile(ALBUMS_DATA_FILE, (err, data) => {
        if (err) {
            res.status(500).send({ message: 'Something went wrong!' });
            return;
        }

        res.json(JSON.parse(data));
    });
};

exports.getAlbumsCoverImages = (req, res) => {
    const albumId = req.params.id;

    res.sendFile(getAlbumFile(albumId, 'cover.jpg'));
};

exports.getAlbumTrack = (req, res) => {
    const { albumId, trackId } = req.params;

    const trackFilePath = getAlbumFile(albumId, `${trackId}.mp3`);
    fs.stat(trackFilePath, (err, stats) => {
        if (err) {
            res.status(500).send({ message: 'Something went wrong!' });
            return;
        }

        res.writeHead(200, {
            'Accept-Ranges': 'bytes',
            'Content-Type': 'audio/mpeg',
            'Content-Length': stats.size,
        });

        fs.createReadStream(trackFilePath).pipe(res);
    });
};
