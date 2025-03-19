
import React, { createContext, useContext, useState, useEffect } from "react";

// Define available languages
export const languages = {
  en: { code: "en", name: "English" },
  fr: { code: "fr", name: "Français" },
  es: { code: "es", name: "Español" },
  it: { code: "it", name: "Italiano" },
  de: { code: "de", name: "Deutsch" },
  pt: { code: "pt", name: "Português" },
  zh: { code: "zh", name: "中文" },
};

export type LanguageCode = keyof typeof languages;

// Translations for each language
export const translations = {
  en: {
    // Hero section
    smartNoteTaking: "Smart Note-Taking for Students",
    transformNotes: "Transform Your Study Notes into Knowledge",
    intelligentNoteTaking: "The intelligent note-taking platform designed for students. Organize, collaborate, and excel in your studies with AI-powered tools.",
    getStartedFree: "Get Started Free",
    signIn: "Sign In",
    
    // Features section
    everythingToExcel: "Everything You Need to Excel",
    
    // CTA section
    readyToElevate: "Ready to Elevate Your Study Experience?",
    joinThousands: "Join thousands of students who are already transforming how they learn. Experience the power of AI-enhanced study tools today.",
    goToMyNotes: "Go to My Notes",
    
    // Language selector
    selectLanguage: "Select Language",
  },
  fr: {
    smartNoteTaking: "Prise de Notes Intelligente pour Étudiants",
    transformNotes: "Transformez vos Notes d'Étude en Connaissances",
    intelligentNoteTaking: "La plateforme de prise de notes intelligente conçue pour les étudiants. Organisez, collaborez et excellez dans vos études avec des outils alimentés par l'IA.",
    getStartedFree: "Commencer Gratuitement",
    signIn: "Se Connecter",
    
    everythingToExcel: "Tout ce dont vous avez besoin pour exceller",
    
    readyToElevate: "Prêt à améliorer votre expérience d'étude ?",
    joinThousands: "Rejoignez des milliers d'étudiants qui transforment déjà leur façon d'apprendre. Découvrez la puissance des outils d'étude améliorés par l'IA dès aujourd'hui.",
    goToMyNotes: "Accéder à Mes Notes",
    
    selectLanguage: "Choisir la Langue",
  },
  es: {
    smartNoteTaking: "Toma de Notas Inteligente para Estudiantes",
    transformNotes: "Transforma tus Notas de Estudio en Conocimiento",
    intelligentNoteTaking: "La plataforma de toma de notas inteligente diseñada para estudiantes. Organiza, colabora y destaca en tus estudios con herramientas potenciadas por IA.",
    getStartedFree: "Comienza Gratis",
    signIn: "Iniciar Sesión",
    
    everythingToExcel: "Todo lo que necesitas para destacar",
    
    readyToElevate: "¿Listo para elevar tu experiencia de estudio?",
    joinThousands: "Únete a miles de estudiantes que ya están transformando su forma de aprender. Experimenta el poder de las herramientas de estudio mejoradas con IA hoy.",
    goToMyNotes: "Ir a Mis Notas",
    
    selectLanguage: "Seleccionar Idioma",
  },
  it: {
    smartNoteTaking: "Appunti Intelligenti per Studenti",
    transformNotes: "Trasforma i tuoi Appunti di Studio in Conoscenza",
    intelligentNoteTaking: "La piattaforma di appunti intelligente progettata per studenti. Organizza, collabora ed eccelli nei tuoi studi con strumenti potenziati dall'IA.",
    getStartedFree: "Inizia Gratuitamente",
    signIn: "Accedi",
    
    everythingToExcel: "Tutto ciò di cui hai bisogno per eccellere",
    
    readyToElevate: "Pronto a migliorare la tua esperienza di studio?",
    joinThousands: "Unisciti a migliaia di studenti che stanno già trasformando il loro modo di apprendere. Scopri oggi la potenza degli strumenti di studio potenziati dall'IA.",
    goToMyNotes: "Vai ai Miei Appunti",
    
    selectLanguage: "Seleziona Lingua",
  },
  de: {
    smartNoteTaking: "Intelligente Notizen für Studenten",
    transformNotes: "Verwandle deine Studiennotizen in Wissen",
    intelligentNoteTaking: "Die intelligente Notizplattform für Studenten. Organisiere, arbeite zusammen und glänze in deinem Studium mit KI-gestützten Tools.",
    getStartedFree: "Kostenlos Starten",
    signIn: "Anmelden",
    
    everythingToExcel: "Alles was du brauchst, um zu glänzen",
    
    readyToElevate: "Bereit, dein Studienerlebnis zu verbessern?",
    joinThousands: "Schließe dich Tausenden von Studenten an, die bereits ihre Lernweise transformieren. Erlebe noch heute die Kraft der KI-verbesserten Lerntools.",
    goToMyNotes: "Zu Meinen Notizen",
    
    selectLanguage: "Sprache Auswählen",
  },
  pt: {
    smartNoteTaking: "Anotações Inteligentes para Estudantes",
    transformNotes: "Transforme suas Anotações de Estudo em Conhecimento",
    intelligentNoteTaking: "A plataforma de anotações inteligente projetada para estudantes. Organize, colabore e destaque-se em seus estudos com ferramentas potencializadas por IA.",
    getStartedFree: "Comece Gratuitamente",
    signIn: "Entrar",
    
    everythingToExcel: "Tudo o que você precisa para se destacar",
    
    readyToElevate: "Pronto para elevar sua experiência de estudo?",
    joinThousands: "Junte-se a milhares de estudantes que já estão transformando a maneira como aprendem. Experimente hoje o poder das ferramentas de estudo aprimoradas por IA.",
    goToMyNotes: "Ir para Minhas Anotações",
    
    selectLanguage: "Selecionar Idioma",
  },
  zh: {
    smartNoteTaking: "为学生设计的智能笔记",
    transformNotes: "将您的学习笔记转化为知识",
    intelligentNoteTaking: "为学生设计的智能笔记平台。利用AI驱动的工具，组织、协作并在学习中脱颖而出。",
    getStartedFree: "免费开始",
    signIn: "登录",
    
    everythingToExcel: "卓越所需的一切",
    
    readyToElevate: "准备提升您的学习体验？",
    joinThousands: "加入已经改变学习方式的数千名学生。今天就体验AI增强学习工具的力量。",
    goToMyNotes: "前往我的笔记",
    
    selectLanguage: "选择语言",
  }
};

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: keyof typeof translations.en) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  t: (key) => key as string,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Get saved language from localStorage, default to 'en'
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    const savedLanguage = localStorage.getItem("language") as LanguageCode;
    return savedLanguage && translations[savedLanguage] ? savedLanguage : "en";
  });

  // Update language and save to localStorage
  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
    document.documentElement.lang = lang;
  };

  // Set HTML lang attribute on mount and when language changes
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  // Translation function
  const t = (key: keyof typeof translations.en) => {
    return translations[language][key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use the language context
export const useLanguage = () => useContext(LanguageContext);
