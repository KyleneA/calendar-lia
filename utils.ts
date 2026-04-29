type Constructable<T> = { new(): T };

/**
 * Returns the first element of the given `type` (e.g.,
 * `HTMLParagraphElement`, `HTMLInputElement`) that matches the
 * specified CSS `selector`. If a `parent` is given, the element
 * returned is a descendant of that parent.
 *
 * Throws an Error if no element is found or if the element found does
 * not match the given `type`.
 */
export function query<T extends Element>(
    selector: string,
    type: Constructable<T>,
    parent: Element | Document = document,
): T {
    const el = parent.querySelector(selector);
    if (!(el instanceof type)) {
        throw new Error(
            `cannot find element of type "${type}" matching selector "${selector}"`,
        );
    }

    return el;
}
