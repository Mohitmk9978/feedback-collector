/** Shared option lists for forms and filters */

export const CATEGORIES = [
  { value: 'bug', label: 'Bug' },
  { value: 'suggestion', label: 'Suggestion' },
  { value: 'improvement', label: 'Improvement' },
  { value: 'general', label: 'General' },
  { value: 'other', label: 'Other' },
];

export const PRIORITIES = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'critical', label: 'Critical' },
];

export const STATUSES = [
  { value: 'pending', label: 'Pending' },
  { value: 'in_review', label: 'In Review' },
  { value: 'resolved', label: 'Resolved' },
];

export function labelFor(list, value) {
  return list.find((x) => x.value === value)?.label ?? value;
}
