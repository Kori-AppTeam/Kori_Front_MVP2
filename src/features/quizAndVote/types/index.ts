// 퀴즈, 투표
export interface QuizAndVoteItem {
  id: number;
  type: 'QUIZ' | 'VOTE';
  title: string;
  description: string;
  closeAt: string;
  totalVoteCount: number;
  options: OptionType[];
  selectedOptionId: number | null;
}

export interface OptionType {
  id: number;
  content: string;
  voteCount: number;
}
