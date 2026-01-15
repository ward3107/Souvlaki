
export enum Language {
  HE = 'he',
  EN = 'en',
  AR = 'ar',
  RU = 'ru',
  EL = 'el',
}

export interface MenuItem {
  id: string;
  category: string;
  price: number;
  image: string;
  name: {
    [key in Language]: string;
  };
  description: {
    [key in Language]: string;
  };
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  text: {
    [key in Language]: string;
  };
}

export interface FAQItem {
  id: string;
  question: {
    [key in Language]: string;
  };
  answer: {
    [key in Language]: string;
  };
}

export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

export type TranslationKey = 
  | 'nav_home'
  | 'nav_menu'
  | 'nav_gallery'
  | 'nav_about'
  | 'nav_reviews'
  | 'nav_faq'
  | 'nav_contact'
  | 'hero_title'
  | 'hero_subtitle'
  | 'hero_cta_order'
  | 'hero_cta_menu'
  | 'about_title'
  | 'about_content_1'
  | 'about_content_2'
  | 'gallery_title'
  | 'menu_title'
  | 'reviews_title'
  | 'reviews_subtitle'
  | 'faq_title'
  | 'contact_title'
  | 'footer_copyright'
  | 'footer_terms'
  | 'footer_privacy'
  | 'footer_accessibility'
  | 'footer_follow_us'
  | 'category_pita'
  | 'category_plate'
  | 'category_sides'
  | 'open_status_open'
  | 'open_status_closed'
  | 'cookie_text'
  | 'cookie_accept'
  | 'cookie_decline'
  | 'form_title'
  | 'form_name'
  | 'form_rating'
  | 'form_time_rating'
  | 'form_comment'
  | 'form_submit'
  | 'form_success';