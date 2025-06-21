import type App3 from 'astal/gtk3/app';
import type App4 from 'astal/gtk4/app';
import GLib from 'gi://GLib?version=2.0';
import options from 'options';

const help = (instanceName: string) => `
Usage:
    astal -i ${instanceName} [COMMAND] [ARGUMENTS]

Commands:
    version                 Print version
    inspect                 Open GTK debugger tool
    quit                    Quit the application
    eval [code]             Evaluate JavaScript
    toggle [name]           Toggle layer shell
`;

async function getGtk(gtk: 3 | 4) {
  switch (gtk) {
    case 3:
      return await import('gi://Gtk?version=3.0').then(m => m.default);
    case 4:
      return await import('gi://Gtk?version=4.0').then(m => m.default);
    default:
      throw Error('invalid gtk version');
  }
}

type MainProps = {
  name: string;
  gtk: 3 | 4;
  App: typeof App3 | typeof App4;
  theme: () => Promise<unknown>;
  callback: () => Promise<unknown>;
};

export function run(...modules: Array<Promise<{ default: () => void }>>) {
  return async function () {
    for await (const app of modules) {
      try {
        app.default();
      } catch (error) {
        logError(error);
      }
    }
  };
}

export async function start(props: MainProps) {
  const { name, gtk, App, theme, callback: main } = props;
  const instanceName = GLib.getenv('INSTANCE_NAME') || name;
  const Gtk = await getGtk(gtk);

  App.start({
    instanceName,
    // gtkTheme: 'WhiteSur-Dark',
    requestHandler(request, res) {
      const [cmd, ...args] = request.split(/\s+/);
      switch (cmd) {
        case 'version':
        case '-v':
          return res(VERSION);
        case 'help':
        case '-h':
          return res(help(instanceName));
        case 'inspect':
        case '-i':
          return res(App.inspector());
        case 'quit':
        case '-q':
          return res(App.quit());
        case 'toggle':
        case '-t': {
          const name = args[0] || App.instanceName || '';
          const win = App.get_window(name);
          if (win) {
            win.visible = !win.visible;
            return res('ok');
          }
          return res(`${name} layer does not exists`);
        }

        case 'eval':
        default:
          return App.eval(args.join(' ')).then(res).catch(res);
      }
    },
    client(message, ...args) {
      print(message(args.join(' ')));
    },
    async main(...args) {
      if (['help', '--help', '-h'].some(cmd => args.includes(cmd))) {
        print(help(instanceName));
        return App.quit(0);
      }

      if (['version', '--version', '-v'].some(cmd => args.includes(cmd))) {
        print(VERSION);
        return App.quit(0);
      }

      if (['quit', '--quit', '-q'].some(cmd => args.includes(cmd))) return App.quit(0);

      const settings = Gtk.Settings.get_default()!;
      settings.gtkFontName = options.theme.font.get();
      options.theme.font.subscribe(v => (settings.gtkFontName = v));

      try {
        await theme();
        await main();
      } catch (error) {
        logError(error);
        App.quit(1);
      }
    },
  });
}
