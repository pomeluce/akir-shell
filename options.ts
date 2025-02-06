import GLib from 'gi://GLib';
import { mkOptions, opt } from 'core/lib/option';
import { BarWidget } from 'widgets/bar/Bar';

export default mkOptions('config', {
  theme: {
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
  },
  bar: {
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
  },
  quicksettings: {
    position: opt<'left' | 'center' | 'right'>('right'),
    avatar: {
      image: opt(`/var/lib/AccountsService/icons/${USER}`),
      size: opt(90),
    },
    width: opt(380),
    audio: {
      mixer: {
        names: opt(true),
      },
    },
    brightness: {
      min: opt(0.5),
      max: opt(0.75),
    },
    volume: opt('pavucontrol'),
    bluetooth: opt('blueman-manager'),
    network: opt('nm-connection-editor'),
    media: {
      maxItems: opt(10),
      coverSize: opt(6),
      icon: {
        size: opt(1),
        monochrome: opt(false),
      },
    },
    chunkSize: opt(3),
    colors: opt([
      { dark: '#e55f86', light: '#d15577' },
      { dark: '#00D787', light: '#43c383' },
      { dark: '#EBFF71', light: '#d8e77b' },
      { dark: '#51a4e7', light: '#426ede' },
      { dark: '#9077e7', light: '#8861dd' },
      { dark: '#51e6e6', light: '#43c3c3' },
      { dark: '#ffffff', light: '#080808' },
    ]),
  },
});
