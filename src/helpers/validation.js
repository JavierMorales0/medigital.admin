export const validateCreateConsult = (data) => {
  if (!data.date) {
    return { msg: 'Fecha faltante', status: false }
  }
  if (!data.patient || data.patient.length !== 24) {
    return { msg: 'El ID de paciente no es correcto', status: false }
  }
  if (!data.doctor || data.doctor.length !== 24) {
    return { msg: 'El ID de doctor no es correcto', status: false }
  }
  if (!data.reason || data.reason.length < 5) {
    return {
      msg: 'El motivo es requerido y debe ser mayor a 5 caracteres',
      status: false,
    }
  }
  return { msg: '', status: true }
}
