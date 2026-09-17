'use client';

import React from 'react';
import { SongCard } from '@/components/music/SongCard';
import type { Song } from '@/types';

interface SectionRowProps {
  title: string;
  songs: Song[];
  onSeeAll?: () => void;
  id?: string;
}

export function SectionRow({ title, songs, onSeeAll, id }: SectionRowProps) {
  if (!songs || songs.length === 0) return null;

  return (
    <div className="section-row" id={id}>
      <div className="section-header">
        <h2 className="section-title">{title}</h2>
        {onSeeAll && (
          <button className="section-see-all" onClick={onSeeAll} aria-label={`See all ${title}`}>
            See all →
          </button>
        )}
      </div>
      <div className="horizontal-scroll" role="list" aria-label={title}>
        {songs.map(song => (
          <div key={song.id} role="listitem">
            <SongCard song={song} queue={songs} />
          </div>
        ))}
      </div>
    </div>
  );
}
