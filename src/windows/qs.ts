import QuickSettings from '@/widget/qs';
import app from 'ags/gtk4/app';
import options from 'options';

export default () => {
  app.get_monitors().map(QuickSettings);

  if (options.theme.hyprland.enable.get()) {
    import('gi://AstalHyprland').then(m => {
      const h = m.default.get_default();
      h.message_async('keyword layerrule noanim,quicksettings', null);
    });
  }
};
