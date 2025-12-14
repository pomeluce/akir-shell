import { QSSimpleToggleButton } from './button';
import { themes } from 'options';

export const DarkMode = () => {
  const { mode } = themes.scheme;

  return (
    <QSSimpleToggleButton
      state={mode(s => s === 'dark')}
      icon={mode(s => `${s}-mode`)}
      label={mode.as(v => v.charAt(0).toUpperCase() + v.slice(1))}
      onToggled={() => mode.set(mode() === 'dark' ? 'light' : 'dark')}
    />
  );
};
