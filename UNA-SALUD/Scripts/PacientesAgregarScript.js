function limpiarFormularioAgregar() {
    $("#formAgregarPaciente #Email").val("");
    $("#formAgregarPaciente #Nombre").val("");
    $("#formAgregarPaciente #Apellido1").val("");
    $("#formAgregarPaciente #Apellido2").val("");
    $("#formAgregarPaciente #Sexo").val("");
    $("#formAgregarPaciente #TipoSangre").val("");
}


function agregarPaciente() {
    if($("#formAgregarPaciente").valid()){
        $.post("/Pacientes/Guardar",
              $("#formAgregarPaciente").serialize(),
               function (data) {
                   limpiarFormularioAgregar();
                   if (data)
                       swal("Exito!", "Paciente agregado correctamente!", "success")
               });
    }
}