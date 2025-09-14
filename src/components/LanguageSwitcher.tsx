'use client';

import { useRouter, usePathname, useParams } from 'next/navigation';
import { locales } from '@/i18n/config';

export default function LanguageSwitcher() {
  const params = useParams();
  const locale = params.locale as string;
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: string) => {
    // Remove the current locale from the pathname if it exists
    const pathWithoutLocale = pathname.replace(`/${locale}`, '') || '/';

    // Navigate to the new locale path - always use locale prefix for consistency
    router.push(`/${newLocale}${pathWithoutLocale}`);
  };

  return (
    <div className="flex items-center space-x-2">
      <select
        value={locale}
        onChange={(e) => switchLocale(e.target.value)}
        className="bg-white border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
      >
        <option value="en">🇺🇸 English</option>
        <option value="th">🇹🇭 ไทย</option>
      </select>
    </div>
  );
}