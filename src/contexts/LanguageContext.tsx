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
