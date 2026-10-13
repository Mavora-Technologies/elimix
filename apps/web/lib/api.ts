// apps/web/lib/api.ts
export const getApiUrl = () => {
  return process.env.NEXT_PUBLIC_API_URL || 'https://elimix.vercel.app/api/v1';
};