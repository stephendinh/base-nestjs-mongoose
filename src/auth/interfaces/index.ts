import { IUser } from '@modules/users/interfaces';

export interface IMessageResponse {
  message: string;
}

export interface JWTPayload {
  email: string;
}

export interface IGenerateTokenProps extends JWTPayload {}
export interface IGetUserAuthInfoRequest extends Request {
  user: IUser;
}
