import playerState from '../../state/player-state';
import { ee } from '../../helpers/event-emitter';
import { playerElms } from './player-dom-elements';
import { isTouchDevice } from '../../helpers/touch-device-check';

const calcCanvasAndPointWidth = () => {
    let canvasWidth = 370;
    let pointWidth = 2.5;
    let pointMargin = 1.2;

    // Keep margin/width ratio ~1/2
    if (window.innerWidth <= 767) {
        canvasWidth = window.innerWidth - CANVAS_X_PADDING;
        pointWidth = ((canvasWidth / POINTS_COUNT) * 2) / 3;
        pointMargin = canvasWidth / POINTS_COUNT / 3;
    }
    return [canvasWidth, pointWidth, pointMargin];
};

const POINTS_COUNT = 100;
const CANVAS_X_PADDING = 30;
const CANVAS_HEIGHT = 42;
const DEFAULT_WAVEFORM_DATA = Array(POINTS_COUNT).fill(100);
const POINT_FILL_COLOR = '#5c4e16';
const POINT_BUFFERED_COLOR = '#927916';
const POINT_PLAYED_COLOR = '#ffcd06';
const POINT_HOVER_COLOR = '#e6e481';

let [canvasWidth, pointWidth, pointMargin] = calcCanvasAndPointWidth();

const canvas = playerElms.playerProgressElm;

canvas.width = canvasWidth;
canvas.height = CANVAS_HEIGHT;
const ctx = canvas.getContext('2d');

let hoverXCoord;
let lastPlayedPoint = 0;
let lastBufferedPoint = 0;

const getPointCoords = ({
    index,
    pointWidth,
    pointMargin,
    canvasHeight,
    pointAmplitude,
}) => {
    const pointHeight = Math.round((pointAmplitude / 100) * canvasHeight);
    const vertCenter = Math.round((canvasHeight - pointHeight) / 2);
    return [
        index * (pointWidth + pointMargin),
        canvasHeight - pointHeight - vertCenter,
        pointWidth,
        pointHeight,
    ];
};

export const renderWaveForm = (
    waveformData,
    lastPlayedPoint,
    hoverXCoord,
    lastBufferedPoint
) => {
    const data = waveformData ?? DEFAULT_WAVEFORM_DATA;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    data.forEach((point, index) => {
        ctx.beginPath();

        const pointCoords = getPointCoords({
            index,
            pointWidth: pointWidth,
            pointMargin: pointMargin,
            canvasHeight: CANVAS_HEIGHT,
            pointAmplitude: point,
        });

        ctx.rect(...pointCoords);

        const isPointHovered = hoverXCoord >= pointCoords[0];
        const isPointPlayed = index < lastPlayedPoint;
        const isPointBuffered = index < lastBufferedPoint;

        if (isPointBuffered) {
            ctx.fillStyle = POINT_BUFFERED_COLOR;
        }
        if (isPointPlayed) {
            ctx.fillStyle = POINT_PLAYED_COLOR;
        }
        if (isPointHovered) {
            ctx.fillStyle = POINT_HOVER_COLOR;
        }
        if (!isPointBuffered && !isPointHovered) {
            ctx.fillStyle = POINT_FILL_COLOR;
        }

        ctx.fill();
    });
};

ee.on('player/audio-source-changed', () => {
    lastBufferedPoint = 0;
});

ee.on('player/data-buffering', (bufferedTime) => {
    const { selectedTrack } = playerState;

    const trackBufferedTime = bufferedTime / selectedTrack.duration;
    lastBufferedPoint =
        (canvasWidth * trackBufferedTime) / (pointWidth + pointMargin);

    requestAnimationFrame(() =>
        renderWaveForm(
            selectedTrack.waveformData,
            lastPlayedPoint,
            hoverXCoord,
            lastBufferedPoint
        )
    );
});

ee.on('player/time-updated', (currentTime) => {
    const { selectedTrack } = playerState;

    const trackProgress = currentTime / selectedTrack.duration;
    lastPlayedPoint =
        (canvasWidth * trackProgress) / (pointWidth + pointMargin);

    requestAnimationFrame(() =>
        renderWaveForm(
            selectedTrack.waveformData,
            lastPlayedPoint,
            hoverXCoord,
            lastBufferedPoint
        )
    );
});

canvas.addEventListener('mousemove', ({ layerX }) => {
    const { selectedTrack } = playerState;
    if (!selectedTrack || isTouchDevice()) {
        return;
    }

    hoverXCoord = layerX;
    requestAnimationFrame(() =>
        renderWaveForm(
            selectedTrack.waveformData,
            lastPlayedPoint,
            hoverXCoord,
            lastBufferedPoint
        )
    );
});

canvas.addEventListener('mouseleave', () => {
    const { selectedTrack } = playerState;
    if (!selectedTrack || isTouchDevice()) {
        return;
    }

    hoverXCoord = undefined;
    requestAnimationFrame(() =>
        renderWaveForm(
            selectedTrack.waveformData,
            lastPlayedPoint,
            hoverXCoord,
            lastBufferedPoint
        )
    );
});

canvas.addEventListener('click', ({ layerX }) => {
    const { selectedTrack } = playerState;
    if (!selectedTrack) {
        return;
    }

    ee.emit(
        'progress/time-update',
        (selectedTrack.duration * layerX) / canvasWidth
    );
});

window.addEventListener('resize', () => {
    let waveformData = playerState.selectedTrack?.waveformData;
    if (!waveformData) {
        waveformData = DEFAULT_WAVEFORM_DATA;
    }

    [canvasWidth, pointWidth, pointMargin] = calcCanvasAndPointWidth();
    canvas.width = canvasWidth;

    requestAnimationFrame(() =>
        renderWaveForm(
            waveformData,
            lastPlayedPoint,
            hoverXCoord,
            lastBufferedPoint
        )
    );
});
