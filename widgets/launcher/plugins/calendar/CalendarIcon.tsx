import { App } from 'astal/gtk3';
import { GLib } from 'astal';
import Button from 'gtk/primitive/Button';
import Box from 'gtk/primitive/Box';
import type { Date } from '.';
import options from '../../options';
import { bash } from 'core/lib/os';
import Icon from 'gtk/primitive/Icon';

export default function CalendarIcon(date: Date) {
  function tooltip() {
    const { year, month, day } = date.get();
    return GLib.DateTime.new_utc(year, month, day, 0, 0, 0).format('%Y. %m. %d.')!;
  }

  function onClick() {
    bash(options.calendar.app.get()).catch(printerr);
    App.get_window('launcher')!.visible = false;
  }

  return (
    <Button flat suggested color="primary" tooltipText={tooltip()} onClicked={onClick}>
      <Box py="md" px="xl">
        <Icon symbolic icon="x-office-calendar" />
      </Box>
    </Button>
  );
}
