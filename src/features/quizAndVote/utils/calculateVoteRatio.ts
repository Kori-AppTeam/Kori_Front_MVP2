export const calculateVoteRatio = (totalCount: number, voteCount: number) => {
  if (totalCount === 0) return 0;
  return Math.round((voteCount / totalCount) * 100);
};
