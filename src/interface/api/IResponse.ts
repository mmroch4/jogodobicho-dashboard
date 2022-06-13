export interface IResponse<T> {
  success: boolean;
  status: number;
  message: string;
  response: IServiceResponse<T>;
}

export interface IServiceResponse<T> {
  type: IServiceResponseType;
  payload: T;
  created_at: Date;
}

export type IServiceResponseType =
  | "FindEvent"
  | "CreateEvent"
  | "UpdateEvent"
  | "DeleteEvent"
  | "AuthEvent"
  | "ValidateEvent"
  | "PayEvent"
  | "ErrorEvent";
