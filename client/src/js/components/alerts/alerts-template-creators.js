const alertTypeClassnames = {
    error: 'alert__item--error',
    success: 'alert__item--success',
};

export const createAlertHTML = (id, message, type) => {
    const typeClass = alertTypeClassnames[type];

    return `
        <div class="alert__item ${typeClass}" id="${id}">
            <svg class="alert__item-icon">
                <use href="/icons/icon-sprite.svg#alert-error" />
            </svg>
            <span>${message}</span>
        </div>
    `;
};
