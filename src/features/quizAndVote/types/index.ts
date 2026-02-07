// 퀴즈, 투표 Base 타입
export interface PollBaseType {
  title: string;
  description?: string;
  closeAt: string;
  totalVoteCount: number;
  options: OptionType[];
  selectedOptionId: number | null; // 사용자가 선택한 옵션 ID, 선택하지 않았으면 null
  correctOptionId?: number | null; // 퀴즈인 경우 정답 옵션 ID
}

// 퀴즈, 투표
export interface TodayPollType extends PollBaseType {
  id: number;
  type: 'QUIZ' | 'VOTE';
}

// 오늘의 퀴즈/투표 서버 응답 타입
export interface TodayPollServerResp {
  message: string;
  data: TodayPollType;
  timestamp: string;
}

export interface OptionType {
  id: number;
  optionId?: number;
  content: string;
  voteCount: number;
}

// 퀴즈/투표 참여 파라미터
export interface PostPollParams {
  pollId: number;
  optionId: number;
  pollType: 'QUIZ' | 'VOTE';
}

// 퀴즈/투표 참여 후 응답 타입
export interface QuizAndVoteResponse {
  message: string;
  data: {
    pollId: number;
    type: 'QUIZ' | 'VOTE';
    isCorrect?: boolean;
    correctOptionId?: number;
    results: {
      optionId: number | null;
      voteCount: number;
      percentage: number;
    }[];
  };
  timestamp: string;
}

// 투표 생성 API 파라미터
export interface MakeVoteParams {
  content?: string;
  title: string;
  description?: string;
  isAnonymous: boolean;
  options: string[];
}
