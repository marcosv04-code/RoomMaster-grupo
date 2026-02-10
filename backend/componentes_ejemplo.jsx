/**
 * ================================================
 * COMPONENTES REACT EJEMPLO - CONECTADOS AL BACKEND
 * Copya y adapta estos ejemplos en tus componentes
 * ================================================
 */

// ================================================
// 1. COMPONENTE: LOGIN PAGE
// ================================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService, handleError } from '../services/api';

export function LoginPageConectada() {
    const [email, setEmail] = useState('admin@roommaster.com');
    const [contraseña, setContraseña] = useState('admin123');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        
        try {
            const response = await authService.login(email, contraseña);
            const { token, usuario } = response.data.datos;
            
            // Guardar en localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('usuario', JSON.stringify(usuario));
            
            // Redirigir
            navigate('/dashboard');
        } catch (err) {
            setError(handleError(err));
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div style={{ maxWidth: '400px', margin: '100px auto', padding: '20px' }}>
            <h2>Iniciar Sesión</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email:</label>
                    <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Contraseña:</label>
                    <input 
                        type="password" 
                        value={contraseña}
                        onChange={(e) => setContraseña(e.target.value)}
                        required
                    />
                </div>
                <button disabled={loading}>
                    {loading ? 'Ingresando...' : 'Ingresar'}
                </button>
            </form>
        </div>
    );
}

// ================================================
// 2. COMPONENTE: CLIENTES PAGE
// ================================================

import { useState, useEffect } from 'react';
import { clientesService, handleError } from '../services/api';

export function ClientesPageConectada() {
    const [clientes, setClientes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [telefono, setTelefono] = useState('');
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    
    useEffect(() => {
        cargarClientes();
    }, []);
    
    async function cargarClientes() {
        try {
            setLoading(true);
            const response = await clientesService.obtener();
            setClientes(response.data.datos || []);
        } catch (err) {
            setError(handleError(err));
        } finally {
            setLoading(false);
        }
    }
    
    async function handleCrear(e) {
        e.preventDefault();
        setError('');
        setSuccessMsg('');
        
        try {
            await clientesService.crear({
                nombre,
                email,
                telefono,
                tipo_documento: 'cedula',
                ciudad: 'Cali'
            });
            
            setNombre('');
            setEmail('');
            setTelefono('');
            setSuccessMsg('Cliente creado exitosamente');
            
            // Recargar lista
            cargarClientes();
        } catch (err) {
            setError(handleError(err));
        }
    }
    
    async function handleEliminar(id, nombre) {
        if (!confirm(`¿Eliminar cliente ${nombre}?`)) return;
        
        try {
            await clientesService.eliminar(id);
            setSuccessMsg(`${nombre} eliminado`);
            cargarClientes();
        } catch (err) {
            setError(handleError(err));
        }
    }
    
    if (loading) return <div style={{ padding: '20px' }}>Cargando clientes...</div>;
    
    return (
        <div style={{ padding: '20px' }}>
            <h1>Gestión de Clientes</h1>
            
            {error && <div style={{ 
                background: '#ffcccc', 
                color: '#cc0000', 
                padding: '10px',
                marginBottom: '10px',
                borderRadius: '4px'
            }}>{error}</div>}
            
            {successMsg && <div style={{ 
                background: '#ccffcc', 
                color: '#00cc00', 
                padding: '10px',
                marginBottom: '10px',
                borderRadius: '4px'
            }}>{successMsg}</div>}
            
            <form onSubmit={handleCrear} style={{ 
                background: '#f5f5f5',
                padding: '15px',
                marginBottom: '20px',
                borderRadius: '4px'
            }}>
                <h3>Agregar Nuevo Cliente</h3>
                <div>
                    <input 
                        type="text" 
                        placeholder="Nombre"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        required
                        style={{ marginRight: '10px', padding: '8px' }}
                    />
                    <input 
                        type="email" 
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{ marginRight: '10px', padding: '8px' }}
                    />
                    <input 
                        type="tel" 
                        placeholder="Teléfono"
                        value={telefono}
                        onChange={(e) => setTelefono(e.target.value)}
                        required
                        style={{ marginRight: '10px', padding: '8px' }}
                    />
                    <button type="submit">Crear</button>
                </div>
            </form>
            
            <h3>Lista de Clientes ({clientes.length})</h3>
            <table style={{ 
                width: '100%', 
                borderCollapse: 'collapse',
                border: '1px solid #ccc'
            }}>
                <thead style={{ background: '#333', color: '#fff' }}>
                    <tr>
                        <th style={{ padding: '10px', textAlign: 'left' }}>ID</th>
                        <th style={{ padding: '10px', textAlign: 'left' }}>Nombre</th>
                        <th style={{ padding: '10px', textAlign: 'left' }}>Email</th>
                        <th style={{ padding: '10px', textAlign: 'left' }}>Teléfono</th>
                        <th style={{ padding: '10px', textAlign: 'left' }}>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {clientes.map(cliente => (
                        <tr key={cliente.id} style={{ borderBottom: '1px solid #ccc' }}>
                            <td style={{ padding: '10px' }}>{cliente.id}</td>
                            <td style={{ padding: '10px' }}>{cliente.nombre}</td>
                            <td style={{ padding: '10px' }}>{cliente.email}</td>
                            <td style={{ padding: '10px' }}>{cliente.telefono}</td>
                            <td style={{ padding: '10px' }}>
                                <button 
                                    onClick={() => handleEliminar(cliente.id, cliente.nombre)}
                                    style={{ 
                                        background: '#ff6666', 
                                        color: '#fff',
                                        border: 'none',
                                        padding: '5px 10px',
                                        cursor: 'pointer',
                                        borderRadius: '3px'
                                    }}
                                >
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

// ================================================
// 3. COMPONENTE: FACTURAS PAGE
// ================================================

import { useState, useEffect } from 'react';
import { facturasService, handleError } from '../services/api';

export function FacturasPageConectada() {
    const [facturas, setFacturas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [estado, setEstado] = useState('Pendiente');
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    
    useEffect(() => {
        cargarFacturas();
    }, [estado]);
    
    async function cargarFacturas() {
        try {
            setLoading(true);
            const response = await facturasService.obtener(estado);
            setFacturas(response.data.datos || []);
        } catch (err) {
            setError(handleError(err));
        } finally {
            setLoading(false);
        }
    }
    
    async function marcarComoPagada(id) {
        try {
            await facturasService.marcarPagada(id, 'tarjeta');
            setSuccessMsg('Factura marcada como pagada');
            cargarFacturas();
        } catch (err) {
            setError(handleError(err));
        }
    }
    
    if (loading) return <div style={{ padding: '20px' }}>Cargando facturas...</div>;
    
    return (
        <div style={{ padding: '20px' }}>
            <h1>Facturación</h1>
            
            {error && <div style={{ 
                background: '#ffcccc', 
                color: '#cc0000', 
                padding: '10px',
                marginBottom: '10px'
            }}>{error}</div>}
            
            {successMsg && <div style={{ 
                background: '#ccffcc', 
                color: '#00cc00', 
                padding: '10px',
                marginBottom: '10px'
            }}>{successMsg}</div>}
            
            <div style={{ marginBottom: '20px' }}>
                <label>Filtrar por estado: </label>
                <select value={estado} onChange={(e) => setEstado(e.target.value)}>
                    <option value="Pendiente">Pendiente</option>
                    <option value="Pagada">Pagada</option>
                    <option value="Cancelada">Cancelada</option>
                </select>
            </div>
            
            <table style={{ 
                width: '100%', 
                borderCollapse: 'collapse',
                border: '1px solid #ccc'
            }}>
                <thead style={{ background: '#333', color: '#fff' }}>
                    <tr>
                        <th style={{ padding: '10px', textAlign: 'left' }}>Número</th>
                        <th style={{ padding: '10px', textAlign: 'left' }}>Cliente</th>
                        <th style={{ padding: '10px', textAlign: 'right' }}>Total</th>
                        <th style={{ padding: '10px', textAlign: 'left' }}>Estado</th>
                        <th style={{ padding: '10px', textAlign: 'left' }}>Fecha</th>
                        <th style={{ padding: '10px', textAlign: 'left' }}>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {facturas.map(factura => (
                        <tr key={factura.id} style={{ borderBottom: '1px solid #ccc' }}>
                            <td style={{ padding: '10px' }}>{factura.numero_factura}</td>
                            <td style={{ padding: '10px' }}>{factura.cliente_nombre}</td>
                            <td style={{ padding: '10px', textAlign: 'right' }}>
                                ${Number(factura.total).toFixed(2)}
                            </td>
                            <td style={{ padding: '10px' }}>
                                <span style={{
                                    padding: '4px 8px',
                                    borderRadius: '3px',
                                    background: factura.estado === 'Pagada' ? '#66ff66' : '#ffcc00',
                                    color: '#000'
                                }}>
                                    {factura.estado}
                                </span>
                            </td>
                            <td style={{ padding: '10px' }}>
                                {new Date(factura.fecha_emision).toLocaleDateString()}
                            </td>
                            <td style={{ padding: '10px' }}>
                                {factura.estado === 'Pendiente' && (
                                    <button 
                                        onClick={() => marcarComoPagada(factura.id)}
                                        style={{ 
                                            background: '#66ff66',
                                            border: 'none',
                                            padding: '5px 10px',
                                            cursor: 'pointer',
                                            borderRadius: '3px'
                                        }}
                                    >
                                        Pagar
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

// ================================================
// 4. COMPONENTE: DASH BOARD
// ================================================

import { useState, useEffect } from 'react';
import { reportesService, handleError } from '../services/api';

export function DashboardConectado() {
    const [datos, setDatos] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    useEffect(() => {
        cargarDatos();
    }, []);
    
    async function cargarDatos() {
        try {
            const response = await reportesService.getDashboard();
            setDatos(response.data.datos);
        } catch (err) {
            setError(handleError(err));
        } finally {
            setLoading(false);
        }
    }
    
    if (loading) return <div>Cargando dashboard...</div>;
    if (error) return <div style={{ color: 'red' }}>{error}</div>;
    if (!datos) return <div>Sin datos</div>;
    
    const d = datos.dashboard || {};
    
    return (
        <div style={{ padding: '20px' }}>
            <h1>Dashboard</h1>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                {/* Card 1: Huéspedes Actuales */}
                <div style={{
                    background: '#3498db',
                    color: '#fff',
                    padding: '20px',
                    borderRadius: '8px',
                    textAlign: 'center'
                }}>
                    <h3>Huéspedes Actuales</h3>
                    <p style={{ fontSize: '32px', margin: '10px 0' }}>
                        {d.huespedes_actuales || 0}
                    </p>
                </div>
                
                {/* Card 2: Habitaciones Disponibles */}
                <div style={{
                    background: '#2ecc71',
                    color: '#fff',
                    padding: '20px',
                    borderRadius: '8px',
                    textAlign: 'center'
                }}>
                    <h3>Habitaciones Disponibles</h3>
                    <p style={{ fontSize: '32px', margin: '10px 0' }}>
                        {d.habitaciones_disponibles || 0}
                    </p>
                </div>
                
                {/* Card 3: Ingresos Mes */}
                <div style={{
                    background: '#f39c12',
                    color: '#fff',
                    padding: '20px',
                    borderRadius: '8px',
                    textAlign: 'center'
                }}>
                    <h3>Ingresos Este Mes</h3>
                    <p style={{ fontSize: '32px', margin: '10px 0' }}>
                        ${Number(d.ingresos_mes || 0).toFixed(2)}
                    </p>
                </div>
                
                {/* Card 4: Pendiente de Cobro */}
                <div style={{
                    background: '#e74c3c',
                    color: '#fff',
                    padding: '20px',
                    borderRadius: '8px',
                    textAlign: 'center'
                }}>
                    <h3>Pendiente de Cobro</h3>
                    <p style={{ fontSize: '32px', margin: '10px 0' }}>
                        ${Number(d.pendiente_cobro || 0).toFixed(2)}
                    </p>
                </div>
            </div>
        </div>
    );
}

// ================================================
// 5. COMPONENTE: PRODUCTOS (TIENDA)
// ================================================

import { useState, useEffect } from 'react';
import { productosService, ventasService, handleError } from '../services/api';

export function TiendaPageConectada() {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    
    useEffect(() => {
        cargarProductos();
    }, []);
    
    async function cargarProductos() {
        try {
            const response = await productosService.obtener();
            setProductos(response.data.datos || []);
        } catch (err) {
            setError(handleError(err));
        } finally {
            setLoading(false);
        }
    }
    
    async function comprarProducto(productoId, productoNombre, precio) {
        // Esta es un ejemplo simplificado
        const cantidad = prompt(`¿Cuántos ${productoNombre}s deseas comprar?`);
        if (!cantidad || parseInt(cantidad) <= 0) return;
        
        try {
            // Aquí va la lógica de venta
            setSuccessMsg(`${cantidad} x ${productoNombre} agregado(s) al carrito`);
            setTimeout(() => setSuccessMsg(''), 3000);
        } catch (err) {
            setError(handleError(err));
        }
    }
    
    if (loading) return <div>Cargando tienda...</div>;
    
    return (
        <div style={{ padding: '20px' }}>
            <h1>Tienda - Productos</h1>
            
            {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
            {successMsg && <div style={{ color: 'green', marginBottom: '10px' }}>{successMsg}</div>}
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
                {productos.map(producto => (
                    <div key={producto.id} style={{
                        border: '1px solid #ccc',
                        borderRadius: '8px',
                        padding: '15px',
                        textAlign: 'center'
                    }}>
                        <h3>{producto.nombre}</h3>
                        <p>{producto.descripcion}</p>
                        <p style={{ 
                            fontSize: '20px', 
                            color: '#f39c12',
                            fontWeight: 'bold',
                            margin: '10px 0'
                        }}>
                            ${Number(producto.precio).toFixed(2)}
                        </p>
                        <p style={{ 
                            color: producto.stock_actual > 5 ? '#2ecc71' : '#e74c3c'
                        }}>
                            Stock: {producto.stock_actual}
                        </p>
                        <button 
                            onClick={() => comprarProducto(producto.id, producto.nombre, producto.precio)}
                            disabled={producto.stock_actual <= 0}
                            style={{
                                background: '#3498db',
                                color: '#fff',
                                border: 'none',
                                padding: '10px 20px',
                                borderRadius: '4px',
                                cursor: producto.stock_actual > 0 ? 'pointer' : 'not-allowed',
                                opacity: producto.stock_actual > 0 ? 1 : 0.5
                            }}
                        >
                            {producto.stock_actual > 0 ? 'Comprar' : 'Sin Stock'}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ================================================
// Exportar todos los componentes
// ================================================

export {
    LoginPageConectada,
    ClientesPageConectada,
    FacturasPageConectada,
    DashboardConectado,
    TiendaPageConectada
};
