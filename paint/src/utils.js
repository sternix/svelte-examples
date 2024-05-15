
// https://github.com/aml2610/react-painter/blob/master/src/helpers/eventHelpers.ts
export function extractOffSetFromEvent(e, scalingFactor, canvas) {
    const {
        offsetX,
        offsetY,
        touches,
        clientX: mouseClientX,
        clientY: mouseClientY
    } = e;

    // If offset coords are directly on the event we use them
    if (offsetX && offsetY) {
        return {
            offsetX: offsetX * scalingFactor,
            offsetY: offsetY * scalingFactor
        };
    }

    // Otherwise we need to calculate them as difference between (x, y) of event and (left, top) corner of canvas
    // We need to check whether user is using a touch device or just the mouse and extract
    // the touch/click coords accordingly
    const clientX = touches && touches.length ? touches[0].clientX : mouseClientX;
    const clientY = touches && touches.length ? touches[0].clientY : mouseClientY;
    const rect = canvas.getBoundingClientRect();
    const x = (clientX - rect.left) * scalingFactor;
    const y = (clientY - rect.top) * scalingFactor;

    return {
        offsetX: x,
        offsetY: y
    };
}