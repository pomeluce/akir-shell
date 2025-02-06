import { opt, mkOptions } from 'core/lib/option';

export default mkOptions('powermenu', {
  layout: opt<'1x6' | '2x3'>('1x6'),
  labels: opt(true),
  iconSize: opt(6),

  hibernate: opt('systemctl hibernate'),
  sleep: opt('systemctl suspend'),
  reboot: opt('systemctl reboot'),
  logout: opt('hyprctl dispatch exit'),
  shutdown: opt('shutdown now'),
  lockscreen: opt('swaylock -eF'),
});
