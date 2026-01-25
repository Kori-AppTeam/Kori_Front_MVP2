export const calculateVoteRatio = (totalCount: number, voteCount: number) => {
  if (totalCount === 0) return 0;
  return (voteCount / totalCount) * 100;
};
