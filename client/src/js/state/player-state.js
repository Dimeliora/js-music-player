class PlayerState {
    albums = [];
    selectedAlbum = null;
    selectedTrack = null;
    playingAlbum = null;

    setAlbumsData(albums) {
        this.albums = albums;
    }

    setSelectedAlbumData(albumData) {
        this.selectedAlbum = albumData;
    }

    setSelectedTrack(trackData) {
        this.selectedTrack = trackData;
    }

    setPlayingAlbum(albumData) {
        this.playingAlbum = albumData;
    }
}

export default new PlayerState();
