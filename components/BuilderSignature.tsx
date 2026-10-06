import { Globe, Phone, Mail, MessageCircle } from 'lucide-react';
import { FacebookIcon, InstagramIcon, GithubIcon, LinkedinIcon } from './BrandIcons';
import VasiaLogo from './VasiaLogo';
import { Language } from '../types';
import { tx } from '../utils/i18n';

// Use the same verified destinations as vasia.dev. No guessed profile URLs.
const BUILDER_LINKS = [
  { label: 'VASIA website', href: 'https://vasia.dev/', Icon: Globe },
  { label: 'VASIA WhatsApp', href: 'https://wa.me/972534260632', Icon: MessageCircle },
  { label: 'Call Waseem', href: 'tel:+972534260632', Icon: Phone },
  { label: 'Email Waseem', href: 'mailto:wasya92@gmail.com', Icon: Mail },
  {
    label: 'VASIA Facebook',
    href: 'https://www.facebook.com/profile.php?id=61594997720112',
    Icon: FacebookIcon,
  },
  { label: 'VASIA Instagram', href: 'https://www.instagram.com/vasia.dev/', Icon: InstagramIcon },
  {
    label: 'Waseem LinkedIn',
    href: 'https://www.linkedin.com/in/waseem-abu-akel-334486374/',
    Icon: LinkedinIcon,
  },
  { label: 'Waseem GitHub', href: 'https://github.com/ward3107', Icon: GithubIcon },
] as const;

export default function BuilderSignature({ lang }: { lang: Language }) {
  return (
    <div
      className="mt-8 flex flex-col items-center gap-4 border-t border-gray-800 pt-6 lg:flex-row lg:justify-between"
      data-builder-signature
    >
      <a
        href="https://vasia.dev/"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 rounded-lg text-gray-200 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-300"
      >
        <span className="text-xs text-gray-400">
          {tx(
            lang,
            'עיצוב ופיתוח',
            'Design & development',
            'تصميم وتطوير',
            'Дизайн и разработка',
            'Σχεδιασμός & ανάπτυξη'
          )}
        </span>
        <VasiaLogo markOnly className="h-10 w-11 shrink-0" />
        <span dir="ltr" className="text-lg font-semibold tracking-tight">
          vasia<span className="text-cyan-300">.</span>dev
        </span>
      </a>
      <nav
        aria-label={tx(
          lang,
          'קישורי VASIA ויצירת קשר',
          'VASIA social and contact links',
          'روابط VASIA والتواصل',
          'Соцсети и контакты VASIA',
          'Σύνδεσμοι και επικοινωνία VASIA'
        )}
      >
        <ul className="grid grid-cols-4 justify-center gap-2 sm:flex sm:flex-wrap" dir="ltr">
          {BUILDER_LINKS.map(({ label, href, Icon }) => (
            <li key={label}>
              <a
                href={href}
                aria-label={label}
                title={label}
                target={href.startsWith('https:') ? '_blank' : undefined}
                rel={href.startsWith('https:') ? 'noopener noreferrer' : undefined}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-gray-300 transition-colors hover:border-cyan-300/50 hover:bg-white/5 hover:text-cyan-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
              >
                <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
