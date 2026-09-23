import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const sets = {
  solar: require('@iconify-json/solar/icons.json'),
  simple: require('@iconify-json/simple-icons/icons.json'),
};

/**
 * Looks an icon up by its real name, never an alias: a renamed icon should
 * fail the build rather than resolve to something the set no longer calls it.
 */
export function iconBody(ref) {
  const [set, name] = ref.split(':');
  const data = sets[set];
  if (!data) throw new Error(`Unknown icon set "${set}" in "${ref}"`);
  const icon = data.icons[name];
  if (!icon) throw new Error(`Icon set "${set}" has no icon named "${name}"`);
  return { body: icon.body, width: icon.width ?? data.width ?? 24, height: icon.height ?? data.height ?? 24 };
}

export function hasIcon(ref) {
  try {
    iconBody(ref);
    return true;
  } catch {
    return false;
  }
}
