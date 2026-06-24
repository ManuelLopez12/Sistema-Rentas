import { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, UserPlus, Phone, MapPin, Search, MessageCircle } from 'lucide-react';
import Modal from '../components/Modal';

// Colores para los avatares de clientes (se asignan en ciclo)
const AVATAR_COLORES = [
    'linear-gradient(135deg, #8B5CF6, #6D28D9)',
    'linear-gradient(135deg, #06B6D4, #0284C7)',
    'linear-gradient(135deg, #10B981, #059669)',
    'linear-gradient(135deg, #F59E0B, #D97706)',
    'linear-gradient(135deg, #EC4899, #DB2777)',
    'linear-gradient(135deg, #EF4444, #DC2626)',
];

export default function Clientes() {
    const [clientes, setClientes] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [modalAbierto, setModalAbierto] = useState(false);
    const [formulario, setFormulario] = useState({ nombre: '', telefono: '', direccion: '' });

    const cargarClientes = () => {
        axios.get('http://127.0.0.1:8000/clientes/')
            .then(res => setClientes(res.data));
    };

    useEffect(() => { cargarClientes(); }, []);

    const manejarCambio = (e) => {
        setFormulario({ ...formulario, [e.target.name]: e.target.value });
    };

    const guardarCliente = () => {
        if (!formulario.nombre) return alert('El nombre es obligatorio');
        axios.post('http://127.0.0.1:8000/clientes/', formulario)
            .then(() => {
                setModalAbierto(false);
                cargarClientes();
                setFormulario({ nombre: '', telefono: '', direccion: '' });
            }).catch(err => alert('Error al guardar'));
    };

    const clientesFiltrados = clientes.filter(c =>
        c.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        (c.telefono && c.telefono.includes(busqueda))
    );

    const inputStyle = {
        width: '100%', padding: '0.75rem', marginBottom: '1rem',
        background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '8px', color: 'var(--text-main)', fontSize: '0.95rem'
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            {/* ── BARRA SUPERIOR ── */}
            <div className="premium-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <div>
                    <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.3rem', margin: 0 }}>
                        <Users size={24} color="var(--primary)" /> Directorio de Clientes
                    </h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '0.3rem 0 0 0' }}>
                        {clientes.length} cliente{clientes.length !== 1 ? 's' : ''} registrado{clientes.length !== 1 ? 's' : ''}
                    </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                    {/* Buscador */}
                    <div style={{ position: 'relative' }}>
                        <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)' }} />
                        <input
                            type="text"
                            placeholder="Buscar cliente o teléfono..."
                            value={busqueda}
                            onChange={e => setBusqueda(e.target.value)}
                            style={{ ...inputStyle, paddingLeft: '2.5rem', marginBottom: 0, minWidth: '240px' }}
                        />
                    </div>
                    <button
                        onClick={() => setModalAbierto(true)}
                        style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '0.7rem 1.2rem', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold', whiteSpace: 'nowrap' }}
                    >
                        <UserPlus size={18} /> Nuevo Cliente
                    </button>
                </div>
            </div>

            {/* ── CUADRÍCULA DE CLIENTES ── */}
            {clientesFiltrados.length === 0 ? (
                <div className="premium-card" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                    <Users size={48} style={{ margin: '0 auto 1rem auto', opacity: 0.3 }} />
                    <p>{busqueda ? 'No se encontró ningún cliente con esa búsqueda.' : 'No hay clientes aún. ¡Agrega el primero!'}</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                    {clientesFiltrados.map((cliente, idx) => (
                        <div key={cliente.id} className="glass-panel" style={{ padding: '1.5rem', transition: 'transform 0.2s, border-color 0.2s' }}
                            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.borderColor = 'rgba(139,92,246,0.3)'; }}
                            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'; }}
                        >
                            {/* Avatar + nombre */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                                <div style={{
                                    background: AVATAR_COLORES[idx % AVATAR_COLORES.length],
                                    borderRadius: '50%', width: '50px', height: '50px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontWeight: 'bold', fontSize: '1.3rem', flexShrink: 0,
                                    boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
                                }}>
                                    {cliente.nombre.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '1.05rem', margin: 0, fontWeight: '600' }}>{cliente.nombre}</h3>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.04)', padding: '0.1rem 0.5rem', borderRadius: '4px' }}>
                                        Cliente #{cliente.id}
                                    </span>
                                </div>
                            </div>

                            {/* Divider */}
                            <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', marginBottom: '1rem' }}></div>

                            {/* Datos de contacto */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                                <p style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.9rem', margin: 0 }}>
                                    <Phone size={15} color="var(--secondary)" />
                                    {cliente.telefono || 'Sin teléfono'}
                                </p>
                                {cliente.direccion && (
                                    <p style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.9rem', margin: 0 }}>
                                        <MapPin size={15} color="var(--primary)" />
                                        {cliente.direccion}
                                    </p>
                                )}
                            </div>

                            {/* Botón WhatsApp */}
                            {cliente.telefono && (
                                <a
                                    href={`https://wa.me/52${cliente.telefono.replace(/\D/g, '')}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    style={{
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                                        marginTop: '1rem', padding: '0.6rem', borderRadius: '8px',
                                        background: 'rgba(37,211,102,0.1)', border: '1px solid rgba(37,211,102,0.25)',
                                        color: '#25d366', textDecoration: 'none', fontSize: '0.85rem', fontWeight: '600'
                                    }}
                                >
                                    <MessageCircle size={16} /> Contactar por WhatsApp
                                </a>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* ── MODAL NUEVO CLIENTE ── */}
            <Modal isOpen={modalAbierto} onClose={() => setModalAbierto(false)} title="👤 Registrar Nuevo Cliente">
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem', display: 'block' }}>Nombre completo *</label>
                <input style={inputStyle} name="nombre" placeholder="Ej. María González" value={formulario.nombre} onChange={manejarCambio} />

                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem', display: 'block' }}>Teléfono / WhatsApp</label>
                <input style={inputStyle} name="telefono" placeholder="Ej. 3311223344" value={formulario.telefono} onChange={manejarCambio} />

                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem', display: 'block' }}>Dirección (opcional)</label>
                <input style={inputStyle} name="direccion" placeholder="Ej. Calle Morelos #123, Col. Centro" value={formulario.direccion} onChange={manejarCambio} />

                <button
                    onClick={guardarCliente}
                    style={{ width: '100%', padding: '0.9rem', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' }}
                >
                    Guardar Cliente ✅
                </button>
            </Modal>
        </div>
    );
}