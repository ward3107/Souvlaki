import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { ArrowLeft, X, FileText, Shield, Cookie, User, AlertCircle } from 'lucide-react';
import { Language } from '../types';

interface LegalDocumentProps {
  language: Language;
  documentPath: string;
  onClose: () => void;
}

const LegalDocument: React.FC<LegalDocumentProps> = ({ language, documentPath, onClose }) => {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDocument = async () => {
      try {
        const response = await fetch(documentPath);
        const text = await response.text();
        setContent(text);
        setLoading(false);
      } catch (error) {
        console.error('Error loading document:', error);
        setLoading(false);
      }
    };

    loadDocument();
  }, [documentPath]);

  // Get document icon based on path
  const getDocumentIcon = () => {
    if (documentPath.includes('terms')) return <FileText className="w-6 h-6" />;
    if (documentPath.includes('privacy')) return <Shield className="w-6 h-6" />;
    if (documentPath.includes('cookie')) return <Cookie className="w-6 h-6" />;
    if (documentPath.includes('accessibility')) return <User className="w-6 h-6" />;
    return <FileText className="w-6 h-6" />;
  };

  // Get document title based on path
  const getDocumentTitle = () => {
    if (documentPath.includes('terms')) {
      return {
        he: 'תנאי שימוש',
        en: 'Terms of Use',
        ar: 'شروط الاستخدام',
        ru: 'Условия использования',
        el: 'Όροι Χρήσης'
      };
    }
    if (documentPath.includes('privacy')) {
      return {
        he: 'מדיניות פרטיות',
        en: 'Privacy Policy',
        ar: 'سياسة الخصوصية',
        ru: 'Политика конфиденциальности',
        el: 'Πολιτική Απορρήτου'
      };
    }
    if (documentPath.includes('cookie')) {
      return {
        he: 'מדיניות עוגיות',
        en: 'Cookie Policy',
        ar: 'سياسة ملفات تعريف الارتباط',
        ru: 'Политика cookie',
        el: 'Πολιτική Cookies'
      };
    }
    if (documentPath.includes('accessibility')) {
      return {
        he: 'הצהרת נגישות',
        en: 'Accessibility Statement',
        ar: 'بيان إمكانية الوصول',
        ru: 'Заявление о доступности',
        el: 'Δήλωση Προσβασιμότητας'
      };
    }
    return {
      he: 'מסמך',
      en: 'Document',
      ar: 'وثيقة',
      ru: 'Документ',
      el: 'Έγγραφο'
    };
  };

  // Filter content based on language
  const getLanguageContent = (fullContent: string): { content: string; actualLanguage: Language; isFallback: boolean } => {
    // Split by section headers
    const sections = fullContent.split(/## (English|עברית \(Hebrew\)|العربية \(Arabic\))/);

    // Find the right section based on language
    let content = '';
    let actualLanguage: Language = language;
    let isFallback = false;

    if (language === Language.HE) {
      // Find Hebrew section (index 2)
      content = sections[2] || '';
      if (!content.trim()) {
        content = sections[1] || '';
        actualLanguage = Language.EN;
        isFallback = true;
      }
    } else if (language === Language.AR) {
      // Find Arabic section (index 3)
      content = sections[3] || '';
      if (!content.trim()) {
        content = sections[1] || '';
        actualLanguage = Language.EN;
        isFallback = true;
      }
    } else if (language === Language.RU || language === Language.EL) {
      // Russian and Greek not available, fallback to English
      content = sections[1] || '';
      actualLanguage = Language.EN;
      isFallback = true;
    } else {
      // English section (index 1)
      content = sections[1] || '';
    }

    return {
      content: content.trim() || sections[1] || fullContent,
      actualLanguage,
      isFallback
    };
  };

  // Check if RTL
  const isRtl = language === Language.HE || language === Language.AR;

  if (loading) {
    return (
      <div className="fixed inset-0 z-[100] min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 dark:border-slate-700 border-t-blue-600 mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              {getDocumentIcon()}
            </div>
          </div>
          <p className="mt-6 text-gray-600 dark:text-gray-400 text-lg font-medium animate-pulse">טוען...</p>
        </div>
      </div>
    );
  }

  const { content: languageContent, actualLanguage, isFallback } = getLanguageContent(content);
  const docTitle = getDocumentTitle();

  // Get fallback notice text
  const getFallbackNotice = () => {
    if (!isFallback) return null;

    const notices = {
      [Language.RU]: {
        title: 'Доступен на английском',
        message: 'Этот документ в настоящее время доступен только на английском языке.'
      },
      [Language.EL]: {
        title: 'Διαθέσιμο στα Αγγλικά',
        message: 'Αυτό το έγγραφο είναι προς το παρόν διαθέσιμο μόνο στα Αγγλικά.'
      },
      [Language.HE]: {
        title: 'זמין באנגלית',
        message: 'מסמך זה זמין כעת באנגלית בלבד.'
      },
      [Language.AR]: {
        title: 'متاح باللغة الإنجليزية',
        message: 'هذا المستند متاح حاليًا باللغة الإنجليزية فقط.'
      },
      [Language.EN]: {
        title: 'Available in English',
        message: 'This document is currently only available in English.'
      }
    };

    return notices[language] || notices[Language.EN];
  };

  return (
    <div className={`fixed inset-0 z-[100] min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-y-auto ${isRtl ? 'rtl' : 'ltr'}`}>
      {/* Animated background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-slate-700 shadow-sm">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <button
            onClick={onClose}
            className="flex items-center gap-3 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-semibold transition-all group"
          >
            <div className="w-10 h-10 bg-gray-100 dark:bg-slate-800 rounded-xl flex items-center justify-center group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </div>
            <span className="hidden sm:inline">
              {language === Language.HE ? 'חזרה לאתר' : language === Language.AR ? 'العودة للموقع' : 'Back to Website'}
            </span>
          </button>

          {/* Document Title */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg">
              {getDocumentIcon()}
            </div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white hidden sm:block">
              {docTitle[language as keyof typeof docTitle]}
            </h1>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 bg-gray-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400 transition-all"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Document Content */}
      <main className="container mx-auto px-4 py-12 max-w-4xl relative">
        {/* Decorative card */}
        <article className="relative bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-slate-700 overflow-hidden">
          {/* Gradient top border */}
          <div className="h-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"></div>

          <div className="p-8 md:p-12">
            {/* Fallback Notice */}
            {isFallback && getFallbackNotice() && (
              <div className="mb-8 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-amber-800 dark:text-amber-300 text-sm">
                    {getFallbackNotice()?.title}
                  </p>
                  <p className="text-amber-700 dark:text-amber-400 text-xs mt-1">
                    {getFallbackNotice()?.message}
                  </p>
                </div>
              </div>
            )}

            {/* Content */}
            <ReactMarkdown
              components={{
                h1: ({ node, ...props }) => (
                  <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 mb-8 pb-6 border-b-2 border-gray-200 dark:border-slate-700" {...props} />
                ),
                h2: ({ node, children, ...props }) => (
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mt-12 mb-6 flex items-center gap-3" {...props}>
                    <span className="w-8 h-1 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full"></span>
                    {children}
                  </h2>
                ),
                h3: ({ node, children, ...props }) => (
                  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mt-8 mb-4" {...props}>
                    {children}
                  </h3>
                ),
                p: ({ node, children, ...props }) => (
                  <p className="mb-6 text-gray-700 dark:text-gray-300 leading-relaxed text-lg" {...props}>
                    {children}
                  </p>
                ),
                ul: ({ node, children, ...props }) => (
                  <ul className="mb-8 space-y-3" {...props}>
                    {children}
                  </ul>
                ),
                ol: ({ node, children, ...props }) => (
                  <ol className="mb-8 space-y-3 list-decimal list-inside" {...props}>
                    {children}
                  </ol>
                ),
                li: ({ node, children, ...props }) => (
                  <li className="flex items-start gap-3 text-gray-700 dark:text-gray-300 leading-relaxed" {...props}>
                    <span className="w-2 h-2 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full mt-2 flex-shrink-0"></span>
                    <span>{children}</span>
                  </li>
                ),
                a: ({ node, href, children, ...props }) => (
                  <a
                    href={href}
                    className="text-blue-600 dark:text-blue-400 hover:text-purple-600 dark:hover:text-purple-400 font-semibold underline underline-offset-4 decoration-2 hover:decoration-blue-600 transition-all inline-flex items-center gap-1"
                    target="_blank"
                    rel="noopener noreferrer"
                    {...props}
                  >
                    {children}
                  </a>
                ),
                table: ({ node, children, ...props }) => (
                  <div className="my-8 overflow-x-auto rounded-2xl border border-gray-200 dark:border-slate-700" {...props}>
                    <table className="w-full">{children}</table>
                  </div>
                ),
                thead: ({ node, children, ...props }) => (
                  <thead className="bg-gradient-to-r from-blue-600 to-purple-600 text-white" {...props}>
                    {children}
                  </thead>
                ),
                tbody: ({ node, children, ...props }) => (
                  <tbody className="divide-y divide-gray-200 dark:divide-slate-700" {...props}>
                    {children}
                  </tbody>
                ),
                tr: ({ node, children, ...props }) => (
                  <tr className="hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors" {...props}>
                    {children}
                  </tr>
                ),
                th: ({ node, children, ...props }) => (
                  <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider" {...props}>
                    {children}
                  </th>
                ),
                td: ({ node, children, ...props }) => (
                  <td className="px-6 py-4 text-gray-700 dark:text-gray-300" {...props}>
                    {children}
                  </td>
                ),
                blockquote: ({ node, children, ...props }) => (
                  <blockquote className="border-l-4 border-blue-600 pl-6 py-4 my-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-r-xl italic text-gray-700 dark:text-gray-300" {...props}>
                    {children}
                  </blockquote>
                ),
                hr: ({ node, ...props }) => (
                  <hr className="my-12 border-t-2 border-dashed border-gray-300 dark:border-slate-700" {...props}
                />
                ),
                strong: ({ node, children, ...props }) => (
                  <strong className="font-bold text-blue-600 dark:text-blue-400" {...props}>
                    {children}
                  </strong>
                ),
              }}
            >
              {`## ${actualLanguage === Language.HE ? 'עברית' : actualLanguage === Language.AR ? 'العربية' : 'English'}\n\n${languageContent}`}
            </ReactMarkdown>
          </div>

          {/* Gradient bottom border */}
          <div className="h-2 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600"></div>
        </article>

        {/* Back button at bottom */}
        <div className="mt-12 text-center">
          <button
            onClick={onClose}
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-lg rounded-2xl transition-all transform hover:scale-105 shadow-xl shadow-blue-600/30"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>{language === Language.HE ? 'חזרה לאתר' : language === Language.AR ? 'العودة للموقع' : 'Back to Website'}</span>
          </button>
        </div>
      </main>
    </div>
  );
};

export default LegalDocument;
