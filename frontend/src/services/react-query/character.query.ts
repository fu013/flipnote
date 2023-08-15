import { useQuery } from "@tanstack/react-query";
import { useCharacter_a } from "services/axios/character.axios";

const QUERY_KEY = {
  char: "char",
};
/* 
react-query에서는 비동기 작업을 처리하는 함수가 
Promise를 반환하거나 비동기로 데이터를 처리하는 경우에만 데이터 변경을 감지합니다. 
axios 요청에서 응답에 return을 누락하면 해당 비동기 함수는 undefined를 반환하게 될 수 있습니다. 
이 경우 react-query는 갱신된 데이터를 가져오지 못해 변경을 감지할 수 없게 됩니다. 
즉, react-query는 axios 요청 같은 http요청에서 반환값이 존재하지 않는다면, 데이터 변경을 감지하지 못하여,
자동 갱신을 하지 않는다. react-query를 사용할땐 delete, update, insert등을 하고나서 서버로부터 꼭 응답 메세지를 받도록 한다.
*/

// 캐싱 :: 캐릭터 프리셋 목록
export const useFetchChar = () => {
  const myAxios = useCharacter_a();
  const { data, isLoading } = useQuery([QUERY_KEY.char], () => myAxios.getCharacter());
  if (typeof data === 'undefined') {
    throw new Error('데이터를 불러올 수 없습니다.');
  }
  return {
    char: data,
    char_isLoading: isLoading,
  };
};

