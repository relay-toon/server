import { AuthGuard } from '@nestjs/passport';

export class KakaoAuthGuard extends AuthGuard('kakao') {}

export class NaverAuthGuard extends AuthGuard('naver') {}

export class GoogleAuthGuard extends AuthGuard('google') {}

export class JwtAuthGuard extends AuthGuard('jwt') {}
