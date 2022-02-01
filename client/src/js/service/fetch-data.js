import axios from 'axios';

import { BASE_URL } from '../config/base-url';

const albumsService = axios.create({
    baseURL: `${BASE_URL}/albums`,
});

export const getAlbumsData = async () => {
    try {
        const { data } = await albumsService.get('/');

        return data;
    } catch (error) {
        if (!error.response) {
            throw new Error('Service is unreachable');
        }

        throw new Error(error.response.data.message);
    }
};

export const getAlbumsCoverImages = async (albumsData) => {
    const requests = albumsData.map(async (album) => {
        try {
            const { data } = await albumsService.get(`/cover/${album.id}`, {
                responseType: 'blob',
            });

            album.cover = URL.createObjectURL(data);
        } catch (error) {
            album.cover = null;
        }

        return album;
    });

    return Promise.all(requests);
};

export const getAlbumTracklist = async (albumId) => {
    try {
        const { data } = await albumsService.get(`/tracklist/${albumId}`);

        return data;
    } catch (error) {
        if (!error.response) {
            throw new Error('Service is unreachable');
        }

        throw new Error(error.response.data.message);
    }
};

export const getTrackFile = async (albumId, trackId) => {
    try {
        await albumsService.head(`/${albumId}/${trackId}`);

        return `${BASE_URL}/albums/${albumId}/${trackId}`;
    } catch (error) {
        if (!error.response) {
            throw new Error('Service is unreachable');
        }

        throw new Error('Track file not found');
    }
};
