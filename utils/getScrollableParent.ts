function getScrollParent(
  node: HTMLElement | null
): HTMLElement | null | undefined {
  if (node instanceof HTMLElement) {
    const isElement = node instanceof HTMLElement;
    const overflowY = isElement && window.getComputedStyle(node).overflowY;
    const isScrollable = overflowY !== "visible" && overflowY !== "hidden";

    if (!node) {
      return null;
    } else if (isScrollable && node.scrollHeight >= node.clientHeight) {
      return node;
    }

    return getScrollParent(node.parentNode as HTMLElement) || document.body;
  }
}

export default getScrollParent;
