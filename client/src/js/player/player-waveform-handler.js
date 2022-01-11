import { ee } from '../helpers/event-emitter';
import { state } from '../state/state';
import { playerElms } from './player-dom-elements';
import { isTouchDevice } from '../helpers/touch-device-check';

const calcCanvasAndPointWidth = () => {
    let canvasWidth = 400;
    let pointWidth = 3;
    let pointMargin = 1;

    // Preserving margin/width ratio 1/3
    if (window.innerWidth <= 575) {
        canvasWidth = window.innerWidth - CANVAS_X_PADDING;
        pointWidth = ((canvasWidth / POINTS_COUNT) * 3) / 4;
        pointMargin = canvasWidth / POINTS_COUNT / 4;
    }
    return [canvasWidth, pointWidth, pointMargin];
};

const POINTS_COUNT = 100;
const CANVAS_X_PADDING = 50;
const CANVAS_HEIGHT = 42;
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
let currentWaveformData;
let playedPoint = 0;
let bufferedPoint = 0;

const getPointCoords = ({
    index,
    pointWidth,
    pointMargin,
    canvasHeight,
    pointAmplitude,
}) => {
    const pointHeight = Math.round(
        (pointAmplitude / POINTS_COUNT) * canvasHeight
    );
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
    playedPoint = 0,
    hoverXCoord,
    bufferedPoint
) => {
    const data = waveformData ?? Array(POINTS_COUNT).fill(100);
    currentWaveformData = data;

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
        const isPointPlayed = index < playedPoint;
        const isPointBuffered = index < bufferedPoint;

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
    bufferedPoint = 0;
});

ee.on('player/data-buffering', (bufferedTime) => {
    const { selectedTrack } = state;
    if (!selectedTrack) {
        return;
    }

    const trackBufferedTime = bufferedTime / selectedTrack.duration;
    bufferedPoint =
        (canvasWidth * trackBufferedTime) / (pointWidth + pointMargin);

    requestAnimationFrame(() =>
        renderWaveForm(
            selectedTrack.waveformData,
            playedPoint,
            hoverXCoord,
            bufferedPoint
        )
    );
});

ee.on('player/time-updated', (currentTime) => {
    const { selectedTrack } = state;
    if (!selectedTrack) {
        return;
    }

    const trackProgress = currentTime / selectedTrack.duration;
    playedPoint = (canvasWidth * trackProgress) / (pointWidth + pointMargin);

    requestAnimationFrame(() =>
        renderWaveForm(
            selectedTrack.waveformData,
            playedPoint,
            hoverXCoord,
            bufferedPoint
        )
    );
});

canvas.addEventListener('mousemove', ({ layerX }) => {
    const { selectedTrack } = state;
    if (!selectedTrack || isTouchDevice()) {
        return;
    }

    hoverXCoord = layerX;
    requestAnimationFrame(() =>
        renderWaveForm(
            selectedTrack.waveformData,
            playedPoint,
            hoverXCoord,
            bufferedPoint
        )
    );
});

canvas.addEventListener('mouseleave', () => {
    const { selectedTrack } = state;
    if (!selectedTrack || isTouchDevice()) {
        return;
    }

    hoverXCoord = undefined;
    requestAnimationFrame(() =>
        renderWaveForm(
            selectedTrack.waveformData,
            playedPoint,
            hoverXCoord,
            bufferedPoint
        )
    );
});

canvas.addEventListener('click', ({ layerX }) => {
    const { selectedTrack } = state;
    if (!selectedTrack) {
        return;
    }

    ee.emit(
        'progress/time-update',
        (selectedTrack.duration * layerX) / canvasWidth
    );
});

window.addEventListener('resize', () => {
    [canvasWidth, pointWidth, pointMargin] = calcCanvasAndPointWidth();
    canvas.width = canvasWidth;

    requestAnimationFrame(() =>
        renderWaveForm(
            currentWaveformData,
            playedPoint,
            hoverXCoord,
            bufferedPoint
        )
    );
});
