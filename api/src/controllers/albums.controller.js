const fs = require('fs');

const { ALBUMS_DATA_FILE } = require('../constants/paths');
const { getAlbumFile } = require('../helpers/get-album-file');

exports.getAlbumsData = (_, res) => {
    fs.readFile(ALBUMS_DATA_FILE, (err, data) => {
        if (err) {
            res.status(500).send({
                message:
                    'Error occuring while trying to get albums data. Please, try later',
            });
            return;
        }

        const albumsData = JSON.parse(data);
        const rootAlbumsData = albumsData.map((album) => {
            const filteredAlbumProps = Object.entries(album).filter(
                ([key]) => key !== 'tracklist'
            );

            return Object.fromEntries(filteredAlbumProps);
        });

        res.json(rootAlbumsData);
    });
};

exports.getAlbumsCoverImages = (req, res) => {
    const albumId = req.params.id;

    res.sendFile(getAlbumFile(albumId, 'cover.jpg'));
};

exports.getAlbumsTracklist = (req, res) => {
    const albumId = req.params.id;

    fs.readFile(ALBUMS_DATA_FILE, (err, data) => {
        if (err) {
            res.status(500).send({
                message:
                    'Error occuring while trying to get tracklist. Please, try later',
            });
            return;
        }

        const albumsData = JSON.parse(data);
        const album = albumsData.find((item) => item.id === albumId);

        res.json(album.tracklist);
    });
};

exports.getAlbumTrack = (req, res) => {
    const { albumId, trackId } = req.params;

    const trackFilePath = getAlbumFile(albumId, `${trackId}.mp3`);
    fs.stat(trackFilePath, (err, stats) => {
        if (err) {
            res.status(500).send({ message: 'Audiofile not found' });
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
