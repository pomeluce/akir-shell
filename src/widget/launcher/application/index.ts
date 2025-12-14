import Apps from 'gi://AstalApps?version=0.1';
import AppList from './app-list';
import { Gtk } from 'ags/gtk4';
import { createState } from 'gnim';
import { configs } from 'options';

export default () => {
  const apps = new Apps.Apps({ minScore: 1 });

  const { sort, placeholder /* , maxItems */ } = configs.launcher.app;

  const q = (s: string) => (sort.peek() === 'frequency' ? apps.fuzzy_query(s) : apps.fuzzy_query(s).sort((a, b) => a.name.localeCompare(b.name)));

  const [list, setList] = createState<Apps.Application[]>([]);
  const [visible, setVisible] = createState<string[]>([]);

  return {
    tab: { name: 'app', icon: 'preferences-desktop-apps', label: 'Apps' },
    ui: AppList({ list, visible }) as Gtk.Widget,
    placeholder: placeholder.peek(),
    reload: () => setList(q('')),
    search: (text: string) => {
      setVisible(
        q(text)
          // .slice(0, maxItems.peek())
          .map(app => app.entry),
      );
    },
    enter(entered: string) {
      const app = q(entered)[0];
      app.launch();
    },
  };
};
