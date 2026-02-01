import { createContext, useContext, useState, ReactNode } from 'react';
import { Language } from '@/types';

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
};

const translations = {
  uz: {
    // Navigation
    dashboard: 'Boshqaruv paneli',
    posts: "E'lonlar",
    users: 'Foydalanuvchilar',
    comments: 'Sharhlar',
    messages: 'Xabarlar',
    logout: 'Chiqish',
    
    // Auth
    loginTitle: 'Admin Panelga Kirish',
    registerTitle: "Ro'yxatdan o'tish",
    email: 'Email',
    password: 'Parol',
    enterEmail: 'Email kiriting',
    enterPassword: 'Parol kiriting',
    enterUsername: 'Foydalanuvchi nomini kiriting',
    login: 'Kirish',
    register: "Ro'yxatdan o'tish",
    loginSuccess: 'Muvaffaqiyatli kirdingiz',
    registerSuccess: "Akkaunt yaratildi! Admin huquqi berildi.",
    loginFailed: 'Email yoki parol xato',
    registerFailed: "Ro'yxatdan o'tishda xatolik",
    notAdmin: 'Sizda admin huquqi yoq',
    noAccount: 'Akkauntingiz yoqmi?',
    alreadyHaveAccount: 'Akkauntingiz bormi?',
    passwordTooShort: 'Parol kamida 6 ta belgidan iborat bo\'lishi kerak',
    passwordMinLength: 'Kamida 6 ta belgi',
    
    // Dashboard
    totalUsers: 'Jami foydalanuvchilar',
    totalPosts: "Jami e'lonlar",
    totalComments: 'Jami sharhlar',
    totalMessages: 'Jami xabarlar',
    rewardPosts: "Mukofotli e'lonlar",
    recentPosts: "So'nggi e'lonlar",
    postsLast7Days: "E'lonlar (oxirgi 7 kun)",
    
    // Posts
    allPosts: "Barcha e'lonlar",
    image: 'Rasm',
    title: 'Sarlavha',
    type: 'Turi',
    user: 'Foydalanuvchi',
    location: 'Joylashuv',
    reward: 'Mukofot',
    date: 'Sana',
    actions: 'Amallar',
    found: 'Topdim',
    lost: "Yo'qotdim",
    all: 'Barchasi',
    withReward: 'Mukofotli',
    search: 'Qidirish...',
    viewDetails: "Ko'rish",
    delete: "O'chirish",
    confirmDelete: 'Ishonchingiz komilmi?',
    cancel: 'Bekor qilish',
    
    // Users
    avatar: 'Avatar',
    username: 'Foydalanuvchi nomi',
    admin: 'Admin',
    postsCount: "E'lonlar soni",
    registeredDate: "Ro'yxatdan o'tgan",
    makeAdmin: 'Admin qilish',
    removeAdmin: 'Admin huquqini olish',
    viewPosts: "E'lonlarni ko'rish",
    
    // Comments
    post: "E'lon",
    commentText: 'Sharh',
    goToPost: "E'longa o'tish",
    
    // Messages
    sender: 'Yuboruvchi',
    receiver: 'Qabul qiluvchi',
    messageText: 'Xabar',
    read: "O'qildi",
    unread: "O'qilmagan",
    
    // Common
    loading: 'Yuklanmoqda...',
    noData: "Ma'lumot topilmadi",
    previous: 'Oldingi',
    next: 'Keyingi',
    of: 'dan',
    darkMode: "Tungi rejim",
    lightMode: "Kunduzgi rejim",
  },
  en: {
    // Navigation
    dashboard: 'Dashboard',
    posts: 'Posts',
    users: 'Users',
    comments: 'Comments',
    messages: 'Messages',
    logout: 'Logout',
    
    // Auth
    loginTitle: 'Admin Panel Login',
    registerTitle: 'Create Admin Account',
    email: 'Email',
    password: 'Password',
    enterEmail: 'Enter email',
    enterPassword: 'Enter password',
    enterUsername: 'Enter username',
    login: 'Login',
    register: 'Register',
    loginSuccess: 'Login successful',
    registerSuccess: 'Account created! Admin access granted.',
    loginFailed: 'Invalid email or password',
    registerFailed: 'Registration failed',
    notAdmin: 'You do not have admin access',
    noAccount: "Don't have an account?",
    alreadyHaveAccount: 'Already have an account?',
    passwordTooShort: 'Password must be at least 6 characters',
    passwordMinLength: 'Minimum 6 characters',
    
    // Dashboard
    totalUsers: 'Total Users',
    totalPosts: 'Total Posts',
    totalComments: 'Total Comments',
    totalMessages: 'Total Messages',
    rewardPosts: 'Posts with Rewards',
    recentPosts: 'Recent Posts',
    postsLast7Days: 'Posts (Last 7 Days)',
    
    // Posts
    allPosts: 'All Posts',
    image: 'Image',
    title: 'Title',
    type: 'Type',
    user: 'User',
    location: 'Location',
    reward: 'Reward',
    date: 'Date',
    actions: 'Actions',
    found: 'Found',
    lost: 'Lost',
    all: 'All',
    withReward: 'With Reward',
    search: 'Search...',
    viewDetails: 'View',
    delete: 'Delete',
    confirmDelete: 'Are you sure?',
    cancel: 'Cancel',
    
    // Users
    avatar: 'Avatar',
    username: 'Username',
    admin: 'Admin',
    postsCount: 'Posts Count',
    registeredDate: 'Registered',
    makeAdmin: 'Make Admin',
    removeAdmin: 'Remove Admin',
    viewPosts: 'View Posts',
    
    // Comments
    post: 'Post',
    commentText: 'Comment',
    goToPost: 'Go to Post',
    
    // Messages
    sender: 'Sender',
    receiver: 'Receiver',
    messageText: 'Message',
    read: 'Read',
    unread: 'Unread',
    
    // Common
    loading: 'Loading...',
    noData: 'No data found',
    previous: 'Previous',
    next: 'Next',
    of: 'of',
    darkMode: 'Dark Mode',
    lightMode: 'Light Mode',
  },
  ru: {
    // Navigation
    dashboard: 'Панель управления',
    posts: 'Объявления',
    users: 'Пользователи',
    comments: 'Комментарии',
    messages: 'Сообщения',
    logout: 'Выход',
    
    // Auth
    loginTitle: 'Вход в админ панель',
    registerTitle: 'Создать админ аккаунт',
    email: 'Email',
    password: 'Пароль',
    enterEmail: 'Введите email',
    enterPassword: 'Введите пароль',
    enterUsername: 'Введите имя пользователя',
    login: 'Войти',
    register: 'Регистрация',
    loginSuccess: 'Вход выполнен',
    registerSuccess: 'Аккаунт создан! Права администратора выданы.',
    loginFailed: 'Неверный email или пароль',
    registerFailed: 'Ошибка регистрации',
    notAdmin: 'У вас нет прав администратора',
    noAccount: 'Нет аккаунта?',
    alreadyHaveAccount: 'Уже есть аккаунт?',
    passwordTooShort: 'Пароль должен содержать минимум 6 символов',
    passwordMinLength: 'Минимум 6 символов',
    
    // Dashboard
    totalUsers: 'Всего пользователей',
    totalPosts: 'Всего объявлений',
    totalComments: 'Всего комментариев',
    totalMessages: 'Всего сообщений',
    rewardPosts: 'Объявления с вознаграждением',
    recentPosts: 'Последние объявления',
    postsLast7Days: 'Объявления (последние 7 дней)',
    
    // Posts
    allPosts: 'Все объявления',
    image: 'Изображение',
    title: 'Заголовок',
    type: 'Тип',
    user: 'Пользователь',
    location: 'Местоположение',
    reward: 'Вознаграждение',
    date: 'Дата',
    actions: 'Действия',
    found: 'Найдено',
    lost: 'Потеряно',
    all: 'Все',
    withReward: 'С вознаграждением',
    search: 'Поиск...',
    viewDetails: 'Просмотр',
    delete: 'Удалить',
    confirmDelete: 'Вы уверены?',
    cancel: 'Отмена',
    
    // Users
    avatar: 'Аватар',
    username: 'Имя пользователя',
    admin: 'Админ',
    postsCount: 'Кол-во объявлений',
    registeredDate: 'Зарегистрирован',
    makeAdmin: 'Сделать админом',
    removeAdmin: 'Убрать права админа',
    viewPosts: 'Просмотр объявлений',
    
    // Comments
    post: 'Объявление',
    commentText: 'Комментарий',
    goToPost: 'Перейти к объявлению',
    
    // Messages
    sender: 'Отправитель',
    receiver: 'Получатель',
    messageText: 'Сообщение',
    read: 'Прочитано',
    unread: 'Не прочитано',
    
    // Common
    loading: 'Загрузка...',
    noData: 'Данные не найдены',
    previous: 'Предыдущая',
    next: 'Следующая',
    of: 'из',
    darkMode: 'Темный режим',
    lightMode: 'Светлый режим',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('uz');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.uz] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
