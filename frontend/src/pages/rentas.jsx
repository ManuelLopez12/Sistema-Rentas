import { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../config';
import { ClipboardList, Plus, Trash2, Printer, Box, Layers, AlertTriangle, Calendar } from 'lucide-react';
import Modal from '../components/Modal';

// Importamos las librerías para crear el PDF
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default function Rentas() {
    const [rentas, setRentas] = useState([]);
    const [items, setItems] = useState([]);

    // Control de Modales
    const [modalPrincipalAbierto, setModalPrincipalAbierto] = useState(false);
    const [modalJuegoAbierto, setModalJuegoAbierto] = useState(false);
    const [modalSueltoAbierto, setModalSueltoAbierto] = useState(false);

    // Datos generales de la renta
    const [formulario, setFormulario] = useState({
        nombre_cliente: '', telefono_cliente: '', lugar_evento: '', fecha_evento: '', fecha_entrega: '', fecha_recoleccion: '', estado: 'Pendiente',
    });

    // El "Carrito de Compras" (lista atómica de artículos que se van a rentar)
    const [detallesCarrito, setDetallesCarrito] = useState([]);

    // Estados para el asistente "Agregar Juego de Mesa"
    const [juegoForm, setJuegoForm] = useState({
        cantidadJuegos: 1,
        mesa_id: '',
        silla_id: '',
        mantel_id: '',
        cubremantel_id: '',
        cubresilla_id: '', // opcional
        mono_id: '', // opcional
        cantidadMonosPorMesa: 10 // Puede ser 5 o 10
    });

    // Estados para el asistente "Agregar Artículo Suelto"
    const [sueltoForm, setSueltoForm] = useState({
        item_id: '', cantidad: 1
    });

    const cargarDatos = () => {
        Promise.all([
            axios.get(`${API_URL}/rentas/`),
            axios.get(`${API_URL}/items/`),
        ]).then(([rentasRes, itemsRes]) => {
            // Ordenamos rentas por fecha de evento más próxima
            const rentasOrdenadas = rentasRes.data.sort((a, b) => new Date(a.fecha_evento) - new Date(b.fecha_evento));
            setRentas(rentasOrdenadas);
            setItems(itemsRes.data);
        });
    };

    useEffect(() => { cargarDatos(); }, []);

    const manejarCambioFormulario = (e) => {
        setFormulario({ ...formulario, [e.target.name]: e.target.value });
    };

    // --- LÓGICA DEL CARRITO ---

    const buscarItem = (id) => items.find(i => i.id === parseInt(id));

    const procesarJuegoDeMesa = () => {
        const nuevosArticulos = [];
        const cant = parseInt(juegoForm.cantidadJuegos) || 1;

        if (!juegoForm.mesa_id || !juegoForm.silla_id || !juegoForm.mantel_id || !juegoForm.cubremantel_id) {
            alert("Por favor selecciona los 4 elementos básicos: Mesa, Silla, Mantel y Cubremantel.");
            return;
        }

        // PRECIOS DE PAQUETE: Para que el juego completo cueste exactamente $110
        // Mesa (30) + 10 Sillas (5 c/u = 50) + Mantel (15) + Cubremantel (15) = 110

        // 1. Agregar las Mesas (1 por juego)
        const mesa = buscarItem(juegoForm.mesa_id);
        nuevosArticulos.push({ item_id: mesa.id, nombre: `[Juego] ${mesa.nombre}`, cantidad: cant * 1, precio_unitario: 30 });

        // 2. Agregar las Sillas (10 por juego)
        const silla = buscarItem(juegoForm.silla_id);
        nuevosArticulos.push({ item_id: silla.id, nombre: `[Juego] ${silla.nombre}`, cantidad: cant * 10, precio_unitario: 5 });

        // 3. Agregar los Manteles (1 por juego)
        const mantel = buscarItem(juegoForm.mantel_id);
        nuevosArticulos.push({ item_id: mantel.id, nombre: `[Juego] ${mantel.nombre}`, cantidad: cant * 1, precio_unitario: 15 });

        // 4. Agregar los Cubremanteles (1 por juego)
        const cubremantel = buscarItem(juegoForm.cubremantel_id);
        nuevosArticulos.push({ item_id: cubremantel.id, nombre: `[Juego] ${cubremantel.nombre}`, cantidad: cant * 1, precio_unitario: 15 });

        // 5. Agregar Cubresillas (Opcional, 10 por juego)
        if (juegoForm.cubresilla_id) {
            const cubresilla = buscarItem(juegoForm.cubresilla_id);
            // Precio paquete: 10
            nuevosArticulos.push({ item_id: cubresilla.id, nombre: `[Juego] ${cubresilla.nombre}`, cantidad: cant * 10, precio_unitario: 10 });
        }

        // 6. Agregar Moños (Opcional, 5 o 10 por juego)
        if (juegoForm.mono_id) {
            const mono = buscarItem(juegoForm.mono_id);
            const monosTotales = cant * parseInt(juegoForm.cantidadMonosPorMesa);
            // Precio paquete: 5
            nuevosArticulos.push({ item_id: mono.id, nombre: `[Juego] ${mono.nombre}`, cantidad: monosTotales, precio_unitario: 5 });
        }

        setDetallesCarrito([...detallesCarrito, ...nuevosArticulos]);
        setModalJuegoAbierto(false);
        setJuegoForm({ cantidadJuegos: 1, mesa_id: '', silla_id: '', mantel_id: '', cubremantel_id: '', cubresilla_id: '', mono_id: '', cantidadMonosPorMesa: 10 });
    };

    const procesarArticuloSuelto = () => {
        if (!sueltoForm.item_id || !sueltoForm.cantidad) return;
        
        const item = buscarItem(sueltoForm.item_id);
        setDetallesCarrito([...detallesCarrito, { 
            item_id: item.id, 
            nombre: item.nombre, 
            cantidad: parseInt(sueltoForm.cantidad), 
            precio_unitario: item.precio_renta 
        }]);

        setModalSueltoAbierto(false);
        setSueltoForm({ item_id: '', cantidad: 1 });
    };

    const quitarDelCarrito = (index) => {
        setDetallesCarrito(detallesCarrito.filter((_, i) => i !== index));
    };

    const guardarRenta = () => {
        if (!formulario.nombre_cliente) {
            alert("El nombre del cliente es obligatorio.");
            return;
        }
        if (detallesCarrito.length === 0) {
            alert("No has agregado ningún artículo a la renta.");
            return;
        }

        const payload = {
            ...formulario,
            detalles: detallesCarrito.map(d => ({
                item_id: d.item_id,
                cantidad: d.cantidad,
                precio_unitario: d.precio_unitario // Enviamos el precio calculado (sea suelto o de paquete)
            })),
        };

        axios.post(`${API_URL}/rentas/`, payload)
            .then(() => {
                setModalPrincipalAbierto(false);
                cargarDatos();
                setFormulario({ nombre_cliente: '', telefono_cliente: '', lugar_evento: '', fecha_evento: '', fecha_entrega: '', fecha_recoleccion: '', estado: 'Pendiente' });
                setDetallesCarrito([]);
            })
            .catch(err => alert('Error: ' + err.response?.data?.detail));
    };

    const marcarDevuelto = (rentaId) => {
        axios.put(`${API_URL}/rentas/${rentaId}/devolver`)
            .then(() => cargarDatos())
            .catch(err => alert('Error al devolver: ' + err.response?.data?.detail));
    };

    // --- LÓGICA PARA GENERAR TICKET EN PDF ---
    const imprimirTicket = (renta) => {
        const nombreCliente = renta.nombre_cliente || 'Cliente Especial';
        const telefonoCliente = renta.telefono_cliente || 'N/A';
        const lugar = renta.lugar_evento || 'No especificado';

        const doc = new jsPDF();

        // Título
        doc.setFontSize(22);
        doc.setTextColor(59, 130, 246);
        doc.text("SISTEMA DE RENTAS", 105, 20, null, null, "center");
        
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text("Ticket de Renta - Folio #" + renta.id, 105, 28, null, null, "center");

        // Datos del Evento y Cliente
        doc.setFontSize(12);
        doc.setTextColor(40);
        doc.text(`Cliente: ${nombreCliente}`, 14, 45);
        doc.text(`Teléfono: ${telefonoCliente}`, 14, 52);
        doc.text(`Lugar: ${lugar}`, 14, 59);
        
        doc.text(`Evento: ${renta.fecha_evento}`, 120, 45);
        doc.text(`Entrega: ${renta.fecha_entrega}`, 120, 52);
        doc.text(`Recolecta: ${renta.fecha_recoleccion}`, 120, 59);

        // Línea divisoria
        doc.line(14, 65, 196, 65);

        // Tabla
        const tableColumn = ["Cant.", "Artículo", "Precio Unitario", "Subtotal"];
        const tableRows = [];

        renta.detalles.forEach(detalle => {
            const subtotal = detalle.cantidad * detalle.precio_unitario;
            tableRows.push([
                detalle.cantidad,
                detalle.item_nombre,
                `$${detalle.precio_unitario.toFixed(2)}`,
                `$${subtotal.toFixed(2)}`
            ]);
        });

        doc.autoTable({
            startY: 70,
            head: [tableColumn],
            body: tableRows,
            theme: 'striped',
            headStyles: { fillColor: [59, 130, 246] },
            margin: { top: 10 }
        });

        const finalY = doc.lastAutoTable.finalY || 65;
        
        doc.setFontSize(16);
        doc.setTextColor(16, 185, 129);
        doc.text(`Total a Pagar: $${renta.total.toFixed(2)}`, 140, finalY + 15);

        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text("__________________________________", 105, finalY + 45, null, null, "center");
        doc.text("Firma de Conformidad", 105, finalY + 52, null, null, "center");
        doc.text("El mobiliario debe entregarse en las mismas condiciones en las que se recibió.", 105, finalY + 60, null, null, "center");

        doc.save(`Ticket_Renta_Folio_${renta.id}.pdf`);
    };

    // Estilos compartidos
    const inputStyle = { width: '100%', padding: '0.75rem', marginBottom: '0.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-main)', fontSize: '0.9rem' };

    // --- CÁLCULO DE NOTIFICACIONES ---
    const hoy = new Date();
    hoy.setHours(0,0,0,0);
    
    // Contar rentas que son en los próximos 3 días
    const rentasProximas = rentas.filter(r => {
        if(r.estado !== 'Pendiente' || !r.fecha_evento) return false;
        const fechaEvento = new Date(r.fecha_evento);
        const diffDias = Math.ceil((fechaEvento - hoy) / (1000 * 60 * 60 * 24));
        return diffDias >= 0 && diffDias <= 3;
    });

    // Agrupar rentas por fecha para mostrar contador si hay múltiples el mismo día
    const conteoPorFecha = {};
    rentas.forEach(r => {
        if(r.fecha_evento) {
            conteoPorFecha[r.fecha_evento] = (conteoPorFecha[r.fecha_evento] || 0) + 1;
        }
    });

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* ── BANNER DE NOTIFICACIONES ── */}
            {rentasProximas.length > 0 && (
                <div style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.2), rgba(245,158,11,0.05))', borderLeft: '4px solid #f59e0b', padding: '1rem 1.5rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ background: 'rgba(245,158,11,0.2)', padding: '0.6rem', borderRadius: '50%' }}>
                        <AlertTriangle color="#f59e0b" size={24} />
                    </div>
                    <div>
                        <h4 style={{ margin: 0, color: '#f59e0b', fontSize: '1rem', fontWeight: 'bold' }}>¡Atención! Tienes {rentasProximas.length} evento(s) en los próximos 3 días.</h4>
                        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.2rem' }}>Revisa el inventario y la logística de entrega para estas fechas.</p>
                    </div>
                </div>
            )}

            <div className="premium-card">
                {/* Encabezado Principal */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <ClipboardList size={32} color="var(--primary)" /> Historial de Rentas
                    </h1>
                    <button
                        onClick={() => setModalPrincipalAbierto(true)}
                        style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '0.8rem 1.5rem', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold' }}>
                        <Plus size={20} /> Crear Nueva Renta
                    </button>
                </div>

                {/* Lista de rentas */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {rentas.map(renta => {
                        const rentasMismoDia = conteoPorFecha[renta.fecha_evento] || 1;
                        
                        return (
                            <div key={renta.id} className="glass-panel" style={{ padding: '1.5rem', borderLeft: renta.estado === 'Pendiente' ? '4px solid var(--primary)' : '4px solid var(--success)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                                    <div>
                                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                                            Folio #{renta.id} - {renta.nombre_cliente || 'Cliente no registrado'}
                                        </h3>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                            📍 {renta.lugar_evento || 'Lugar no especificado'} 
                                            {renta.telefono_cliente && ` | 📞 ${renta.telefono_cliente}`}
                                        </p>
                                        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.6rem' }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem', color: 'var(--primary)', background: 'rgba(139,92,246,0.1)', padding: '0.2rem 0.6rem', borderRadius: '6px' }}>
                                                <Calendar size={14} /> Evento: {renta.fecha_evento}
                                            </span>
                                            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>🚚 Entrega: {renta.fecha_entrega}</span>
                                        </div>
                                        
                                        {/* Indicador de múltiples rentas el mismo día */}
                                        {rentasMismoDia > 1 && (
                                            <div style={{ marginTop: '0.8rem', fontSize: '0.75rem', color: '#06b6d4', fontWeight: 'bold', display: 'inline-block', background: 'rgba(6,182,212,0.1)', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>
                                                ¡Ojo! Tienes {rentasMismoDia} eventos agendados para este mismo día.
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexDirection: 'column', alignItems: 'flex-end' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <span style={{
                                                padding: '0.3rem 1rem', borderRadius: '20px', fontWeight: 'bold', fontSize: '0.85rem',
                                                background: renta.estado === 'Pendiente' ? 'rgba(245,158,11,0.2)' : 'rgba(16,185,129,0.2)',
                                                color: renta.estado === 'Pendiente' ? '#f59e0b' : '#10b981',
                                            }}>
                                                {renta.estado}
                                            </span>
                                            <h2 style={{ color: 'var(--primary-hover)', margin: 0 }}>${renta.total.toFixed(2)}</h2>
                                        </div>
                                        
                                        <button 
                                            onClick={() => imprimirTicket(renta)}
                                            style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid var(--border)', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 'bold' }}>
                                            <Printer size={16} /> Imprimir Ticket PDF
                                        </button>
                                    </div>
                                </div>

                                <div style={{ marginTop: '1.2rem', paddingTop: '1.2rem', borderTop: '1px solid var(--border)', display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                        {renta.detalles.map(d => (
                                            <span key={d.id} style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', padding: '0.3rem 0.8rem', borderRadius: '6px', fontSize: '0.8rem', color: 'var(--text-main)' }}>
                                                <strong>{d.cantidad}x</strong> {d.item_nombre}
                                            </span>
                                        ))}
                                    </div>
                                    {renta.estado === 'Pendiente' && (
                                        <button
                                            onClick={() => marcarDevuelto(renta.id)}
                                            style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981', border: '1px solid #10b981', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85rem' }}>
                                            Marcar Devuelto ✅
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* ============================================================== */}
            {/* MODAL PRINCIPAL: PUNTO DE VENTA INTELIGENTE */}
            {/* ============================================================== */}
            <Modal isOpen={modalPrincipalAbierto} onClose={() => setModalPrincipalAbierto(false)} title="🎉 Creador de Renta Rápido">
                
                {/* Datos del Cliente directos en la renta */}
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', marginBottom: '0.5rem' }}>
                    <div>
                        <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Nombre del Cliente *</label>
                        <input style={inputStyle} type="text" name="nombre_cliente" placeholder="Ej. María González" onChange={manejarCambioFormulario} value={formulario.nombre_cliente} />
                    </div>
                    <div>
                        <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Teléfono / WhatsApp</label>
                        <input style={inputStyle} type="text" name="telefono_cliente" placeholder="Opcional" onChange={manejarCambioFormulario} value={formulario.telefono_cliente} />
                    </div>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Lugar del Evento / Dirección de entrega</label>
                    <input style={inputStyle} type="text" name="lugar_evento" placeholder="Ej. Salón Los Arcángeles / Calle Morelos #123" onChange={manejarCambioFormulario} value={formulario.lugar_evento} />
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ flex: 1 }}>
                        <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Fecha Evento</label>
                        <input style={inputStyle} type="date" name="fecha_evento" onChange={manejarCambioFormulario} value={formulario.fecha_evento} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Entrega</label>
                        <input style={inputStyle} type="date" name="fecha_entrega" onChange={manejarCambioFormulario} value={formulario.fecha_entrega} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Recolección</label>
                        <input style={inputStyle} type="date" name="fecha_recoleccion" onChange={manejarCambioFormulario} value={formulario.fecha_recoleccion} />
                    </div>
                </div>

                <div style={{ margin: '1.5rem 0', padding: '1.5rem', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                    <h3 style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', marginTop: 0 }}>
                        <span>🛒 Carrito de Renta</span>
                        <span style={{ fontSize: '1.2rem', color: 'var(--primary-hover)', fontWeight: 'bold' }}>
                            Total: ${detallesCarrito.reduce((suma, d) => suma + (d.cantidad * d.precio_unitario), 0).toFixed(2)}
                        </span>
                    </h3>
                    
                    {/* Botones Mágicos */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                        <button 
                            onClick={() => setModalJuegoAbierto(true)}
                            style={{ 
                                padding: '1.2rem 1rem', 
                                background: 'linear-gradient(135deg, rgba(59,130,246,0.1) 0%, rgba(59,130,246,0.2) 100%)', 
                                border: '1px solid rgba(59,130,246,0.4)', 
                                color: '#60a5fa', 
                                borderRadius: '12px', 
                                cursor: 'pointer', 
                                display: 'flex', 
                                flexDirection: 'column',
                                justifyContent: 'center', 
                                alignItems: 'center', 
                                gap: '0.5rem', 
                                fontWeight: 'bold',
                                transition: 'all 0.2s'
                            }}>
                            <Layers size={28} /> 
                            <span style={{fontSize: '1rem'}}>+ Agregar Juego Completo</span>
                            <span style={{fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'normal'}}>Mesa, Sillas y Manteles</span>
                        </button>
                        <button 
                            onClick={() => setModalSueltoAbierto(true)}
                            style={{ 
                                padding: '1.2rem 1rem', 
                                background: 'linear-gradient(135deg, rgba(16,185,129,0.1) 0%, rgba(16,185,129,0.2) 100%)', 
                                border: '1px solid rgba(16,185,129,0.4)', 
                                color: '#34d399', 
                                borderRadius: '12px', 
                                cursor: 'pointer', 
                                display: 'flex', 
                                flexDirection: 'column',
                                justifyContent: 'center', 
                                alignItems: 'center', 
                                gap: '0.5rem', 
                                fontWeight: 'bold',
                                transition: 'all 0.2s'
                            }}>
                            <Box size={28} /> 
                            <span style={{fontSize: '1rem'}}>+ Agregar Piezas Sueltas</span>
                            <span style={{fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'normal'}}>Carpas, Paredes, Extras</span>
                        </button>
                    </div>

                    {/* Lista de cosas en el carrito */}
                    {detallesCarrito.length === 0 ? (
                        <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem 0', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                            <Box size={32} style={{ opacity: 0.2, margin: '0 auto 0.5rem auto' }} />
                            <p style={{ margin: 0, fontSize: '0.9rem' }}>El carrito está vacío. Agrega juegos o artículos.</p>
                        </div>
                    ) : (
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {detallesCarrito.map((d, index) => (
                                <li key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.05)', padding: '0.6rem 1rem', borderRadius: '8px', fontSize: '0.9rem' }}>
                                    <span><strong>{d.cantidad}x</strong> {d.nombre}</span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                        <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>${(d.cantidad * d.precio_unitario).toFixed(2)}</span>
                                        <button onClick={() => quitarDelCarrito(index)} style={{ background: 'rgba(239,68,68,0.1)', border: 'none', color: '#ef4444', padding: '0.4rem', borderRadius: '6px', cursor: 'pointer', display: 'flex' }}>
                                            <Trash2 size={16}/>
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <button
                    onClick={guardarRenta}
                    style={{ width: '100%', padding: '1rem', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.1rem' }}>
                    Guardar Renta y Generar Folio ✅
                </button>
            </Modal>

            {/* ============================================================== */}
            {/* SUB-MODAL: ASISTENTE DE JUEGO DE MESA */}
            {/* ============================================================== */}
            <Modal isOpen={modalJuegoAbierto} onClose={() => setModalJuegoAbierto(false)} title="✨ Configurar Juego de Mesa">
                <div style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
                    <p style={{ fontSize: '0.85rem', color: '#60a5fa', margin: 0 }}>
                        💡 <strong>Nota:</strong> El sistema multiplicará automáticamente x10 las sillas y x1 las mesas por cada juego que agregues.
                    </p>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px' }}>
                    <label style={{ flex: 1, fontWeight: 'bold', fontSize: '1.1rem' }}>¿Cuántos Juegos armamos?</label>
                    <input type="number" min="1" style={{ ...inputStyle, flex: 0.5, marginBottom: 0, fontSize: '1.2rem', textAlign: 'center', background: 'var(--bg-dark)' }} 
                        value={juegoForm.cantidadJuegos} 
                        onChange={e => setJuegoForm({...juegoForm, cantidadJuegos: e.target.value})} 
                    />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                        <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.3rem', display: 'block' }}>🪑 Tipo de Mesa (1 por juego)</label>
                        <select style={inputStyle} value={juegoForm.mesa_id} onChange={e => setJuegoForm({...juegoForm, mesa_id: e.target.value})}>
                            <option value="">-- Selecciona --</option>
                            {items.filter(i => i.categoria === 'Mesas').map(i => <option key={i.id} value={i.id}>{i.nombre} (Disp: {i.cantidad_total})</option>)}
                        </select>
                    </div>
                    <div>
                        <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.3rem', display: 'block' }}>🪑 Sillas a usar (10 por juego)</label>
                        <select style={inputStyle} value={juegoForm.silla_id} onChange={e => setJuegoForm({...juegoForm, silla_id: e.target.value})}>
                            <option value="">-- Selecciona --</option>
                            {items.filter(i => i.categoria === 'Sillas').map(i => <option key={i.id} value={i.id}>{i.nombre} (Disp: {i.cantidad_total})</option>)}
                        </select>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '0.5rem' }}>
                    <div>
                        <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.3rem', display: 'block' }}>⬜ Mantel Base (1 por juego)</label>
                        <select style={inputStyle} value={juegoForm.mantel_id} onChange={e => setJuegoForm({...juegoForm, mantel_id: e.target.value})}>
                            <option value="">-- Selecciona --</option>
                            {items.filter(i => i.categoria === 'Manteles').map(i => <option key={i.id} value={i.id}>{i.nombre} (Disp: {i.cantidad_total})</option>)}
                        </select>
                    </div>
                    <div>
                        <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.3rem', display: 'block' }}>🎨 Cubremantel (1 por juego)</label>
                        <select style={inputStyle} value={juegoForm.cubremantel_id} onChange={e => setJuegoForm({...juegoForm, cubremantel_id: e.target.value})}>
                            <option value="">-- Selecciona el color --</option>
                            {items.filter(i => i.categoria === 'Cubremanteles').map(i => <option key={i.id} value={i.id}>{i.color} - {i.nombre} (Disp: {i.cantidad_total})</option>)}
                        </select>
                    </div>
                </div>

                <div style={{ margin: '1.5rem 0', borderTop: '1px dashed var(--border)' }}></div>
                
                <p style={{ fontSize: '1rem', color: 'var(--primary)', marginBottom: '1rem', fontWeight: 'bold' }}>⭐ Adicionales (Opcional):</p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                        <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.3rem', display: 'block' }}>👻 Cubresillas (10 por juego)</label>
                        <select style={inputStyle} value={juegoForm.cubresilla_id} onChange={e => setJuegoForm({...juegoForm, cubresilla_id: e.target.value})}>
                            <option value="">-- Sin Cubresillas --</option>
                            {items.filter(i => i.categoria === 'Cubresillas').map(i => <option key={i.id} value={i.id}>{i.nombre} (Disp: {i.cantidad_total})</option>)}
                        </select>
                    </div>
                    <div>
                        <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.3rem', display: 'block' }}>🎀 Moños (Color y Cantidad)</label>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <select style={{ ...inputStyle, flex: 2 }} value={juegoForm.mono_id} onChange={e => setJuegoForm({...juegoForm, mono_id: e.target.value})}>
                                <option value="">-- Sin Moños --</option>
                                {items.filter(i => i.categoria === 'Moños').map(i => <option key={i.id} value={i.id}>{i.color} (Disp: {i.cantidad_total})</option>)}
                            </select>
                            <select style={{ ...inputStyle, flex: 1, padding: '0.5rem' }} value={juegoForm.cantidadMonosPorMesa} onChange={e => setJuegoForm({...juegoForm, cantidadMonosPorMesa: e.target.value})}>
                                <option value="10">10 x Juego</option>
                                <option value="5">5 x Juego</option>
                            </select>
                        </div>
                    </div>
                </div>

                <button onClick={procesarJuegoDeMesa} style={{ width: '100%', padding: '1rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', marginTop: '1.5rem', fontSize: '1.1rem' }}>
                    Agregar al Carrito 🛒
                </button>
            </Modal>

            {/* ============================================================== */}
            {/* SUB-MODAL: AGREGAR SUELTO (Carpas, Sillas Extra, Paredes) */}
            {/* ============================================================== */}
            <Modal isOpen={modalSueltoAbierto} onClose={() => setModalSueltoAbierto(false)} title="📦 Agregar Artículo Suelto">
                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'block', fontWeight: 'bold' }}>Busca y selecciona el artículo:</label>
                    <select style={{...inputStyle, height: 'auto', padding: '1rem'}} value={sueltoForm.item_id} onChange={e => setSueltoForm({...sueltoForm, item_id: e.target.value})}>
                        <option value="">-- Despliega para ver todo el inventario --</option>
                        {items.map(i => <option key={i.id} value={i.id}>[{i.categoria}] {i.nombre} {i.color ? `- ${i.color}` : ''} (Disp: {i.cantidad_total})</option>)}
                    </select>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'block', fontWeight: 'bold' }}>¿Cuántas piezas necesitas?</label>
                    <input type="number" min="1" style={{...inputStyle, fontSize: '1.2rem', textAlign: 'center'}} value={sueltoForm.cantidad} onChange={e => setSueltoForm({...sueltoForm, cantidad: e.target.value})} />
                </div>

                <button onClick={procesarArticuloSuelto} style={{ width: '100%', padding: '1rem', background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.1rem' }}>
                    Agregar al Carrito 🛒
                </button>
            </Modal>

        </div>
    );
}