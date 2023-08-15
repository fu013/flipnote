import customErrorToast from "lib/customErrorToast";
import { useAxiosCustom } from "services/setting/axios.custom";

export const useTodo_a = () => {
  const instance = useAxiosCustom(true);

  const getTodo = async () => {
    try {
      const res = await instance.get("/char/getTodoPer");
      return res.data;
    } catch (err: any) {
      if (err.response) customErrorToast(err.response.data.statusCode);
      if (err.message) customErrorToast(err.message);
      console.log(err);
    }
  };

  return { getTodo };
};
