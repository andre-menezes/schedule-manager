import type { ThemeDefinition } from 'vuetify';

export type AppThemeDefinition = ThemeDefinition;

export type ThemeName = 'light' | 'dark';

/**
 * Matizes de evento do design system Agenda (ADR-0044). Cada um tem as cores
 * `event-<matiz>` (destaque), `event-<matiz>-bg` (fundo) e
 * `on-event-<matiz>-bg` (texto sobre o fundo) no tema.
 */
export const EVENT_HUES = [
  'indigo',
  'teal',
  'violet',
  'pink',
  'orange',
  'amber',
  'green',
  'sky',
] as const;
export type EventHue = (typeof EVENT_HUES)[number];

/**
 * Tons de status (chips, avisos). Cada um tem `<tom>-container` e
 * `on-<tom>-container` no tema; `neutral` usa a superfície.
 */
export type StatusTone = 'success' | 'warning' | 'error' | 'info' | 'neutral';
