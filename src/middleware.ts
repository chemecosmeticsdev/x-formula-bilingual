import createMiddleware from 'next-intl/middleware';
import {locales, defaultLocale} from '@/i18n/config';

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always' // Always use locale prefix for consistency
});

export const config = {
  // Match only internationalized pathnames, exclude API routes and static files
  matcher: ['/((?!api|_next|_static|.*\..*).*)']
};
