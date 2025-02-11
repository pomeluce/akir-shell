import { exec, GObject, Process, property, register, subprocess } from 'astal';

@register({ GTypeName: 'Cliphist' })
export default class Cliphist extends GObject.Object {
  static INSTANCE: Cliphist;

  static get_default() {
    if (!this.INSTANCE) this.INSTANCE = new Cliphist();
    return this.INSTANCE;
  }

  #proc!: Process;
  #history: string[] = [];

  #onChange() {
    this.#history = exec(['cliphist', 'list']).split(/\n/);
    this.emit('changed');
    this.notify('cliphist-value');
    this.emit('cliphist-changed', this.#history);
  }

  constructor() {
    super();
    this.#proc = subprocess({
      cmd: ['wl-paste', '--watch', 'bash', '-c', '\'cliphist store && echo "cliphist changed"\''],
      out: _ => this.#onChange(),
      err: printerr,
    });
    this.#onChange();
  }

  get history() {
    return this.#history;
  }

  stop() {
    // exec(`PID=$(ps -ef | grep 'wl-paste --watch bash -c cliphist store && echo "cliphist changed"' | grep -v grep | awk '{print $2}')
    //         if [ -n "$PID" ]; then
    //           echo "$PID" | xargs kill
    //         fi`);
    // this.proc.signal(2);
  }

  select(selected: string) {
    exec(`echo ${selected} | cliphist decode | wl-copy`);
  }

  query(term: string) {
    return !term ? this.#history : this.#history.filter(item => item.match(term));
  }
}
