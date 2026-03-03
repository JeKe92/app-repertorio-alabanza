export interface ScheduledSong {
  chordsOrLyrics?: string; // 'Acordes/Letra'
  bass?: string; // 'Bajo'
  drums?: string; // 'Batería'
  songName?: string; // 'Coro'
  songText?: string; // 'CoroText'

  date: Date; // parsed from 'Fecha'
  dateText?: string; // 'FechaText'

  acousticGuitar?: string; // 'Guitarra Acústica'
  electricGuitar?: string; // 'Guitarra Eléctrica'
  month?: string; // 'Mes'
  piano?: string;
  keyA?: string; // 'Tonalidad A'
  keyB?: string | null; // 'Tonalidad B'

  voices?: string; // 'Voces'
  leadVocal?: string; // 'Voz principal'
  youtube?: string; // 'Youtube'

  // Keep any other raw or unmapped fields
  [key: string]: any;
}

// Backwards-compatible alias
export type Song = ScheduledSong;
