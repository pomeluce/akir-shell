import Gio from 'gi://Gio';
import { themes } from 'options';

export default {
  async init() {
    try {
      const settings = new Gio.Settings({
        schema: 'org.gnome.desktop.interface',
      });

      const scheme = themes.scheme.mode;
      if (themes.scheme.enable.peek()) {
        scheme.subscribe(() => {
          settings.set_string('color-scheme', `prefer-${scheme.peek()}`);
          settings.set_string('gtk-theme', themes.scheme.theme[scheme.peek()].peek());
        });
        settings.set_string('color-scheme', `prefer-${scheme.peek()}`);
        settings.set_string('gtk-theme', themes.scheme.theme[scheme.peek()].peek());
      }
    } catch (error) {
      printerr('gsettings integration failed', error);
    }
  },
};
