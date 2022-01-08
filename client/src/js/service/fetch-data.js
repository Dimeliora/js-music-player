const BASE_URL = 'http://localhost:3000/api';

export const getAlbumsData = async () => {
    const response = await fetch(`${BASE_URL}/albums`);
    return response.json();
};

export const getAlbumsCoverImages = async (albumsData) => {
    const requests = albumsData.map(async (album) => {
        const response = await fetch(`${BASE_URL}/albums/cover/${album.id}`);
        const coverImageData = await response.blob();
        album.cover = URL.createObjectURL(coverImageData);
        return album;
    });

    return Promise.all(requests);
};
