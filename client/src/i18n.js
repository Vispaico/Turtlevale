import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import axios from 'axios';

// Import translation files
import en from './locales/en.json';
import es from './locales/es.json';
import pt from './locales/pt.json';
import de from './locales/de.json';
import it from './locales/it.json';
import fr from './locales/fr.json';

// Detect user's preferred language
const detectLanguage = async () => {
  try {
    // First try to get language from localStorage
    const savedLanguage = localStorage.getItem('turtelli-language');
    if (savedLanguage) return savedLanguage;

    // Try to detect from geolocation
    const geoResponse = await axios.get('http://ip-api.com/json/');
    const countryCode = geoResponse.data.countryCode;
    
    const countryLanguageMap = {
      'ES': 'es',
      'MX': 'es',
      'AR': 'es',
      'CO': 'es',
      'PE': 'es',
      'VE': 'es',
      'CL': 'es',
      'EC': 'es',
      'BO': 'es',
      'PY': 'es',
      'UY': 'es',
      'BR': 'pt',
      'PT': 'pt',
      'DE': 'de',
      'AT': 'de',
      'CH': 'de',
      'IT': 'it',
      'FR': 'fr',
      'BE': 'fr',
      'LU': 'fr',
      'MC': 'fr'
    };

    if (countryLanguageMap[countryCode]) {
      return countryLanguageMap[countryCode];
    }
  } catch (error) {
    console.log('Could not detect language from geolocation:', error);
  }

  // Fall back to browser language
  const browserLanguage = navigator.language.split('-')[0];
  const supportedLanguages = ['en', 'es', 'pt', 'de', 'it', 'fr'];
  
  return supportedLanguages.includes(browserLanguage) ? browserLanguage : 'en';
};

const resources = {
  en: { translation: en },
  es: { translation: es },
  pt: { translation: pt },
  de: { translation: de },
  it: { translation: it },
  fr: { translation: fr }
};

// Initialize i18next
i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // Default language
    fallbackLng: 'en',
    
    interpolation: {
      escapeValue: false // React already escapes by default
    },
    
    react: {
      useSuspense: false
    }
  });

// Set language based on detection
detectLanguage().then(detectedLanguage => {
  i18n.changeLanguage(detectedLanguage);
});

export default i18n; 