import AdminUserManagePage from './AdminUserManagePage';

export default function AdminOwnersPage() {
  return (
    <AdminUserManagePage
      roleFilter="owner"
      title="Owners"
      blurb="Search, edit, suspend, or delete owners. Expand a row to manage listings and wallet."
    />
  );
}
