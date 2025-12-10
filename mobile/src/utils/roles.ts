export enum Roles {
  ADMIN = 1,
  MANAGER = 2,
  ENGINEER = 3,
  OPERATOR = 4,
}

// Optional: if you also want role names for display or mapping
export const RoleNames: Record<Roles, string> = {
  [Roles.ADMIN]: "Admin",
  [Roles.MANAGER]: "Manager",
  [Roles.ENGINEER]: "Engineer",
  [Roles.OPERATOR]: "Operator",
}
