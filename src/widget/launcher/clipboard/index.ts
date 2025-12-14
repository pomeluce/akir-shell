import Cliphist from '@/service/cliphist';
import ClipBoard from './clip-board';
import { Gtk } from 'ags/gtk4';
import { createState } from 'gnim';
import { configs } from 'options';

export default () => {
  const { /* maxItems, */ placeholder } = configs.launcher.clipboard;
  const cliphist = Cliphist.get_default();
  const [history, setHistory] = createState<string[]>([]);

  return {
    tab: { name: 'clipboard', icon: 'clipboard', label: 'ClipBoard' },
    ui: ClipBoard({ history, setHistory }) as Gtk.Widget,
    placeholder: placeholder.peek(),
    search: (text: string) => {
      setHistory(cliphist.query(text) /* .slice(0, maxItems.peek()) */);
    },
    enter: (entered: string) => {
      cliphist.select(entered);
    },
  };
};
