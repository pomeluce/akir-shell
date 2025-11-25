import '@/support/globals';
import theme from '@/theme';
import app from 'ags/gtk4/app';

type Props = {
  name: string;
  app: typeof app;
  callback?: () => Promise<unknown>;
};

const help = (name: string) => `
Usage:
    ${name} [COMMAND] [ARGUMENTS]

Commands:
    toggle [name]           Toggle layer shell
    eval [code]             Evaluate JavaScript
    version                 Print version
    quit                    Quit the application
    help                    Help about any command
`;

export const run = (...modules: Array<Promise<{ default: () => void }>>) => {
  return async () => {
    for await (const app of modules) {
      try {
        app.default();
      } catch (error) {
        logError(error);
      }
    }
  };
};

export const main = (props: Props) => {
  const { name: instanceName = 'akrids', app, callback } = props;

  app.start({
    instanceName,
    requestHandler(req, res) {
      const [cmd, ...args] = req;

      switch (cmd) {
        case 'version':
        case '-v':
          return res(VERSION);
        case 'help':
        case '-h':
          return res(help(instanceName));
        case 'quit':
        case '-q':
          return res(app.quit());
        case 'toggle':
        case '-t': {
          const name = args[0] || app.instanceName || '';
          const win = app.get_window(name);
          if (win) {
            win.visible = !win.visible;
            return res('ok');
          }
          return res(`${name} layer does not exists`);
        }
        case 'eval':
        default:
          return app.runAsync(args).then(res).catch(res);
      }
    },
    async main(...args) {
      if (['help', '--help', '-h'].some(cmd => args.includes(cmd))) {
        print(help(instanceName));
        return app.quit(0);
      }
      if (['version', '--version', '-v'].some(cmd => args.includes(cmd))) {
        print(VERSION);
        return app.quit(0);
      }
      if (['quit', '--quit', '-q'].some(cmd => args.includes(cmd))) return app.quit(0);

      try {
        await theme();
        await callback?.();
      } catch (error) {
        logError(error);
        app.quit(1);
      }
    },
  });
};
