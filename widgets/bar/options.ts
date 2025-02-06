import GLib from 'gi://GLib';
import { opt, mkOptions } from 'core/lib/option';

export type BarWidget =
  | 'launcher'
  | 'battery'
  | 'date'
  | 'launcher'
  | 'media'
  | 'powermenu'
  | 'systray'
  | 'system'
  | 'taskbar' // Hyprland only
  | 'workspaces' // Hyprland only
  | 'screenrecord'
  | 'messages'
  | 'spacer';

export default mkOptions('bar', {
  bold: opt(true),
  position: opt<'top' | 'bottom'>('top'),
  corners: opt<'none' | 'sm' | 'md' | 'lg' | 'xl'>('md'),
  transparent: opt(false),
  layout: {
    start: opt<Array<BarWidget>>(['launcher', 'workspaces', 'taskbar', 'spacer', 'messages']),
    center: opt<Array<BarWidget>>(['date']),
    end: opt<Array<BarWidget>>(['media', 'spacer', 'systray', /* "colorpicker", */ 'screenrecord', 'system', 'battery', 'powermenu']),
  },
  launcher: {
    suggested: opt(false),
    flat: opt(true),
    icon: opt(GLib.get_os_info('LOGO') || 'system-search-symbolic'),
    label: opt('Applications'),
    action: opt('akir -t launcher'),
  },
  date: {
    flat: opt(true),
    format: opt('%m-%d %H:%M:%S - %A'),
    action: opt(`akir eval "launcher('cal')"`),
    label: opt('Calendar'),
  },
  battery: {
    suggested: opt(true),
    flat: opt(true),
    bar: opt<'hidden' | 'regular'>('regular'),
    percentage: opt(true),
    low: opt(30),
    size: opt<'sm' | 'md' | 'lg'>('md'),
  },
  workspaces: {
    flat: opt(true),
    workspaces: opt(7),
    label: opt('Workspaces'),
  },
  taskbar: {
    flat: opt(true),
    monochrome: opt(true),
  },
  messages: {
    flat: opt(true),
    action: opt(`akir eval "launcher('n')"`),
  },
  systray: {
    flat: opt(true),
    ignore: opt(['KDE Connect Indicator', 'spotify-client']),
  },
  media: {
    flat: opt(true),
    monochrome: opt(true),
    preferred: opt('spotify'),
    direction: opt<'left' | 'right'>('right'),
    format: opt('{artist} - {title}'),
    maxChars: opt(40),
    timeout: opt(5000), // for how long to reveal on new song
  },
  powermenu: {
    suggested: opt(true),
    flat: opt(true),
    action: opt('akir -t powermenu'),
  },
  systemIndicators: {
    flat: opt(true),
    action: opt(`akir -t quicksettings`),
    label: opt('System Indicators'),
  },
});
