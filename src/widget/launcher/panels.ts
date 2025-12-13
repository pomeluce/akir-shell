import { Gtk } from 'ags/gtk4';
import { idle } from 'ags/time';
import { createState } from 'gnim';
import application from './application';
import clipboard from './clipboard';

export const panels = () => {
  return {
    app: makePanel(application),
    clipboard: makePanel(clipboard),
    // cmd: makePanel(cmd),
  };
};

export type PanelKeyType = keyof ReturnType<typeof panels>;

function makePanel(panel: () => Panel) {
  const { ui, ...pl } = panel();
  const [visible, setVisible] = createState(false);

  idle(pl.reload);

  const uiWrapper = new Gtk.Revealer({
    revealChild: visible(),
    transitionType: SLIDE_DOWN,
    child: ui,
  });

  visible.subscribe(() => (uiWrapper.revealChild = visible()));

  return {
    ...pl,
    visible: (v: boolean) => setVisible(v),
    ui: uiWrapper,
  };
}

export type Panel = {
  tab: { name: string; icon: string; label: string };
  ui?: Gtk.Widget;
  placeholder?: string;
  reload?(): void;
  search(search: string): void;
  enter(entered: string): void;
};
