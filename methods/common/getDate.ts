/**
 * Get current date
 * @returns Date today in YYYY-mm-dd
 */
export default (timestamp: number) => {
    const date = new Date();
    const offset = date.getTimezoneOffset()
    return new Date(timestamp - (offset * 60 * 1000)).toISOString().split('T')[0];
}