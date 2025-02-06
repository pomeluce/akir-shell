import { Variable } from 'astal';
import Box from 'gtk/primitive/Box';
import Separator from 'gtk/primitive/Separator';
// import { date } from "lib/state"
// import { scss } from "lib/theme"
import Calendar from './Calendar';

export default function Cal(caldate: Variable<{ day: number; month: number; year: number }>) {
  // const header = Variable.derive(
  //     [date, caldate],
  //     (date, { year, month, day }) => (
  //         `${year}. ${month}. ${day}. - ${date.format("%H:%M")}`
  //     ),
  // )

  return (
    <Box vertical>
      <Separator />
      {/* <Box p="xl" className="date"> */}
      {/*     <label label={header()} /> */}
      {/* </Box> */}
      <Box p="xl">
        <Calendar
          date={caldate}
          // mark={(y, m, day) => day === 5}
        />
      </Box>
    </Box>
  );
}
