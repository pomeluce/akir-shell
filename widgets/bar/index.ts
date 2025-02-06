import { App } from 'astal/gtk3';
import { Variable } from 'astal';
import options from 'core/theme/options';
import Bar from './Bar';
import Corners from './Corners';
import baropts from './options';

export default () => {
  const bars = App.get_monitors().map(Bar);
  App.get_monitors().map(Corners);

  if (options.hyprland.enable.get()) {
    import('gi://AstalHyprland').then(m => {
      const h = m.default.get_default();
      const msg = (s: string) => h.message_async(s, null);

      msg('keyword layerrule noanim,bar');
      msg('keyword layerrule noanim,corners');

      Variable.derive([options.spacing, options.hyprland.gapsMultiplier, baropts.transparent, baropts.position], (gaps, mul, tr, pos) => {
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
