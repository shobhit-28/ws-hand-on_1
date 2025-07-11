export type commonHttpType = {
  success: true,
  message: string
}


export type ApiResponse<T> = commonHttpType & {
  data: T;
};
