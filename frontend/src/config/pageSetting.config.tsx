// 페이지명과 URL정보를 담고 있는 객체 배열, 객체 추가시 서브 페이지도 추가 가능
export const pageGroup: { [key: string]: any } = {
  Todo: [{ Todo: `/` }],
  Post: [{ Post: `post` }],
  Patch: [{ Patch: `patch` }],
  Etc: [{ Etc: `etc` }],
};
