import Apps from 'gi://AstalApps';
import options from 'options';
import { Panel } from '../panel';
import { Variable } from 'astal';
import { appLunch } from 'core/lib/app';
import AppLauncher from './AppLauncher';

const { maxItems, placeholder } = options.launcher.app;

export default function appLauncher(): Panel {
  const apps = new Apps.Apps({ minScore: 1 });

  const list = Variable([] as Apps.Application[]);
  const visible = Variable([] as string[]);

  const q = (s: string) => apps.exact_query(s);

  return {
    ui: AppLauncher({ list: list(), visible: visible() }),
    placeholder: placeholder().get(),
    reload: () => list.set(q('')),
    search: search => {
      visible.set(
        q(search)
          .slice(0, maxItems.get())
          .map(app => app.entry!),
      );
    },
    enter(entered) {
      const app = q(entered)[0];
      app && appLunch(app);
    },
  };
}
