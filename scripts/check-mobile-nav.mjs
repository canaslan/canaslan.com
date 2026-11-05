// Focus/state regression checks with a DOM double; this is not browser QA.
// Run: node scripts/check-mobile-nav.mjs
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { stripTypeScriptTypes } from 'node:module';
import vm from 'node:vm';

const handlers = {};
let mobile = true;
const document = { activeElement: null };
function element() {
  return {
    attrs: {}, hidden: false, inert: false,
    setAttribute(name, value) { this.attrs[name] = value; },
    getAttribute(name) { return this.attrs[name]; },
    removeAttribute(name) { delete this.attrs[name]; },
    addEventListener(name, fn) { this[name] = fn; },
    focus() { document.activeElement = this; },
  };
}
const toggle = element(), drawer = element(), modal = element(), label = element();
const shell = element(), skip = element(), desktopLink = element();
const first = element(), last = element();
drawer.hidden = true;
drawer.querySelector = () => first;
drawer.querySelectorAll = () => [first, last];
document.querySelector = (selector) => ({
  '[data-menu-toggle]': toggle, '[data-menu-drawer]': drawer,
  '[data-menu-modal]': modal, '[data-menu-toggle-label]': label,
  '.sidebar a[aria-current="page"], .sidebar a[href]': desktopLink,
})[selector];
document.querySelectorAll = () => [shell, skip];
document.body = { toggleAttribute() {} };
const window = {
  matchMedia: () => ({ matches: mobile, addEventListener(name, fn) { handlers.resize = fn; } }),
  addEventListener(name, fn) { handlers[name] = fn; },
};
let source = readFileSync(new URL('../src/scripts/nav.ts', import.meta.url), 'utf8');
source = source.replace(/^import .*;\n/gm, '').split('\ninitThemeToggle();')[0];
const context = vm.createContext({ document, window, viewport: { viewport: { 'mobile-max': { $value: 768 } } } });
vm.runInContext(stripTypeScriptTypes(source), context);
vm.runInContext('initMobileNav()', context);
const key = (value, shiftKey = false) => {
  const event = { key: value, shiftKey, prevented: false, preventDefault() { this.prevented = true; } };
  handlers.keydown(event);
  return event;
};
toggle.click();
assert.equal(drawer.hidden, false);
assert.equal(toggle.attrs['aria-expanded'], 'true');
assert.equal(modal.attrs['aria-modal'], 'true');
assert.ok(shell.inert && skip.inert);
assert.equal(document.activeElement, first);
last.focus();
assert.ok(key('Tab').prevented);
assert.equal(document.activeElement, toggle);
assert.ok(key('Tab', true).prevented);
assert.equal(document.activeElement, last);
key('Escape');
assert.ok(drawer.hidden && !shell.inert && !skip.inert);
assert.equal(modal.attrs.role, undefined);
assert.equal(document.activeElement, toggle);
toggle.click();
drawer.click({ target: { closest: () => true } });
assert.equal(document.activeElement, toggle);
toggle.click();
mobile = false;
handlers.resize({ matches: true });
assert.equal(document.activeElement, desktopLink);
assert.ok(drawer.hidden && !shell.inert);
console.log('PASS: menu opening, background isolation, Tab wrapping, Escape, click dismissal, desktop resize, and focus restoration');
