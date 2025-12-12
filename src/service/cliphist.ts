import GObject, { getter, register } from 'gnim/gobject';
import { dependencies, sh } from '@/support/os';
import { exec, subprocess } from 'ags/process';

@register({ GTypeName: 'Cliphist' })
export default class Cliphist extends GObject.Object {
  static instance: Cliphist;

  static get_default() {
    if (!this.instance) this.instance = new Cliphist();
    return this.instance;
  }

  #history: string[] = [];

  @getter(Array<string>)
  get history() {
    return this.#history;
  }

  constructor() {
    super();

    if (dependencies('wl-paste', 'cliphist')) {
      sh(`
        PID=$(ps -ef | grep 'wl-paste --watch bash -c cliphist store && echo "cliphist changed"' | grep -v grep | awk '{print $2}')
        if [ -n "$PID" ]; then
          echo "$PID" | xargs kill
        fi
      `).then(() =>
        // 监听剪贴板变化
        subprocess({
          cmd: ['wl-paste', '--watch', 'bash', '-c', 'cliphist store && echo "cliphist changed"'],
          out: () => {
            this.#history = exec('cliphist list').split(/\n/);
            this.notify('history');
          },
          err: printerr,
        }),
      );
    }
  }

  // $ > / ' "" ' "' " `&|<\&& ||
  select(selected: string) {
    const escaped = selected.replace(/'/g, "'\\''");
    sh(`echo '${escaped}' | cliphist decode | wl-copy`);
  }

  query(term: string) {
    if (!term) return this.#history;
    return this.#history.filter(item => item.match(term));
  }
}
