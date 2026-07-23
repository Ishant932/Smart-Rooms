import AdminUserManagePage from './AdminUserManagePage';

export default function AdminTenantsPage() {
  return (
    <AdminUserManagePage
      roleFilter="tenant"
      title="Tenants"
      blurb="Search, edit, suspend, or delete tenants. Adjust wallets and view profiles."
    />
  );
}
