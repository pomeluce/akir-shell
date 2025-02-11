import { type App as App3 } from 'astal/gtk3';
import { type App as App4 } from 'astal/gtk4';
import GLib from 'gi://GLib?version=2.0';
import { readFile } from 'astal/file';

export function initIcons(app: typeof App3 | typeof App4) {
  if (GLib.file_test(`${CONFIG}/icons`, GLib.FileTest.EXISTS)) app.add_icons(`${CONFIG}/icons`);
}

export function icon(name: string | null, fallback = 'image-missing', checker: (name: string) => boolean) {
  if (!name) return fallback || '';

  const icon = substitutes[name] || substitutes[name.toLowerCase()] || name;
  if (GLib.file_test(icon, GLib.FileTest.EXISTS)) return icon;
  if (checker(icon)) return icon;
  if (checker(icon.toLowerCase())) return icon.toLowerCase();
  printerr(`no icon "${icon}", fallback: "${fallback}"`);
  return fallback;
}

export const substitutes: Record<string, string> = GLib.file_test(`${CONFIG}/substitutes.json`, GLib.FileTest.EXISTS) ? JSON.parse(readFile(`${CONFIG}/substitutes.json`)) : {};

export function symbolic(i: string, s: boolean) {
  if (i == null) return symbolic('image-missing', s);
  return s ? (i.endsWith('-symbolic') ? i : i + '-symbolic') : i.endsWith('-symbolic') ? i.replace('-symbolic', '') : i;
}

// export const icons = {
//     missing: "image-missing",
//     nix: {
//         nix: "nix-snowflake",
//     },
//     app: {
//         terminal: "utilities-terminal",
//         calendar: "x-office-calendar",
//         wifi: "network-wireless",
//         colorpicker: "color-select",
//         photo: "emblem-photos",
//     },
//     fallback: {
//         executable: "application-x-executable",
//         notification: "dialog-information",
//         video: "video-x-generic",
//         audio: "audio-x-generic",
//     },
//     ui: {
//         close: "window-close",
//         info: "info",
//         link: "external-link",
//         lock: "system-lock-screen",
//         menu: "open-menu",
//         refresh: "view-refresh",
//         search: "system-search",
//         settings: "emblem-system",
//         themes: "preferences-desktop-theme",
//         tick: "object-select",
//         toolbars: "toolbars",
//         warning: "dialog-warning",
//         avatar: "avatar-default",
//         grid: "view-grid",
//         window: "focus-windows",
//         hourglass: "hourglass",
//         arrow: {
//             right: "pan-end",
//             left: "pan-start",
//             down: "pan-down",
//             up: "pan-up",
//         },
//     },
//     audio: {
//         music: "emblem-music",
//         mic: {
//             muted: "microphone-disabled",
//             low: "microphone-sensitivity-low",
//             medium: "microphone-sensitivity-medium",
//             high: "microphone-sensitivity-high",
//         },
//         volume: {
//             muted: "audio-volume-muted",
//             low: "audio-volume-low",
//             medium: "audio-volume-medium",
//             high: "audio-volume-high",
//             overamplified: "audio-volume-overamplified",
//         },
//         type: {
//             headset: "audio-headphones",
//             speaker: "audio-speakers",
//             card: "audio-card",
//         },
//         mixer: "mixer",
//     },
//     powerprofile: {
//         "balanced": "power-profile-balanced",
//         "power-saver": "power-profile-power-saver",
//         "performance": "power-profile-performance",
//     },
//     asusctl: {
//         profile: {
//             Balanced: "power-profile-balanced",
//             Quiet: "power-profile-power-saver",
//             Performance: "power-profile-performance",
//         },
//         mode: {
//             Integrated: "processor",
//             Hybrid: "controller",
//         },
//     },
//     battery: {
//         charging: "battery-flash",
//         warning: "battery-empty",
//         charged: "battery-full-charged",
//     },
//     bluetooth: {
//         enabled: "bluetooth-active",
//         disabled: "bluetooth-disabled",
//     },
//     brightness: {
//         indicator: "display-brightness",
//         keyboard: "keyboard-brightness",
//         screen: "display-brightness",
//     },
//     powermenu: {
//         sleep: "weather-clear-night",
//         reboot: "system-reboot",
//         logout: "system-log-out",
//         shutdown: "system-shutdown",
//     },
//     recorder: {
//         recording: "media-record",
//     },
//     notifications: {
//         noisy: "org.gnome.Settings-notifications",
//         silent: "notifications-disabled",
//         message: "mail-unread",
//     },
//     trash: {
//         full: "user-trash-full",
//         empty: "user-trash",
//     },
//     mpris: {
//         shuffle: {
//             enabled: "media-playlist-shuffle",
//             disabled: "media-playlist-consecutive",
//         },
//         loop: {
//             none: "media-playlist-repeat",
//             track: "media-playlist-repeat-song",
//             playlist: "media-playlist-repeat",
//         },
//         playing: "media-playback-pause",
//         paused: "media-playback-start",
//         stopped: "media-playback-start",
//         prev: "media-skip-backward",
//         next: "media-skip-forward",
//     },
//     system: {
//         cpu: "org.gnome.SystemMonitor",
//         ram: "drive-harddisk-solidstate",
//         temp: "temperature",
//     },
//     color: {
//         dark: "dark-mode",
//         light: "light-mode",
//     },
// }
