import { opt, mkOptions } from '../lib/option';

export default mkOptions('theme', {
  dark: {
    primary: opt('#51a4e7'),
    error: opt('#e55f86'),
    success: opt('#00D787'),
    bg: opt('#171717'),
    fg: opt('#eeeeee'),
    widget: opt('#eeeeee'),
    border: opt('#eeeeee'),
  },
  light: {
    primary: opt('#426ede'),
    error: opt('#b13558'),
    success: opt('#009e49'),
    bg: opt('#fffffa'),
    fg: opt('#080808'),
    widget: opt('#080808'),
    border: opt('#080808'),
  },
  blur: opt(30),
  scheme: {
    enable: opt(true),
    mode: opt<'dark' | 'light'>('dark'),
  },
  widget: {
    opacity: opt(94),
  },
  border: {
    width: opt(1),
    opacity: opt(96),
  },
  shadows: opt(true),
  padding: opt(9),
  spacing: opt(9),
  radius: opt(9),
  font: opt('CaskaydiaMono Nerd Font 10'),
  hyprland: {
    enable: opt(true),
    inactiveBorder: {
      dark: opt('#282828'),
      light: opt('#181818'),
    },
    gapsMultiplier: opt(1.7),
  },
  swww: {
    enable: opt(false),
    fps: opt(165),
  },
  tmux: {
    enable: opt(false),
    cmd: opt('tmux set @main_accent "{hex}"'),
  },
  gsettings: {
    enable: opt(true),
  },
});
