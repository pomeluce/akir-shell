import { idle, Variable } from 'astal';
import { Gtk, Widget } from 'astal/gtk3';
import appLauncher from './applauncher';
import cmd from './cmd';

export const panels = () => {
  return {
    app: makePanel(appLauncher),
    cmd: makePanel(cmd),
  };
};

export type PanelKeyType = keyof ReturnType<typeof panels>;

function makePanel(panel: () => Panel) {
  const { ui, ...pl } = panel();
  const visible = Variable(false);

  idle(pl.reload);

  return {
    ...pl,
    visible: (v: boolean) => visible.set(v),
    ui: new Widget.Revealer({
      revealChild: visible(),
      transitionType: SLIDE_DOWN,
      child: ui,
    }),
  };
}

export type Panel = {
  ui?: Gtk.Widget;
  placeholder?: string;
  reload?(): void;
  search(search: string): void;
  enter(entered: string): void;
  complete?(search: string): string;
};
