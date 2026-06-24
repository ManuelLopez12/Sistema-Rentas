import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Inventario from './pages/Inventario';
import Rentas from './pages/rentas';

function App() {
  return (
    <BrowserRouter>
      <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', minHeight: '100vh', background: 'var(--bg-app)' }}>
        {/* Panel lateral */}
        <Sidebar />

        {/* Área de contenido */}
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflowY: 'auto' }}>
          <Header />
          <main style={{ padding: '0 2.5rem 2.5rem 2.5rem', flex: 1 }}>
            <Routes>
              {/* Redirigir la raíz al inventario */}
              <Route path="/" element={<Navigate to="/inventario" replace />} />
              <Route path="/inventario" element={<Inventario />} />
              <Route path="/rentas" element={<Rentas />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;