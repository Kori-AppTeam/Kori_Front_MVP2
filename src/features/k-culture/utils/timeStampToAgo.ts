export const timeStampToAgo = (timestamp: number): string => {
  if (!timestamp) return 'Unknown time ago';

  const now = Date.now();

  const secondsAgo = Math.floor((now - timestamp) / 1000);

  if (secondsAgo < 60) {
    return 'Just now';
  } else if (secondsAgo < 3600) {
    const minutes = Math.floor(secondsAgo / 60);
    return `${minutes}m ago`;
  } else if (secondsAgo < 86400) {
    const hours = Math.floor(secondsAgo / 3600);
    return `${hours}h ago`;
  } else {
    const days = Math.floor(secondsAgo / 86400);
    return `${days}d ago`;
  }
};
