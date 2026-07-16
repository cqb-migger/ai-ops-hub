/**
 * Recomputes the `loginId_<index>` duplicate errors for the whole list.
 *
 * The whole list is rechecked every time rather than just the edited field: entries are keyed
 * by index, so adding or removing a row shifts every key after it, and fixing one half of a
 * duplicate pair has to clear the error on the other half too.
 */
export function withDuplicateLoginIdErrors(
  errors: Record<string, string>,
  loginIds: string[],
  duplicateMessage: string
): Record<string, string> {
  const next: Record<string, string> = {};
  for (const [key, value] of Object.entries(errors)) {
    if (!key.startsWith('loginId_')) next[key] = value;
  }

  const seen = new Set<string>();
  loginIds.forEach((id, index) => {
    const trimmed = id.trim();
    if (!trimmed) return;
    if (seen.has(trimmed)) {
      next[`loginId_${index}`] = duplicateMessage;
    } else {
      seen.add(trimmed);
    }
  });

  return next;
}
