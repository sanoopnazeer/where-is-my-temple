import type { Access } from 'payload'

/**
 * V1 has a single admin user model with no roles (see CLAUDE.md §6/§11).
 * Any authenticated Payload user is treated as an admin.
 */
export const isAdmin: Access = ({ req: { user } }) => {
  return Boolean(user)
}
