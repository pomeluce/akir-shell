import Icon from 'gtk/primitive/Icon';
import { lengthStr } from 'core/lib/utils';
import { uptime } from 'core/lib/date';

export default function Uptime() {
  const className = uptime(up => {
    if (up > 4 * 60) return 'error';
    return 'primary';
  });

  return (
    <box className="Uptime" tooltipText="Uptime">
      <label label={uptime(lengthStr)} css="margin-right: .2em" />
      <Icon symbolic className={className} icon="hourglass" />
    </box>
  );
}
