export const isTouchDevice = () => {
    return (
        window.ontouchstart ||
        navigator.maxTouchPoints > 0 ||
        navigator.msMaxTouchPoints > 0
    );
};
