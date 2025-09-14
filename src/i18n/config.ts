import {notFound} from 'next/navigation';
import {getRequestConfig} from 'next-intl/server';
import enMessages from '../../messages/en.json';
import thMessages from '../../messages/th.json';

export const locales = ['en', 'th'] as const;
export const defaultLocale = 'en' as const;

const messages = {
  en: enMessages,
  th: thMessages
};

export default getRequestConfig(async ({locale}) => {
  console.log('i18n config called with locale:', locale);

  // Extract locale from URL path if not provided directly
  if (!locale) {
    // This should be handled by Next.js middleware, but as fallback
    locale = defaultLocale;
  }

  // Ensure locale is a string and validate
  const localeStr = String(locale);
  if (!locales.includes(localeStr as any)) {
    console.warn(`Unsupported locale "${localeStr}", falling back to "${defaultLocale}"`);
    return {
      locale: defaultLocale,
      messages: messages[defaultLocale] || {}
    };
  }

  const selectedMessages = messages[localeStr as keyof typeof messages];

  if (!selectedMessages) {
    console.warn(`No messages found for locale "${localeStr}", using default messages`);
    return {
      locale: defaultLocale,
      messages: messages[defaultLocale] || {}
    };
  }

  return {
    locale: localeStr,
    messages: selectedMessages
  };
});