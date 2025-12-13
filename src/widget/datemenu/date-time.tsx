import Calendar from './calendar';
import { Box } from '@/components';
import { pollTime, uptime } from '@/support/date';

function up(up: number) {
  const h = Math.floor(up / 60);
  const m = Math.floor(up % 60);
  return `uptime: ${h}:${m < 10 ? '0' + m : m}`;
}
function Clock() {
  return (
    <Box class="clock-box" vertical px="2xl" py="xl">
      <label class="clock" label={pollTime(60).as(t => t.format('%H:%M')!)} />
      <label class="uptime" label={uptime.as(up)} />
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
