import { createContext, useState, useEffect } from "react";
import clienteAxios from '../config/axios';
import swal from 'sweetalert';


const PacienteContext = createContext();

const PacientesProvider = ({ children }) => {

    const [pacientes, setPacientes] = useState([]);
    const [paciente, setPaciente] = useState({});

    useEffect(() => {
        const obtenerPacientes = async () => {
            try {
                const token = localStorage.getItem('token_apv');
                if (!token) return

                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: ` Bearer ${token}`
                    }
                }
                const { data } = await clienteAxios('/pacientes', config);
                setPacientes(data);
            } catch (error) {
                console.log(error);
            }
        }
        obtenerPacientes()
    }, [])

    const guardarPaciente = async (paciente) => {

        const token = localStorage.getItem('token_apv');
        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: ` Bearer ${token}`
            }
        }
        if (paciente.id) {
            try {
                const { data } = await clienteAxios.put(`/pacientes/${paciente.id}`, paciente, config);

                const pacientesActualizado = pacientes.map(pacienteState => pacienteState._id === data._id ? data : pacienteState);
                setPacientes(pacientesActualizado);
            } catch (error) {
                console.log(error);
            }
        } else {
            try {
                const { data } = await clienteAxios.post('/pacientes', paciente, config);
                const { createdAt, updatedAt, __v, ...pacienteAlmacenado } = data;
                setPacientes([pacienteAlmacenado, ...pacientes]);
                // console.log(pacienteAlmacenado);
            } catch (error) {
                console.log(error.response.data.msg);
            }
        }
    }

    const setEdicion = (paciente) => {
        setPaciente(paciente);
    }

    const eliminarPaciente = async id => {
        // Wait for the user to press a button...
        const shouldDelete = await swal({
            title: "¿Estas Seguro de eliminar este Paciente?",
            text: "Una vez eliminado no podremos recuperar la información",
            icon: "warning",
            buttons: true,
            dangerMode: true,
          })

        if (shouldDelete) {
            // Code to actually delete file goes here
            swal("¡Eliminado!", "El registro fue eliminado", "success");
            try {
                const token = localStorage.getItem('token_apv');
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: ` Bearer ${token}`
                    }
                }
                const { data } = await clienteAxios.delete(`/pacientes/${id}`, config)
                const pacientesActualizado = pacientes.filter(pacientesState => pacientesState._id !== id);
                setPacientes(pacientesActualizado);
            } catch (error) {
                console.log(error);
            }
        }


        // const confirmar = confirm('¿Deseas eliminar este paciente?');
        // if (confirmar) {
        //     try {
        //         const token = localStorage.getItem('token_apv');
        //         const config = {
        //             headers: {
        //                 "Content-Type": "application/json",
        //                 Authorization: ` Bearer ${token}`
        //             }
        //         }
        //         const { data } = await clienteAxios.delete(`/pacientes/${id}`, config)
        //         const pacientesActualizado = pacientes.filter(pacientesState => pacientesState._id !== id);
        //         setPacientes(pacientesActualizado);
        //     } catch (error) {
        //         console.log(error);
        //     }
        // }

    }
    return (
        <PacienteContext.Provider
            value={{
                pacientes,
                guardarPaciente,
                setEdicion,
                paciente,
                eliminarPaciente
            }}
        >
            {children}
        </PacienteContext.Provider>
    )
}
export {
    PacientesProvider
}
export default PacienteContext;