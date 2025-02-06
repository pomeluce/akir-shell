import Variable from 'astal/variable';
import Binding from 'astal/binding';

export function tmpl(strings: TemplateStringsArray, ...values: (Variable<any> | Binding<any> | string | number | boolean)[]) {
  const deps = values.filter(v => v instanceof Variable || v instanceof Binding);
  const indexes = deps.map(d => values.indexOf(d));

  const evaluate = (...variableValues: any[]) => {
    let v = 0;

    const val = (i: number) => (indexes.includes(i) ? variableValues[v++] : (values[i] ?? ''));

    return strings.flatMap((str, i) => str + `${String(val(i))}`).join('');
  };

  return Variable.derive(deps, evaluate);
}

export function lengthStr(length: number) {
  const min = Math.floor(length / 60);
  const sec = Math.floor(length % 60);
  const sec0 = sec < 10 ? '0' : '';
  return `${min}:${sec0}${sec}`;
}

type StyleNode = undefined | boolean | string | Record<string, boolean | undefined | null>;

export function cnames(...arg: Array<StyleNode>): string {
  const names = arg.flatMap(item => {
    if (item && typeof item === 'string') {
      return item;
    }

    if (typeof item === 'object') {
      return Object.entries(item)
        .filter(([, v]) => v)
        .map(([name]) => name);
    }

    return null;
  });

  return names.filter(Boolean).join(' ');
}

export function fake<T>(value: T | Binding<T>): Binding<T> {
  return value instanceof Binding
    ? value
    : Binding.bind({
        get: () => value,
        subscribe: () => () => void 0,
      });
}
