import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../config';
import { Wallet, Calendar, Package, ArrowUpRight, PlusCircle, Box, Users, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
    const [stats, setStats] = useState({ ingresos: 0, rentasActivas: 0, totalItems: 0, rentasFuturas: [], inventario: [] });
    const navigate = useNavigate();

    useEffect(() => {
        Promise.all([
            axios.get(`${API_URL}/rentas/`),
            axios.get(`${API_URL}/items/`)
        ]).then(([rentasRes, itemsRes]) => {
            const rentas = rentasRes.data;
            const items = itemsRes.data;
            const ingresos = rentas.reduce((acc, r) => acc + (r.total || 0), 0);
            const activas = rentas.filter(r => r.estado === 'Pendiente').length;
            const futuras = [...rentas].sort((a, b) => new Date(a.fecha_evento) - new Date(b.fecha_evento)).slice(0, 4);
            const destacados = [...items].sort((a, b) => a.cantidad_total - b.cantidad_total).slice(0, 5);
            setStats({ ingresos, rentasActivas: activas, totalItems: items.length, rentasFuturas: futuras, inventario: destacados });
        });
    }, []);

    const formatCurrency = (amount) => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            {/* ── MÉTRICAS ── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                <div className="premium-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                        <div style={{ background: 'rgba(59,130,246,0.12)', padding: '0.8rem', borderRadius: '12px' }}>
                            <Wallet color="#60a5fa" size={24} />
                        </div>
                        <div>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', margin: 0 }}>Ingresos totales</p>
                            <h3 style={{ fontSize: '1.7rem', margin: 0, fontWeight: 'bold' }}>{formatCurrency(stats.ingresos)}</h3>
                        </div>
                    </div>
                    <p style={{ color: 'var(--success)', fontSize: '0.78rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <ArrowUpRight size={14} /> Suma de todas las rentas
                    </p>
                </div>

                <div className="premium-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                        <div style={{ background: 'rgba(139,92,246,0.12)', padding: '0.8rem', borderRadius: '12px' }}>
                            <Calendar color="var(--primary)" size={24} />
                        </div>
                        <div>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', margin: 0 }}>Rentas pendientes</p>
                            <h3 style={{ fontSize: '1.7rem', margin: 0, fontWeight: 'bold' }}>{stats.rentasActivas}</h3>
                        </div>
                    </div>
                    <p style={{ color: 'var(--warning)', fontSize: '0.78rem', margin: 0 }}>Por entregar o recolectar</p>
                </div>

                <div className="premium-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                        <div style={{ background: 'rgba(16,185,129,0.12)', padding: '0.8rem', borderRadius: '12px' }}>
                            <Package color="var(--success)" size={24} />
                        </div>
                        <div>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', margin: 0 }}>Productos en catálogo</p>
                            <h3 style={{ fontSize: '1.7rem', margin: 0, fontWeight: 'bold' }}>{stats.totalItems}</h3>
                        </div>
                    </div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', margin: 0 }}>Artículos de inventario</p>
                </div>
            </div>

            {/* ── GRID PRINCIPAL ── */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>

                {/* COLUMNA IZQUIERDA */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                    {/* CALENDARIO VISUAL */}
                    <div className="premium-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem', margin: 0 }}>
                                <Calendar size={18} color="var(--primary)" /> Calendario de eventos
                            </h3>
                            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.3rem 0.8rem', borderRadius: '8px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                Junio 2025
                            </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.4rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '0.8rem' }}>
                            {['DOM', 'LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB'].map(d => <div key={d}>{d}</div>)}
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.4rem' }}>
                            {Array.from({ length: 30 }).map((_, i) => {
                                const isToday = i + 1 === 23;
                                const hasEvent = [8, 15, 22, 28].includes(i + 1);
                                return (
                                    <div key={i} style={{
                                        padding: '0.4rem 0.2rem',
                                        borderRadius: '8px',
                                        textAlign: 'center',
                                        fontSize: '0.82rem',
                                        background: isToday ? 'var(--primary)' : 'rgba(255,255,255,0.02)',
                                        border: `1px solid ${isToday ? 'var(--primary)' : hasEvent ? 'rgba(139,92,246,0.3)' : 'rgba(255,255,255,0.04)'}`,
                                        color: isToday ? 'white' : 'var(--text-muted)',
                                        fontWeight: isToday ? 'bold' : 'normal',
                                        boxShadow: isToday ? '0 0 12px rgba(139,92,246,0.4)' : 'none',
                                        position: 'relative'
                                    }}>
                                        {i + 1}
                                        {hasEvent && !isToday && (
                                            <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--primary)', margin: '2px auto 0 auto' }}></div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* ACCIONES RÁPIDAS */}
                    <div>
                        <h4 style={{ marginBottom: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Acciones rápidas</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                            {[
                                { icon: PlusCircle, label: 'Nueva renta', sub: 'Crear folio', to: '/rentas', color: 'var(--primary)', bg: 'rgba(139,92,246,0.1)', border: 'rgba(139,92,246,0.3)' },
                                { icon: Box, label: 'Inventario', sub: 'Agregar artículo', to: '/inventario', color: 'var(--secondary)', bg: 'rgba(6,182,212,0.08)', border: 'rgba(6,182,212,0.2)' },
                                { icon: Users, label: 'Clientes', sub: 'Directorio', to: '/clientes', color: 'var(--success)', bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.2)' },
                                { icon: FileText, label: 'Reportes', sub: 'Pronto', to: '#', color: 'var(--warning)', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)' },
                            ].map(({ icon: Icon, label, sub, to, color, bg, border }, idx) => (
                                <button key={idx} onClick={() => navigate(to)} style={{
                                    padding: '1.2rem 1rem', textAlign: 'center', cursor: 'pointer',
                                    border: `1px solid ${border}`, background: bg,
                                    color: 'white', borderRadius: '12px',
                                    transition: 'all 0.2s', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem'
                                }}
                                    onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
                                    onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                                >
                                    <Icon size={26} color={color} />
                                    <p style={{ fontSize: '0.85rem', margin: 0, fontWeight: '600' }}>{label}</p>
                                    <p style={{ fontSize: '0.7rem', margin: 0, color: 'var(--text-muted)' }}>{sub}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* COLUMNA DERECHA */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                    {/* PRÓXIMAS RENTAS */}
                    <div className="premium-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', alignItems: 'center' }}>
                            <h3 style={{ fontSize: '1rem', margin: 0 }}>Próximas rentas</h3>
                            <span onClick={() => navigate('/rentas')} style={{ fontSize: '0.8rem', color: 'var(--primary)', cursor: 'pointer' }}>Ver todas →</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                            {stats.rentasFuturas.length === 0 ? (
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center', padding: '1rem 0' }}>Sin rentas registradas</p>
                            ) : stats.rentasFuturas.map((r, idx) => (
                                <div key={idx} style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', padding: '0.7rem', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.04)' }}>
                                    <div style={{ textAlign: 'center', minWidth: '40px', background: 'rgba(139,92,246,0.15)', padding: '0.4rem', borderRadius: '8px' }}>
                                        <p style={{ margin: 0, fontSize: '0.65rem', color: 'var(--primary)', fontWeight: 'bold', lineHeight: 1 }}>
                                            {r.fecha_evento ? new Date(r.fecha_evento).toLocaleString('es-MX', { month: 'short' }).toUpperCase() : '---'}
                                        </p>
                                        <h4 style={{ margin: 0, fontSize: '1.2rem', lineHeight: 1, marginTop: '0.2rem' }}>
                                            {r.fecha_evento ? r.fecha_evento.slice(8, 10) : '--'}
                                        </h4>
                                    </div>
                                    <div style={{ flex: 1, overflow: 'hidden' }}>
                                        <p style={{ margin: 0, fontSize: '0.88rem', fontWeight: '600' }}>Folio #{r.id}</p>
                                        <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                                            📍 {r.lugar_evento || 'Sin lugar'}
                                        </p>
                                    </div>
                                    <div style={{ fontSize: '0.72rem', color: 'var(--secondary)', background: 'rgba(6,182,212,0.1)', padding: '0.2rem 0.5rem', borderRadius: '4px', whiteSpace: 'nowrap' }}>
                                        {r.estado}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* INVENTARIO CRÍTICO */}
                    <div className="premium-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', alignItems: 'center' }}>
                            <h3 style={{ fontSize: '1rem', margin: 0 }}>Inventario</h3>
                            <span onClick={() => navigate('/inventario')} style={{ fontSize: '0.8rem', color: 'var(--primary)', cursor: 'pointer' }}>Ver todo →</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
                            {stats.inventario.map((item, idx) => (
                                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.7rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                                    <div style={{ flex: 1, overflow: 'hidden' }}>
                                        <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: '600', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                                            {item.nombre} {item.color ? `· ${item.color}` : ''}
                                        </p>
                                        <p style={{ margin: 0, fontSize: '0.72rem', color: item.cantidad_total < 10 ? 'var(--warning)' : 'var(--success)' }}>
                                            {item.cantidad_total < 10 ? '⚠️ Pocas unidades' : '✓ Disponible'}
                                        </p>
                                    </div>
                                    <div style={{ textAlign: 'right', marginLeft: '0.8rem' }}>
                                        <p style={{ margin: 0, fontSize: '1.05rem', fontWeight: 'bold' }}>{item.cantidad_total}</p>
                                        <p style={{ margin: 0, fontSize: '0.65rem', color: 'var(--text-muted)' }}>pzs</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}