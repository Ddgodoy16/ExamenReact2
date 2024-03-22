import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { alertaSuccess, alertaError, alertaWarning } from '../functions';
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

export const Categorias = () => {
    const apiUrl = 'https://api.escuelajs.co/api/v1/categories';
    const [categorias, setCategorias] = useState([]);
    const [id, setId] = useState('');
    const [nombreCategoria, setNombreCategoria] = useState('');
    const [imageCategoria, setImageCategoria] = useState('');
    const [operacion, setOperacion] = useState(1); // 1 para agregar, 2 para editar

    useEffect(() => {
        obtenerCategorias();
    }, []);

    const obtenerCategorias = async () => {
        try {
            const response = await axios.get(apiUrl);
            setCategorias(response.data);
        } catch (error) {
            console.error('Error al obtener categorías:', error);
            alertaError('Error al obtener categorías');
        }
    };

    const abrirModal = (operacion, id = '', nombre = '', image = '') => {
        setId(id);
        setNombreCategoria(nombre);
        setImageCategoria(image);
        setOperacion(operacion);
    };

    const enviarSolicitud = async (url, metodo, parametros) => {
        let obj = {
            method: metodo,
            url: url,
            data: parametros,
            headers: {
                "Content-Type":"application/json",
                "Accept":"application/json"
            }
        };
        await axios(obj).then( () => {
            let mensaje;
            if (metodo === 'POST') {
                mensaje = 'Se agregó la categoría';
            } else if (metodo === 'PUT') {
                mensaje = 'Se actualizó la categoría';
            } else if (metodo === 'DELETE') {
                mensaje = 'Se eliminó la categoría';
            }

            alertaSuccess(mensaje);
            document.getElementById('btnCerrarModal').click();
            obtenerCategorias();
        }).catch((error) => {
            alertaError(error.response.data.message);
            console.log(error);
        });
    }

    const validarCategoria = () => {
        let payload;
        let metodo;
        let urlAxios;
        if (!nombreCategoria.trim() || !imageCategoria.trim()) {
            alertaWarning('Por favor, complete todos los campos');
            return;
        }

        payload = {
            name: nombreCategoria,
            image: imageCategoria
          
        };

      
        if (operacion === 1) {
            metodo = 'POST';
           urlAxios = 'https://api.escuelajs.co/api/v1/categories/';
        } else {
            metodo = 'PUT';
         urlAxios = `https://api.escuelajs.co/api/v1/categories/${id}`;
        }

        enviarSolicitud(urlAxios, metodo, payload);
    };

    const eliminarCategoria = (id) => {
        let urlDelete = `https://api.escuelajs.co/api/v1/categories/${id}`;

        const MySwal = withReactContent(Swal);
        MySwal.fire({
            title: '¿Está seguro de eliminar la categoría?',
            icon: 'question',
            text: 'La categoría se eliminará de forma permanente',
            showCancelButton: true,
            confirmButtonText: 'Eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                enviarSolicitud(urlDelete, 'DELETE', {});
            }
        }).catch((error) => {
            console.error('Error al eliminar categoría:', error);
            alertaError('Error al eliminar categoría');
        });
    };

    return (
        <div className="container mt-5">
            <h2>Lista de Categorías</h2>
            <button onClick={() => abrirModal(1)} className="btn btn-dark btn-sm mb-3" data-bs-toggle='modal' data-bs-target='#modalProducts'>Agregar Categoría</button>
            <table className="table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Nombre</th>
                        <th>Imagen</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {categorias.map((categoria, index) => (
                        <tr key={categoria.id}>
                            <td>{index + 1}</td>
                            <td>{categoria.name}</td>
                            <td>{categoria.image}</td>
                            <td>
                                <button onClick={() => abrirModal(2, categoria.id, categoria.name, categoria.image)} className="btn btn-warning btn-sm me-2">Editar</button>
                                <button onClick={() => eliminarCategoria(categoria.id)} className="btn btn-danger btn-sm">Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Modal para agregar/editar categoría */}
            <div id="modalCategoria" className="modal fade" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">{operacion === 1 ? 'Agregar Categoría' : 'Editar Categoría'}</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                                <div className="mb-3">
                                    <label htmlFor="nombreCategoria" className="form-label">Nombre</label>
                                    <input type="text" className="form-control" id="nombreCategoria" value={nombreCategoria} onChange={(e) => setNombreCategoria(e.target.value)} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="imageCategoria" className="form-label">Imagen</label>
                                    <input type="text" className="form-control" id="imageCategoria" value={imageCategoria} onChange={(e) => setImageCategoria(e.target.value)} />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                                <button type="button" className="btn btn-primary" onClick={validarCategoria}>{operacion === 1 ? 'Agregar' : 'Guardar Cambios'}</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        
    );
};
