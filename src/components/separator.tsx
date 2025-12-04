import { SeparatorProps } from '@/types/element';
import { Gtk } from 'ags/gtk4';
import { cnames } from '@/support/utils';
import { scss } from '@/theme/theme';

void scss`separator.separator {
  @include margin;

  min-width: $border-width;
  min-height: $border-width;
  background-color: $border-color;
}`;

export default ({ vertical = false, m, my, mx, mt, mb, mr, ml }: SeparatorProps) => {
  const names = cnames('separator', m && `m-${m}`, mx && `mx-${mx}`, my && `my-${my}`, mt && `mt-${mt}`, mb && `mb-${mb}`, ml && `ml-${ml}`, mr && `mr-${mr}`);

  return <Gtk.Separator hexpand={!vertical} vexpand={vertical} class={names} orientation={vertical ? 1 : 0} />;
};
