import Box from 'gtk/primitive/Box';
import options from '../../options';
import theme from 'core/theme/options';
import { scss } from 'core/theme';
import { cnames } from 'core/lib/utils';
import { Variable } from 'astal';

void scss`button.AccentColor {
  all: unset;

  transition: $transition;
  border-radius: $radius;
  background-color: currentColor;
  min-height: 1.5rem;
  min-width: 1.8rem;
  border: $border;
  margin: $spacing;

  outline-color: transparent;
  outline-style: solid;
  outline-width: $border-width;
  outline-offset: $border-width;
  -gtk-outline-radius: $radius + ($border-width * 2);

  &:focus,
  &:hover,
  &:active {
    outline-color: currentColor;
  }

  &.active {
    box-shadow: inset 0 0 0 $border-width $accent-fg;
  }
}`;

export default function AccentPicker() {
  function set({ dark, light }: { dark: string; light: string }) {
    theme.set('dark.primary', dark);
    theme.set('light.primary', light);
  }

  const current = Variable.derive([theme.dark.primary, theme.light.primary], (dark, light) => ({ dark, light }));

  return (
    <Box gap="2xl" halign={CENTER}>
      {options.theme.accents(as =>
        as.map(accent => (
          <button
            className={current(current => cnames('AccentColor', current.dark === accent.dark && current.light === accent.light && 'active'))}
            tooltipText={theme.scheme.mode(s => accent[s])}
            css={theme.scheme.mode(s => `color: ${accent[s]}`)}
            onClicked={() => set(accent)}
          />
        )),
      )}
    </Box>
  );
}
