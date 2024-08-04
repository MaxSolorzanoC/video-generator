export const countWords = (text: string) => {
    return text.split(/\s+/).filter(word => word !== '').length;
}