const list = document.querySelector<HTMLElement>('.principles-list');
const items = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-principle-item]'));

function activate(item: HTMLButtonElement | undefined) {
  items.forEach((candidate) => {
    candidate.toggleAttribute('data-active', candidate === item);
  });
}

function itemFromTarget(target: EventTarget | null) {
  return target instanceof Element
    ? target.closest<HTMLButtonElement>('[data-principle-item]') ?? undefined
    : undefined;
}

if (list && items.length > 0) {
  list.addEventListener('pointerover', (event) => {
    activate(itemFromTarget(event.target));
  });

  list.addEventListener('focusin', (event) => {
    activate(itemFromTarget(event.target));
  });

  list.addEventListener('pointerleave', () => {
    const focused = itemFromTarget(document.activeElement);
    activate(focused ?? items[0]);
  });

  list.addEventListener('focusout', () => {
    requestAnimationFrame(() => {
      const focused = itemFromTarget(document.activeElement);
      if (!focused) activate(items[0]);
    });
  });
}
