import { QSSimpleToggleButton } from './button';
import { themes } from 'options';

export const DarkMode = () => {
  return (
    <QSSimpleToggleButton
      state={themes.scheme.mode(s => s === 'dark')}
      icon={themes.scheme.mode(s => `${s}-mode`)}
      label={themes.scheme.mode.as(v => v.charAt(0).toUpperCase() + v.slice(1))}
      onToggled={() => {
        const s = themes.scheme.mode.peek();
        themes.scheme.mode.set(s === 'dark' ? 'light' : 'dark');
      }}
    />
  );
};
