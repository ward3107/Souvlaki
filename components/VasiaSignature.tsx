import React from 'react';
import styles from './VasiaSignature.module.css';

/** Canonical owner signature: keep the supplied artwork transparent and all seven links active. */
export default function VasiaSignature({ tone = 'dark' }: { tone?: 'auto' | 'light' | 'dark' }) {
  return (
    <React.Fragment>
      <nav
        className={styles.signature}
        data-vasia-signature
        data-tone={tone}
        dir="ltr"
        aria-label="vasia dev. — website and contact links"
      >
        <img
          className={styles.artwork}
          src="/brand/vasia-dev-signature.png"
          width={373}
          height={259}
          alt="vasia dev. — digital solutions, branding and website design"
          loading="lazy"
          decoding="async"
        />
        <a
          className={`${styles.link} ${styles.website}`}
          href="https://www.vasia.dev/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="vasia dev. — Website"
          title="vasia dev. — Website"
        />
        <a
          className={`${styles.link} ${styles.email} ${styles.social}`}
          href="mailto:wasya92@gmail.com"
          aria-label="vasia dev. — Email"
          title="vasia dev. — Email"
        />
        <a
          className={`${styles.link} ${styles.whatsapp} ${styles.social}`}
          href="https://wa.me/972534260632"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="vasia dev. — WhatsApp"
          title="vasia dev. — WhatsApp"
        />
        <a
          className={`${styles.link} ${styles.facebook} ${styles.social}`}
          href="https://www.facebook.com/profile.php?id=61594997720112"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="vasia dev. — Facebook"
          title="vasia dev. — Facebook"
        />
        <a
          className={`${styles.link} ${styles.instagram} ${styles.social}`}
          href="https://www.instagram.com/vasia.dev/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="vasia dev. — Instagram"
          title="vasia dev. — Instagram"
        />
        <a
          className={`${styles.link} ${styles.github} ${styles.social}`}
          href="https://github.com/ward3107"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="vasia dev. — GitHub"
          title="vasia dev. — GitHub"
        />
        <a
          className={`${styles.link} ${styles.linkedin} ${styles.social}`}
          href="https://www.linkedin.com/in/waseem-abu-akel-334486374/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="vasia dev. — LinkedIn"
          title="vasia dev. — LinkedIn"
        />
      </nav>
    </React.Fragment>
  );
}
