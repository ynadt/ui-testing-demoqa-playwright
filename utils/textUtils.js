export function normalizeLabeledText(text, labelPattern) {
  if (!text) return '';
  return text
    .replace(new RegExp(`^(${labelPattern})\\s*:`, 'i'), '')
    .trim();
}
