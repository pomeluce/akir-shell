import options from 'options';
import type { IntegrationProps } from '.';
import Hyprland from 'gi://AstalHyprland';

function rgba(color: string) {
  return `rgba(${color}ff)`.replace('#', '');
}

function sendBatch(...batch: string[]) {
  const hypr = Hyprland.get_default();
  const cmd = batch
    .filter(x => !!x)
    .map(x => `keyword ${x}`)
    .join('; ');

  return new Promise(resolve => {
    hypr.message_async(`[[BATCH]]/${cmd}`, (_, res) => {
      resolve(hypr.message_finish(res));
    });
  });
}

async function reset() {
  if (!options.theme.hyprland.enable.get()) return;

  const { spacing, border, scheme, dark, light, radius, shadows } = options.theme;
  const { inactiveBorder, gapsMultiplier } = options.theme.hyprland;

  const wm_gaps = Math.floor(spacing.get() * gapsMultiplier.get());
  const active = scheme.mode.get() === 'dark' ? dark.primary.get() : light.primary.get();
  const inactive = scheme.mode.get() === 'dark' ? inactiveBorder.dark.get() : inactiveBorder.light.get();
  const rounding = Math.floor(radius.get() * gapsMultiplier.get());

  sendBatch(
    `general:border_size ${border.width.get() * 3}`,
    `general:gaps_out ${wm_gaps}`,
    `general:gaps_in ${Math.floor(wm_gaps / 2)}`,
    `general:col.active_border ${rgba(active)}`,
    `general:col.inactive_border ${rgba(inactive)}`,
    `decoration:rounding ${rounding}`,
    `decoration:shadow:enabled ${shadows.get() ? 'true' : 'false'}`,
  );

  // TODO: gapsWhenOnly
  // if (gaps != null) {
  //     sendBatch(
  //         `dwindle:no_gaps_when_only ${gaps ? 0 : 1}`,
  //         `master:no_gaps_when_only ${gaps ? 0 : 1}`,
  //     )
  // }
}

async function init({ App, Astal }: IntegrationProps) {
  async function blur(name: string) {
    await sendBatch(`layerrule unset, ${name}`);

    if (options.theme.blur.get() > 0) {
      sendBatch(`layerrule unset, ${name}`, `layerrule blur, ${name}`, `layerrule ignorealpha ${0.29}, ${name}`);
    }
  }

  App.connect('window-added', (_, win) => {
    if (win instanceof Astal.Window) blur(win.namespace);
  });

  options.theme.blur.subscribe(() => {
    for (const win of App.get_windows()) {
      if (win instanceof Astal.Window) blur(win.namespace);
    }
  });
}

export function margin({ top = 0, bottom = 0, left = 0, right = 0 } = {}) {
  sendBatch(
    ...Hyprland.get_default()
      .get_monitors()
      .map(mon => `monitor ${mon.name},addreserved,${top},${bottom},${left},${right}`),
  );
}

export default {
  init,
  reset,
};
