export type ToastProps = {
  message: string;
  position:
    | "bottom-center"
    | "bottom-left"
    | "bottom-right"
    | "top-center"
    | "top-left"
    | "top-right";
};

export type SwiperBreakpoints = {
  [key in number]: {
    slidesPerView: number;
    spaceBetween: number;
  };
};
