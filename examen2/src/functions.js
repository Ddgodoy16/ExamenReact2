import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const alertaSuccess = (mensaje) => {
    const MySwal = withReactContent(Swal);

    MySwal.fire({
        title: mensaje,
        icon: 'success'
    });
}

const alertaError = (mensaje) => {
    const MySwal = withReactContent(Swal);

    MySwal.fire({
        title: mensaje,
        icon: 'error'
    });
}

const alertaWarning = (mensaje, id = '') => {
    onFocus(id);
    const MySwal = withReactContent(Swal);

    MySwal.fire({
        title: mensaje,
        icon: 'warning'
    });
}

const alertaConfirmation = (mensaje) => {
    const MySwal = withReactContent(Swal);
    
    MySwal.fire({
        title: mensaje,
        icon: 'question',
        text: 'No habrá marcha atrás',
        showCancelButton: true,
        confirmButtonText: 'Si, eliminar',
        cancelButtonText: 'Cancelar'
    });
}

const onFocus = (id) => {
    if (id !== '') {
        document.getElementById(id).focus();
    }    
}

export { alertaSuccess, alertaError, alertaWarning, alertaConfirmation };

