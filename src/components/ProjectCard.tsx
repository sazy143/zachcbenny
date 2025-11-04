import React from 'react';

type Props = {
  name: string;
  description?: string;
  url: string;
};

export default function ProjectCard({ name, description, url }: Props) {
  return (
    <article className="nb-card">
      <h3 style={{ marginTop: 0 }}>{name}</h3>
      {description && <p className="muted">{description}</p>}
      <a className="nb-button" href={url} target="_blank" rel="noreferrer">
        Open
      </a>
    </article>
  );
}

