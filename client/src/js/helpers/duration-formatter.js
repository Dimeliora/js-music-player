export const getFormattedDuration = (duration) => {
    const stringify = (value) => String(value).padStart(2, '0');

    const mins = Math.floor(duration / 60);
    const secs = Math.floor(duration % 60);

    return `${stringify(mins)}:${stringify(secs)}`;
};
