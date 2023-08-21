import customErrorToast from "lib/customErrorToast";
import { useAxiosCustom } from "services/setting/axios.custom";

export const useLog_a = () => {
  const instance = useAxiosCustom(true); // 로그인 회원 전용

  const getLog = async () => {
    try {
      const res = await instance.get("/log/getLog");
      return res.data;
    } catch (err: any) {
      err.response ? customErrorToast(err.response.data.statusCode) : false;
      err.message ? customErrorToast(err.message) : false;
      console.log(err);
    }
  };

  return { getLog };
};
