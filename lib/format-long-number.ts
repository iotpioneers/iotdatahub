export function formatLongNumber(num: number | string | null | undefined): string {
  // Convert to number and handle invalid cases
  const numValue = typeof num === 'string' ? parseFloat(num) : Number(num);
  
  // Return '0' for invalid numbers
  if (isNaN(numValue) || numValue === null || numValue === undefined) {
    return '0';
  }
  
  if (numValue >= 1000000000000) {
    return (numValue / 1000000000000).toFixed(1).replace(/\.0$/, "") + "T";
  }
  if (numValue >= 1000000000) {
    return (numValue / 1000000000).toFixed(1).replace(/\.0$/, "") + "B";
  }
  if (numValue >= 1000000) {
    return (numValue / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (numValue >= 1000) {
    return (numValue / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  }
  // For numbers less than 1000, limit to 2 decimal places and remove trailing zeros
  return Number(numValue.toFixed(2)).toString();
}
