//공통에러
export const COMMON_ERROR_CODE = {
  INVALID_INPUT: 'INVALID_INPUT',
  PROFILE_SET_NOT_COMPLETED: 'PROFILE_SET_NOT_COMPLETED',
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
};
export const COMMON_ERROR_MESSAGE = {
  [COMMON_ERROR_CODE.INVALID_INPUT]: 'The input provided is invalid.',
  [COMMON_ERROR_CODE.PROFILE_SET_NOT_COMPLETED]: 'Your profile is incomplete. Please complete your profile setup.',
  [COMMON_ERROR_CODE.INTERNAL_SERVER_ERROR]: 'An internal server error occurred. Please try again later.',
};

// 댓글 관련 에러 코드 및 메시지
export const COMMENT_ERROR_CODE = {
  // 댓글 작성
  NOT_AVAILABLE_ANONYMOUS: 'NOT_AVAILABLE_ANONYMOUS',
  TOO_MANY_COMMENTS: 'TOO_MANY_COMMENTS',
};
export const COMMENT_ERROR_MESSAGE = {
  // 댓글 작성
  [COMMENT_ERROR_CODE.NOT_AVAILABLE_ANONYMOUS]: 'Anonymous comments are not allowed in this category.',
  [COMMENT_ERROR_CODE.TOO_MANY_COMMENTS]: 'You have exceeded the comment limit. Please try again later.',
};

// 게시글 관련 에러 코드 및 메시지
export const POST_ERROR_CODE = {
  // 게시글 신고, 차단
  INVALID_JSON: 'INVALID_JSON',
  POST_NOT_FOUND: 'POST_NOT_FOUND',
  METHOD_NOT_ALLOWED: 'METHOD_NOT_ALLOWED',
  DUPLICATE_REPORT: 'DUPLICATE_REPORT',
};
export const POST_ERROR_MESSAGE = {
  // 게시글 신고, 차단
  [POST_ERROR_CODE.INVALID_JSON]: 'The JSON format is invalid.',
  [POST_ERROR_CODE.POST_NOT_FOUND]: 'The requested post was not found.',
  [POST_ERROR_CODE.METHOD_NOT_ALLOWED]: 'The HTTP method used is not allowed for this endpoint.',
  [POST_ERROR_CODE.DUPLICATE_REPORT]: 'You have already reported this post.',
};
