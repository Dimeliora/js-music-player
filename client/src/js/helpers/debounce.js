export const debounce = (fn, ms) => {
    let timerId;

    return (...args) => {
        clearTimeout(timerId);

        timerId = setTimeout(() => {
            fn(...args);
        }, ms);
    };
};
