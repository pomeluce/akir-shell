import { pollTime, uptime } from 'core/lib/date';
import Box from 'gtk/primitive/Box';
import Calendar from './Calendar';

function up(up: number) {
  const h = Math.floor(up / 60);
  const m = Math.floor(up % 60);
  return `uptime: ${h}:${m < 10 ? '0' + m : m}`;
}
function Clock() {
  return (
    <Box className="clock-box" vertical px="2xl" py="xl">
      <label className="clock" label={pollTime(60)().as(t => t.format('%H:%M')!)} />
      <label className="uptime" label={uptime().as(up)} />
    </Box>
  );
}

export default function DateTime() {
  return (
    <Box vertical p="2xl" gap="2xl">
      <Clock />
      <Calendar />
    </Box>
  );
}
