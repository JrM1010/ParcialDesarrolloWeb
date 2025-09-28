// Configuración de la API
const API_BASE_URL = 'http://localhost:5194/api';
//const API_BASE_URL = window.location.origin + '/api';
let estudiantes = [];
let carreras = [];
let facultades = [];
let estudianteEditando = null;

// Elementos del DOM
const form = document.getElementById('estudiante-form');
const formTitle = document.getElementById('form-title');
const submitBtn = document.getElementById('submit-btn');
const cancelBtn = document.getElementById('cancel-btn');
const tbody = document.getElementById('estudiantes-tbody');
const searchInput = document.getElementById('search-input');
const sortSelect = document.getElementById('sort-select');

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    console.log('Inicializando aplicación...');
    cargarDatosIniciales();
    configurarEventListeners();
});

function configurarEventListeners() {
    form.addEventListener('submit', manejarEnvioFormulario);
    cancelBtn.addEventListener('click', cancelarEdicion);
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') buscarEstudiantes();
    });
}

async function cargarDatosIniciales() {
    try {
        console.log('Cargando datos iniciales...');
        await cargarCarreras();
        await cargarFacultades();
        await cargarEstudiantes();
        console.log('Datos cargados exitosamente');
    } catch (error) {
        console.error('Error al cargar datos:', error);
        mostrarMensaje('Error al cargar los datos iniciales: ' + error.message, 'error');
    }
}

// Funciones para cargar datos desde la API
async function cargarEstudiantes() {
    try {
        console.log('Cargando estudiantes desde:', `${API_BASE_URL}/Estudiantes`);
        const response = await fetch(`${API_BASE_URL}/Estudiantes`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        estudiantes = await response.json();
        console.log('Estudiantes cargados:', estudiantes);
        mostrarEstudiantes(estudiantes);
    } catch (error) {
        console.error('Error cargando estudiantes:', error);
        mostrarMensaje('Error al cargar estudiantes: ' + error.message, 'error');
    }
}

async function cargarCarreras() {
    try {
        console.log('Cargando carreras desde:', `${API_BASE_URL}/Carreras`);
        const response = await fetch(`${API_BASE_URL}/Carreras`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        carreras = await response.json();
        console.log('Carreras cargadas:', carreras);
        llenarSelectCarreras();
    } catch (error) {
        console.error('Error cargando carreras:', error);
        mostrarMensaje('Error al cargar carreras: ' + error.message, 'error');
    }
}

async function cargarFacultades() {
    try {
        console.log('Cargando facultades desde:', `${API_BASE_URL}/Facultades`);
        const response = await fetch(`${API_BASE_URL}/Facultades`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        facultades = await response.json();
        console.log('Facultades cargadas:', facultades);
        llenarSelectFacultades();
    } catch (error) {
        console.error('Error cargando facultades:', error);
        mostrarMensaje('Error al cargar facultades: ' + error.message, 'error');
    }
}

function llenarSelectCarreras() {
    const select = document.getElementById('carrera');
    select.innerHTML = '<option value="">Seleccione una carrera</option>';
    carreras.forEach(carrera => {
        const option = document.createElement('option');
        option.value = carrera.idCarrera;
        option.textContent = carrera.nombreCarrera;
        select.appendChild(option);
    });
}

function llenarSelectFacultades() {
    const select = document.getElementById('facultad');
    select.innerHTML = '<option value="">Seleccione una facultad</option>';
    facultades.forEach(facultad => {
        const option = document.createElement('option');
        option.value = facultad.idFacultad;
        option.textContent = facultad.nombreFacultad;
        select.appendChild(option);
    });
}

// Validación del formulario
function validarFormulario() {
    let esValido = true;
    const campos = ['carnet', 'nombres', 'apellidos', 'correo', 'telefono', 'carrera', 'facultad'];
    
    // Limpiar mensajes de error anteriores
    campos.forEach(campo => {
        document.getElementById(`${campo}-error`).textContent = '';
    });

    // Validar cada campo
    campos.forEach(campo => {
        const elemento = document.getElementById(campo);
        const valor = elemento.value.trim();
        
        if (!valor) {
            document.getElementById(`${campo}-error`).textContent = 'Este campo es obligatorio';
            elemento.style.borderColor = '#e74c3c';
            esValido = false;
        } else {
            elemento.style.borderColor = '#ddd';
        }
    });

    // Validación específica para email
    const correo = document.getElementById('correo').value.trim();
    if (correo && !validarEmail(correo)) {
        document.getElementById('correo-error').textContent = 'Formato de email inválido';
        document.getElementById('correo').style.borderColor = '#e74c3c';
        esValido = false;
    }

    return esValido;
}

function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Manejo del formulario
async function manejarEnvioFormulario(e) {
    e.preventDefault();
    
    if (!validarFormulario()) {
        mostrarMensaje('Por favor, complete todos los campos correctamente', 'warning');
        return;
    }

    const estudianteData = {
        carnet: document.getElementById('carnet').value.trim(),
        nombres: document.getElementById('nombres').value.trim(),
        apellidos: document.getElementById('apellidos').value.trim(),
        correo: document.getElementById('correo').value.trim(),
        telefono: document.getElementById('telefono').value.trim(),
        idCarrera: parseInt(document.getElementById('carrera').value),
        idFacultad: parseInt(document.getElementById('facultad').value)
    };

    try {
        if (estudianteEditando) {
            // Actualizar estudiante existente
            estudianteData.idEstudiante = estudianteEditando.idEstudiante;
            await actualizarEstudiante(estudianteData);
        } else {
            // Crear nuevo estudiante
            await crearEstudiante(estudianteData);
        }
    } catch (error) {
        mostrarMensaje('Error al guardar el estudiante: ' + error.message, 'error');
    }
}

async function crearEstudiante(estudianteData) {
    const response = await fetch(`${API_BASE_URL}/Estudiantes`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(estudianteData)
    });

    if (!response.ok) throw new Error('Error al crear estudiante');
    
    mostrarMensaje('Estudiante creado exitosamente', 'success');
    limpiarFormulario();
    await cargarEstudiantes();
}

async function actualizarEstudiante(estudianteData) {
    const response = await fetch(`${API_BASE_URL}/Estudiantes/${estudianteData.idEstudiante}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(estudianteData)
    });

    if (!response.ok) throw new Error('Error al actualizar estudiante');
    
    mostrarMensaje('Estudiante actualizado exitosamente', 'success');
    cancelarEdicion();
    await cargarEstudiantes();
}

function limpiarFormulario() {
    form.reset();
    estudianteEditando = null;
    formTitle.textContent = 'Agregar Nuevo Estudiante';
    submitBtn.textContent = 'Guardar Estudiante';
    cancelBtn.style.display = 'none';
    
    // Limpiar estilos de validación
    const campos = document.querySelectorAll('#estudiante-form input, #estudiante-form select');
    campos.forEach(campo => {
        campo.style.borderColor = '#ddd';
    });
}

function cancelarEdicion() {
    limpiarFormulario();
}

// Funciones para la tabla
function mostrarEstudiantes(listaEstudiantes) {
    tbody.innerHTML = '';
    
    if (listaEstudiantes.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align: center;">No hay estudiantes registrados</td></tr>';
        return;
    }

    listaEstudiantes.forEach(estudiante => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${estudiante.carnet || ''}</td>
            <td>${estudiante.nombres || ''}</td>
            <td>${estudiante.apellidos || ''}</td>
            <td>${estudiante.correo || ''}</td>
            <td>${estudiante.telefono || ''}</td>
            <td>${estudiante.carrera?.nombreCarrera || 'N/A'}</td>
            <td>${estudiante.facultad?.nombreFacultad || 'N/A'}</td>
            <td class="acciones-cell">
                <button class="btn-editar" onclick="editarEstudiante(${estudiante.idEstudiante})">Editar</button>
                <button class="btn-eliminar" onclick="eliminarEstudiante(${estudiante.idEstudiante})">Eliminar</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function editarEstudiante(id) {
    console.log('Editando estudiante ID:', id);
    const estudiante = estudiantes.find(e => e.idEstudiante === id);
    
    if (!estudiante) {
        console.error('Estudiante no encontrado con ID:', id);
        mostrarMensaje('Error: Estudiante no encontrado', 'error');
        return;
    }

    estudianteEditando = estudiante;
    
    document.getElementById('carnet').value = estudiante.carnet || '';
    document.getElementById('nombres').value = estudiante.nombres || '';
    document.getElementById('apellidos').value = estudiante.apellidos || '';
    document.getElementById('correo').value = estudiante.correo || '';
    document.getElementById('telefono').value = estudiante.telefono || '';
    document.getElementById('carrera').value = estudiante.idCarrera || '';
    document.getElementById('facultad').value = estudiante.idFacultad || '';

    formTitle.textContent = 'Editar Estudiante';
    submitBtn.textContent = 'Actualizar Estudiante';
    cancelBtn.style.display = 'inline-block';
    
    // Scroll al formulario
    document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
}

async function eliminarEstudiante(id) {
    if (!confirm('¿Está seguro de que desea eliminar este estudiante?')) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/Estudiantes/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('Error al eliminar estudiante');
        
        mostrarMensaje('Estudiante eliminado exitosamente', 'success');
        await cargarEstudiantes();
    } catch (error) {
        mostrarMensaje('Error al eliminar estudiante: ' + error.message, 'error');
    }
}

// Búsqueda y ordenamiento
function buscarEstudiantes() {
    const termino = searchInput.value.toLowerCase().trim();
    
    if (!termino) {
        mostrarEstudiantes(estudiantes);
        return;
    }

    const resultados = estudiantes.filter(estudiante => 
        (estudiante.carnet && estudiante.carnet.toLowerCase().includes(termino)) ||
        (estudiante.nombres && estudiante.nombres.toLowerCase().includes(termino)) ||
        (estudiante.apellidos && estudiante.apellidos.toLowerCase().includes(termino)) ||
        (estudiante.correo && estudiante.correo.toLowerCase().includes(termino)) ||
        (estudiante.carrera?.nombreCarrera && estudiante.carrera.nombreCarrera.toLowerCase().includes(termino)) ||
        (estudiante.facultad?.nombreFacultad && estudiante.facultad.nombreFacultad.toLowerCase().includes(termino))
    );

    mostrarEstudiantes(resultados);
}

function ordenarEstudiantes() {
    const [campo, direccion] = sortSelect.value.split('-');
    const estudiantesOrdenados = [...estudiantes];

    estudiantesOrdenados.sort((a, b) => {
        let valorA = a[campo] || '';
        let valorB = b[campo] || '';

        // Para campos anidados (carrera, facultad)
        if (campo === 'carrera') {
            valorA = a.carrera?.nombreCarrera || '';
            valorB = b.carrera?.nombreCarrera || '';
        } else if (campo === 'facultad') {
            valorA = a.facultad?.nombreFacultad || '';
            valorB = b.facultad?.nombreFacultad || '';
        }

        if (typeof valorA === 'string') {
            valorA = valorA.toLowerCase();
            valorB = valorB.toLowerCase();
        }

        if (valorA < valorB) return direccion === 'asc' ? -1 : 1;
        if (valorA > valorB) return direccion === 'asc' ? 1 : -1;
        return 0;
    });

    mostrarEstudiantes(estudiantesOrdenados);
}

// Utilidades
function mostrarMensaje(mensaje, tipo) {
    const container = document.getElementById('message-container');
    const div = document.createElement('div');
    div.className = `message ${tipo}`;
    div.textContent = mensaje;
    
    container.appendChild(div);
    
    setTimeout(() => {
        div.remove();
    }, 5000);
}

// Hacer las funciones globales para los eventos onclick
window.editarEstudiante = editarEstudiante;
window.eliminarEstudiante = eliminarEstudiante;
window.buscarEstudiantes = buscarEstudiantes;
window.ordenarEstudiantes = ordenarEstudiantes;