export const timeStampToAgo = (timestamp: number): string => {
  // 데이터가 없거나 음수인 경우
  if (timestamp === undefined || timestamp === null || timestamp < 0) return 'Today';

  if (timestamp === 0) return 'Today';

  if (timestamp < 7) {
    return timestamp === 1 ? `${timestamp} day ago` : `${timestamp} days ago`;
  } else if (timestamp < 30) {
    const weeks = Math.floor(timestamp / 7);
    return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`;
  } else if (timestamp < 365) {
    const months = Math.floor(timestamp / 30);
    return months === 1 ? '1 month ago' : `${months} months ago`;
  } else {
    const years = Math.floor(timestamp / 365);
    return years === 1 ? '1 year ago' : `${years} years ago`;
  }
};
