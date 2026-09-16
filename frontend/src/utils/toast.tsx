  import { Bounce, ToastContainer, toast } from 'react-toastify';
  
  export const toastWarn = (msg: string) => {
    toast.warn(msg, {
      position: "top-center",
      toastId: 'campos-vazios',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      closeButton: false,
      pauseOnHover: true,
      draggable: false,
      progress: undefined,
      theme: "light",
      transition: Bounce,
    });
  }