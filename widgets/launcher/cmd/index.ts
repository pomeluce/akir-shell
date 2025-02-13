import options from 'options';
import { Panel } from '../panel';
import { bash, dependencies, mkdir } from 'core/lib/os';
import { exec, execAsync, GLib, Variable, writeFileAsync } from 'astal';
import CMD from './CMD';

export default function cmd(): Panel {
  const { maxItems, placeholder } = options.launcher.cmd;

  if (!dependencies('fzf')) {
    throw Error('missing dependency: fzf');
  }

  mkdir(CACHE);
  const binaries = `${CACHE}/binaries`;
  Promise.all(
    GLib.getenv('PATH')!
      .split(':')
      .map(path => execAsync(`ls ${path}`).catch(() => '')),
  ).then(exe => writeFileAsync(binaries, exe.join('\n')));

  const bins = Variable<Array<string>>([]);

  return {
    ui: CMD(bins),
    placeholder: placeholder.get(),
    search(search: string) {
      if (!search) bins.set(binaries.split('\n').slice(maxItems.get()));

      bash(`cat ${binaries} | fzf -f "${search}" | head -n ${maxItems.get()}`)
        .then(str => {
          bins.set(Array.from(new Set(str.split('\n')).values()).filter(Boolean));
        })
        .catch(() => bins.set([]));
    },
    enter: (entered: string) => bash(entered).catch(console.error),
    complete(search: string) {
      const res = exec(['bash', '-c', `cat ${binaries} | fzf -f "${search}" | head -n 1`]);
      return res === search ? '' : res;
    },
  };
}
