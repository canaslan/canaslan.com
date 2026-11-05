import { marked } from 'marked';

const trigger = document.querySelector<HTMLButtonElement>('[data-readme-trigger]');
const region = document.querySelector<HTMLElement>('[data-readme-region]');
const content = document.querySelector<HTMLElement>('[data-readme-content]');
const status = document.querySelector<HTMLElement>('[data-readme-status]');

function cleanCellText(cell: Element) {
  return (cell.textContent ?? '').replace(/\s+/g, ' ').trim();
}

function headingToTableTitle(heading: Element | null) {
  const raw = (heading?.textContent ?? '').replace(/\s+/g, ' ').trim();
  if (!raw) return '/TABLE';

  const withoutEmoji = raw.replace(/^[^\p{L}\p{N}]+/u, '').trim();
  return `/${(withoutEmoji || raw).toUpperCase()}`;
}

function findPrecedingHeading(table: HTMLTableElement) {
  let sibling: Element | null = table.previousElementSibling;

  while (sibling) {
    if (/^H[1-6]$/.test(sibling.tagName)) return sibling;
    sibling = sibling.previousElementSibling;
  }

  return null;
}

function enhanceMarkdownTables(root: HTMLElement) {
  root.querySelectorAll('table').forEach((table) => {
    const rows = Array.from(table.querySelectorAll('tr'));
    if (rows.length < 2) return;

    const dataRows = rows.slice(1).flatMap((row) => {
      const cells = Array.from(row.querySelectorAll('th, td'));
      if (cells.length < 2) return [];

      return [
        {
          label: cleanCellText(cells[0]),
          valueHtml: cells[1].innerHTML.trim(),
        },
      ];
    });

    if (dataRows.length === 0) return;

    const heading = findPrecedingHeading(table);
    const wrapper = document.createElement('div');
    wrapper.className = 'info-table';
    wrapper.setAttribute('role', 'table');
    wrapper.setAttribute('aria-label', cleanCellText(heading ?? table) || 'Table');

    const header = document.createElement('div');
    header.className = 'info-table__header';
    header.setAttribute('role', 'row');

    const headerCell = document.createElement('div');
    headerCell.className = 'info-table__header-cell';
    headerCell.setAttribute('role', 'columnheader');
    headerCell.textContent = headingToTableTitle(heading);
    header.append(headerCell);

    const body = document.createElement('div');
    body.className = 'info-table__body';
    body.setAttribute('role', 'rowgroup');

    dataRows.forEach((row) => {
      const rowEl = document.createElement('div');
      rowEl.className = 'info-table__row';
      rowEl.setAttribute('role', 'row');

      const label = document.createElement('div');
      label.className = 'info-table__label';
      label.setAttribute('role', 'rowheader');
      label.textContent = row.label;

      const value = document.createElement('div');
      value.className = 'info-table__value';
      value.setAttribute('role', 'cell');
      value.innerHTML = row.valueHtml;

      rowEl.append(label, value);
      body.append(rowEl);
    });

    wrapper.append(header, body);
    table.replaceWith(wrapper);
  });
}

async function revealReadme() {
  if (!trigger || !region || !content || !status) return;

  if (region.dataset.loaded === 'true') {
    region.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }

  const source = trigger.dataset.readmeSource;
  if (!source) return;

  trigger.disabled = true;
  trigger.setAttribute('aria-busy', 'true');
  status.textContent = 'Loading README…';
  region.hidden = false;
  region.scrollIntoView({ behavior: 'smooth', block: 'start' });

  try {
    const response = await fetch(source);
    if (!response.ok) {
      throw new Error(`GitHub README fetch failed (${response.status})`);
    }

    const markdown = await response.text();
    content.innerHTML = await marked.parse(markdown, { gfm: true, breaks: false });
    content.querySelectorAll('a[href]').forEach((link) => link.classList.add('inline-link'));
    enhanceMarkdownTables(content);
    status.textContent = '';
    region.dataset.loaded = 'true';
    trigger.setAttribute('aria-expanded', 'true');
  } catch (error) {
    status.textContent = error instanceof Error ? error.message : 'Failed to load README.';
    trigger.disabled = false;
  } finally {
    trigger.removeAttribute('aria-busy');
  }
}

trigger?.addEventListener('click', revealReadme);
