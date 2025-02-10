import GLib from 'gi://GLib';
import App from 'astal/gtk3/app';
import { dependencies } from 'core/lib/os';
import { Shoting } from 'core/service/screenshot';

App.start({
  instanceName: 'recording',
  requestHandler(request, res) {
    const [cmd] = request.split(/\s+/);
    try {
      Shoting.shot(cmd === '--full');
      return res(`shoting`);
    } catch (error) {
      logError(error instanceof GLib.Error ? error.message : error);
      return res(`cancelled`);
    }
  },
  client(message, arg = '') {
    print(message(arg));
  },
  main(...args) {
    if (!dependencies('wayshot', 'slurp')) {
      return App.quit(1);
    }
    try {
      Shoting.shot(args.includes('--full'));
    } catch (error) {
      logError(error instanceof GLib.Error ? error.message : error);
      return App.quit(1);
    }
  },
});
