export const statuses = ['pending', 'success', 'error'] as const;

export type Status = (typeof statuses)[number];
