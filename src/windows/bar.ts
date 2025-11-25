import Bar, { Corners } from '@/widget/bar';
import { Gtk } from 'ags/gtk4';
import app from 'ags/gtk4/app';
import { createComputed } from 'gnim';
import options from 'options';

const { bar, theme } = options;

export default () => {
  const bars = app.get_monitors().map(Bar) as Gtk.Widget[];
  app.get_monitors().map(Corners);

  if (theme.hyprland.enable.get()) {
    import('gi://AstalHyprland').then(m => {
      const h = m.default.get_default();
      const msg = (s: string) => h.message_async(s, null);

      msg('keyword layerrule noanim,bar');
      msg('keyword layerrule noanim,corners');

      createComputed([theme.spacing(), theme.hyprland.gapsMultiplier(), bar.transparent(), bar.anchor()], (gaps, mul, tr, pos) => {
        const bar = bars[0].get_allocated_height();
        const gap = gaps * mul;
        const r = gap > bar ? -bar : -(gap * 0.9);

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
