import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

import { ScheduledSong } from '../models/song.model';

export type SongData = ScheduledSong;

@Injectable({
  providedIn: 'root'
})
export class DataService {
  // Public Google Sheet configuration (no API key required for published/public sheets)
  private spreadsheetId = '1anYCamlSRFhbbQAJVATmPcaG-jajkqWJREAyd5y3ERU'; // Set with setSpreadsheet()
  private sheetNameOrGid = 'ProgMes';
  private baseGvizUrl = 'https://docs.google.com/spreadsheets/d';

  // cached songs data
  private _songs: SongData[] = [];
  public songs$ = new BehaviorSubject<SongData[]>(this._songs);

  constructor(private http: HttpClient) { }

  /**
   * Set the spreadsheet ID and optional sheet name or gid
   * @param spreadsheetId The Google Sheet ID
   * @param sheetNameOrGid Sheet name (e.g., 'Sheet1') or gid (numeric) if needed
   */
  setSpreadsheet(spreadsheetId: string, sheetNameOrGid?: string): void {
    this.spreadsheetId = spreadsheetId;
    this.sheetNameOrGid = sheetNameOrGid || '';
  }

  /**
   * Fetch data from a public Google Sheet without API key using the gviz endpoint.
   * Sheet must be published or publicly viewable.
   * @param sheet Optional sheet name or gid to override the configured one
   */
  /**
   * Fetch data and update cache
   */
  getPublicSheetData(sheet?: string): Observable<SongData[]> {
    if (!this.spreadsheetId) {
      console.error('Please configure spreadsheetId using setSpreadsheet()');
      return of([]);
    }

    const sheetParam = sheet || this.sheetNameOrGid;
    let url = `${this.baseGvizUrl}/${this.spreadsheetId}/gviz/tq?tqx=out:json`;
    if (sheetParam) {
      if (/^\d+$/.test(sheetParam)) {
        url += `&gid=${sheetParam}`;
      } else {
        url += `&sheet=${encodeURIComponent(sheetParam)}`;
      }
    }

    return this.http.get(url, { responseType: 'text' }).pipe(
      map(text => {
        // Extract JSON object from the gviz response which is like: "/*O_o*/\ngoogle.visualization.Query.setResponse({...});"
        const match = text.match(/({[\s\S]*})\);?\s*$/);
        if (!match) {
          console.error('Unexpected gviz response format');
          return [];
        }
        const json = JSON.parse(match[1]);
        return this.parseGvizData(json);
      }),
      tap(songs => {
        // update cache
        this._songs = songs;
        this.songs$.next(songs);
      }),
      catchError(err => {
        console.error('Error fetching public sheet data', err);
        return of([]);
      })
    );
  }

  /**
   * Parse the Google Visualization gviz JSON structure into SongData[]
   */
  private parseGvizData(gviz: any): SongData[] {
    if (!gviz || !gviz.table) return [];
    const cols = (gviz.table.cols || []).map((c: any, i: number) => c.label || c.id || `col${i}`);
    const rows = gviz.table.rows || [];

    // Mapping from sheet header -> friendly Song property
    const fieldMap: Record<string, string> = {
      'Acordes/Letra': 'chordsOrLyrics',
      'Bajo': 'bass',
      'Batería': 'drums',
      'Coro': 'songName',
      'CoroText': 'songText',
      'Fecha': 'date',
      'FechaText': 'dateText',
      'Guitarra Acústica': 'acousticGuitar',
      'Guitarra Eléctrica': 'electricGuitar',
      'Trompeta': 'trumpet',
      'Mes': 'month',
      'Piano': 'piano',
      'Tempo': 'tempo',
      'Tonalidad A': 'keyA',
      'Tonalidad B': 'keyB',
      'Voces': 'voices',
      'Voz principal': 'leadVocal',
      'Youtube': 'youtube',
    };

    const results: SongData[] = rows.map((r: any) => {
      const raw: Record<string, any> = {};
      (r.c || []).forEach((cell: any, idx: number) => {
        const key = cols[idx] || `col${idx}`;
        raw[key] = cell ? cell.v : null;
      });

      const mapped: SongData = {} as SongData;
      // assign mapped fields
      for (const k of Object.keys(raw)) {
        const target = fieldMap[k] || toCamelCase(k);
        let value = raw[k];

        // parse gviz Date-like string: Date(YYYY,MM,DD)
        if (k === 'Fecha' && typeof value === 'string') {
          const m = value.match(/Date\((\d+),\s*(\d+),\s*(\d+)\)/);
          if (m) {
            const y = parseInt(m[1], 10);
            const mo = parseInt(m[2], 10);
            const d = parseInt(m[3], 10);
            value = new Date(y, mo, d);
          }
        }

        mapped[target] = value;
        // also keep the raw under its original key for reference
        mapped[k] = raw[k];
      }

      return mapped;
    });

    return results;
  }

  /**
   * Convenience wrapper that fetches and updates cached songs.
   */
  loadData(sheet?: string): Observable<SongData[]> {
    return this.getPublicSheetData(sheet);
  }

  /**
   * Parse date string in "d/m/y" format to Date object
   */
  parseDate(s: string | null): Date | null {
    if (!s) return null;
    const parts = s.split('/');
    if (parts.length === 3) {
      const d = parseInt(parts[0], 10);
      const m = parseInt(parts[1], 10);
      const y = parseInt(parts[2], 10);
      if (!isNaN(d) && !isNaN(m) && !isNaN(y)) {
        return new Date(y, m - 1, d);
      }
    }
    return null;
  }

  /**
   * Format date to Spanish: "Monday, 1 of March"
   */
  formatDateSpanish(d: Date | null): string {
    if (!d) return '';
    const days = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
                     'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    const dayName = days[d.getDay()];
    const dayNum = d.getDate();
    const monthName = months[d.getMonth()];
    return `${dayName.charAt(0).toUpperCase() + dayName.slice(1)}, ${dayNum} de ${monthName}`;
  }
}

function toCamelCase(header: string): string {
  if (!header) return header;
  // remove non-alphanumeric, split and camelCase
  const parts = header.replace(/[^a-zA-Z0-9]+/g, ' ').trim().split(/\s+/);
  if (parts.length === 0) return header;
  return parts.map((p, i) => i === 0 ? p.toLowerCase() : p.charAt(0).toUpperCase() + p.slice(1)).join('');
}
