import ClipBoard from './ClipBoard';
import { Panel } from '../panel';
import options from 'options';
import Cliphist from 'core/service/cliphist';
import { Variable } from 'astal';

export default function clipboard(): Panel {
  const { maxItems, placeholder } = options.launcher.clipboard;
  const cliphist = Cliphist.get_default();
  const history = Variable<string[]>([]);

  return {
    ui: ClipBoard(cliphist, history),
    placeholder: placeholder.get(),
    search: (search: string) => {
      history.set(cliphist.query(search).slice(0, maxItems.get()));
    },
    enter: (entered: string) => {
      cliphist.select(entered);
    },
  };
}
