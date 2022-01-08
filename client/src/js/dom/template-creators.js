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

// Track Item HTML Template
export const createTrackHTML = (trackData) => {
    return `
        <li
            class="player__music-list-item track"
            tabindex="0"
            data-track-id="${trackData.id}"
        >
            <div class="track__controls">
                <span class="track__index">${trackData.index}</span>
                <button
                    class="track__button track__button--play"
                    tabindex="-1"
                    title="Play"
                    aria-label="Play"
                    data-track-play
                >
                    <svg class="track__icon">
                        <use
                            href="/icons/icon-sprite.svg#play"
                        />
                    </svg>
                </button>
                <button
                    class="track__button track__button--pause"
                    tabindex="-1"
                    title="Pause"
                    aria-label="Pause"
                    data-track-pause
                >
                    <svg class="track__icon">
                        <use href="/icons/icon-sprite.svg#pause"/>
                    </svg>
                </button>
                <svg
                    viewBox="0 0 16 12"
                    class="track__playing track__icon"
                >
                    <path
                        d="M1 3C1 2.4 1.4 2 2 2V2C2.5 2 3 2.4 3 3V14H1V3Z"
                    />
                    <path
                        d="M5 3C5 2.4 5.4 2 6 2V2C6.5 2 7 2.4 7 3V14H5V3Z"
                    />
                    <path
                        d="M9 3C9 2.4 9.4 2 10 2V2C10.5 2 11 2.4 11 3V14H9V3Z"
                    />
                    <path
                        d="M13 3C13 2.4 13.4 2 14 2V2C14.5 2 15 2.4 15 3V14H13V3Z"
                    />
                </svg>
            </div>
            <div class="track__title">${trackData.title}</div>
            <div class="track__artist">${trackData.artist}</div>
            <div class="track__duration">${trackData.duration}</div>
        </li>
    `;
};
