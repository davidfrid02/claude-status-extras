export function parseStdin(raw) {
    const trimmed = raw.trim();
    if (!trimmed)
        return null;
    try {
        return JSON.parse(trimmed);
    }
    catch {
        return null;
    }
}
export async function readStdin() {
    if (process.stdin.isTTY)
        return null;
    const chunks = [];
    process.stdin.setEncoding('utf8');
    for await (const chunk of process.stdin) {
        chunks.push(chunk);
    }
    return parseStdin(chunks.join(''));
}
//# sourceMappingURL=stdin.js.map