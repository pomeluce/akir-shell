import Cliphist from '@/service/cliphist';
import ClipBoard from './ClipBoard';
import { Gtk } from 'ags/gtk4';
import { createState } from 'gnim';
import { configs } from 'options';

export default () => {
  const { maxItems, placeholder } = configs.launcher.clipboard;
  const cliphist = Cliphist.get_default();
  const [history, setHistory] = createState<string[]>([]);

  return {
    ui: ClipBoard({ cliphist, history, setHistory }) as Gtk.Widget,
    placeholder: placeholder.peek(),
    search: (text: string) => {
      setHistory(cliphist.query(text).slice(0, maxItems.peek()));
    },
    enter: (entered: string) => {
      cliphist.select(entered);
    },
  };
};
