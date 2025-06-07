import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from '../locales/en/common.json';
import fa from '../locales/fa/common.json';

i18n
    .use(initReactI18next)
    .init({
        debug: false,
        fallbackLng: "en",
        interpolation: {
            escapeValue: false,
        },
        resources: {
            en: {
                common: en,
            },
            fa: {
                common: fa,
            },
        },
        defaultNS: 'common'
    });

export default i18n;