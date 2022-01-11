import { ee } from '../helpers/event-emitter';
import { state } from '../state/state';
import { playerElms } from './player-dom-elements';

const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 42;
const POINT_WIDTH = 3;
const POINT_MARGIN = 1;
const POINT_FILL_COLOR = '#5c4e16';
const POINT_BUFFERED_COLOR = '#927916';
const POINT_PLAYED_COLOR = '#ffcd06';
const POINT_HOVER_COLOR = '#e6e481';

const canvas = playerElms.playerProgressElm;

canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
const ctx = canvas.getContext('2d');

let hoverXCoord;
let playedPoint = 0;
let bufferedPoint = 0;

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
    playedPoint = 0,
    hoverXCoord,
    bufferedPoint
) => {
    const data = waveformData ?? Array(100).fill(100);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    data.forEach((point, index) => {
        ctx.beginPath();

        const pointCoords = getPointCoords({
            index,
            pointWidth: POINT_WIDTH,
            pointMargin: POINT_MARGIN,
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
        (CANVAS_WIDTH * trackBufferedTime) / (POINT_WIDTH + POINT_MARGIN);

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
    playedPoint = (CANVAS_WIDTH * trackProgress) / (POINT_WIDTH + POINT_MARGIN);

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
    if (!selectedTrack) {
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
    if (!selectedTrack) {
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
        (selectedTrack.duration * layerX) / CANVAS_WIDTH
    );
});
