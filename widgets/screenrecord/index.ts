import GLib from 'gi://GLib';
import App from 'astal/gtk3/app';
import { Recording } from 'core/service/screenrecord';
import { dependencies } from 'core/lib/os';

App.start({
  instanceName: 'recording',
  requestHandler(request, res) {
    const [cmd] = request.split(/\s+/);
    if (Recording.state.recording) {
      Recording.stop();
      return res('stopped');
    } else {
      try {
        Recording.record(cmd === '--full');
        return res(`recording`);
      } catch (error) {
        logError(error instanceof GLib.Error ? error.message : error);
        return res(`cancelled`);
      }
    }
  },
  client(message, arg = '') {
    print(message(arg));
  },
  main(...args) {
    if (!dependencies('wf-recorder', 'slurp')) {
      return App.quit(1);
    }
    try {
      Recording.record(args.includes('--full'));
    } catch (error) {
      logError(error instanceof GLib.Error ? error.message : error);
      return App.quit(1);
    }
  },
});
