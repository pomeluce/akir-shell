import { dependencies, sh } from '../../lib/os';
import options from '../options';

async function reset() {
  if (!options.tmux.enable.get() || !dependencies('tmux')) return;

  const { scheme, dark, light } = options;
  const hex = scheme.mode.get() === 'dark' ? dark.primary.get() : light.primary.get();

  return sh(`tmux set @main_accent "${hex}"`);
}

export default {
  reset,
};
