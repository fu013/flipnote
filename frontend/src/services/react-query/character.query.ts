import { useQuery } from "@tanstack/react-query";
import { useCharacter_a } from "services/axios/character.axios";

const QUERY_KEY = {
  char: "char",
};

// 캐싱 :: 캐릭터 목록
export const useFetchChar = () => {
  const myAxios = useCharacter_a();
  const { data, isLoading } = useQuery(
    [QUERY_KEY.char],
    () => myAxios.getCharacter()
  );
  return {
    char: data,
    char_isLoading: isLoading,
  };
};