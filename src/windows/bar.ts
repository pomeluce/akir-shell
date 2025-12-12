import Bar, { Corners } from '@/widget/bar';
import { Gtk } from 'ags/gtk4';
import { createComputed } from 'gnim';
import { configs, themes } from 'options';
import app from 'ags/gtk4/app';

export default () => {
  const bars = app.get_monitors().map(Bar) as Gtk.Widget[];
  app.get_monitors().map(Corners);

  if (themes.hyprland.enable.peek()) {
    import('gi://AstalHyprland').then(m => {
      const h = m.default.get_default();
      const msg = (s: string) => h.message_async(s, null);

      msg('keyword layerrule noanim,akirds-bar');
      msg('keyword layerrule noanim,akirds-corners');

      createComputed(() => {
        const bar = bars[0].get_allocated_height();
        const gap = themes.spacing() * themes.hyprland.gapsMultiplier();
        const r = gap > bar ? -bar : -(gap * 0.9);

        const pos = configs.bar.anchor();
        const tr = configs.bar.transparent();
        const top = pos == 'top' && tr ? r : 0;
        const bottom = pos == 'bottom' && tr ? r : 0;

        for (const { name } of h.get_monitors()) {
          const addr = `addreserved,${top},${bottom},0,0`;
          msg(`keyword monitor ${name},${addr}`);
        }
      });
    });
  }
};
