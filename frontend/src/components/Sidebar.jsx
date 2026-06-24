import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Package, ShoppingCart, Hexagon } from 'lucide-react';

export default function Sidebar() {
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    const navItemStyle = (path) => ({
        display: 'flex',
        alignItems: 'center',
        gap: '0.8rem',
        padding: '0.8rem 1rem',
        borderRadius: '12px',
        color: isActive(path) ? 'var(--text-main)' : 'var(--text-muted)',
        background: isActive(path) ? 'linear-gradient(90deg, rgba(139,92,246,0.18) 0%, transparent 100%)' : 'transparent',
        borderLeft: isActive(path) ? '3px solid var(--primary)' : '3px solid transparent',
        textDecoration: 'none',
        fontWeight: isActive(path) ? '600' : '500',
        fontSize: '0.95rem',
        transition: 'all 0.2s',
        marginBottom: '0.3rem',
    });

    const menuItems = [
        { path: '/inventario', name: 'Inventario', icon: Package },
        { path: '/rentas', name: 'Rentas', icon: ShoppingCart },
    ];

    return (
        <aside style={{
            width: '240px',
            background: 'var(--bg-sidebar)',
            borderRight: '1px solid var(--border)',
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            position: 'sticky',
            top: 0,
        }}>
            {/* LOGO */}
            <div style={{ padding: '2rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.8rem', borderBottom: '1px solid var(--border)' }}>
                <Hexagon size={30} color="var(--primary)" strokeWidth={1.5} style={{ fill: 'rgba(139,92,246,0.15)' }} />
                <div>
                    <h1 style={{ fontSize: '1.15rem', margin: 0, fontWeight: 'bold', letterSpacing: '1px' }}>
                        RENTA <span style={{ color: 'var(--primary)' }}>PRO</span>
                    </h1>
                    <p style={{ fontSize: '0.62rem', color: 'var(--text-muted)', margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>
                        Sistema de rentas
                    </p>
                </div>
            </div>

            {/* MENÚ */}
            <nav style={{ flex: 1, padding: '1.5rem 1rem' }}>
                <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '0.8rem', paddingLeft: '1rem' }}>
                    Módulos
                </p>
                {menuItems.map((item) => (
                    <Link key={item.path} to={item.path} style={navItemStyle(item.path)}>
                        <item.icon size={20} />
                        <span>{item.name}</span>
                    </Link>
                ))}
            </nav>

            {/* FOOTER */}
            <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                <div style={{
                    width: '38px', height: '38px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                    display: 'flex', justifyContent: 'center', alignItems: 'center',
                    fontWeight: 'bold', fontSize: '0.9rem', flexShrink: 0
                }}>
                    EE
                </div>
                <div>
                    <p style={{ margin: 0, fontSize: '0.88rem', fontWeight: '600' }}>Eventos Elite</p>
                    <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--text-muted)' }}>Administrador</p>
                </div>
            </div>
        </aside>
    );
}
