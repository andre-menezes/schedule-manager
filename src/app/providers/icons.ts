/**
 * Icon set customizado do Vuetify para o Material Symbols (Google).
 *
 * O Material Symbols usa ligaturas (ex.: `home`, `settings`) renderizadas por
 * um `<span class="material-symbols-outlined">`. O nome do ícone vem de
 * `props.icon`.
 *
 * Uso nos componentes:
 * - Contorno (padrão): `icon="settings"`.
 * - Preenchido (FILL 1): sufixo `-fill` → `icon="favorite-fill"`, ou aplique a
 *   classe utilitária `ms-fill` diretamente (`<v-icon class="ms-fill" ... />`).
 *
 * O Material Symbols é uma variable font com o eixo `FILL` (0 = contorno,
 * 1 = preenchido), controlado via `font-variation-settings` (classe `ms-fill`).
 *
 * Referência: https://fonts.google.com/icons
 */
import { h } from 'vue';
import type { IconAliases, IconProps, IconSet } from 'vuetify';

/** Sufixo que indica a variante preenchida (FILL 1) de um ícone. */
const FILL_SUFFIX = '-fill';

/**
 * Aliases internos do Vuetify (ícones usados por componentes como v-select,
 * v-checkbox, v-pagination, etc.) mapeados para ligaturas do Material Symbols.
 */
export const aliases: IconAliases = {
  collapse: 'keyboard_arrow_up',
  complete: 'check',
  cancel: 'cancel',
  close: 'close',
  delete: 'cancel',
  clear: 'cancel',
  success: 'check_circle',
  info: 'info',
  warning: 'priority_high',
  error: 'warning',
  prev: 'chevron_left',
  next: 'chevron_right',
  checkboxOn: 'check_box',
  checkboxOff: 'check_box_outline_blank',
  checkboxIndeterminate: 'indeterminate_check_box',
  delimiter: 'fiber_manual_record',
  sortAsc: 'arrow_upward',
  sortDesc: 'arrow_downward',
  expand: 'keyboard_arrow_down',
  menu: 'menu',
  subgroup: 'arrow_drop_down',
  dropdown: 'arrow_drop_down',
  radioOn: 'radio_button_checked',
  radioOff: 'radio_button_unchecked',
  edit: 'edit',
  ratingEmpty: 'star_border',
  ratingFull: 'star',
  ratingHalf: 'star_half',
  loading: 'cached',
  first: 'first_page',
  last: 'last_page',
  unfold: 'unfold_more',
  file: 'attach_file',
  plus: 'add',
  minus: 'remove',
  calendar: 'event',
  treeviewCollapse: 'arrow_drop_down',
  treeviewExpand: 'arrow_right',
  eyeDropper: 'colorize',
  upload: 'cloud_upload',
  color: 'palette',
  command: 'keyboard_command_key',
  ctrl: 'keyboard_control_key',
  space: 'keyboard_space',
  shift: 'shift',
  alt: 'keyboard_option_key',
  enter: 'keyboard_return',
  arrowup: 'keyboard_arrow_up',
  arrowdown: 'keyboard_arrow_down',
  arrowleft: 'keyboard_arrow_left',
  arrowright: 'keyboard_arrow_right',
  backspace: 'backspace',
  clock: 'schedule',
};

/**
 * Icon set que renderiza ligaturas do Material Symbols.
 *
 * Renderiza um `<span class="material-symbols-outlined">` cujo conteúdo é a
 * ligatura do ícone. Um sufixo `-fill` no nome ativa a variante preenchida
 * (classe `ms-fill`), ex.: `favorite-fill`.
 */
export const ms: IconSet = {
  component: (props: IconProps) => {
    // O VIcon repassa, além de `icon`/`tag`, outros atributos (class com
    // sizeClasses/textColorClasses, style com font-size/cor, role, aria...).
    // Precisamos preservá-los; extraímos apenas `icon` e `tag`, e mesclamos
    // nossa classe base com a `class` recebida do Vuetify.
    const {
      icon,
      tag,
      class: incomingClass,
      ...rest
    } = props as IconProps & {
      class?: unknown;
      [key: string]: unknown;
    };

    const name = String(icon ?? '');
    const filled = name.endsWith(FILL_SUFFIX);
    const ligature = filled ? name.slice(0, -FILL_SUFFIX.length) : name;

    const baseClass = filled ? 'material-symbols-outlined ms-fill' : 'material-symbols-outlined';

    return h(
      tag,
      {
        ...rest,
        class: [baseClass, incomingClass],
      },
      [ligature]
    );
  },
};
