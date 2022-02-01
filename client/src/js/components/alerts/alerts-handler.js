import { v4 } from 'uuid';

import { alertElms } from './alerts-dom-elements';
import { createAlertHTML } from './alerts-template-creators';

export const alertHandle = (message, type) => {
    const alertId = `alert-${v4()}`;
    const alertTemplate = createAlertHTML(alertId, message, type);

    alertElms.alertBlockElm.insertAdjacentHTML('beforeend', alertTemplate);

    const alertElm = alertElms.alertBlockElm.querySelector(`#${alertId}`);

    const alertTimerId = setTimeout(() => {
        alertElm.style.opacity = 0;
    }, 5000);

    alertElm.addEventListener('transitionend', () => {
        alertElm.remove();
    });

    alertElm.addEventListener('click', () => {
        clearTimeout(alertTimerId);
        alertElm.remove();
    });
};
