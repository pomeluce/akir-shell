import { Variable } from 'astal';
import Icon from 'gtk/primitive/Icon';
import { lengthStr } from 'core/lib/utils';

export default function Uptime() {
  const uptime = Variable(0).poll(60_000, 'cat /proc/uptime', line => Number.parseInt(line.split('.')[0]) / 60);

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
