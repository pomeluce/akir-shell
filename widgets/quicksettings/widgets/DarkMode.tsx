import options from 'options';
import { QSSimpleToggleButton } from '../QSButton';

export const DarkMode = () => {
  return (
    <QSSimpleToggleButton
      state={options.theme.scheme.mode(s => s === 'dark')}
      icon={options.theme.scheme.mode(s => `${s}-mode`)}
      label={options.theme.scheme.mode().as(v => v.charAt(0).toUpperCase() + v.slice(1))}
      onToggled={() => {
        const s = options.theme.scheme.mode.get();
        options.theme.scheme.mode.set(s === 'dark' ? 'light' : 'dark');
      }}
    />
  );
};
