import { toast, ToastOptions } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/* toast 알리미 커스터마이징 */
enum ToastType {
  Success = "success",
  Error = "error",
  Warning = "warning",
  Default = "default",
}

const customToast = (message: string, type: string) => {
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

  switch (type) {
    case ToastType.Success:
      return toast.success(message, config);
    case ToastType.Error:
      return toast.error(message, config);
    case ToastType.Warning:
      return toast.warning(message, config);
    default:
      return toast(message, config);
  }
};

export default customToast;
