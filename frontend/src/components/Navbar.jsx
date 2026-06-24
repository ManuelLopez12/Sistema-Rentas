import { Link } from 'react-router-dom';
import { LayoutDashboard, Package, Users, CalendarDays } from 'lucide-react';

export default function Navbar() {
    return (
        <nav className="glass-panel" style={{ padding: '1rem 2rem', margin: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

            {/* El Logotipo de la app */}
            <h2 style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CalendarDays size={28} />
                RentasPro
            </h2>

            {/* Los botones del menú */}
            <div style={{ display: 'flex', gap: '2rem' }}>
                <Link to="/" style={{ color: 'var(--text-main)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '500' }}>
                    <LayoutDashboard size={20} /> Inicio
                </Link>
                <Link to="/inventario" style={{ color: 'var(--text-main)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '500' }}>
                    <Package size={20} /> Inventario
                </Link>
                <Link to="/clientes" style={{ color: 'var(--text-main)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '500' }}>
                    <Users size={20} /> Clientes
                </Link>
                <Link to="/rentas" style={{ color: 'var(--text-main)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '500' }}>
                    <CalendarDays size={20} /> Rentas
                </Link>
            </div>

        </nav>
    );
}