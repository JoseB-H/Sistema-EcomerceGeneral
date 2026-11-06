// Grouping follows API order; it implies no ranking or personal history.
export function deriveHomeSections(works) {
  return {
    featured: works[0] ?? null,
    discovery: works.slice(1, 4),
    selection: works.slice(4),
    categories: [...new Set(works.flatMap(work => work.genres))],
  };
}
