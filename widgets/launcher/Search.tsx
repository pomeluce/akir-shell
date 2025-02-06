import { Gdk, App } from 'astal/gtk3';
import Variable from 'astal/variable';
import SearchEntry from 'gtk/primitive/SearchEntry';
import { scss } from 'core/theme';
import { idle } from 'astal/time';

void scss`.Search {
  padding: $padding;

  SearchEntry {
    padding: $padding / 2;
  }
}
`;

type Props = {
  handler: (arg: { text: string; complete?: boolean; enter?: boolean }) => void;
  text: Variable<string>;
  position: Variable<number>;
  child?: JSX.Element;
};

export default function Search({ handler, text, position, child }: Props) {
  return (
    <box className="Search" expand={false}>
      <SearchEntry
        onSearch={self => {
          text.set(self.text || '');
          handler({ text: self.text || '' });
        }}
        onEnter={({ text }) => {
          handler({ text: text || '', enter: true });
          App.get_window('launcher')!.visible = false;
        }}
        onKeyPressEvent={({ text }, event) => {
          if (event.get_keyval()[1] === Gdk.KEY_Tab) {
            return handler({ text: text || '', complete: true });
          }
        }}
        text={text()}
        placeholder={'Type ":" to list subcommands'}
        setup={self => {
          idle(() => self.focus()); // focus at startup

          self.hook(position, () =>
            idle(() => {
              self.focus();
              self.set_position(position.get());
            }),
          );
          self.hook(text, () => {
            if (self.text !== text.get()) self.focus();
          });
        }}
      />
      {child}
    </box>
  );
}
