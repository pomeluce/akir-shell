import { QSSimpleToggleButton } from '../QSButton';
import options from 'core/theme/options';

export const DarkMode = () => {
  return (
    <QSSimpleToggleButton
      state={options.scheme.mode(s => s === 'dark')}
      icon={options.scheme.mode(s => `${s}-mode`)}
      label={options.scheme.mode().as(v => v.charAt(0).toUpperCase() + v.slice(1))}
      onToggled={() => {
        const s = options.scheme.mode.get();
        options.scheme.mode.set(s === 'dark' ? 'light' : 'dark');
      }}
    />
  );
};
