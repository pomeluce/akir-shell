import { createState } from 'gnim';

export class Option<T = unknown> {
  initial: T;
  id: string = '';

  constructor(initial: T) {
    // const [v, setValue] = createState(initial);
    this.initial = initial;
  }
}
