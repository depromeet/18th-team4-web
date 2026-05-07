import { type NextRequest, NextResponse } from 'next/server';

const API_PROXY_TARGET = process.env.API_PROXY_TARGET!;

export const middleware = async (request: NextRequest) => {
  const userSession = request.cookies.get('user_session');

  // user_session 쿠키가 없으면 신규 세션 생성
  if (!userSession) {
    try {
      const apiResponse = await fetch(`${API_PROXY_TARGET}/api/v1/users/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (apiResponse.ok) {
        const setCookieHeader = apiResponse.headers.get('set-cookie');
        const userSessionMatch = setCookieHeader?.match(/user_session=([^;]+)/);

        if (userSessionMatch) {
          const userSessionValue = userSessionMatch[1];

          // 신규 쿠키를 요청 헤더에도 주입 → 같은 요청에서 서버 컴포넌트가 즉시 읽을 수 있도록
          const requestHeaders = new Headers(request.headers);
          const existingCookies = request.headers.get('cookie') ?? '';
          requestHeaders.set(
            'cookie',
            existingCookies
              ? `${existingCookies}; user_session=${userSessionValue}`
              : `user_session=${userSessionValue}`,
          );

          const response = NextResponse.next({ request: { headers: requestHeaders } });

          // 브라우저에 httpOnly 쿠키 설정
          response.cookies.set('user_session', userSessionValue, {
            path: '/',
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 365,
          });

          return response;
        }
      } else {
        console.error('[middleware] 세션 생성 실패:', apiResponse.status);
      }
    } catch (error) {
      console.error('[middleware] 세션 생성 중 오류 발생:', error);
    }
  }

  return NextResponse.next();
};

export const config = {
  matcher: [
    // 아래 경로를 제외한 모든 요청에 미들웨어 적용
    // - api (API 라우트)
    // - _next/static (정적 파일)
    // - _next/image (이미지 최적화)
    // - favicon.ico
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
