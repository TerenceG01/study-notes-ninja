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
    
    // Auth related
    welcomeToStudyNotes: "Welcome to StudyNotes",
    email: "Email",
    password: "Password",
    enterYourEmail: "Enter your email",
    enterYourPassword: "Enter your password",
    createPassword: "Create a password",
    signingIn: "Signing in...",
    creatingAccount: "Creating account...",
    createAccount: "Create Account",
    forgotPassword: "Forgot password?",
    
    // Reset password
    resetPassword: "Reset Your Password",
    createNewPassword: "Create a new password for your account",
    newPassword: "New Password",
    confirmNewPassword: "Confirm New Password",
    enterNewPassword: "Enter new password",
    confirmNewPasswordPlaceholder: "Confirm new password",
    updatingPassword: "Updating Password...",
    updatePassword: "Update Password",
    passwordUpdated: "Password Updated",
    passwordUpdatedSuccess: "Your password has been changed successfully. You'll be redirected to the app in a moment.",
    goToApp: "Go to App",
    
    // Forgot password
    resetYourPassword: "Reset Your Password",
    backToSignIn: "Back to sign in",
    sendResetLink: "Send Reset Link",
    sending: "Sending...",
    checkYourEmail: "Check your email",
    resetInstructions: "We've sent password reset instructions to your email address.",
    didntReceiveEmail: "Didn't receive an email? Check your spam folder or",
    tryAgain: "try again",
    enterEmailForReset: "Enter your email address and we'll send you a link to reset your password.",
    
    // Profile and navigation
    profile: "Profile",
    logOut: "Log out",
    
    // Empty states
    noNotesYet: "No notes have been shared yet",
    noRemindersYet: "No reminders yet",
    addDates: "Add important dates for your group",
    pageNotFound: "Oops! Page not found",
    returnToHome: "Return to Home",

    // New translations for TestimonialsSection
    studentSuccessStories: "Student Success Stories",
    medicalStudent: "Medical Student",
    engineeringMajor: "Engineering Major",
    psychologyStudent: "Psychology Student",
    testimonial1: "This app has completely transformed how I study for exams. The AI summaries save me hours of review time!",
    testimonial2: "The collaborative features helped our study group stay organized during our entire senior project.",
    testimonial3: "I used to struggle keeping my notes organized. Now everything is searchable and I can actually find what I need.",
    
    // New translations for HowItWorksSection
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
    
    welcomeToStudyNotes: "Bienvenue sur StudyNotes",
    email: "Email",
    password: "Mot de passe",
    enterYourEmail: "Entrez votre email",
    enterYourPassword: "Entrez votre mot de passe",
    createPassword: "Créez un mot de passe",
    signingIn: "Connexion en cours...",
    creatingAccount: "Création du compte...",
    createAccount: "Créer un compte",
    forgotPassword: "Mot de passe oublié ?",
    
    resetPassword: "Réinitialisez votre mot de passe",
    createNewPassword: "Créez un nouveau mot de passe pour votre compte",
    newPassword: "Nouveau mot de passe",
    confirmNewPassword: "Confirmez le nouveau mot de passe",
    enterNewPassword: "Entrez le nouveau mot de passe",
    confirmNewPasswordPlaceholder: "Confirmez le nouveau mot de passe",
    updatingPassword: "Mise à jour du mot de passe...",
    updatePassword: "Mettre à jour le mot de passe",
    passwordUpdated: "Mot de passe mis à jour",
    passwordUpdatedSuccess: "Votre mot de passe a été modifié avec succès. Vous serez redirigé vers l'application dans un instant.",
    goToApp: "Aller à l'application",
    
    resetYourPassword: "Réinitialisez votre mot de passe",
    backToSignIn: "Retour à la connexion",
    sendResetLink: "Envoyer le lien de réinitialisation",
    sending: "Envoi en cours...",
    checkYourEmail: "Vérifiez votre email",
    resetInstructions: "Nous avons envoyé des instructions de réinitialisation du mot de passe à votre adresse email.",
    didntReceiveEmail: "Vous n'avez pas reçu d'email ? Vérifiez votre dossier spam ou",
    tryAgain: "essayez à nouveau",
    enterEmailForReset: "Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.",
    
    profile: "Profil",
    logOut: "Déconnexion",
    
    noNotesYet: "Aucune note n'a encore été partagée",
    noRemindersYet: "Pas encore de rappels",
    addDates: "Ajouter des dates importantes pour votre groupe",
    pageNotFound: "Oops! Page non trouvée",
    returnToHome: "Retour à l'accueil",

    // New translations for TestimonialsSection
    studentSuccessStories: "Témoignages de Réussite Étudiante",
    medicalStudent: "Étudiant en Médecine",
    engineeringMajor: "Étudiant en Ingénierie",
    psychologyStudent: "Étudiant en Psychologie",
    testimonial1: "Cette application a complètement transformé ma façon d'étudier pour les examens. Les résumés IA me font gagner des heures de révision !",
    testimonial2: "Les fonctionnalités collaboratives ont aidé notre groupe d'étude à rester organisé pendant tout notre projet de fin d'études.",
    testimonial3: "J'avais du mal à garder mes notes organisées. Maintenant, tout est consultable et je peux trouver ce dont j'ai besoin.",
    
    // New translations for HowItWorksSection
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
    intelligentNoteTaking: "La plataforma de toma de notas inteligente diseñada para estudiantes. Organiza, colabora y destaque-se en tus estudios con herramientas potenciadas por IA.",
    getStartedFree: "Comienza Gratis",
    signIn: "Iniciar Sesión",
    
    everythingToExcel: "Todo lo que necesitas para destacar",
    
    readyToElevate: "¿Listo para elevar tu experiencia de estudio?",
    joinThousands: "Únete a miles de estudiantes que ya están transformando su forma de aprender. Experimenta el poder de las herramientas de estudio mejoradas por IA hoy.",
    goToMyNotes: "Ir a Mis Notas",
    
    selectLanguage: "Seleccionar Idioma",
    
    welcomeToStudyNotes: "Bienvenido a StudyNotes",
    email: "Correo electrónico",
    password: "Contraseña",
    enterYourEmail: "Introduce tu correo electrónico",
    enterYourPassword: "Introduce tu contraseña",
    createPassword: "Crea una contraseña",
    signingIn: "Iniciando sesión...",
    creatingAccount: "Creando cuenta...",
    createAccount: "Crear cuenta",
    forgotPassword: "¿Olvidaste tu contraseña?",
    
    resetPassword: "Restablece tu contraseña",
    createNewPassword: "Crea una nueva contraseña para tu cuenta",
    newPassword: "Nueva contraseña",
    confirmNewPassword: "Confirmar nueva contraseña",
    enterNewPassword: "Introduce nueva contraseña",
    confirmNewPasswordPlaceholder: "Confirma nueva contraseña",
    updatingPassword: "Actualizando contraseña...",
    updatePassword: "Actualizar contraseña",
    passwordUpdated: "Contraseña actualizada",
    passwordUpdatedSuccess: "Tu contraseña ha sido cambiada con éxito. Serás redirigido a la aplicación en un momento.",
    goToApp: "Ir a la aplicación",
    
    resetYourPassword: "Restablece tu contraseña",
    backToSignIn: "Volver a iniciar sesión",
    sendResetLink: "Enviar enlace de restablecimiento",
    sending: "Enviando...",
    checkYourEmail: "Revisa tu correo",
    resetInstructions: "Hemos enviado instrucciones para restablecer la contraseña a tu correo electrónico.",
    didntReceiveEmail: "¿No recibiste un correo? Revisa tu carpeta de spam o",
    tryAgain: "inténtalo de nuevo",
    enterEmailForReset: "Introduce tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.",
    
    profile: "Perfil",
    logOut: "Cerrar sesión",
    
    noNotesYet: "Aún no se han compartido notas",
    noRemindersYet: "Aún no hay recordatorios",
    addDates: "Añade fechas importantes para tu grupo",
    pageNotFound: "¡Ups! Página no encontrada",
    returnToHome: "Volver al inicio",

    // New translations for TestimonialsSection
    studentSuccessStories: "Historias de Éxito de Estudiantes",
    medicalStudent: "Estudiante de Medicina",
    engineeringMajor: "Estudiante de Ingeniería",
    psychologyStudent: "Estudiante de Psicología",
    testimonial1: "Esta aplicación ha transformado completamente mi forma de estudiar para los exámenes. ¡Los resúmenes de IA me ahorran horas de tiempo de revisión!",
    testimonial2: "Las funciones colaborativas ayudaron a nuestro grupo de estudio a mantenerse organizado durante todo nuestro proyecto final.",
    testimonial3: "Solía tener dificultades para mantener mis notas organizadas. Ahora todo es consultable y puedo encontrar lo que necesito.",
    
    // New translations for HowItWorksSection
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
    
    welcomeToStudyNotes: "Benvenuto in StudyNotes",
    email: "Email",
    password: "Password",
    enterYourEmail: "Inserisci la tua email",
    enterYourPassword: "Inserisci la tua password",
    createPassword: "Crea una password",
    signingIn: "Accesso in corso...",
    creatingAccount: "Creazione account...",
    createAccount: "Crea account",
    forgotPassword: "Password dimenticata?",
    
    resetPassword: "Reimposta la tua password",
    createNewPassword: "Crea una nuova password per il tuo account",
    newPassword: "Nuova password",
    confirmNewPassword: "Conferma nuova password",
    enterNewPassword: "Inserisci nuova password",
    confirmNewPasswordPlaceholder: "Conferma nuova password",
    updatingPassword: "Aggiornamento password...",
    updatePassword: "Aggiorna password",
    passwordUpdated: "Password aggiornata",
    passwordUpdatedSuccess: "La tua password è stata modificata con successo. Sarai reindirizzato all'app tra un momento.",
    goToApp: "Vai all'app",
    
    resetYourPassword: "Reimposta la tua password",
    backToSignIn: "Torna all'accesso",
    sendResetLink: "Invia link di reimpostazione",
    sending: "Invio in corso...",
    checkYourEmail: "Controlla la tua email",
    resetInstructions: "Abbiamo inviato le istruzioni per reimpostare la password al tuo indirizzo email.",
    didntReceiveEmail: "Non hai ricevuto un'email? Controlla la tua cartella spam o",
    tryAgain: "riprova",
    enterEmailForReset: "Inserisci il tuo indirizzo email e te invieremo un link per reimpostare la password.",
    
    profile: "Profilo",
    logOut: "Disconnetti",
    
    noNotesYet: "Nessun appunto è stato ancora condiviso",
    noRemindersYet: "Ancora nessun promemoria",
    addDates: "Aggiungi date importanti per il tuo gruppo",
    pageNotFound: "Ops! Pagina non trovata",
    returnToHome: "Torna alla home",

    // New translations for TestimonialsSection
    studentSuccessStories: "Storie di Successo degli Studenti",
    medicalStudent: "Studente di Medicina",
    engineeringMajor: "Studente di Ingegneria",
    psychologyStudent: "Studente di Psicologia",
    testimonial1: "Questa app ha completamente trasformato il mio modo di studiare per gli esami. I riassunti AI mi fanno risparmiare ore di tempo di revisione!",
    testimonial2: "Le funzionalità collaborative hanno aiutato il nostro gruppo di studio a rimanere organizzato durante l'intero progetto finale.",
    testimonial3: "Mi è sempre stato difficile tenere organizzati i miei appunti. Ora tutto è consultabile e posso trovare ciò di cui ho bisogno.",
    
    // New translations for HowItWorksSection
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
    
    welcomeToStudyNotes: "Willkommen bei StudyNotes",
    email: "E-Mail",
    password: "Passwort",
    enterYourEmail: "Gib deine E-Mail ein",
    enterYourPassword: "Gib dein Passwort ein",
    createPassword: "Erstelle ein Passwort",
    signingIn: "Anmeldung läuft...",
    creatingAccount: "Konto wird erstellt...",
    createAccount: "Konto erstellen",
    forgotPassword: "Passwort vergessen?",
    
    resetPassword: "Setze dein Passwort zurück",
    createNewPassword: "Erstelle ein neues Passwort für dein Konto",
    newPassword: "Neues Passwort",
    confirmNewPassword: "Neues Passwort bestätigen",
    enterNewPassword: "Neues Passwort eingeben",
    confirmNewPasswordPlaceholder: "Neues Passwort bestätigen",
    updatingPassword: "Passwort wird aktualisiert...",
    updatePassword: "Passwort aktualisieren",
    passwordUpdated: "Passwort aktualisiert",
    passwordUpdatedSuccess: "Dein Passwort wurde erfolgreich geändert. Du wirst in Kürze zur App weitergeleitet.",
    goToApp: "Zur App gehen",
    
    resetYourPassword: "Setze dein Passwort zurück",
    backToSignIn: "Zurück zur Anmeldung",
    sendResetLink: "Zurücksetzungslink senden",
    sending: "Wird gesendet...",
    checkYourEmail: "Überprüfe deine E-Mail",
    resetInstructions: "Wir haben Anweisungen zum Zurücksetzen des Passworts an deine E-Mail-Adresse gesendet.",
    didntReceiveEmail: "Keine E-Mail erhalten? Überprüfe deinen Spam-Ordner oder",
    tryAgain: "versuche es erneut",
    enterEmailForReset: "Gib deine E-Mail-Adresse ein und wir senden dir einen Link zum Zurücksetzen deines Passworts.",
    
    profile: "Profil",
    logOut: "Abmelden",
    
    noNotesYet: "Es wurden noch keine Notizen geteilt",
    noRemindersYet: "Noch keine Erinnerungen",
    addDates: "Füge wichtige Termine für deine Gruppe hinzu",
    pageNotFound: "Hoppla! Seite nicht gefunden",
    returnToHome: "Zurück zur Startseite",

    // New translations for TestimonialsSection
    studentSuccessStories: "Erfolgsgeschichten von Studenten",
    medicalStudent: "Medizinstudent",
    engineeringMajor: "Ingenieurstudent",
    psychologyStudent: "Psychologiestudent",
    testimonial1: "Diese App hat meine Art zu lernen komplett verändert. Die KI-Zusammenfassungen sparen mir Stunden an Wiederholungszeit!",
    testimonial2: "Die Kollaborationsfunktionen halfen unserer Lerngruppe, während unseres gesamten Abschlussprojekts organisiert zu bleiben.",
    testimonial3: "Ich hatte immer Schwierigkeiten, meine Notizen zu organisieren. Jetzt ist alles durchsuchbar und ich kann finden, was ich brauche.",
    
    // New translations for HowItWorksSection
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
    
    welcomeToStudyNotes: "Bem-vindo ao StudyNotes",
    email: "Email",
    password: "Senha",
    enterYourEmail: "Digite seu email",
    enterYourPassword: "Digite sua senha",
    createPassword: "Crie uma senha",
    signingIn: "Entrando...",
    creatingAccount: "Criando conta...",
    createAccount: "Criar Conta",
    forgotPassword: "Esqueceu sua senha?",
    
    resetPassword: "Redefina sua senha",
    createNewPassword: "Crie uma nova senha para sua conta",
    newPassword: "Nova senha",
    confirmNewPassword: "Confirmar nova senha",
    enterNewPassword: "Digite nova senha",
    confirmNewPasswordPlaceholder: "Confirme nova senha",
    updatingPassword: "Atualizando senha...",
    updatePassword: "Atualizar senha",
    passwordUpdated: "Senha atualizada",
    passwordUpdatedSuccess: "Sua senha foi alterada com sucesso. Você será redirecionado para o aplicativo em um momento.",
    goToApp: "Ir para o aplicativo",
    
    resetYourPassword: "Redefina sua senha",
    backToSignIn: "Voltar para o login",
    sendResetLink: "Enviar link de redefinição",
    sending: "Enviando...",
    checkYourEmail: "Verifique seu email",
    resetInstructions: "Enviamos instruções de redefinição de senha para seu endereço de email.",
    didntReceiveEmail: "Não recebeu um email? Verifique sua pasta de spam ou",
    tryAgain: "tente novamente",
    enterEmailForReset: "Digite seu endereço de email e enviaremos um link para redefinir sua senha.",
    
    profile: "Perfil",
    logOut: "Sair",
    
    noNotesYet: "Nenhuma nota foi compartilhada ainda",
    noRemindersYet: "Nenhum lembrete ainda",
    addDates: "Adicione datas importantes para seu grupo",
    pageNotFound: "Ops! Página não encontrada",
    returnToHome: "Retornar à página inicial",

    // New translations for TestimonialsSection
    studentSuccessStories: "Histórias de Sucesso de Estudantes",
    medicalStudent: "Estudante de Medicina",
    engineeringMajor: "Estudante de Engenharia",
    psychologyStudent: "Estudante de Psicologia",
    testimonial1: "Este aplicativo transformou completamente minha forma de estudar para os exames. Os resumos de IA me economizam horas de revisão!",
    testimonial2: "Os recursos colaborativos ajudaram nosso grupo de estudo a permanecer organizado durante todo o nosso projeto final.",
    testimonial3: "Eu costumava ter dificuldade em manter minhas anotações organizadas. Agora tudo é pesquisável e posso encontrar o que preciso.",
    
    // New translations for HowItWorksSection
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
    
    welcomeToStudyNotes: "欢迎使用 StudyNotes",
    email: "邮箱",
    password: "密码",
    enterYourEmail: "输入您的邮箱",
    enterYourPassword: "输入您的密码",
    createPassword: "创建密码",
    signingIn: "登录中...",
    creatingAccount: "创建账户中...",
    createAccount: "创建账户",
    forgotPassword: "忘记密码？",
    
    resetPassword: "重置您的密码",
    createNewPassword: "为您的账户创建新密码",
    newPassword: "新密码",
    confirmNewPassword: "确认新密码",
    enterNewPassword: "输入新密码",
    confirmNewPasswordPlaceholder: "确认新密码",
    updatingPassword: "更新密码中...",
    updatePassword: "更新密码",
    passwordUpdated: "密码已更新",
    passwordUpdatedSuccess: "您的密码已成功更改。稍后将重定向到应用程序。",
    goToApp: "前往应用程序",
    
    resetYourPassword: "重置您的密码",
    backToSignIn: "返回登录",
    sendResetLink: "发送重置链接",
    sending: "发送中...",
    checkYourEmail: "查看您的邮箱",
    resetInstructions: "我们已将密码重置说明发送到您的邮箱地址。",
    didntReceiveEmail: "没有收到邮件？检查您的垃圾邮件文件夹或",
    tryAgain: "重试",
    enterEmailForReset: "输入您的邮箱地址，我们将向您发送重置密码的链接。",
    
    profile: "个人资料",
    logOut: "退出登录",
    
    noNotesYet: "尚未分享任何笔记",
    noRemindersYet: "暂无提醒",
    addDates: "为您的小组添加重要日期",
    pageNotFound: "哎呀！找不到页面",
    returnToHome: "返回首页",

    // New translations for TestimonialsSection
    studentSuccessStories: "学生成功故事",
    medicalStudent: "医学专业学生",
    engineeringMajor: "工程专业学生",
    psychologyStudent: "心理学专业学生",
    testimonial1: "这个应用程序彻底改变了我备考的方式。AI总结为我节省了数小时的复习时间！",
    testimonial2: "协作功能帮助我们的学习小组在整个毕业项目期间保持组织有序。",
    testimonial3: "我过去总是难以保持笔记的条理性。现在所有内容都可搜索，我能够找到我需要的东西。",
    
    // New translations for HowItWorksSection
    howItWorks: "工作原理",
    superchargeStudy: "提升您的学习过程",
    platformUsesAI: "我们的平台使用AI帮助您创建更好的学习材料，理解复杂主题，并更有效地记忆信息。",
    takeNotesYourWay: "按照您的方式做笔记",
    captureIdeas: "使用我们灵活的编辑器捕捉想法，适应您的风格。",
    getAIEnhancements: "获取AI增强",
    aiToolsHelp: "我们的AI工具帮助组织、总结和改进您的笔记。",
    studySmarter: "更智能地学习",
    generateFlashcards: "自动生成抽认卡、摘要和学习材料。",
    startTakingNotes: "开始记笔记",
    
    // Empty notes row
    noNotesFound: "未找到笔记。在上方创建您的第一个笔记！",
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
