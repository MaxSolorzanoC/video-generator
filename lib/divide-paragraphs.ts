export function divideByParagraphs(script: string): string[] {
    // Split the script into an array of paragraphs by newlines
    const paragraphs = script.split(/\n+/).filter(paragraph => paragraph.trim() !== '');
    return paragraphs;
}