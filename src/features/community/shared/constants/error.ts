// 공통 에러
export const COMMON_ERROR_CODE = {
  INVALID_INPUT: 'INVALID_INPUT',
  PROFILE_SET_NOT_COMPLETED: 'PROFILE_SET_NOT_COMPLETED',
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  METHOD_NOT_ALLOWED: 'METHOD_NOT_ALLOWED',
  INAPPROPRIATE_CONTENT: 'INAPPROPRIATE_CONTENT',
};
export const COMMON_ERROR_MESSAGE = {
  [COMMON_ERROR_CODE.INVALID_INPUT]: 'The input provided is invalid.',
  [COMMON_ERROR_CODE.PROFILE_SET_NOT_COMPLETED]: 'Your profile is incomplete. Please complete your profile setup.',
  [COMMON_ERROR_CODE.INTERNAL_SERVER_ERROR]: 'An internal server error occurred. Please try again later.',
  [COMMON_ERROR_CODE.METHOD_NOT_ALLOWED]: 'The HTTP method used is not allowed for this endpoint.',
  [COMMON_ERROR_CODE.INAPPROPRIATE_CONTENT]: 'The content you have submitted is inappropriate.',
};

// 커뮤니티 관련 에러 (게시글, 댓글)
export const COMMUNITY_ERROR_CODE = {
  // 게시글
  BOARD_NOT_FOUND: 'BOARD_NOT_FOUND',
  POST_NOT_FOUND: 'POST_NOT_FOUND',
  TOO_MANY_POSTS: 'TOO_MANY_POSTS',
  DUPLICATE_REPORT: 'DUPLICATE_REPORT',
  INVALID_JSON: 'INVALID_JSON',
  POLL_NOT_FOUND: 'POLL_NOT_FOUND',

  // 댓글
  TOO_MANY_COMMENTS: 'TOO_MANY_COMMENTS',

  // 공통 (게시글/댓글)
  NOT_AVAILABLE_ANONYMOUS: 'NOT_AVAILABLE_ANONYMOUS',
};
export const COMMUNITY_ERROR_MESSAGE = {
  // 게시글
  [COMMUNITY_ERROR_CODE.BOARD_NOT_FOUND]: 'The specified board does not exist.',
  [COMMUNITY_ERROR_CODE.POST_NOT_FOUND]: 'The requested post was not found.',
  [COMMUNITY_ERROR_CODE.TOO_MANY_POSTS]: 'You have exceeded the post limit. Please try again later.',
  [COMMUNITY_ERROR_CODE.DUPLICATE_REPORT]: 'You have already reported this post.',
  [COMMUNITY_ERROR_CODE.INVALID_JSON]: 'The JSON format is invalid.',
  [COMMUNITY_ERROR_CODE.POLL_NOT_FOUND]: 'The requested poll was not found.',
  // 댓글
  [COMMUNITY_ERROR_CODE.TOO_MANY_COMMENTS]: 'You have exceeded the comment limit. Please try again later.',

  // 공통 (게시글/댓글)
  [COMMUNITY_ERROR_CODE.NOT_AVAILABLE_ANONYMOUS]: 'Anonymous posts/comments are not allowed in this category.',
};
