export function buildTopicIndex(cards) {
  return cards.flatMap((card) => [
    ...(card.links ?? []).map((link) => ({ ...link, section: card.title })),
    ...(card.groups ?? []).flatMap((group) =>
      group.sections.flatMap((section) =>
        section.links.map((link) => ({
          ...link,
          section: `${card.title} · ${group.name} · ${section.title}`,
        })),
      ),
    ),
  ]);
}

function scoreTopic(topic, words) {
  const label = topic.label.toLowerCase();
  const haystack = `${label} ${topic.section.toLowerCase()}`;
  if (!words.every((word) => haystack.includes(word))) return null;
  return {
    labelHits: words.filter((word) => label.includes(word)).length,
    startsWithQuery: words.some((word) => label.startsWith(word)),
  };
}

function compareResults(a, b) {
  if (a.score.labelHits !== b.score.labelHits) return b.score.labelHits - a.score.labelHits;
  if (a.score.startsWithQuery !== b.score.startsWithQuery) return a.score.startsWithQuery ? -1 : 1;
  return a.topic.label.length - b.topic.label.length;
}

export function searchTopics(index, query, limit = 8) {
  const words = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];

  return index
    .map((topic) => ({ topic, score: scoreTopic(topic, words) }))
    .filter((result) => result.score !== null)
    .sort(compareResults)
    .slice(0, limit)
    .map((result) => result.topic);
}
