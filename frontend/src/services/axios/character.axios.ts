import customErrorToast from "lib/customErrorToast";
import { useAxiosCustom } from "services/setting/axios.custom";

export const useCharacter_a = () => {
  const instance = useAxiosCustom(true); // 로그인 회원 전용

  const getCharacter = async () => {
    try {
      const res = await instance.get("/char/getCharacter");
      return res.data;
    } catch (err: any) {
      if (err.response) customErrorToast(err.response.data.statusCode);
      if (err.message) customErrorToast(err.message);
      console.log(err);
    }
  };

  const setCharacter = async (name: string) => {
    try {
      const res = await instance.post("/char/setCharacter", { charName: name });
      return res.data;
    } catch (err: any) {
      if (err.response) customErrorToast(err.response.data.statusCode);
      if (err.message) customErrorToast(err.message);
      console.log(err);
    }
  };

  const delCharacter = async (name: string) => {
    try {
      const res = await instance.delete("/char/delCharacter", {
        params: {
          charName: name
        }
      });
      return res.data;
    } catch (err: any) {
      if (err.response) customErrorToast(err.response.data.statusCode);
      if (err.message) customErrorToast(err.message);
      console.log(err);
    }
  };

  return { getCharacter, setCharacter, delCharacter };
};
