// type defining the possilbe Template types
export type Template = string | (() => string | HTMLElement) | HTMLElement | HTMLTemplateElement | null | undefined;

/**
 * Properties used to create a web component
 */
export type WebComponentProps = {
    attributes?: string[],
    shadowRootMode?: 'open' | 'closed',
    constructor?: Function,
    template?: Template,
    connected?: Function,
    disconnected?: Function,
    attributeChanged?: Function,
    adopted?: Function
}

/**
 * Class used to create and manage a custom web component
 */
export default class WebComponent {
    constructor(tagName: string, details?: WebComponentProps) {
        if (!tagName || tagName.indexOf("-") < 1) {
            throw new Error("Tag name must include a hyphen.")
        }
        customElements.define(tagName, this.createElementClass(tagName, details));
    }

    createElementClass(tagName: string, details: WebComponentProps = {}) {
        const {attributes, constructor, shadowRootMode} = Object.assign({}, {shadowRootMode: 'open'}, details);
        let template: Template = details?.template || document.getElementById(tagName);

        /**
         * Custom class created that will be registered as the custom web component
         */
        return class extends HTMLElement {
            static observedAttributes = attributes;

            constructor() {
                super();

                constructor?.bind(this)();
                template = this.getTemplate(template);
                this.attachShadow({mode: shadowRootMode});
                this.shadowRoot?.append((template as HTMLTemplateElement).content);
            }

            // Utility method for creating an HTMLElement class
            getTemplate(template: Template): HTMLTemplateElement {
                const templateNode = document.createElement("template");
                if (typeof template === 'function') {
                    template = template.bind(this)();
                }
                if (typeof template == 'string') {
                    let innerHTML = "";
                    [template, innerHTML] = [templateNode, template];
                    template.innerHTML = innerHTML;
                }

                if (template instanceof HTMLTemplateElement) return template;
                else if (template instanceof HTMLElement) {
                    templateNode.appendChild(template);
                    return templateNode;
                }
                return templateNode;
            }

            connectedCallback() {
                details?.connected?.bind(this)();
            }

            disconnectedCallback() {
                details?.disconnected?.bind(this)();
            }

            attributeChangedCallback() {
                details?.attributeChanged?.bind(this)(...arguments);
            }

            adoptedCallback() {
                details?.adopted?.bind(this)();
            }
        }
    }
}