import type { Plugin } from '../plugin';
import { Variable, GLib } from 'astal';
import { writeFileAsync } from 'astal/file';
import { exec, execAsync } from 'astal/process';
import { dependencies, mkdir, bash } from 'core/lib/os';
import Sh from './Sh';
import options from 'options';

export default function sh(): Plugin {
  const { maxItems } = options.launcher.sh;

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
    description: 'Run executables from PATH',
    icon: {
      icon: 'utilities-terminal',
      color: 'success',
    },
    ui: Sh(bins),
    search(search: string) {
      if (!search) bins.set(binaries.split('\n').slice(maxItems.get()));

      bash`cat ${binaries} | fzf -f "${search}" | head -n ${maxItems.get()}`
        .then(str => {
          bins.set(Array.from(new Set(str.split('\n')).values()).filter(Boolean));
        })
        .catch(() => bins.set([]));
    },
    enter(entered: string) {
      bash(entered).catch(console.error);
    },
    complete(search: string) {
      const res = exec(['bash', '-c', `cat ${binaries} | fzf -f "${search}" | head -n 1`]);
      return res === search ? '' : res;
    },
  };
}
