const BASE_URL = 'http://localhost:3000/api';

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

        if (!response.ok) {
            const { message } = await response.json();
            throw new Error(message);
        }

        const coverImageData = await response.blob();

        album.cover = URL.createObjectURL(coverImageData);
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
    const response = await fetch(`${BASE_URL}/albums/${albumId}/${trackId}`);

    if (!response.ok) {
        const { message } = await response.json();
        throw new Error(message);
    }

    return `${BASE_URL}/albums/${albumId}/${trackId}`;
};
