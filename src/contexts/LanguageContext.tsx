
import React, { createContext, useContext, useState, useEffect } from "react";

// Define available languages
export const languages = {
  en: { code: "en", name: "English" },
  fr: { code: "fr", name: "Français" },
  es: { code: "es", name: "Español" },
  it: { code: "it", name: "Italiano" },
  de: { code: "de", name: "Deutsch" },
  pt: { code: "pt", name: "Português" },
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
    
    // Empty states
    noNotesYet: "No notes have been shared yet",
    noRemindersYet: "No reminders yet",
    addDates: "Add important dates for your group",
    pageNotFound: "Oops! Page not found",
    returnToHome: "Return to Home",

    // TestimonialsSection
    studentSuccessStories: "Student Success Stories",
    medicalStudent: "Medical Student",
    engineeringMajor: "Engineering Major",
    psychologyStudent: "Psychology Student",
    testimonial1: "This app has completely transformed how I study for exams. The AI summaries save me hours of review time!",
    testimonial2: "The collaborative features helped our study group stay organized during our entire senior project.",
    testimonial3: "I used to struggle keeping my notes organized. Now everything is searchable and I can actually find what I need.",
    
    // HowItWorksSection
    howItWorks: "How It Works",
    superchargeStudy: "Supercharge Your Study Process",
    platformUsesAI: "Our platform uses AI to help you create better study materials, understand complex topics, and retain information more effectively.",
    takeNotesYourWay: "Take Notes Your Way",
    captureIdeas: "Capture ideas with our flexible editor that adapts to your style.",
    getAIEnhancements: "Get AI Enhancements",
    aiToolsHelp: "Our AI tools help organize, summarize, and improve your notes.",
    studySmarter: "Study Smarter",
    generateFlashcards: "Generate flashcards, summaries, and study materials automatically.",
    startTakingNotes: "Start Taking Notes",
    
    // Empty notes row
    noNotesFound: "No notes found. Create your first note above!",
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
    
    noNotesYet: "Aucune note n'a encore été partagée",
    noRemindersYet: "Pas encore de rappels",
    addDates: "Ajouter des dates importantes pour votre groupe",
    pageNotFound: "Oops! Page non trouvée",
    returnToHome: "Retour à l'accueil",

    // TestimonialsSection
    studentSuccessStories: "Témoignages de Réussite Étudiante",
    medicalStudent: "Étudiant en Médecine",
    engineeringMajor: "Étudiant en Ingénierie",
    psychologyStudent: "Étudiant en Psychologie",
    testimonial1: "Cette application a complètement transformé ma façon d'étudier pour les examens. Les résumés IA me font gagner des heures de révision !",
    testimonial2: "Les fonctionnalités collaboratives ont aidé notre groupe d'étude à rester organisé pendant tout notre projet de fin d'études.",
    testimonial3: "J'avais du mal à garder mes notes organisées. Maintenant, tout est consultable et je peux trouver ce dont j'ai besoin.",
    
    // HowItWorksSection
    howItWorks: "Comment Ça Marche",
    superchargeStudy: "Optimisez Votre Processus d'Étude",
    platformUsesAI: "Notre plateforme utilise l'IA pour vous aider à créer de meilleurs supports d'étude, comprendre des sujets complexes et retenir les informations plus efficacement.",
    takeNotesYourWay: "Prenez des Notes à Votre Façon",
    captureIdeas: "Capturez vos idées avec notre éditeur flexible qui s'adapte à votre style.",
    getAIEnhancements: "Obtenez des Améliorations IA",
    aiToolsHelp: "Nos outils IA aident à organiser, résumer et améliorer vos notes.",
    studySmarter: "Étudiez Plus Intelligemment",
    generateFlashcards: "Générez automatiquement des cartes mémoire, des résumés et des supports d'étude.",
    startTakingNotes: "Commencez à Prendre des Notes",
    
    // Empty notes row
    noNotesFound: "Aucune note trouvée. Créez votre première note ci-dessus !",
  },
  es: {
    smartNoteTaking: "Toma de Notas Inteligente para Estudiantes",
    transformNotes: "Transforma tus Notas de Estudio en Conocimiento",
    intelligentNoteTaking: "La plataforma de toma de notas inteligente diseñada para estudiantes. Organiza, colabora y destaca en tus estudios con herramientas potenciadas por IA.",
    getStartedFree: "Comienza Gratis",
    signIn: "Iniciar Sesión",
    
    everythingToExcel: "Todo lo que necesitas para destacar",
    
    readyToElevate: "¿Listo para elevar tu experiencia de estudio?",
    joinThousands: "Únete a miles de estudiantes que ya están transformando su forma de aprender. Experimenta el poder de las herramientas de estudio mejoradas por IA hoy.",
    goToMyNotes: "Ir a Mis Notas",
    
    selectLanguage: "Seleccionar Idioma",
    
    noNotesYet: "Aún no se han compartido notas",
    noRemindersYet: "Aún no hay recordatorios",
    addDates: "Añade fechas importantes para tu grupo",
    pageNotFound: "¡Ups! Página no encontrada",
    returnToHome: "Volver al inicio",

    // TestimonialsSection
    studentSuccessStories: "Historias de Éxito de Estudiantes",
    medicalStudent: "Estudiante de Medicina",
    engineeringMajor: "Estudiante de Ingeniería",
    psychologyStudent: "Estudiante de Psicología",
    testimonial1: "Esta aplicación ha transformado completamente mi forma de estudiar para los exámenes. ¡Los resúmenes de IA me ahorran horas de tiempo de revisión!",
    testimonial2: "Las funciones colaborativas ayudaron a nuestro grupo de estudio a mantenerse organizado durante todo nuestro proyecto final.",
    testimonial3: "Solía tener dificultades para mantener mis notas organizadas. Ahora todo es consultable y puedo encontrar lo que necesito.",
    
    // HowItWorksSection
    howItWorks: "Cómo Funciona",
    superchargeStudy: "Potencia tu Proceso de Estudio",
    platformUsesAI: "Nuestra plataforma utiliza IA para ayudarte a crear mejores materiales de estudio, comprender temas complejos y retener información de manera más efectiva.",
    takeNotesYourWay: "Toma Notas a Tu Manera",
    captureIdeas: "Captura ideas con nuestro editor flexible que se adapta a tu estilo.",
    getAIEnhancements: "Obtén Mejoras de IA",
    aiToolsHelp: "Nuestras herramientas de IA ayudan a organizar, resumir y mejorar tus notas.",
    studySmarter: "Estudia de Forma más Inteligente",
    generateFlashcards: "Genera automáticamente tarjetas de memoria, resúmenes y materiales de estudio.",
    startTakingNotes: "Comienza a Tomar Notas",
    
    // Empty notes row
    noNotesFound: "No se encontraron notas. ¡Crea tu primera nota arriba!",
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
    
    noNotesYet: "Nessun appunto è stato ancora condiviso",
    noRemindersYet: "Ancora nessun promemoria",
    addDates: "Aggiungi date importanti per il tuo gruppo",
    pageNotFound: "Ops! Pagina non trovata",
    returnToHome: "Torna alla home",

    // TestimonialsSection
    studentSuccessStories: "Storie di Successo degli Studenti",
    medicalStudent: "Studente di Medicina",
    engineeringMajor: "Studente di Ingegneria",
    psychologyStudent: "Studente di Psicologia",
    testimonial1: "Questa app ha completamente trasformato il mio modo di studiare per gli esami. I riassunti AI mi fanno risparmiare ore di tempo di revisione!",
    testimonial2: "Le funzionalità collaborative hanno aiutato il nostro gruppo di studio a rimanere organizzato durante l'intero progetto finale.",
    testimonial3: "Mi è sempre stato difficile tenere organizzati i miei appunti. Ora tutto è consultabile e posso trovare ciò di cui ho bisogno.",
    
    // HowItWorksSection
    howItWorks: "Come Funziona",
    superchargeStudy: "Potenzia il Tuo Processo di Studio",
    platformUsesAI: "La nostra piattaforma utilizza l'IA per aiutarti a creare migliori materiali di studio, comprendere argomenti complessi e memorizzare le informazioni in modo più efficace.",
    takeNotesYourWay: "Prendi Appunti a Modo Tuo",
    captureIdeas: "Cattura idee con il nostro editor flessibile che si adatta al tuo stile.",
    getAIEnhancements: "Ottieni Miglioramenti IA",
    aiToolsHelp: "I nostri strumenti IA aiutano a organizzare, riassumere e migliorare i tuoi appunti.",
    studySmarter: "Studia in Modo più Intelligente",
    generateFlashcards: "Genera automaticamente flashcard, riassunti e materiali di studio.",
    startTakingNotes: "Inizia a Prendere Appunti",
    
    // Empty notes row
    noNotesFound: "Nessun appunto trovato. Crea il tuo primo appunto qui sopra!",
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
    
    noNotesYet: "Es wurden noch keine Notizen geteilt",
    noRemindersYet: "Noch keine Erinnerungen",
    addDates: "Füge wichtige Termine für deine Gruppe hinzu",
    pageNotFound: "Hoppla! Seite nicht gefunden",
    returnToHome: "Zurück zur Startseite",

    // TestimonialsSection
    studentSuccessStories: "Erfolgsgeschichten von Studenten",
    medicalStudent: "Medizinstudent",
    engineeringMajor: "Ingenieurstudent",
    psychologyStudent: "Psychologiestudent",
    testimonial1: "Diese App hat meine Art zu lernen komplett verändert. Die KI-Zusammenfassungen sparen mir Stunden an Wiederholungszeit!",
    testimonial2: "Die Kollaborationsfunktionen halfen unserer Lerngruppe, während unseres gesamten Abschlussprojekts organisiert zu bleiben.",
    testimonial3: "Ich hatte immer Schwierigkeiten, meine Notizen zu organisieren. Jetzt ist alles durchsuchbar und ich kann finden, was ich brauche.",
    
    // HowItWorksSection
    howItWorks: "Wie Es Funktioniert",
    superchargeStudy: "Optimiere deinen Lernprozess",
    platformUsesAI: "Unsere Plattform nutzt KI, um dir zu helfen, bessere Lernmaterialien zu erstellen, komplexe Themen zu verstehen und Informationen effektiver zu behalten.",
    takeNotesYourWay: "Mach Notizen auf deine Weise",
    captureIdeas: "Erfasse Ideen mit unserem flexiblen Editor, der sich deinem Stil anpasst.",
    getAIEnhancements: "Erhalte KI-Verbesserungen",
    aiToolsHelp: "Unsere KI-Tools helfen, deine Notizen zu organisieren, zusammenzufassen und zu verbessern.",
    studySmarter: "Lerne Intelligenter",
    generateFlashcards: "Generiere automatisch Karteikarten, Zusammenfassungen und Lernmaterialien.",
    startTakingNotes: "Beginne mit dem Notizen machen",
    
    // Empty notes row
    noNotesFound: "Keine Notizen gefunden. Erstelle deine erste Notiz oben!",
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
    
    noNotesYet: "Nenhuma nota foi compartilhada ainda",
    noRemindersYet: "Nenhum lembrete ainda",
    addDates: "Adicione datas importantes para seu grupo",
    pageNotFound: "Ops! Página não encontrada",
    returnToHome: "Retornar à página inicial",

    // TestimonialsSection
    studentSuccessStories: "Histórias de Sucesso de Estudantes",
    medicalStudent: "Estudante de Medicina",
    engineeringMajor: "Estudante de Engenharia",
    psychologyStudent: "Estudante de Psicologia",
    testimonial1: "Este aplicativo transformou completamente minha forma de estudar para os exames. Os resumos de IA me economizam horas de revisão!",
    testimonial2: "Os recursos colaborativos ajudaram nosso grupo de estudo a permanecer organizado durante todo o nosso projeto final.",
    testimonial3: "Eu costumava ter dificuldade em manter minhas anotações organizadas. Agora tudo é pesquisável e posso encontrar o que preciso.",
    
    // HowItWorksSection
    howItWorks: "Como Funciona",
    superchargeStudy: "Potencialize Seu Processo de Estudo",
    platformUsesAI: "Nossa plataforma usa IA para ajudá-lo a criar melhores materiais de estudo, entender tópicos complexos e reter informações de forma mais eficaz.",
    takeNotesYourWay: "Faça Anotações do Seu Jeito",
    captureIdeas: "Capture ideias com nosso editor flexível que se adapta ao seu estilo.",
    getAIEnhancements: "Obtenha Melhorias de IA",
    aiToolsHelp: "Nossas ferramentas de IA ajudam a organizar, resumir e melhorar suas anotações.",
    studySmarter: "Estude de Forma mais Inteligente",
    generateFlashcards: "Gere automaticamente flashcards, resumos e materiais de estudo.",
    startTakingNotes: "Comece a Fazer Anotações",
    
    // Empty notes row
    noNotesFound: "Nenhuma nota encontrada. Crie sua primeira nota acima!",
  }
};

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (code: LanguageCode) => void;
  t: (key: keyof typeof translations.en) => string;
}

const defaultLanguage: LanguageCode = "en";

const LanguageContext = createContext<LanguageContextType>({
  language: defaultLanguage,
  setLanguage: () => {},
  t: (key) => key.toString(),
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<LanguageCode>(() => {
    // Try to get language from localStorage
    const savedLanguage = localStorage.getItem("language") as LanguageCode;
    return savedLanguage && Object.keys(languages).includes(savedLanguage)
      ? savedLanguage
      : defaultLanguage;
  });

  useEffect(() => {
    // Save language to localStorage when it changes
    localStorage.setItem("language", language);
  }, [language]);

  // Translation function
  const t = (key: keyof typeof translations.en): string => {
    const currentTranslation = translations[language];
    // If key exists in current language, return it, otherwise return English version
    return currentTranslation[key] || translations.en[key] || key.toString();
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
