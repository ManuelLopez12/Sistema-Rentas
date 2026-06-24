import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children }) {
    if (!isOpen) return null;

    return (
        // Fondo oscuro que cubre toda la pantalla - scrolleable
        <div
            onClick={onClose}
            style={{
                position: 'fixed', top: 0, left: 0,
                width: '100%', height: '100%',
                background: 'rgba(0,0,0,0.7)',
                zIndex: 1000,
                overflowY: 'auto',              // <-- permite scroll en la ventana
            }}
        >
            {/* Contenedor interno para asegurar el espacio arriba y abajo sin que colapse el margin */}
            <div style={{
                minHeight: '100%',
                padding: '3rem 1rem',           // Espacio forzado arriba y abajo del modal
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-start'
            }}>
                {/* Caja del modal */}
                <div
                    onClick={e => e.stopPropagation()}
                    className="glass-panel"
                    style={{
                        padding: '2rem',
                        width: '100%',
                        maxWidth: '560px',
                        position: 'relative',
                    }}
                >
                {/* Cabecera: título + botón X */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.15rem', margin: 0 }}>{title}</h2>
                    <button
                        onClick={onClose}
                        style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', color: 'var(--text-muted)', borderRadius: '8px', padding: '0.35rem 0.6rem', lineHeight: 1 }}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Contenido dinámico */}
                {children}
                </div>
            </div>
        </div>
    );
}