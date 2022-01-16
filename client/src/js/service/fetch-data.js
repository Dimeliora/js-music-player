import { BASE_URL, ALBUM_COVER_PLACEHOLDER_URL } from '../constants/constants';

export const getAlbumsData = async () => {
    const response = await fetch(`${BASE_URL}/albums`);

    if (!response.ok) {
        const { message } = await response.json();
        throw new Error(message);
    }

    return response.json();
};

export const getAlbumsCoverImages = async (albumsData) => {
    const requests = albumsData.map(async (album) => {
        const response = await fetch(`${BASE_URL}/albums/cover/${album.id}`);

        if (response.ok) {
            const coverImageData = await response.blob();
            album.cover = URL.createObjectURL(coverImageData);
        } else {
            album.cover = ALBUM_COVER_PLACEHOLDER_URL;
        }

        return album;
    });

    return Promise.all(requests);
};

export const getAlbumTracklist = async (albumId) => {
    const response = await fetch(`${BASE_URL}/albums/tracklist/${albumId}`);

    if (!response.ok) {
        const { message } = await response.json();
        throw new Error(message);
    }

    return response.json();
};

export const getTrackFile = async (albumId, trackId) => {
    const response = await fetch(`${BASE_URL}/albums/${albumId}/${trackId}`, {
        method: 'HEAD',
    });

    if (!response.ok) {
        throw new Error('Audiofile not found');
    }

    return `${BASE_URL}/albums/${albumId}/${trackId}`;
};
