/**
 * Formats a date to YYYY-MM-DD format
 * @param date - Date object or date string
 * @returns Formatted date string in YYYY-MM-DD format
 */
export function formatDate(date: Date | string): string {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Formats a date to a more readable format (e.g., "March 14, 2025")
 * @param date - Date object or date string
 * @returns Formatted date string
 */
export function formatDateReadable(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
} 