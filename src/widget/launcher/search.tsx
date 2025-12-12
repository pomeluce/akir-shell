import App from 'ags/gtk4/app';
import { Icon } from '@/components';
import { Gtk } from 'ags/gtk4';
import { Accessor, createState } from 'gnim';
import { scss } from '@/theme/style';

type ISearchProps = {
  placeholder: string | Accessor<string>;
  handler: (arg: { text: string; enter?: boolean }) => void;
};

export default ({ placeholder, handler }: ISearchProps) => {
  const [text, setText] = createState('');

  let entry: Gtk.Entry;

  const clear = () => {
    setText('');
    entry.set_text('');
    entry.grab_focus();
  };

  return (
    <box class="search" hexpand={false} vexpand={false}>
      <box $type="SearchEntry" cssName="SearchEntry" widthRequest={10}>
        <Icon class="search-icon" iconName="system-search-symbolic" />
        <overlay>
          <box css="min-width: 10rem;">
            <entry
              $={self => {
                entry = self;
                App.connect('window-toggled', (_, win) => {
                  const winName = win.name;
                  const visible = win.visible;

                  if (winName == 'launcher' && visible) {
                    clear();
                    handler({ text: '', enter: false });
                    setText('');
                    entry.set_text('');
                    self.grab_focus();
                  }
                });
              }}
              hexpand
              placeholderText={placeholder}
              onActivate={({ text }) => {
                handler({ text: text || '', enter: true });
                App.get_window('launcher')!.visible = false;
              }}
              onNotifyText={self => {
                setText(self.text);
                handler({ text: self.text || '' });
              }}
            />
            <revealer transitionType={SLIDE_LEFT} revealChild={text.as(Boolean)}>
              <button onClicked={clear} focusOnClick>
                <Icon iconName="edit-clear-symbolic" />
              </button>
            </revealer>
          </box>
        </overlay>
      </box>
    </box>
  );
};

void scss`.search {
  padding: $padding;

  SearchEntry {
    padding: $padding / 2;
    color: transparentize($fg, .2);
    transition: $transition;

    button {
      all: unset;
      transition: $transition;
      color: transparentize($fg, .3);

      &:hover { color: transparentize($fg, .15); }
      &:focus { color: transparentize($primary, .15); }
      &:active { color: $primary; }
    }

    entry {
      all: unset;
      color: $fg;
    }

    image.search-icon {
      transition: $transition;
      font-size: .9em;
      margin-right: .4em;
    }

    &.hover image.search-icon {
        color: transparentize($primary, .1);
    }

    &.focus image.search-icon {
        color: $primary;
    }
  }
}
`;
