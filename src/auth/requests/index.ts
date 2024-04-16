import { Request } from 'express';

export interface KakaoRequest extends Request {
  user: {
    kakaoId: string;
  };
}
