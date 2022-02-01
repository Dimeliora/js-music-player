import { getFormattedDuration } from '../../helpers/duration-formatter';

export const createTrackHTML = (trackData) => {
    const { id, index, title, artist, duration, isPlaying } = trackData;

    const activeClass = isPlaying ? 'track--playing' : '';

    return `
        <li
            class="player__music-list-item track ${activeClass}"
            tabindex="0"
            data-track-id="${id}"
        >
            <div class="track__status">
                <span class="track__index">${index}</span>
                <svg class="track__icon track__icon--play">
                    <use href="/icons/icon-sprite.svg#play"/>
                </svg>                
                <svg class="track__icon track__icon--pause">
                    <use href="/icons/icon-sprite.svg#pause"/>
                </svg>
                <svg
                    viewBox="0 0 16 12"
                    class="track__icon track__icon--playing"
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
            <div class="track__title">${title}</div>
            <div class="track__artist">${artist}</div>
            <div class="track__duration">${getFormattedDuration(duration)}</div>
        </li>
    `;
};
