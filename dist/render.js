const RESET = '\x1b[0m';
const DIM = '\x1b[2m';
const SEPARATOR = `${DIM} │ ${RESET}`;
export function buildLine(calendar, weather, spotify) {
    const segments = [calendar, weather, spotify].filter((s) => s !== null);
    if (segments.length === 0)
        return '';
    return segments.join(SEPARATOR);
}
export function buildOutput(alertStr, statusLine) {
    if (alertStr && statusLine)
        return `${alertStr}\n${statusLine}`;
    if (alertStr)
        return alertStr;
    return statusLine;
}
//# sourceMappingURL=render.js.map