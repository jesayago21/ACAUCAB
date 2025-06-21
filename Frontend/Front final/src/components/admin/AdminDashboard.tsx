/** Dashboard administrativo principal */
import React from 'react';
import AdminDashboardMain from './AdminDashboardMain';
import type { Usuario } from '../../types/auth';

interface AdminDashboardProps {
  usuario: Usuario;
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ usuario, onLogout }) => {
  return (
    <AdminDashboardMain usuario={usuario} onLogout={onLogout} />
  );
};

export default AdminDashboard; 