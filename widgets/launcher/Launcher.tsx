import { App, Widget } from 'astal/gtk3';
import { Variable } from 'astal';
import PopupBin from 'gtk/primitive/PopupBin';
import PopupPadding from 'gtk/primitive/PopupPadding';
import Search from './Search';
import { scss } from 'core/theme';
import options from 'options';
import Box from 'gtk/primitive/Box';
import PopupWindow, { LayoutType } from 'gtk/primitive/PopupWindow';
import Icon from 'gtk/primitive/Icon';
import Button from 'gtk/primitive/Button';
import { PanelKeyType, panels } from './panel';

void scss`.Launcher {
  &.separator-padded separator {
    margin-left: $padding;
    margin-right: $padding;
  }

  &.separator-none separator {
    min-height: 0;
    background-color: transparent;
  }
}`;

// main search handler logic
interface HandlerProps {
  text: string;
  enter?: boolean;
  complete?: boolean;
}

function hide() {
  App.get_window('launcher')!.hide();
}

export default function Launcher() {
  const currentPanel = Variable<PanelKeyType>('app');
  const pls = panels();

  const { separator, width, margin, anchor } = options.launcher;

  const layout = anchor(([v1, v2]) => `${v1}_${v2}` as LayoutType);

  const text = Variable('');
  const position = Variable(0);
  const placeholder = Variable('');

  function hidPanels() {
    Object.values(pls).map(pl => pl.visible(false));
  }

  function setText(str: string) {
    text.set(str);
    position.set(str.length);
  }

  function setPanel(pl: PanelKeyType) {
    currentPanel.set(pl);
  }

  function handler({ text, enter, complete }: HandlerProps) {
    hidPanels();

    const panel = pls[currentPanel.get()];
    panel.visible(true);
    placeholder.set(panel.placeholder || '');

    if (enter) {
      panel.enter(text);
    } else if (complete && panel.complete) {
      const result = panel.complete(text);
      if (result !== '') {
        setText(result);
        return true;
      }
    } else {
      panel.search(text);
    }
  }

  function setup(self: Widget.Window) {
    self.connect('notify::visible', ({ visible }) => {
      if (!visible) {
        Object.values(pls).map(p => p?.reload?.());
        setText('');
      }
    });
    handler({ text: '' });
  }

  const Panel = ({ label, icon, panel }: { label: Widget.LabelProps['label']; icon: Widget.IconProps['icon']; panel?: PanelKeyType }) => {
    return (
      <box hexpand halign={CENTER}>
        <Button
          flat
          suggested
          className={currentPanel(v => (v === panel ? 'active' : ''))}
          onClicked={() => {
            if (panel) currentPanel.set(panel);
            handler({ text: '' });
          }}
          canFocus={false}
        >
          <Box p="xl" gap="xl">
            <Icon symbolic icon={icon} />
            <label label={label} />
          </Box>
        </Button>
      </box>
    );
  };

  const win = (
    <PopupWindow name="launcher" namespace="launcher" position={layout} setup={setup} onDestroy={() => currentPanel.drop()}>
      <box vertical>
        <PopupPadding onClick={hide}>
          <box canFocus css={margin(s => `min-height: ${s}rem`)} />
        </PopupPadding>
        <PopupBin r="md" css={width(s => `min-width: ${s}rem`)}>
          <Box vertical p="2xl" mt="2xl">
            <centerbox>
              <Panel label="Apps" icon="preferences-desktop-apps" panel="app" />
              <Panel label="ClipBoard" icon="clipboard" />
              <Panel label="CMD" icon="utilities-terminal" panel="cmd" />
            </centerbox>

            <box vertical className={separator(s => `Launcher separator-${s}`)}>
              <Search text={text} position={position} placeholder={placeholder} handler={handler} />
              <box vertical className="Body" css={width(s => `min-width: ${s}pt`)}>
                {Object.values(pls)
                  .filter(i => i?.ui)
                  .map(i => i!.ui)}
              </box>
            </box>
          </Box>
        </PopupBin>
      </box>
    </PopupWindow>
  );

  return Object.assign(win, { setText, setPanel });
}
