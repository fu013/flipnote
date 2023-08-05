import customErrorToast from "lib/customErrorToast";
import { LoginParams } from "services/interfaces/auth.interface";
import { useAxiosCustom } from "services/setting/axios.custom";

// character 관련 hook > api
export const useCharacter_a = () => {

  const instance = useAxiosCustom(true); // 회원만 사용 가능

  const setCharacter = async (name: string) => {
    try {
      await instance.post("/char/setCharacter", { charName: name });
    } catch (err: any) {
      if (err.response) customErrorToast(err.response.data.statusCode);
      console.log(err);
    }
  };

  return { setCharacter };
};
