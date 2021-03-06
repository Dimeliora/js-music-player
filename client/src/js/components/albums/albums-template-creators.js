export const createGenreBlockHTML = (genre) => {
    return `
        <div class="genres__item" data-albums-genre="${genre}">
            <h2 class="genres__heading" data-albums-genre-title>
                ${genre}
            </h2>
            <div class="genres__albums" data-albums-grid>{{albums}}</div>
        </div>
    `;
};

export const createAlbumHTML = (albumData) => {
    const { id, cover, title, artist } = albumData;

    const coverSrc = cover ?? '/images/album-cover-placeholder.jpg';

    return `
        <div
            class="genre__albums-item album"
            tabindex="0"
            data-album-id="${id}"
        >
            <div class="album__cover">
                <img
                    src="${coverSrc}"
                    alt="${title} album cover"
                    class="album__cover-image"
                />
            </div>
            <h3 class="album__title">${title}</h3>
            <div class="album__artist">
                ${artist}
            </div>
            <img
                src="${coverSrc}"
                alt="Album cover backdrop"
                class="album__active-highlight"
                aria-hidden="true"
                
            />
        </div>
    `;
};
