import { Variable, execAsync, exec, writeFileAsync } from 'astal';
import { dependencies, bash, mkdir } from 'core/lib/os';
import { Plugin } from '../plugin';
import Spinner from 'gtk/primitive/Spinner';
import options from '../../options';
import Nix from './Nix';

const { pkgs, maxItems } = options.nix;
const PREFIX = 'legacyPackages.x86_64-linux.';

export type Nixpkg = {
  description: string;
  pname: string;
  version: string;
};

export default function nix(): Plugin {
  for (const dep of ['nix', 'fzf', 'head']) {
    if (!dependencies(dep)) {
      throw Error(`missing dependency: ${dep}`);
    }
  }

  mkdir(CACHE);
  const list = `${CACHE}/nixpkgs`;
  const nixpkgs = Variable<Record<string, Nixpkg>>({});
  const filter = Variable<Array<string>>([]);

  const found = Variable.derive([nixpkgs, filter], (nixpkgs, filter) =>
    filter
      .map(f => {
        if (!nixpkgs[`${PREFIX}${f}`]) return null as unknown as Nixpkg; // filtered

        return nixpkgs[`${PREFIX}${f}`]!;
      })
      .filter(pkg => pkg),
  );

  execAsync(`nix search ${pkgs} ^ --json`).then(json => {
    const obj = JSON.parse(json);
    const content = Object.keys(obj)
      .map(n => n.replace(PREFIX, ''))
      .join('\n');

    writeFileAsync(list, content).then(() => {
      nixpkgs.set(obj);
    });
  });

  return {
    description: pkgs(pkgs => `Run a nix package from ${pkgs}`),
    icon: Spinner({
      icon: 'nix',
      spin: nixpkgs(pkgs => Object.values(pkgs).length === 0),
    }),
    ui: Nix({
      loading: nixpkgs(pkgs => Object.values(pkgs).length === 0),
      pkgs: found(),
    }),
    search(search) {
      bash`cat ${list} | fzf -f "${search}" | head -n ${maxItems.get()}`.then(out => filter.set(out.split('\n'))).catch(console.error);
    },
    complete(search) {
      const res = exec(['bash', '-c', `cat ${list} | fzf -f "${search}" | head -n 1`]);
      return res === search ? '' : res;
    },
    enter(entered) {
      const [pkg, ...args] = entered!.split(/\s+/);
      execAsync(`nix run ${pkgs}#${pkg} -- ${args.join(' ')}`).catch(console.error);
    },
  };
}
