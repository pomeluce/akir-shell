import { Gtk, ConstructProps, Widget } from 'astal/gtk3';
import { property, register, signal } from 'astal/gobject';
import { bind } from 'astal/binding';
import { scss } from 'core/theme';

void scss`SearchEntry {
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

    icon.search {
        transition: $transition;
        font-size: .9em;
        margin-right: .4em;
    }

    label.placeholder {
        color: transparentize($fg, .4);
    }

    &.hover icon.search {
        color: transparentize($primary, .1);
    }

    &.focus icon.search {
        color: $primary;
    }
}`;

type SearchEntryProps = ConstructProps<
  SearchEntry,
  Gtk.Widget.ConstructorProps & {
    placeholder: string;
    text: string;
    width: number;
    noIcon: boolean;
  },
  {
    onSearch: [];
    onEnter: [];
  }
>;

@register({ GTypeName: 'SearchEntry', CssName: 'SearchEntry' })
export default class SearchEntry extends Widget.Box {
  declare private _entry: Widget.Entry;

  @property(String) declare placeholder: string;
  @property(String) declare text: string;
  @property(Number) declare width: number;
  @property(Boolean) declare noIcon: boolean;

  @signal() declare enter: () => void;
  @signal() declare search: () => void;

  focus() {
    this._entry.grab_focus();
  }

  set_position(pos: number) {
    this._entry.set_position(pos);
  }

  constructor({ width = 10, ...props }: SearchEntryProps) {
    super({ width, ...props } as any);
    this.add(<icon visible={bind(this, 'noIcon').as(v => !v)} className="search" icon="system-search-symbolic" />);
    this.add(
      <overlay>
        <box css={bind(this, 'width').as(w => `min-width: ${w}rem;`)}>
          <entry
            hexpand
            setup={self => (this._entry = self)}
            widthChars={0}
            text={bind(this, 'text')}
            onChanged={self => this.onChanged(self.text)}
            onActivate={() => this.enter()}
            onFocusInEvent={() => this.toggleClassName('focus', true)}
            onFocusOutEvent={() => this.toggleClassName('focus', false)}
            onEnterNotifyEvent={() => this.toggleClassName('hover', true)}
            onLeaveNotifyEvent={() => this.toggleClassName('hover', false)}
          />
          <revealer transitionType={SLIDE_LEFT} revealChild={bind(this, 'text').as(Boolean)}>
            <button onClicked={() => this.clear()}>
              <icon icon="edit-clear-symbolic" />
            </button>
          </revealer>
        </box>
        <label className="placeholder" visible={bind(this, 'text').as(t => !t)} label={bind(this, 'placeholder')} halign={START} />
      </overlay>,
    );
  }

  private onChanged(text: string) {
    this.text = text;
    this.search();
  }

  private clear() {
    this.text = '';
    this._entry.grab_focus();
  }
}
