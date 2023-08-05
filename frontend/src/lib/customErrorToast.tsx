import { toast, ToastOptions } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const customErrorToast = (errorCode: Number) => {
  const config: ToastOptions = {
    position: "top-center",
    autoClose: 2000,
    hideProgressBar: true,
    closeOnClick: true,
    rtl: false,
    pauseOnFocusLoss: false,
    draggable: false,
    pauseOnHover: false,
  };

  switch (errorCode) {
    case 400:
      return toast.error("파라미터값이 잘못 요청되었습니다.", config);
    case 404:
      return toast.error("존재하지 않는 페이지에 대한 요청입니다.", config);
    case 429:
      return toast.error("짧은 시간에 너무 많은 요청이 감지 되었습니다. \n일정시간동안 사이트 이용이 제한됩니다.", config);
    default:
      return toast.error("서버 요청 중 에러가 발생하였습니다. 문제가 지속된다면 관리자에게 문의바랍니다.", config);
  }
};

export default customErrorToast;
