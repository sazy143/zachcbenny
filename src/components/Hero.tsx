import React from 'react';
import clsx from 'clsx';

type Props = {
  title: string;
  description?: string;
  ctaLabel?: string;
  url?: string;
};

export default function Hero({ title, description, ctaLabel = 'View Project', url = '#' }: Props) {
  return (
    <section className={clsx('nb-card')} style={{ marginTop: 20 }}>
      <h1 style={{ fontSize: 42, margin: '0 0 12px 0' }}>{title}</h1>
      {description && <p style={{ fontSize: 18, marginBottom: 16 }}>{description}</p>}
      {url && (
        <a className="nb-button" href={url} target="_blank" rel="noreferrer">
          {ctaLabel}
        </a>
      )}
    </section>
  );
}
