import { useState, useEffect } from 'react';
import { getTranslation, type Language } from 'shared/i18n';

export function useI18n() {
  const [language, setLanguage] = useState<Language>(() => {
    // 1. Verificar localStorage primeiro
    const stored = localStorage.getItem('language') as Language;
    if (stored && ['pt-BR', 'en', 'es'].includes(stored)) {
      return stored;
    }
    
    // 2. Verificar perfil do usuário (se logado)
    try {
      const user = localStorage.getItem('user');
      if (user) {
        const userData = JSON.parse(user);
        if (userData.language && ['pt-BR', 'en', 'es'].includes(userData.language)) {
          return userData.language;
        }
      }
    } catch (e) {
      // Ignorar erro de parsing
    }
    
    // 3. Detectar idioma do navegador (localização)
    const browserLang = navigator.language || navigator.languages?.[0] || 'pt-BR';
    const langCode = browserLang.split('-')[0].toLowerCase();
    
    // Mapear códigos de idioma
    if (langCode === 'en') return 'en';
    if (langCode === 'es') return 'es';
    if (langCode === 'pt') return 'pt-BR';
    
    // Padrão: Português
    return 'pt-BR';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
    
    // Atualizar no perfil do usuário (se logado) - será salvo quando salvar configurações
    try {
      const user = localStorage.getItem('user');
      if (user) {
        const userData = JSON.parse(user);
        userData.language = language;
        localStorage.setItem('user', JSON.stringify(userData));
      }
    } catch (e) {
      // Ignorar erro
    }
  }, [language]);

  const t = (key: string): string => {
    return getTranslation(key, language);
  };

  return {
    language,
    setLanguage,
    t,
  };
}

