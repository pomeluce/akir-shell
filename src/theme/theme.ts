import app from 'ags/gtk4/app';
import { writeFileAsync } from 'ags/file';
import { idle } from 'ags/time';
import { debounce } from '@/support/function';
import { bash, dependencies, mkdir } from '@/support/os';
import { createState } from 'gnim';
import variables from './variables';
import integrations from './integrations';
import options from 'options';

const [stylesheets, setStylesheets] = createState([] as string[]);

/**
 * Add a stylesheet to the global scss scope
 */
export function scss(sheet: TemplateStringsArray | { default: string }) {
  const style = (sheet as { default: string }).default || sheet;
  setStylesheets([...stylesheets.get(), style as string]);
}

export default async () => {
  const props = { App: app };
  const reset = debounce(10, async () => {
    try {
      if (!dependencies('sass')) {
        app.quit();
      }

      const tmp = mkdir(`${TMP}/theme`);
      const scss = `${tmp}/main.scss`;
      const css = `${tmp}/main.css`;
      const sheet = variables.get() + stylesheets.get().join('\n');

      await writeFileAsync(scss, sheet);
      await bash`sass ${scss} ${css}`;
      app.apply_css(css, true);
      for (const i of integrations) {
        if (i.reset) await i.reset(props);
      }

      return 'reset';
    } catch (e) {
      logError(e);
      app.quit(1);
    }
  });

  for (const i of integrations) {
    if (i.init) await i.init(props);
  }

  options.subscribe(reset);
  variables.subscribe(reset);
  stylesheets.subscribe(reset);
  return new Promise((res, rej) => {
    reset()
      .then(() => idle(() => res(null)))
      .catch(rej);
  });
};
