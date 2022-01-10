// Album Item HTML Template
export const createAlbumHTML = (albumData) => {
    const { id, cover, title, artist } = albumData;

    return `
        <div
            class="genre__albums-item album"
            tabindex="0"
            data-album-id="${id}"
        >
            <div class="album__cover">
                <img
                    src="${cover}"
                    alt="${title} album cover"
                    class="album__cover-image"
                />
            </div>
            <h3 class="album__title">${title}</h3>
            <div class="album__artist">
                ${artist}
            </div>
            <img
                src="${cover}"
                alt="Album cover backdrop"
                class="album__active-highlight"
                aria-hidden="true"
                
            />
        </div>
    `;
};
