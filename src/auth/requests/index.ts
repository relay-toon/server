import { Request } from 'express';

export interface KakaoRequest extends Request {
  user: {
    kakaoId: string;
  };
}

export interface NaverRequest extends Request {
  user: {
    naverId: string;
  };
}

export interface JwtRequest extends Request {
  user: {
    userId: string;
  };
}
