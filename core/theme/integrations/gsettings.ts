import Gio from 'gi://Gio';
import options from 'options';

const { theme } = options;

export default {
  async init() {
    try {
      const settings = new Gio.Settings({
        schema: 'org.gnome.desktop.interface',
      });

      if (theme.scheme.enable.get()) {
        theme.scheme.mode.subscribe(scheme => {
          settings.set_string('color-scheme', `prefer-${scheme}`);
          settings.set_string('gtk-theme', theme.scheme.theme[scheme].get());
        });
        settings.set_string('color-scheme', `prefer-${theme.scheme.mode.get()}`);
        settings.set_string('gtk-theme', theme.scheme.theme[theme.scheme.mode.get()].get());
      }
    } catch (error) {
      printerr('gsettings integration failed', error);
    }
  },
};
