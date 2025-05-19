import { toast } from 'react-hot-toast';

type ToastPromiseMessages = {
  loading: string;
  success: string;
  error: string;
};

export const showToast = {
  promise: (promise: Promise<any>, messages: ToastPromiseMessages) => {
    return toast.promise(promise, {
      loading: messages.loading,
      success: <b>{messages.success}</b>,
      error: <b>{messages.error}</b>,
    });
  },
  success: (message: string) => {
    return toast.success(message);
  },
  error: (message: string) => {
    return toast.error(message);
  },
  info: (message: string) => {
    return toast(message, {
      icon: 'ℹ️',
    });
  }
};
