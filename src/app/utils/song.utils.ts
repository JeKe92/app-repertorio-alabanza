import { ScheduledSong } from '../models/song.model';

export function filterSongs(
  songs: ScheduledSong[],
  searchTerm: string,
  dateTerm: string,
  formatDate: (d: Date) => string
): ScheduledSong[] {
  let filtered = songs;
  if (searchTerm) {
    const t = searchTerm.toLowerCase();
    filtered = filtered.filter(s =>
      (s.songName ?? '').toString().toLowerCase().includes(t)
    );
  }
  if (dateTerm) {
    filtered = filtered.filter(s => {
      const formatted = s.date ? formatDate(s.date) : '';
      return formatted === dateTerm;
    });
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return filtered.sort((a, b) => {
    const aPast = a.date < today;
    const bPast = b.date < today;
    if (aPast !== bPast) return aPast ? 1 : -1;
    return a.date.getTime() - b.date.getTime();
  });
}

export function getDateOptions(
  songs: ScheduledSong[],
  formatDate: (d: Date) => string
): string[] {
  const dateMap = new Map<string, Date>();
  songs.forEach(s => {
    if (s.date) {
      const label = formatDate(s.date);
      if (!dateMap.has(label)) dateMap.set(label, s.date);
    }
  });
  return Array.from(dateMap.entries())
    .sort(([, a], [, b]) => a.getTime() - b.getTime())
    .map(([label]) => label);
}

export function countWithChords(songs: ScheduledSong[]): number {
  return songs.filter(s => s.chordsOrLyrics).length;
}

export function countWithVideo(songs: ScheduledSong[]): number {
  return songs.filter(s => s.youtube).length;
}
