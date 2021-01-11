/* eslint-disable no-dupe-keys */
module.exports = {
  NULL_VALUE: '필요한 값이 없습니다.',
  OUT_OF_VALUE: '파라미터 값이 잘못 되었습니다.',

  /* 회원가입 */
  SIGN_UP_SUCCESS: '회원 가입 성공.',
  SIGN_UP_FAIL: '회원 가입 실패.',

  /* 로그인 */
  SIGN_IN_SUCCESS: '로그인 성공.',
  SIGN_IN_FAIL: '로그인 실패.',

  /* 온보드 정보 등록 */
  UPDATE_ONBOARD_SUCCESS: '온보드 정보 등록 성공',
  UPDATE_ONBOARD_FAIL: '온보드 정보 등록 실패',

  /* 회원관리 */
  ALREADY_ID: '존재하는 ID 입니다.',
  NO_USER: '존재하지않는 유저 id 입니다.',
  ALREADY_EMAIL: '이미 존재하는 이메일 입니다.',
  NO_EMAIL: '존재하지 않는 이메일 입니다.',
  MISS_MATCH_PW: '비밀번호가 일치하지 않습니다',

  /* 타임스탬프 */
  CREATE_TIMESTAMP_SUCCESS: '타임스탬프 생성 완료',
  CREATE_TIMESTAMP_FAIL: '타임스탬프 생성 실패',
  READ_TIMESTAMP_ALL_SUCCESS: '전체 타임스탬프 조회 성공',
  READ_TIMESTAMP_ALL_FAIL: '전체 타임스탬프 조회 실패',
  READ_TIMESTAMP_SUCCESS: '타임스탬프 조회 성공',
  READ_TIMESTAMP_FAIL: '타임스탬프 조회 실패',

  /* 시간, 날짜 포맷 */
  INVALID_DATETIME_FORMAT: '유효하지 않은 날짜, 시간 정보 포맷입니다',
  INVALID_TIME_FORMAT: '유효하지 않은 시간 정보 포맷입니다.',
  INVALID_DATE_FORMAT: '유효하지 않은 날짜 정보 포맷입니다.',

  /* 독서록 */
  CREATE_BOOKCOMMENT_SUCCESS: '독후감 생성 완료',
  CREATE_BOOKCOMMENT_FAIL: '독후감 생성 실패',
  ALREADY_BOOKCOMMENT: '이미 독후감이 작성됐습니다.',

  /* 오늘 하루 다짐 */
  CREATE_DAILYMAXIM_SUCCESS: '오늘 하루 다짐 생성 완료',
  CREATE_DAILYMAXIM_FAIL: '오늘 하루 다짐 생성 실패',
  READ_DAILYMAXIM_SUCCESS: '오늘 하루 다짐 조회 완료',
  READ_DAILYMAXIM_FAIL: '오늘 하루 다짐 조회 실패',
  ALREADY_DAILYMAXIM_CONTENTS: '이미 존재하는 오늘 하루 다짐 문구 입니다.',
  ALREADY_DAILYMAXIM_DATE: '이미 오늘 하루 다짐 문구가 등록된 날짜입니다.',

  /* 자기 회고 및 일기 */
  CREATE_DAILYDIARY_SUCCESS: '일기 작성 완료',
  CREATE_DAILYDIARY_FAIL: '일기 작성 실패',

  /* 게시글 */
  READ_POST_ALL_SUCCESS: '전체 게시글 조회 성공',
  READ_POST_ALL_FAIL: '전체 게시글 조회 실패',

  /* 포스트 */
  CREATE_POST_SUCCESS: '그룹에 타임스탬프가 포스팅되었습니다.',

  /* 그룹 */
  NO_GROUP: '존재하지 않는 그룹의 ID입니다.',
  CREATE_GROUP_SUCCESS: '그룹 생성 완료',
  CREATE_GROUP_FAIL: '그룹 생성 실패',
  ALREADY_GROUP: '이미 그룹에 속해 있습니다.',
  JOIN_GROUP_SUCCESS: '그룹 참가 완료',
  JOIN_GROUP_FAIL: '그룹 참가 실패',
  READ_GROUP_ALL_SUCCESS: '그룹에 가입된 사용자의 전체 그룹 조회 성공',
  READ_GROUP_ALL_FAIL: '그룹에 가입된 사용자의 전체 그룹 조회 실패',
  MEMBER_NUMBER_LIMITATION: '그룹의 인원이 가득찼습니다.',

  /* 그룹 상세정보 */
  GET_GROUP_DETAIL_SUCCESS: '그룹 상세보기 정보 불러오기 성공',
  GET_GROUP_DETAIL_FAIL: '그룹 상세보기 정보 불러오기 실패',

  /* 설정 정보 */
  GET_GROUP_SETTING_SUCCESS: '그룹 설정 정보 불러오기 성공',
  GET_GROUP_SETTING_FAIL: '그룹 설정 정보 불러오기 실패',

  /* 그룹 이미지 등록 */
  CREATE_GROUPIMAGE_SUCCESS: '그룹 이미지 등록 완료',
  CREATE_GROUPIMAGE_FAIL: '그룹 이미지 등록 실패',

  /* 토큰 */
  EMPTY_TOKEN: '토큰 값이 없습니다.',
  EXPIRED_TOKEN: '토큰 값이 만료되었습니다.',
  INVALID_TOKEN: '유효하지 않은 토큰값입니다.',
  AUTH_SUCCESS: '인증에 성공했습니다.',
  ISSUE_SUCCESS: '새로운 토큰이 생성되었습니다.',

  /* 서버에러 */
  INTERNAL_SERVER_ERROR: '서버 내부 오류',
};
