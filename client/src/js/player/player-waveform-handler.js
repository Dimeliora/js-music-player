import { playerElms } from '../dom/dom-elements';
import { state } from '../state/state';
import { ee } from '../helpers/event-emitter';

const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 42;
const POINT_WIDTH = 3;
const POINT_MARGIN = 1;
const POINT_FILL_COLOR = '#8a880d';
const POINT_PLAYED_COLOR = '#e4e00f';
const POINT_HOVER_COLOR = '#e6e481';
const POINT_HOVER_PLAYED_COLOR = '#47460e';

const canvas = playerElms.playerProgressElm;

canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
const ctx = canvas.getContext('2d');

let hoverXCoord;
let playedPoint = 0;

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

export const renderWaveForm = (playedPoint = 0, hoverXCoord) => {
    const { selectedTrack } = state;
    let waveformData = selectedTrack?.waveformData ?? Array(100).fill(100);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    waveformData.forEach((point, index) => {
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
        if (isPointHovered) {
            ctx.fillStyle = isPointPlayed
                ? POINT_HOVER_PLAYED_COLOR
                : POINT_HOVER_COLOR;
        } else if (isPointPlayed) {
            ctx.fillStyle = POINT_PLAYED_COLOR;
        } else {
            ctx.fillStyle = POINT_FILL_COLOR;
        }

        ctx.fill();
    });
};

ee.on('player/time-updated', (currentTime) => {
    const { selectedTrack } = state;

    const trackProgress = currentTime / selectedTrack.duration;
    playedPoint = (CANVAS_WIDTH * trackProgress) / (POINT_WIDTH + POINT_MARGIN);

    requestAnimationFrame(() => renderWaveForm(playedPoint, hoverXCoord));
});

canvas.addEventListener('mousemove', ({ layerX }) => {
    hoverXCoord = layerX;
    requestAnimationFrame(() => renderWaveForm(playedPoint, hoverXCoord));
});

canvas.addEventListener('mouseleave', () => {
    hoverXCoord = undefined;
    requestAnimationFrame(() => renderWaveForm(playedPoint, hoverXCoord));
});

canvas.addEventListener('click', ({ layerX }) => {
    const { selectedTrack } = state;

    ee.emit(
        'player/progress-click',
        (selectedTrack.duration * layerX) / CANVAS_WIDTH
    );
});
