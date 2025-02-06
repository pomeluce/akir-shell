import { Variable } from 'astal';
import { QSMenu, QSToggleButton } from '../QSButton';
import Box from 'gtk/primitive/Box';
import { cnames } from 'core/lib/utils';
import theme from 'core/theme/options';
import options from 'options';

const { quicksettings } = options;

export const ThemeColor = () => {
  return <QSToggleButton name="themeColor" icon="preferences-color" state={true} label="Theme" activate={() => {}} deactivate={() => {}} />;
};

export const ThemeColorSelection = () => {
  function set({ dark, light }: { dark: string; light: string }) {
    theme.set('dark.primary', dark);
    theme.set('light.primary', light);
  }

  const current = Variable.derive([theme.dark.primary, theme.light.primary], (dark, light) => ({ dark, light }));

  const chunkSize = quicksettings.chunkSize.get();

  return (
    <QSMenu name="themeColor" icon="preferences-color" title="Theme Color Selection">
      <Box vertical gap="md">
        {quicksettings.colors(as =>
          as
            .map(accent => (
              <button
                hexpand
                className={current(current => cnames('ThemeColor', current.dark === accent.dark && current.light === accent.light && 'active'))}
                tooltipText={theme.scheme.mode(s => accent[s])}
                css={theme.scheme.mode(s => `color: ${accent[s]}`)}
                onClicked={() => set(accent)}
              >
                <Box p="xl">
                  <label label={accent.dark} />
                </Box>
              </button>
            ))
            .flatMap((_, index, arr) => (index % chunkSize === 0 ? [arr.slice(index, index + chunkSize)] : []))
            .map(m => (
              <Box halign={FILL} gap="md">
                {m.map(c => c)}
              </Box>
            )),
        )}
      </Box>
    </QSMenu>
  );
};
