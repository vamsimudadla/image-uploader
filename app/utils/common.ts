export function formatBytes(bytes: number, decimals: number = 2) {
  if (typeof bytes !== "number" || bytes < 0) {
    return `0.${"0".repeat(decimals)} KB`;
  }

  const KB = 1024;
  const MB = KB * 1024;
  const GB = MB * 1024;

  if (bytes >= GB) {
    return `${(bytes / GB).toFixed(decimals)} GB`;
  } else if (bytes >= MB) {
    return `${(bytes / MB).toFixed(decimals)} MB`;
  }
  return `${(bytes / KB).toFixed(decimals)} KB`;
}
