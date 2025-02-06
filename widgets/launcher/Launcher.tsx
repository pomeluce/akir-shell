import { Astal, Gdk, App, Widget } from 'astal/gtk3';
import { Variable } from 'astal';
import PopupBin from 'gtk/primitive/PopupBin';
import PopupPadding from 'gtk/primitive/PopupPadding';
import Search from './Search';
import Help from './Help';
import options from './options';
import plugins from './plugins/plugin';
import { scss } from 'core/theme';

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

function hide() {
  App.get_window('launcher')!.hide();
}

export default function Launcher() {
  const plugs = plugins();
  const { separator, width, margin } = options;

  const showHelp = Variable(false);
  const text = Variable('');
  const position = Variable(0);

  function hidePlugins() {
    Object.values(plugs.get()).map(p => p?.visible(false));
  }

  function setText(str: string) {
    text.set(str);
    position.set(str.length);
  }

  // main search handler logic
  interface HandlerProps {
    text: string;
    enter?: boolean;
    complete?: boolean;
  }

  function handler({ text, enter, complete }: HandlerProps) {
    const plugins = plugs.get();

    const help = () => {
      hidePlugins();
      showHelp.set(true);
      if (enter) hide();
    };

    // dock, empty search
    if (text === '') {
      hidePlugins();
      showHelp.set(false);
      plugins.dock?.visible(true);
      if (enter) hide();
    }

    // help
    else if (text === '?' || text === ':') {
      help();
    }

    // plugins
    else if (text?.startsWith(':')) {
      showHelp.set(false);

      const index = text.indexOf(' ');
      const prefix = text.substring(1, index);
      const search = text.substring(index).trim();
      const plugin = plugins[prefix as keyof typeof plugins];

      // do plugin
      if (plugin) {
        if (enter) {
          plugin.enter(search);
        } else if (complete && plugin.complete) {
          const res = plugin.complete(search);
          if (res != '') {
            setText(`:${prefix} ${plugin.complete(search)}`);
            return true;
          }
        } else {
          plugin.search(search);
          plugin.visible(true);
        }
      }

      // plugin not found, help
      else {
        help();
      }
    }

    // default
    else {
      plugins.dock?.visible(false);
      plugins.default.visible(true);
      if (enter) {
        plugins.default.enter(text);
      } else if (complete && plugins.default.complete) {
        const c = plugins.default.complete(text);
        if (c !== '') {
          setText(c);
          return true;
        }
      } else {
        plugins.default.search(text);
      }
    }
  }

  function selectPlugin(prefix: string) {
    setText(`:${prefix} `);
  }

  function setup(self: Widget.Window) {
    self.connect('notify::visible', ({ visible }) => {
      if (!visible) {
        Object.values(plugs.get()).map(p => p?.reload?.());
        setText('');
      }
    });
    handler({ text: '' });
  }

  const win = (
    <window
      visible={false}
      namespace="launcher"
      css="background-color: transparent"
      name="launcher"
      application={App}
      anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.BOTTOM}
      exclusivity={Astal.Exclusivity.IGNORE}
      keymode={Astal.Keymode.ON_DEMAND}
      setup={setup}
      onKeyPressEvent={function (_, event: Gdk.Event) {
        if (event.get_keyval()[1] === Gdk.KEY_Escape) hide();
      }}
    >
      <box>
        <PopupPadding h onClick={hide} width={100} />
        <box vertical>
          <PopupPadding onClick={hide}>
            <box css={margin(s => `min-height: ${s}pt`)} />
          </PopupPadding>
          <PopupBin r="md">
            <box vertical className={separator(s => `Launcher separator-${s}`)}>
              <Search text={text} position={position} handler={handler}>
                {plugs(plugins =>
                  Object.values(plugins)
                    .filter(i => i?.icon)
                    .map(i => i!.icon),
                )}
              </Search>
              <box vertical className="Body" css={width(s => `min-width: ${s}pt`)}>
                <Help plugins={plugs} visible={showHelp()} onClicked={selectPlugin} />
                {plugs(plugins =>
                  Object.values(plugins)
                    .filter(i => i?.ui)
                    .map(i => i!.ui),
                )}
              </box>
            </box>
          </PopupBin>
          <PopupPadding v onClick={hide} />
        </box>
        <PopupPadding h onClick={hide} width={100} />
      </box>
    </window>
  );

  return Object.assign(win, { setText });
}
