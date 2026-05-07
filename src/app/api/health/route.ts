import { NextResponse } from 'next/server';

export const GET = async () => {
  const apiProxyTarget = process.env.API_PROXY_TARGET;
  const nextPublicApiUrl = process.env.NEXT_PUBLIC_API_URL;

  let apiReachable = false;
  let apiStatus: number | null = null;
  let apiError: string | null = null;

  if (apiProxyTarget) {
    try {
      const res = await fetch(`${apiProxyTarget}/api/v1/users/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      apiStatus = res.status;
      apiReachable = true;
    } catch (e) {
      apiError = e instanceof Error ? e.message : String(e);
    }
  }

  return NextResponse.json({
    env: {
      API_PROXY_TARGET: apiProxyTarget ?? '(not set)',
      NEXT_PUBLIC_API_URL: nextPublicApiUrl ?? '(not set)',
      NODE_ENV: process.env.NODE_ENV,
    },
    api: {
      reachable: apiReachable,
      status: apiStatus,
      error: apiError,
    },
  });
};
