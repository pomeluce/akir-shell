import Box from 'gtk/primitive/Box';
import Icon from 'gtk/primitive/Icon';
import ToggleButton from 'gtk/primitive/ToggleButton';
import options from 'core/theme/options';

export default function DarkMode() {
  function toggle() {
    const s = options.scheme.mode.get();
    options.set('scheme', s === 'dark' ? 'light' : 'dark');
  }

  return (
    <ToggleButton state={options.scheme.mode(s => s === 'dark')} onToggled={toggle} color="primary" vfill hfill mx="md" suggested>
      <Box py="md" px="xl">
        <Icon symbolic icon={options.scheme.mode(s => `${s}-mode`)} />
      </Box>
    </ToggleButton>
  );
}
