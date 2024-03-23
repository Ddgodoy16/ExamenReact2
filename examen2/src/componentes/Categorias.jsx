import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { alertaSuccess, alertaError, alertaWarning } from '../functions';
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import '../Categorias.css';


export const Categorias = () => {
    const apiUrl = 'https://api.escuelajs.co/api/v1/categories';
    const [categorias, setCategorias] = useState([]);
    const [id, setId] = useState('');
    const [nombre, setNombre] = useState('');
    const [image, setImage] = useState('');
    const [operacion, setOperacion] = useState(1);
    const [titleModal, setTitleModal] = useState('');

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

    const abrirModal = (operacion, id, nombre, image) => {
        setId(id);
        setNombre(nombre);
        setImage(image);


        if (operacion === 1) {
            setTitleModal('Registrar Categoria');
            setOperacion(1);
        } else if (operacion === 2) {
            setTitleModal('Editar Categoria');
            setOperacion(2);
        }
    };



    const enviarSolicitud = async (url, metodo, parametros) => {
        let obj = {
            method: metodo,
            url: url,
            data: parametros,
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        };
        await axios(obj).then(() => {
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
        if (!nombre.trim() || !image.trim()) {
            alertaWarning('Por favor, complete todos los campos');
            return;
        }

        payload = {
            name: nombre,
            image: image

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
        <div className="container-fluid mt-5 justify-content-center">
            <div className="mt-5 mb-5 d-flex justify-content-center">
                <div>
                    <h2>Lista de Categorías</h2>
                    <button onClick={() => abrirModal(1)} className="btn btn-success" data-bs-toggle='modal' data-bs-target='#modalCategoria'>
                        <i className='fa-solid fa-circle-plus' /> Agregar Categoría
                    </button>
                </div>
            </div>

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
                            <td><img src={categoria.image} alt='imager' className='image' /></td>
                            <td>
                                <button onClick={() => abrirModal(2, categoria.id, categoria.name, categoria.image)} className="btn btn-warning btn-sm me-2" data-bs-toggle='modal' data-bs-target='#modalCategoria'>Editar</button>
                                <button onClick={() => eliminarCategoria(categoria.id)} className="btn btn-danger btn-sm">Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>


            <div id="modalCategoria" className="modal fade" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">{titleModal}</h5>
                            <button id='btnCerrarModal' type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <label htmlFor="nombreCategoria" className="form-label">Nombre</label>

                            <div className='input-group mb-3'>
                                <span className='input-group-text'><i className='fa-solid fa-user'></i></span>
                                <input type="text" className="form-control" id="nombreCategoria" value={nombre} onChange={(e) => setNombre(e.target.value)} />
                            </div>

                            <label htmlFor="imageCategoria" className="form-label">Imagen</label>

                            <div className='input-group mb-3'>
                                <span className='input-group-text'><i className='fa-solid fa-image'></i></span>
                                <input type="text" className="form-control" id="imageCategoria" value={image} onChange={(e) => setImage(e.target.value)} />
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
