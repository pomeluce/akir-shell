import GLib from 'gi://GLib';
import { opt, mkOptions } from 'core/lib/option';

export default mkOptions('launcher', {
  width: opt(0),
  separator: opt<'none' | 'padded' | 'full'>('padded'),
  margin: opt(70),

  default: {
    maxItems: opt(7),
    icon: {
      size: opt(4),
      monochrome: opt(false),
    },
  },

  dock: {
    enable: opt(true),
    action: opt('akir -t drawer'),
    icon: {
      size: opt(4),
      monochrome: opt(false),
    },
    display: opt<number | Array<string>>(['IDEA', 'code', 'firefox', 'telegram', 'typora', 'Spotify']),
  },

  hyprland: {
    enable: opt(false),
    prefix: opt('h'),
    icon: {
      size: opt(4),
      monochrome: opt(false),
    },
  },

  nix: {
    enable: opt(Boolean(GLib.find_program_in_path('nix'))),
    prefix: opt('nx'),
    pkgs: opt('nixpkgs/nixos-unstable'),
    maxItems: opt(6),
  },

  sh: {
    enable: opt(true),
    prefix: opt('sh'),
    maxItems: opt(12),
  },

  music: {
    enable: opt(true),
    prefix: opt('m'),
    maxItems: opt(10),
    coverSize: opt(8),
    icon: {
      size: opt(1),
      monochrome: opt(false),
    },
  },

  powermenu: {
    enable: opt(true),
    prefix: opt('p'),
    shutdown: opt('shutdown now'),
    sleep: opt('systemctl suspend'),
    reboot: opt('systemctl reboot'),
    logout: opt('hyprctl dispatch exit'),
  },

  bluetooth: {
    enable: opt(false),
    prefix: opt('bt'),
  },

  notifications: {
    enable: opt(true),
    prefix: opt('n'),
    maxItems: opt(14),
  },

  calendar: {
    enable: opt(true),
    prefix: opt('cal'),
    app: opt('gnome-calendar'),
  },

  wifi: {
    enable: opt(true),
    prefix: opt('nw'),
    maxItems: opt(10),
    settings: opt('gtk-launch gnome-control-center'),
  },

  audio: {
    enable: opt(true),
    prefix: opt('a'),
    mixer: {
      names: opt(true),
    },
  },

  theme: {
    enable: opt(true),
    prefix: opt('th'),
    wallpapers: {
      directory: opt(`/home/${USER}/.config/wallpapers`),
      height: opt(72),
      columns: opt(3),
    },
    accents: opt([
      { dark: '#e55f86', light: '#d15577' },
      { dark: '#00D787', light: '#43c383' },
      { dark: '#EBFF71', light: '#d8e77b' },
      { dark: '#51a4e7', light: '#4886c8' },
      { dark: '#9077e7', light: '#8861dd' },
      { dark: '#51e6e6', light: '#43c3c3' },
      { dark: '#ffffff', light: '#080808' },
    ]),
  },
});
