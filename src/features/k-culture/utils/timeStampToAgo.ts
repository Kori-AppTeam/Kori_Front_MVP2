export const timeStampToAgo = (timestamp: number): string => {
  if (!timestamp) return 'Unknown time ago';

  return timestamp === 0 ? 'Today' : `${timestamp} days ago`;
};
