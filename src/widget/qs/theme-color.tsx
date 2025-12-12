import Box from '@/components/box';
import { QSMenu, QSToggleButton } from './button';
import { createComputed, For } from 'gnim';
import { cnames } from '@/support/utils';
import { configs, themes } from 'options';

const { quicksettings } = configs;

export const ThemeColor = () => {
  return <QSToggleButton name="themeColor" icon="preferences-color" state={true} label="Theme" activate={() => {}} deactivate={() => {}} />;
};

export const ThemeColorSelection = () => {
  function set({ dark, light }: { dark: string; light: string }) {
    themes.set('dark.primary', dark);
    themes.set('light.primary', light);
  }

  const current = createComputed(() => ({ dark: themes.dark.primary(), light: themes.light.primary() }));

  const chunkSize = quicksettings.chunkSize.peek();
  const colors = quicksettings.colors.as(as =>
    as
      .map(accent => (
        <button
          hexpand
          class={current(current => cnames('theme-color', current.dark === accent.dark && current.light === accent.light && 'active'))}
          tooltipText={themes.scheme.mode(s => accent[s])}
          css={themes.scheme.mode(s => `color: ${accent[s]};`)}
          onClicked={() => set(accent)}
        >
          <Box p="xl">
            <label label={accent.dark} />
          </Box>
        </button>
      ))
      .flatMap((_, index, arr) => (index % chunkSize === 0 ? [arr.slice(index, index + chunkSize)] : [])),
  );

  return (
    <QSMenu name="themeColor" icon="preferences-color" title="Theme Color Selection">
      <Box vertical gap="md">
        <For each={colors}>
          {m => (
            <Box halign={FILL} gap="md">
              {m.map(c => c)}
            </Box>
          )}
        </For>
      </Box>
    </QSMenu>
  );
};
