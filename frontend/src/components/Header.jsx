import { Bell, ShoppingCart, Package } from 'lucide-react';
import { useLocation } from 'react-router-dom';

export default function Header() {
    const location = useLocation();
    const pageName = location.pathname === '/rentas' ? 'Rentas' : 'Inventario';
    const pageIcon = location.pathname === '/rentas' ? ShoppingCart : Package;
    const PageIcon = pageIcon;

    return (
        <header style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1.2rem 2.5rem',
            borderBottom: '1px solid var(--border)',
            background: 'var(--bg-sidebar)',
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                <PageIcon size={22} color="var(--primary)" />
                <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '600' }}>{pageName}</h2>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                <div style={{ position: 'relative', cursor: 'pointer' }}>
                    <Bell size={22} color="var(--text-muted)" />
                </div>
                <div style={{
                    width: '36px', height: '36px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                    display: 'flex', justifyContent: 'center', alignItems: 'center',
                    fontWeight: 'bold', fontSize: '0.85rem', cursor: 'pointer'
                }}>
                    EE
                </div>
            </div>
        </header>
    );
}
