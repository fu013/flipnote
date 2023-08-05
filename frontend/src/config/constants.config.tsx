/* 본 프로젝트는 .env를 쓰지 않고 이 파일에서 그 기능을 대신한다. */
/**
 * 서버내에서 사용하는 모든 공통 변수 및 기능, 외부 서버와의 연결 설정이 변경되거나 서버 내부의 공통값을 추가, 변경, 삭제시에는 반드시 해당 파일을 수정해야 한다
 * 절대 깃허브 혹은 공유 스토리지에 올라가지 않도록 주의하며, 개인 보관함에 보관하며 어떤 일이 있어도 유실되지 않도록 한다.
 * 네이밍 규칙: STATIC하므로 무조건 상수로 표기, 띄어쓰기를 해야하면 _으로 구분 ex) FINAL_INPUT
 */

// 전역 Contants 변수 추가(반드시 uppercase로 네이밍)
export const LOGO: string = "MapleFlipnote"; // 홈페이지 로고명
export const SERVER_URL: string = "http://localhost:29000"; // [THIS] API 서버 END-POINT
export const CLIENT_URL: string = "http://localhost:28000"; // CLIENT 서버 END-POINT
export const LOCAL_FRONT_IMG_URL: string = "static/images/";
export const LOCAL_SERVER_IMG_URL: string = `${SERVER_URL}/uploads`; // 서버 로컬 이미지 저장소 url
export let ACCESS_TOKEN: string = ""; // JWT CLIENT ACCESS_TOKEN 저장 변수
export const setAccessToken = (AccessToken: string) => {
  // 액세스 토큰 세터
  ACCESS_TOKEN = AccessToken;
};
export const ACCESS_TOKEN_EXPIRY: number = 1200000;
export let REFRESH_TOKEN_INTERVAL: NodeJS.Timeout | undefined;
export const SET_REFRESH_TOKEN_INTERVAL = (interval: any) => {
  REFRESH_TOKEN_INTERVAL = interval;
};
