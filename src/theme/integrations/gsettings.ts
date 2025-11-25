import Gio from 'gi://Gio';
import options from 'options';

const { theme } = options;

export default {
  async init() {
    try {
      const settings = new Gio.Settings({
        schema: 'org.gnome.desktop.interface',
      });

      const scheme = theme.scheme.mode();

      if (theme.scheme.enable.get()) {
        scheme.subscribe(() => {
          settings.set_string('color-scheme', `prefer-${scheme.get()}`);
          settings.set_string('gtk-theme', theme.scheme.theme[scheme.get()].get());
        });
        settings.set_string('color-scheme', `prefer-${scheme.get()}`);
        settings.set_string('gtk-theme', theme.scheme.theme[scheme.get()].get());
      }
    } catch (error) {
      printerr('gsettings integration failed', error);
    }
  },
};
