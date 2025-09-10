/** ---- String utilities ---- */
export function toPascal(s: string): string {
  return s.split(/[_\-\.]/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join("");
}

export function toCamelCase(s: string): string {
  // Preserve leading underscores for private properties
  if (s.startsWith('_')) {
    const rest = s.slice(1);
    // If the rest is already camelCase (like contentType), keep it as is
    if (rest.includes('_') || rest.includes('-') || rest.includes('.')) {
      const parts = rest.split(/[_\-\.]/);
      return '_' + parts[0].toLowerCase() + parts.slice(1).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join("");
    } else {
      return s; // Keep the original string if it's already in the right format
    }
  }

  const parts = s.split(/[_\-\.]/);
  return parts[0].toLowerCase() + parts.slice(1).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join("");
}

export function toKebab(s: string): string {
  return s.replace(/[_\.]/g, "-").toLowerCase();
}