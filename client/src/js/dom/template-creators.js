// Album Item HTML Template
export const createAlbumHTML = (albumData) => {
    return `
        <div
            class="genre__albums-item album"
            tabindex="0"
            data-album-id="${albumData.id}"
        >
            <div class="album__cover">
                <img
                    src="${albumData.cover}"
                    alt="${albumData.title} album cover"
                    class="album__cover-image"
                />
            </div>
            <h3 class="album__title">${albumData.title}</h3>
            <div class="album__artist">
                ${albumData.artist}
            </div>
            <img
                src="${albumData.cover}"
                alt="Album cover backdrop"
                class="album__active-highlight"
                aria-hidden="true"
                
            />
        </div>
    `;
};
