let taxisAnteriores = [];

// -------------------------------
// FECHA Y HORA
// -------------------------------
function actualizarHora() {
  const ahora = new Date();
  document.getElementById("fechaHora").innerText = ahora.toLocaleString();
}

// -------------------------------
// OBTENER TAXIS
// -------------------------------
async function obtenerTaxis() {
  try {
    const respuesta = await fetch(
      "https://proyecto-api-taxis.onrender.com/api/turnos"
    );

    if (!respuesta.ok) {
      throw new Error("Error API: " + respuesta.status);
    }

    const datos = await respuesta.json();
    return Array.isArray(datos) ? datos : [];

  } catch (error) {
    console.error(error);
    return [];
  }
}

// -------------------------------
// COMPARAR CAMBIOS
// -------------------------------
function hayCambios(nuevos, anteriores) {
  return JSON.stringify(nuevos) !== JSON.stringify(anteriores);
}

// -------------------------------
// ACTUALIZAR TABLA
// -------------------------------
async function cargarTabla() {

  const taxis = await obtenerTaxis();

  // Si no hubo cambios, no hace nada
  if (!hayCambios(taxis, taxisAnteriores)) {
    return;
  }

  taxisAnteriores = taxis;

  const tabla = document.getElementById("tablaTaxis");

  // SOLO aquí limpia la tabla
  tabla.innerHTML = "";

  if (taxis.length === 0) {

    tabla.innerHTML = `
      <tr>
        <td colspan="4" class="text-center">
          No hay datos
        </td>
      </tr>
    `;

    return;
  }

  taxis.forEach((taxi, index) => {

    const fila = document.createElement("tr");

    const esTurno = index === 0;

    fila.innerHTML = `
      <td>${index + 1}</td>
      <td>${taxi.placa ?? "-"}</td>
      <td>${taxi.conductor ?? "-"}</td>
      <td class="${esTurno ? "status-listo" : "status-espera"}">
        ${esTurno ? "En turno" : "En espera"}
      </td>
    `;

    tabla.appendChild(fila);
  });

  document.getElementById("proximoTaxi").innerText =
    taxis[0]?.placa ?? "---";
}

// -------------------------------
// INICIO
// -------------------------------
document.addEventListener("DOMContentLoaded", () => {

  actualizarHora();

  setInterval(actualizarHora, 5000);

  cargarTabla();

  // revisa cambios cada segundo
  setInterval(cargarTabla, 5000);
});