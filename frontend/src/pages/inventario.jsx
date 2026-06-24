import { useState, useEffect } from 'react';
import axios from 'axios';
import { Package, Plus, Search, Filter, Tag, Layers } from 'lucide-react';
import Modal from '../components/Modal';

// Mapa de colores para que cada categoría tenga su propio color de badge
const CATEGORIA_COLORES = {
    'Mesas': { bg: 'rgba(139,92,246,0.15)', color: '#a78bfa', border: 'rgba(139,92,246,0.3)' },
    'Sillas': { bg: 'rgba(6,182,212,0.15)', color: '#22d3ee', border: 'rgba(6,182,212,0.3)' },
    'Manteles': { bg: 'rgba(16,185,129,0.15)', color: '#34d399', border: 'rgba(16,185,129,0.3)' },
    'Cubremanteles': { bg: 'rgba(245,158,11,0.15)', color: '#fbbf24', border: 'rgba(245,158,11,0.3)' },
    'Moños': { bg: 'rgba(244,63,94,0.15)', color: '#fb7185', border: 'rgba(244,63,94,0.3)' },
    'Cubresillas': { bg: 'rgba(14,165,233,0.15)', color: '#38bdf8', border: 'rgba(14,165,233,0.3)' },
    'Carpas': { bg: 'rgba(168,85,247,0.15)', color: '#c084fc', border: 'rgba(168,85,247,0.3)' },
    'Paredes': { bg: 'rgba(100,116,139,0.15)', color: '#94a3b8', border: 'rgba(100,116,139,0.3)' },
};

export default function Inventario() {
    const [items, setItems] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [filtroCategoria, setFiltroCategoria] = useState('');
    const [modalAbierto, setModalAbierto] = useState(false);
    const [formulario, setFormulario] = useState({
        nombre: '', categoria: '', color: '', cantidad_total: 0, precio_renta: 0
    });

    const cargarItems = () => {
        axios.get('http://127.0.0.1:8000/items/')
            .then(res => setItems(res.data));
    };

    useEffect(() => { cargarItems(); }, []);

    const manejarCambio = (e) => {
        setFormulario({ ...formulario, [e.target.name]: e.target.value });
    };

    const guardarItem = () => {
        axios.post('http://127.0.0.1:8000/items/', {
            ...formulario,
            cantidad_total: parseInt(formulario.cantidad_total),
            precio_renta: parseFloat(formulario.precio_renta)
        }).then(() => {
            setModalAbierto(false);
            cargarItems();
            setFormulario({ nombre: '', categoria: '', color: '', cantidad_total: 0, precio_renta: 0 });
        }).catch(err => alert('Error: ' + (err.response?.data?.detail || 'No se pudo guardar')));
    };

    // Filtrar items según búsqueda y categoría seleccionada
    const itemsFiltrados = items.filter(item => {
        const coincideBusqueda = item.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
            (item.color && item.color.toLowerCase().includes(busqueda.toLowerCase()));
        const coincideCategoria = !filtroCategoria || item.categoria === filtroCategoria;
        return coincideBusqueda && coincideCategoria;
    });

    // Obtener categorías únicas para el filtro
    const categorias = [...new Set(items.map(i => i.categoria))].filter(Boolean);

    // Estadísticas rápidas
    const totalPiezas = items.reduce((sum, i) => sum + i.cantidad_total, 0);

    const inputStyle = {
        width: '100%', padding: '0.75rem', marginBottom: '1rem',
        background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '8px', color: 'var(--text-main)', fontSize: '0.95rem'
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            {/* ── ENCABEZADO CON ESTADÍSTICAS ── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                <div className="premium-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ background: 'rgba(139,92,246,0.1)', padding: '0.9rem', borderRadius: '12px' }}>
                        <Package size={22} color="var(--primary)" />
                    </div>
                    <div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: 0 }}>Productos distintos</p>
                        <h3 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 'bold' }}>{items.length}</h3>
                    </div>
                </div>
                <div className="premium-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ background: 'rgba(6,182,212,0.1)', padding: '0.9rem', borderRadius: '12px' }}>
                        <Layers size={22} color="var(--secondary)" />
                    </div>
                    <div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: 0 }}>Total de piezas</p>
                        <h3 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 'bold' }}>{totalPiezas.toLocaleString()}</h3>
                    </div>
                </div>
                <div className="premium-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ background: 'rgba(16,185,129,0.1)', padding: '0.9rem', borderRadius: '12px' }}>
                        <Tag size={22} color="var(--success)" />
                    </div>
                    <div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: 0 }}>Categorías</p>
                        <h3 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 'bold' }}>{categorias.length}</h3>
                    </div>
                </div>
            </div>

            {/* ── BARRA DE HERRAMIENTAS ── */}
            <div className="premium-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.3rem', margin: 0 }}>
                    <Package size={24} color="var(--primary)" /> Inventario Completo
                </h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', flex: 1, maxWidth: '600px' }}>
                    {/* Buscador */}
                    <div style={{ position: 'relative', flex: 1 }}>
                        <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)' }} />
                        <input
                            type="text"
                            placeholder="Buscar artículo o color..."
                            value={busqueda}
                            onChange={e => setBusqueda(e.target.value)}
                            style={{ ...inputStyle, paddingLeft: '2.5rem', marginBottom: 0 }}
                        />
                    </div>
                    {/* Filtro por categoría */}
                    <div style={{ position: 'relative' }}>
                        <Filter size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)' }} />
                        <select
                            value={filtroCategoria}
                            onChange={e => setFiltroCategoria(e.target.value)}
                            style={{ ...inputStyle, paddingLeft: '2.5rem', marginBottom: 0, minWidth: '160px' }}
                        >
                            <option value="">Todas las categorías</option>
                            {categorias.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                    {/* Botón Nuevo */}
                    <button
                        onClick={() => setModalAbierto(true)}
                        style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '0.7rem 1.2rem', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold', whiteSpace: 'nowrap' }}
                    >
                        <Plus size={18} /> Nuevo Artículo
                    </button>
                </div>
            </div>

            {/* ── CUADRÍCULA DE ARTÍCULOS ── */}
            {itemsFiltrados.length === 0 ? (
                <div className="premium-card" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                    <Package size={48} style={{ margin: '0 auto 1rem auto', opacity: 0.3 }} />
                    <p>No se encontraron artículos.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                    {itemsFiltrados.map(item => {
                        const estilo = CATEGORIA_COLORES[item.categoria] || { bg: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)', border: 'rgba(255,255,255,0.1)' };
                        const disponibilidadPct = Math.min(100, item.cantidad_total);
                        return (
                            <div key={item.id} className="glass-panel" style={{ padding: '1.5rem', cursor: 'default', transition: 'transform 0.2s, border-color 0.2s' }}
                                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.borderColor = estilo.border; }}
                                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'; }}
                            >
                                {/* Badge de categoría + cantidad */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                    <span style={{ background: estilo.bg, color: estilo.color, border: `1px solid ${estilo.border}`, padding: '0.25rem 0.8rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600' }}>
                                        {item.categoria}
                                    </span>
                                    <span style={{ fontSize: '0.8rem', color: item.cantidad_total < 10 ? 'var(--warning)' : 'var(--text-muted)', fontWeight: item.cantidad_total < 10 ? 'bold' : 'normal' }}>
                                        {item.cantidad_total < 10 ? '⚠️' : ''} {item.cantidad_total} pzs
                                    </span>
                                </div>

                                {/* Nombre */}
                                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.3rem', fontWeight: '600' }}>{item.nombre}</h3>

                                {/* Color (si aplica) */}
                                {item.color && (
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                        🎨 {item.color}
                                    </p>
                                )}

                                {/* Barra de stock visual */}
                                <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '4px', height: '4px', marginBottom: '1rem', overflow: 'hidden' }}>
                                    <div style={{ background: estilo.color, height: '100%', width: `${Math.min(100, (item.cantidad_total / 200) * 100)}%`, borderRadius: '4px', transition: 'width 0.5s' }}></div>
                                </div>

                                {/* Precio */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Precio renta</span>
                                    <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: estilo.color }}>
                                        ${parseFloat(item.precio_renta).toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* ── MODAL PARA AGREGAR NUEVO ARTÍCULO ── */}
            <Modal isOpen={modalAbierto} onClose={() => setModalAbierto(false)} title="➕ Nuevo Artículo de Inventario">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                    <div style={{ gridColumn: '1/-1' }}>
                        <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem', display: 'block' }}>Nombre del artículo *</label>
                        <input style={inputStyle} name="nombre" placeholder="Ej. Mesa Rectangular, Silla Plegable..." onChange={manejarCambio} value={formulario.nombre} />
                    </div>
                    <div>
                        <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem', display: 'block' }}>Categoría *</label>
                        <select style={inputStyle} name="categoria" onChange={manejarCambio} value={formulario.categoria}>
                            <option value="">-- Selecciona --</option>
                            <option>Mesas</option>
                            <option>Sillas</option>
                            <option>Manteles</option>
                            <option>Cubremanteles</option>
                            <option>Moños</option>
                            <option>Cubresillas</option>
                            <option>Carpas</option>
                            <option>Paredes</option>
                            <option>Brincolin</option>
                            <option>Otro</option>
                        </select>
                    </div>
                    <div>
                        <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem', display: 'block' }}>Color (opcional)</label>
                        <input style={inputStyle} name="color" placeholder="Ej. Rojo, Dorado..." onChange={manejarCambio} value={formulario.color} />
                    </div>
                    <div>
                        <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem', display: 'block' }}>Cantidad en inventario *</label>
                        <input style={inputStyle} name="cantidad_total" type="number" min="0" placeholder="0" onChange={manejarCambio} value={formulario.cantidad_total} />
                    </div>
                    <div>
                        <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem', display: 'block' }}>Precio de renta ($) *</label>
                        <input style={inputStyle} name="precio_renta" type="number" step="0.50" min="0" placeholder="0.00" onChange={manejarCambio} value={formulario.precio_renta} />
                    </div>
                </div>
                <button
                    onClick={guardarItem}
                    style={{ width: '100%', padding: '0.9rem', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', marginTop: '0.5rem' }}
                >
                    Guardar Artículo ✅
                </button>
            </Modal>
        </div>
    );
}