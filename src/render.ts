const RESET = '\x1b[0m';
const DIM = '\x1b[2m';

const SEPARATOR = `${DIM} │ ${RESET}`;

export function buildLine(
  calendar: string | null,
  weather: string | null,
  spotify: string | null,
): string {
  const segments = [calendar, weather, spotify].filter(
    (s): s is string => s !== null,
  );
  if (segments.length === 0) return '';
  return segments.join(SEPARATOR);
}

export function buildOutput(
  alertStr: string | null,
  statusLine: string,
): string {
  if (alertStr && statusLine) return `${alertStr}\n${statusLine}`;
  if (alertStr) return alertStr;
  return statusLine;
}
