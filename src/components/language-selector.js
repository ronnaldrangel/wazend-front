'use client';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Globe } from "lucide-react";

const LanguageSelector = () => {
  const router = useRouter();
  const { t } = useTranslation('common');
  const { locale, locales, asPath } = router;

  const handleLanguageChange = (newLocale) => {
    router.push(asPath, asPath, { locale: newLocale });
  };

  const languageNames = {
    es: 'Español',
    en: 'English'
  };

  return (
    <div className="notranslate">
      <Select value={locale} onValueChange={handleLanguageChange}>
        <SelectTrigger className="w-[130px]">
          <div className="flex items-center gap-2 text-sm">
            <Globe className="h-4 w-4" />
            <SelectValue placeholder={t('language')} />
          </div>
        </SelectTrigger>
        <SelectContent className="min-w-[130px]">
          {locales?.map((lng) => (
            <SelectItem 
              key={lng} 
              value={lng}
              className={locale === lng ? "font-medium" : ""}
            >
              {languageNames[lng] || lng}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default LanguageSelector;