// Role-Based Access Control (RBAC) matrix generator
// This file generates a permission matrix for different user roles

export type Role = 'admin' | 'developer' | 'publisher' | 'advertiser' | 'viewer' | 'team_lead';

export type Resource =
  | 'campaigns'
  | 'wallets'
  | 'payments'
  | 'webhooks'
  | 'integrations'
  | 'api_keys'
  | 'team_members'
  | 'audit_logs'
  | 'settings'
  | 'platforms'
  | 'sdk_generator'
  | 'cli_tool'
  | 'treasury_approvals'
  | 'tax_reports'
  | 'compliance'
  | 'analytics';

export type Action = 'create' | 'read' | 'update' | 'delete' | 'execute' | 'approve';

export interface Permission {
  resource: Resource;
  actions: Action[];
}

export interface RoleDefinition {
  name: Role;
  label: string;
  description: string;
  permissions: Permission[];
}

// ─── Role Definitions ──────────────────────────────────────────────
const ROLE_DEFINITIONS: Record<Role, RoleDefinition> = {
  admin: {
    name: 'admin',
    label: 'Administrator',
    description: 'Full access to all resources including team management and audit logs.',
    permissions: [
      { resource: 'campaigns', actions: ['create', 'read', 'update', 'delete', 'execute'] },
      { resource: 'wallets', actions: ['create', 'read', 'update', 'delete', 'execute'] },
      { resource: 'payments', actions: ['create', 'read', 'update', 'delete', 'execute', 'approve'] },
      { resource: 'webhooks', actions: ['create', 'read', 'update', 'delete', 'execute'] },
      { resource: 'integrations', actions: ['create', 'read', 'update', 'delete', 'execute'] },
      { resource: 'api_keys', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'team_members', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'audit_logs', actions: ['read', 'delete'] },
      { resource: 'settings', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'platforms', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'sdk_generator', actions: ['read', 'execute'] },
      { resource: 'cli_tool', actions: ['read', 'execute'] },
      { resource: 'treasury_approvals', actions: ['read', 'approve', 'execute'] },
      { resource: 'tax_reports', actions: ['read', 'execute'] },
      { resource: 'compliance', actions: ['read', 'execute'] },
      { resource: 'analytics', actions: ['read'] },
    ],
  },

  developer: {
    name: 'developer',
    label: 'Developer',
    description: 'Can manage campaigns, webhooks, and integrations. Read-only access to analytics and audit logs.',
    permissions: [
      { resource: 'campaigns', actions: ['create', 'read', 'update', 'execute'] },
      { resource: 'wallets', actions: ['read'] },
      { resource: 'payments', actions: ['read', 'execute'] },
      { resource: 'webhooks', actions: ['create', 'read', 'update', 'delete', 'execute'] },
      { resource: 'integrations', actions: ['create', 'read', 'update', 'delete', 'execute'] },
      { resource: 'api_keys', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'team_members', actions: ['read'] },
      { resource: 'audit_logs', actions: ['read'] },
      { resource: 'settings', actions: ['read'] },
      { resource: 'platforms', actions: ['read'] },
      { resource: 'sdk_generator', actions: ['read', 'execute'] },
      { resource: 'cli_tool', actions: ['read', 'execute'] },
      { resource: 'treasury_approvals', actions: ['read'] },
      { resource: 'tax_reports', actions: ['read', 'execute'] },
      { resource: 'compliance', actions: ['read', 'execute'] },
      { resource: 'analytics', actions: ['read'] },
    ],
  },

  publisher: {
    name: 'publisher',
    label: 'Publisher',
    description: 'Can manage their own platform inventory, ad slots, and wallet. Read-only analytics.',
    permissions: [
      { resource: 'campaigns', actions: ['read'] },
      { resource: 'wallets', actions: ['read', 'update', 'execute'] },
      { resource: 'payments', actions: ['read', 'execute'] },
      { resource: 'webhooks', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'integrations', actions: ['read', 'update', 'execute'] },
      { resource: 'api_keys', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'team_members', actions: [] },
      { resource: 'audit_logs', actions: ['read'] },
      { resource: 'settings', actions: ['read', 'update'] },
      { resource: 'platforms', actions: ['read', 'update'] },
      { resource: 'sdk_generator', actions: ['read', 'execute'] },
      { resource: 'cli_tool', actions: ['read', 'execute'] },
      { resource: 'treasury_approvals', actions: [] },
      { resource: 'tax_reports', actions: ['read', 'execute'] },
      { resource: 'compliance', actions: ['read'] },
      { resource: 'analytics', actions: ['read'] },
    ],
  },

  advertiser: {
    name: 'advertiser',
    label: 'Advertiser',
    description: 'Can create and manage campaigns, manage wallet, and view their own analytics.',
    permissions: [
      { resource: 'campaigns', actions: ['create', 'read', 'update', 'execute'] },
      { resource: 'wallets', actions: ['create', 'read', 'update', 'execute'] },
      { resource: 'payments', actions: ['create', 'read', 'execute'] },
      { resource: 'webhooks', actions: ['read'] },
      { resource: 'integrations', actions: ['read'] },
      { resource: 'api_keys', actions: ['create', 'read', 'delete'] },
      { resource: 'team_members', actions: [] },
      { resource: 'audit_logs', actions: [] },
      { resource: 'settings', actions: ['read', 'update'] },
      { resource: 'platforms', actions: ['read'] },
      { resource: 'sdk_generator', actions: ['read', 'execute'] },
      { resource: 'cli_tool', actions: ['read', 'execute'] },
      { resource: 'treasury_approvals', actions: [] },
      { resource: 'tax_reports', actions: ['read', 'execute'] },
      { resource: 'compliance', actions: [] },
      { resource: 'analytics', actions: ['read'] },
    ],
  },

  team_lead: {
    name: 'team_lead',
    label: 'Team Lead',
    description: 'Can manage team members and approve treasury operations.',
    permissions: [
      { resource: 'campaigns', actions: ['create', 'read', 'update', 'execute', 'approve'] },
      { resource: 'wallets', actions: ['read', 'execute', 'approve'] },
      { resource: 'payments', actions: ['read', 'execute', 'approve'] },
      { resource: 'webhooks', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'integrations', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'api_keys', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'team_members', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'audit_logs', actions: ['read'] },
      { resource: 'settings', actions: ['read', 'update'] },
      { resource: 'platforms', actions: ['read'] },
      { resource: 'sdk_generator', actions: ['read', 'execute'] },
      { resource: 'cli_tool', actions: ['read', 'execute'] },
      { resource: 'treasury_approvals', actions: ['create', 'read', 'approve', 'execute'] },
      { resource: 'tax_reports', actions: ['read', 'execute', 'approve'] },
      { resource: 'compliance', actions: ['read', 'execute'] },
      { resource: 'analytics', actions: ['read'] },
    ],
  },

  viewer: {
    name: 'viewer',
    label: 'Viewer',
    description: 'Read-only access to campaigns, analytics, and basic resources.',
    permissions: [
      { resource: 'campaigns', actions: ['read'] },
      { resource: 'wallets', actions: ['read'] },
      { resource: 'payments', actions: ['read'] },
      { resource: 'webhooks', actions: ['read'] },
      { resource: 'integrations', actions: ['read'] },
      { resource: 'api_keys', actions: [] },
      { resource: 'team_members', actions: [] },
      { resource: 'audit_logs', actions: [] },
      { resource: 'settings', actions: [] },
      { resource: 'platforms', actions: ['read'] },
      { resource: 'sdk_generator', actions: [] },
      { resource: 'cli_tool', actions: [] },
      { resource: 'treasury_approvals', actions: [] },
      { resource: 'tax_reports', actions: ['read'] },
      { resource: 'compliance', actions: [] },
      { resource: 'analytics', actions: ['read'] },
    ],
  },
};

// ─── Helper Functions ──────────────────────────────────────────────
export function getRole(role: Role): RoleDefinition {
  return ROLE_DEFINITIONS[role];
}

export function getAllRoles(): RoleDefinition[] {
  return Object.values(ROLE_DEFINITIONS);
}

export function can(role: Role, resource: Resource, action: Action): boolean {
  const roleDef = ROLE_DEFINITIONS[role];
  if (!roleDef) return false;

  const permission = roleDef.permissions.find(p => p.resource === resource);
  return permission ? permission.actions.includes(action) : false;
}

export function generateMatrix(): Record<Role, Record<Resource, Action[]>> {
  const matrix: any = {};

  Object.values(ROLE_DEFINITIONS).forEach(role => {
    matrix[role.name] = {};
    Object.values(role.permissions).forEach(perm => {
      matrix[role.name][perm.resource] = perm.actions;
    });
  });

  return matrix;
}
