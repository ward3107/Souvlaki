import { ChevronDown, MessageCircle } from 'lucide-react';
import { Language } from '../../types';
import { FAQS } from '../../constants';
import { t } from '../../utils/i18n';

interface Props {
  lang: Language;
}

export default function FAQ({ lang }: Props) {
  return (
    <section
      id="faq"
      className="py-20 bg-gradient-to-b from-white to-gray-50 dark:from-slate-900 dark:to-slate-800/50 transition-colors duration-300"
    >
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-blue-500 rounded-2xl mb-6 shadow-soft">
            <MessageCircle className="w-8 h-8 text-white" />
          </div>
          <h2 className="font-display text-5xl font-semibold text-gray-900 dark:text-white mb-4 tracking-tight">
            {t(lang, 'faq_title')}
          </h2>
          <div className="w-16 h-1 bg-brand-terracotta-400 mx-auto rounded-full"></div>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, index) => (
            <details
              key={faq.id}
              className="group relative bg-white dark:bg-slate-800 rounded-2xl shadow-soft border border-gray-200 dark:border-slate-700 overflow-hidden transition-all duration-300 hover:shadow-lift hover:border-brand-blue-200 dark:hover:border-brand-blue-700"
            >
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-blue-500 rounded-l-2xl"></div>
              <summary className="flex justify-between items-center p-6 cursor-pointer list-none hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                <div className="flex items-center gap-4 flex-1">
                  <span className="flex-shrink-0 w-8 h-8 bg-brand-blue-500 text-white text-sm font-semibold rounded-full flex items-center justify-center">
                    {index + 1}
                  </span>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white pr-4 rtl:pr-0 rtl:pl-4">
                    {faq.question[lang]}
                  </h3>
                </div>
                <span className="flex-shrink-0 w-10 h-10 bg-brand-blue-50 dark:bg-brand-blue-900/30 rounded-full flex items-center justify-center transition group-open:rotate-180">
                  <ChevronDown className="w-5 h-5 text-brand-blue-500 dark:text-brand-blue-300" />
                </span>
              </summary>
              <div className="px-6 pb-6 text-gray-700 dark:text-gray-300 leading-relaxed border-t border-gray-100 dark:border-slate-700">
                <p className="pt-4">{faq.answer[lang]}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
