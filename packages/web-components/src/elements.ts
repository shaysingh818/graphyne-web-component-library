import { defineCustomElement } from "vue";
import GnButton from "./components/buttons/GnButton/GnButton.vue";
import GnIconButton from "./components/buttons/GnIconButton/GnIconButton.vue";
import GnCard from "./components/layout/GnCard/GnCard.vue";
import GnFormInputField from "./components/forms/GnFormInputField/GnFormInputField.vue";

/**
 * Framework-agnostic custom element classes. Exported individually so
 * consumers (React, Svelte, plain HTML, or Vue apps that want a custom
 * tag prefix) can register them under whatever tag name they choose:
 *
 * ```ts
 * import { GnButtonElement } from '@graphyne/web-components/elements'
 * customElements.define('my-button', GnButtonElement)
 * ```
 */
export const GnButtonElement = defineCustomElement(GnButton);
export const GnIconButtonElement = defineCustomElement(GnIconButton);
export const GnCardElement = defineCustomElement(GnCard);
export const GnFormInputFieldElement = defineCustomElement(GnFormInputField);

const registry: Record<string, CustomElementConstructor> = {
  "gn-button": GnButtonElement,
  "gn-icon-button": GnIconButtonElement,
  "gn-card": GnCardElement,
  "gn-form-input-field": GnFormInputFieldElement
};

/**
 * Registers every Graphyne custom element under its default `gn-*` tag
 * name. Safe to call more than once. Accepts a prefix override if `gn-`
 * collides with another library, e.g. `registerGraphyneElements('acme')`
 * registers `<acme-button>`, `<acme-card>`, etc.
 */
export function registerGraphyneElements(prefix = "gn"): void {
  for (const [defaultTag, ElementClass] of Object.entries(registry)) {
    const tag = prefix === "gn" ? defaultTag : defaultTag.replace("gn-", `${prefix}-`);
    if (!customElements.get(tag)) {
      customElements.define(tag, ElementClass);
    }
  }
}

// Importing this entry point (`@graphyne/web-components/elements`) registers the
// default `gn-*` tags as a side effect, so it works as a drop-in script
// or module import with no extra setup required.
registerGraphyneElements();
