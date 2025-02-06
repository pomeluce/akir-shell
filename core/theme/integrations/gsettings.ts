import Gio from 'gi://Gio';
import options from '../options';

export default {
  async init() {
    try {
      const settings = new Gio.Settings({
        schema: 'org.gnome.desktop.interface',
      });

      if (options.scheme.enable.get()) {
        options.scheme.mode.subscribe(scheme => {
          settings.set_string('color-scheme', `prefer-${scheme}`);
        });
        settings.set_string('color-scheme', `prefer-${options.scheme.mode.get()}`);
      }
    } catch (error) {
      printerr('gsettings integration failed', error);
    }
  },
};
