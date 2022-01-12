import { appElms } from './app-dom-elements';

export const showApp = () => {
    appElms.appPreloaderElm.classList.add('preloader--hidden');
    appElms.appBlockElm.classList.add('container--visible');
};

export const showError = () => {
    appElms.appPreloaderElm.classList.add('preloader--static');
    appElms.appPreloaderElm.firstElementChild.textContent =
        'Service is unreachable. Please try again later';
};
