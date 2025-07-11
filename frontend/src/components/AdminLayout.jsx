import React from 'react';
// We don't need to import AdminDashboard.css here, the classes are applied
// to the elements directly.

function AdminLayout({ children }) {
  return (
    <div className="admin-dashboard">
      <main className="admin-main-content single-pane">
        {children}
      </main>
    </div>
  );
}

export default AdminLayout;