import App from 'ags/gtk4/app';
import Search from './search';
import { LayoutType } from '@/types/element';
import { Gtk } from 'ags/gtk4';
import { Box, Button, Icon, PopupBin, PopupPadding, PopupWindow } from '@/components';
import { Accessor, createRoot, createState } from 'gnim';
import { PanelKeyType, panels } from './panels';
import { scss } from '@/theme/style';
import { configs } from 'options';

const hide = () => App.get_window('launcher')?.hide();

const [currentPanel, setCurrentPanel] = createState<PanelKeyType>('app');

export default () =>
  createRoot(() => {
    const { separator, width, margin, anchor } = configs.launcher;
    const layout = anchor(([v1, v2]) => `${v1}_${v2}` as LayoutType);
    const pls = panels();
    const [placeholder, setPlaceholder] = createState('');

    const hidPanels = () => Object.values(pls).map(pl => pl.visible(false));

    const handler = ({ text, enter }: { text: string; enter?: boolean }) => {
      hidPanels();

      const panel = pls[currentPanel()];
      panel.visible(true);
      setPlaceholder(panel.placeholder || '');

      if (enter) panel.enter(text);
      else panel.search(text);
    };

    const Panel = ({ label, icon, panel }: { label: string | Accessor<string>; icon: string | Accessor<string>; panel: PanelKeyType }) => {
      return (
        <box hexpand halign={CENTER}>
          <Button
            flat
            suggested
            class={currentPanel(v => (v === panel ? 'active' : ''))}
            onClicked={() => {
              if (panel) setCurrentPanel(panel);
              handler({ text: '' });
            }}
            canFocus={false}
          >
            <Box p="xl" gap="xl">
              <Icon symbolic iconName={icon} />
              <label label={label} />
            </Box>
          </Button>
        </box>
      );
    };

    return (
      <PopupWindow
        name="launcher"
        namespace="akirds-launcher"
        position={layout}
        $={self => {
          self.connect('notify::visible', ({ visible }) => {
            if (!visible) {
              Object.values(pls).map(p => p.reload?.());
            }
          });
          handler({ text: '' });
        }}
      >
        <box orientation={Gtk.Orientation.VERTICAL}>
          <PopupPadding onClick={hide}>
            <box canFocus css={margin(s => `min-height: ${s}rem;`)} />
          </PopupPadding>
          <PopupBin r="md" css={width(s => `min-width: ${s}rem;`)}>
            <Box vertical p="2xl" mt="2xl">
              <box>
                <Panel label="Apps" icon="preferences-desktop-apps" panel="app" />
                <Panel label="ClipBoard" icon="clipboard" panel="clipboard" />
              </box>
              <box orientation={Gtk.Orientation.VERTICAL} class={separator(s => `launcher separator-${s};`)}>
                <Search placeholder={placeholder} handler={handler} />
                <box orientation={Gtk.Orientation.VERTICAL} class="body" css={width(s => `min-width: ${s}pt;`)}>
                  {Object.values(pls)
                    .filter(i => i.ui)
                    .map(i => i.ui)}
                </box>
              </box>
            </Box>
          </PopupBin>
        </box>
      </PopupWindow>
    );
  });

void scss`.launcher {
  &.separator-padded separator {
    margin-left: $padding;
    margin-right: $padding;
  }

  &.separator-none separator {
    min-height: 0;
    background-color: transparent;
  }
}`;
