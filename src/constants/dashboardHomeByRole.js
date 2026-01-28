/** Default “home” route inside /dashboard for each role (must match ProtectedRoute rules). */
export const DASHBOARD_HOME_BY_ROLE = {
  1: '/dashboard/manage-users',
  2: '/dashboard/home',
  3: '/dashboard/vet-appointments',
  4: '/dashboard/groomer-appointments',
};

export function dashboardHomePathForRole(roleId) {
  return DASHBOARD_HOME_BY_ROLE[Number(roleId)] || '/dashboard/home';
}
