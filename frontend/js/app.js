// ===== ESTADO GLOBAL =====
let usuarioActual = null;

// ===== NAVEGACIÓN =====
function mostrarSeccion(nombre) {
    document.querySelectorAll('.seccion').forEach(s => s.classList.remove('activa'));
    document.getElementById(`seccion-${nombre}`).classList.add('activa');
}

function mostrarTab(nombre, btn) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('activa'));
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('activa'));
    document.getElementById(`tab-${nombre}`).classList.add('activa');
    btn.classList.add('activa');
    if (nombre === 'misCitas') cargarMisCitas();
    if (nombre === 'miPerfil') mostrarPerfil();
}

function actualizarNavbar() {
    const btnLogin    = document.getElementById('btnLogin');
    const btnRegistro = document.getElementById('btnRegistro');
    const btnCerrar   = document.getElementById('btnCerrar');
    if (usuarioActual) {
        btnLogin.style.display    = 'none';
        btnRegistro.style.display = 'none';
        btnCerrar.style.display   = 'inline';
    } else {
        btnLogin.style.display    = 'inline';
        btnRegistro.style.display = 'inline';
        btnCerrar.style.display   = 'none';
    }
}

function cerrarSesion() {
    usuarioActual = null;
    actualizarNavbar();
    mostrarSeccion('inicio');
}

// ===== MENSAJES =====
function mostrarMensaje(id, texto, tipo = 'exito') {
    const el = document.getElementById(id);
    el.textContent = texto;
    el.className = `mensaje ${tipo}`;
    el.style.display = 'block';
    setTimeout(() => el.style.display = 'none', 4000);
}

function limpiarErrores(ids) {
    ids.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = '';
    });
}

// ===== VALIDACIÓN CLIENTE =====
function validarRegistroCliente() {
    let valido = true;
    limpiarErrores(['errorRegNombre','errorRegEmail','errorRegDni','errorRegTelefono','errorRegPassword']);

    const nombre   = document.getElementById('regNombre').value.trim();
    const email    = document.getElementById('regEmail').value.trim();
    const dni      = document.getElementById('regDni').value.trim();
    const telefono = document.getElementById('regTelefono').value.trim();
    const password = document.getElementById('regPassword').value;

    if (nombre.length < 2) {
        document.getElementById('errorRegNombre').textContent = 'Ingresa tu nombre completo';
        valido = false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        document.getElementById('errorRegEmail').textContent = 'Ingresa un email válido';
        valido = false;
    }
    if (!/^\d{8}$/.test(dni)) {
        document.getElementById('errorRegDni').textContent = 'El DNI debe tener 8 dígitos';
        valido = false;
    }
    if (!/^\d{9}$/.test(telefono)) {
        document.getElementById('errorRegTelefono').textContent = 'El teléfono debe tener 9 dígitos';
        valido = false;
    }
    if (password.length < 6 || !/\d/.test(password)) {
        document.getElementById('errorRegPassword').textContent = 'Mínimo 6 caracteres y un número';
        valido = false;
    }
    return valido;
}

function validarLoginCliente() {
    let valido = true;
    limpiarErrores(['errorLoginEmail','errorLoginPassword']);

    const email    = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        document.getElementById('errorLoginEmail').textContent = 'Ingresa un email válido';
        valido = false;
    }
    if (!password) {
        document.getElementById('errorLoginPassword').textContent = 'Ingresa tu contraseña';
        valido = false;
    }
    return valido;
}

// ===== REGISTRO =====
async function registrar() {                        //Puede espera respuestas sin bloquear la pagina    va a waiting la respuestas
    if (!validarRegistroCliente()) return;    //creamos la condicion pra la verificacion de datos pra el usuario 
//valida que los datos esten correctos 
    const datos = {
        nombre:   document.getElementById('regNombre').value.trim(),
        email:    document.getElementById('regEmail').value.trim(),
        dni:      document.getElementById('regDni').value.trim(),
        telefono: document.getElementById('regTelefono').value.trim(),
        password: document.getElementById('regPassword').value
    };              //captura los datos y usamos el value que es para obtner lo q escribio el usuario y 

    try {
        const res  = await fetch('/api/usuarios/registrar', {   //envia los datos al backend 
            method:  'POST',         //indica que es una peticion post pra enviar datos
            headers: { 'Content-Type': 'application/json' },        //le indica al servidor q los datos vienen en formato json
            body:    JSON.stringify(datos)          //convierte los datos a json pra enviar al servidor 
        });
        const data = await res.json();  //recibe la respuesta del servidor y la convierte a json

        if (!res.ok) {      //si no hubo respuesta   
            mostrarMensaje('registroMsg', data.error || 'Error al registrar', 'error'); 
            return;
        }

        mostrarMensaje('registroMsg', '✅ ¡Cuenta creada! Ahora inicia sesión.', 'exito');
        setTimeout(() => mostrarSeccion('login'), 2000); //espera 2 segundos y muestra la seccion de login 
  
    } catch (err) {         //MANEJO DE ERRORES- SI NO HAY INTERNET->
        mostrarMensaje('registroMsg', 'Error de conexión con el servidor', 'error'); 
    }
}             

// ===== LOGIN ===== validar datos → enviar al servidor → verificar respuesta → entrar al sistema.

async function login() {
    if (!validarLoginCliente()) return;     //validar que los datos existan y sean correctos 

    const datos = {
        email:    document.getElementById('loginEmail').value.trim(),
        password: document.getElementById('loginPassword').value
    };  //aca se guardan los datos 

    try {
        const res  = await fetch('/api/usuarios/login', {           //peticion pra verificar credenciales
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },            //viajan-> json
            body:    JSON.stringify(datos)                               //convertimos a json   
        });
        const data = await res.json();          //recibe la respuesta del servidor y la convierte a json

        if (!res.ok) {                          //si no hubo respuesta
            mostrarMensaje('loginError', data.error || 'Credenciales incorrectas', 'error');
            return;
        }

        usuarioActual = data.usuario;                   //guardamos datos del usuario  
        actualizarNavbar();                             
        document.getElementById('nombreUsuario').textContent = usuarioActual.nombre.split(' ')[0]; //primer nombre 
        mostrarSeccion('dashboard');                      //dashboard
        cargarEspecialidades();                          //especialidades

    } catch (err) {
        mostrarMensaje('loginError', 'Error de conexión con el servidor', 'error');
    }
}

// ===== ESPECIALIDADES =====
async function cargarEspecialidades() {
    try {
        const res            = await fetch('/api/reservas/servicios');
        const especialidades = await res.json();

        const select = document.getElementById('especialidadSelect');
        select.innerHTML = '<option value="">-- Selecciona una especialidad --</option>';
        especialidades.forEach(e => {
            select.innerHTML += `<option value="${e.id}">${e.icono || '🏥'} ${e.nombre} — S/. ${e.precio}</option>`;
        });

        const preview = document.getElementById('serviciosPreview');
        preview.innerHTML = especialidades.map(e => `
            <div class="servicio-card">
                <div style="font-size:2rem;margin-bottom:0.5rem;">${e.icono || '🏥'}</div>
                <h3>${e.nombre}</h3>
                <p>${e.descripcion || ''}</p>
                <p class="duracion">⏱ ${e.duracion_minutos} minutos</p>
                <p class="precio">S/. ${e.precio}</p>
            </div>
        `).join('');

    } catch (err) {
        console.error('Error cargando especialidades:', err);
    }
}

// ===== CREAR CITA =====
async function crearCita() {
    limpiarErrores(['errorEspecialidad','errorFecha','errorHora']);
    let valido = true;

    const especialidad_id = document.getElementById('especialidadSelect').value;
    const fecha           = document.getElementById('citaFecha').value;
    const horaRaw         = document.getElementById('citaHora').value;
    const motivo          = document.getElementById('citaMotivo').value;

    if (!especialidad_id) {
        document.getElementById('errorEspecialidad').textContent = 'Selecciona una especialidad';
        valido = false;
    }
    if (!fecha) {
        document.getElementById('errorFecha').textContent = 'Selecciona una fecha';
        valido = false;
    }
    if (!horaRaw) {
        document.getElementById('errorHora').textContent = 'Selecciona una hora';
        valido = false;
    }
    if (!valido) return;

    // Convertir hora a formato 24h por si el navegador usa AM/PM
    let hora = horaRaw;
    if (horaRaw.includes('AM') || horaRaw.includes('PM')) {
        const [time, modifier] = horaRaw.split(' ');
        let [hours, minutes]   = time.split(':');
        if (modifier === 'AM' && hours === '12') hours = '00';
        if (modifier === 'PM' && hours !== '12') hours = String(parseInt(hours) + 12);
        hora = `${hours.padStart(2, '0')}:${minutes}`;
    }

    const datos = {
        usuario_id:  usuarioActual.id,
        servicio_id: parseInt(especialidad_id),
        fecha,
        hora,
        notas: motivo
    };

    try {
        const res  = await fetch('/api/reservas', {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify(datos)
        });
        const data = await res.json();

        if (!res.ok) {
            const msg = data.error || (data.errores ? data.errores[0].msg : 'Error al crear cita');
            mostrarMensaje('citaMsg', msg, 'error');
            return;
        }

        mostrarMensaje('citaMsg', '✅ ¡Cita médica reservada exitosamente!', 'exito');
        document.getElementById('especialidadSelect').value = '';
        document.getElementById('citaFecha').value          = '';
        document.getElementById('citaHora').value           = '';
        document.getElementById('citaMotivo').value         = '';

    } catch (err) {
        mostrarMensaje('citaMsg', 'Error de conexión con el servidor', 'error');
    }
}

// ===== MIS CITAS =====
async function cargarMisCitas() {
    const lista = document.getElementById('listaCitas');
    lista.innerHTML = '<p style="color:var(--text-muted)">Cargando citas...</p>';

    try {
        const res   = await fetch(`/api/reservas/usuario/${usuarioActual.id}`);
        const citas = await res.json();

        if (citas.length === 0) {
            lista.innerHTML = `
                <div style="text-align:center;padding:2rem;color:var(--text-muted)">
                    <div style="font-size:3rem;margin-bottom:1rem">🗓</div>
                    <p>No tienes citas registradas aún.</p>
                    <p style="font-size:0.85rem;margin-top:0.5rem">Reserva tu primera cita médica</p>
                </div>`;
            return;
        }

        lista.innerHTML = citas.map(c => `
            <div class="reserva-card">
                <div class="reserva-info">
                    <h4>🏥 ${c.servicio}</h4>
                    <p>📅 ${new Date(c.fecha).toLocaleDateString('es-PE', {weekday:'long', year:'numeric', month:'long', day:'numeric'})}</p>
                    <p>⏰ ${c.hora} &nbsp;|&nbsp; 💰 S/. ${c.precio}</p>
                    ${c.notas ? `<p style="margin-top:0.3rem">📝 ${c.notas}</p>` : ''}
                </div>
                <div style="display:flex;flex-direction:column;gap:0.5rem;align-items:flex-end">
                    <span class="badge badge-${c.estado}">${c.estado}</span>
                    ${c.estado === 'pendiente' ? `
                        <button class="btn-danger" onclick="cancelarCita(${c.id})">
                            Cancelar
                        </button>` : ''}
                </div>
            </div>
        `).join('');

    } catch (err) {
        lista.innerHTML = '<p style="color:var(--danger)">Error al cargar las citas.</p>';
    }
}

// ===== CANCELAR CITA =====
async function cancelarCita(id) {
    if (!confirm('¿Seguro que deseas cancelar esta cita médica?')) return;

    try {
        const res = await fetch(`/api/reservas/${id}/estado`, {
            method:  'PUT',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ estado: 'cancelada' })
        });

        if (res.ok) cargarMisCitas();

    } catch (err) {
        alert('Error al cancelar la cita');
    }
}

// ===== MI PERFIL =====
function mostrarPerfil() {
    const perfil = document.getElementById('infoPerfil');
    perfil.innerHTML = `
        <div style="background:var(--bg);border:1px solid var(--border);border-radius:var(--radius);padding:1.5rem;">
            <div style="display:flex;align-items:center;gap:1rem;margin-bottom:1.5rem;">
                <div style="width:60px;height:60px;border-radius:50%;background:rgba(124,58,237,0.2);display:flex;align-items:center;justify-content:center;font-size:1.5rem;color:var(--primary-light);font-weight:700;">
                    ${usuarioActual.nombre.charAt(0).toUpperCase()}
                </div>
                <div>
                    <h3 style="color:var(--text);font-size:1.1rem;">${usuarioActual.nombre}</h3>
                    <p style="color:var(--text-muted);font-size:0.85rem;">Paciente registrado</p>
                </div>
            </div>
            <div style="display:grid;gap:0.8rem;">
                <div style="display:flex;justify-content:space-between;padding:0.8rem;background:var(--bg-card);border-radius:8px;">
                    <span style="color:var(--text-muted);font-size:0.9rem;">📧 Correo</span>
                    <span style="color:var(--text);font-size:0.9rem;">${usuarioActual.email}</span>
                </div>
                <div style="display:flex;justify-content:space-between;padding:0.8rem;background:var(--bg-card);border-radius:8px;">
                    <span style="color:var(--text-muted);font-size:0.9rem;">👤 Rol</span>
                    <span style="color:var(--primary-light);font-size:0.9rem;">${usuarioActual.rol}</span>
                </div>
            </div>
        </div>
    `;
}

// ===== INICIALIZAR =====
document.addEventListener('DOMContentLoaded', () => {
    cargarEspecialidades();
});