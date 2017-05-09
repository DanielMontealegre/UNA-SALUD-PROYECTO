


$(document).ready(function () {
    $('#laboratorioRegistro_Fecha').datetimepicker({
        format: "DD/MM/YYYY",
        showClose: true,
        showClear: true,
        toolbarPlacement: 'top'
    });
})





function abrirModalEscogerLaboratorio() {
    $("#modalListarLaboratorios").modal("show")
}




function abrirModalAgregarLaboratorio() {
    $("#modalListarLaboratorios").modal("hide")
    var paciente = $("#pacienteResultadosLaboratorio").html();
    var emailSinEspacios = paciente.replace(/\s+/g, '');
    $("#formAgregarLaboratorio #laboratorioRegistro_Paciente").val(emailSinEspacios).attr("disabled", true);
    $("#modalAgregarLaboratorio").modal("show")
     $("#CodigoLaboratorio").val("")
}

function volverAlistarLaboratorios() {
    $("#modalAgregarLaboratorio").modal("hide")
    $("#modalListarLaboratorios").modal("show")
}


function guardarLaboratorio() {
    var pathname = window.location.pathname; // Returns path only
    if ($("#formAgregarLaboratorio").valid()) {
        $("#formAgregarLaboratorio #laboratorioRegistro_Paciente").attr("disabled", false);
        var form = $("#formAgregarLaboratorio").serialize();
        $.post("/Historial/GuardarLaboratorio",
        $("#formAgregarLaboratorio").serialize(),
       function (data) {
           //limpiarFormularioAgregar();
           if (data.Resultado){
               limpiarFormAgregarLaboratorio();
               if (data.Editar) {          
                   if (pathname.includes("AgregarResultadoLaboratorio")) {
                       $("#modalAgregarLaboratorio").modal("hide");
                       mensajeOk("Exito!", "Laboratorio editado correctamente!", function () {
                           $("#modalListarLaboratorios").modal("show");
                       })
                   }
                   else {
                       $("#modalAgregarLaboratorio").modal("hide");
                       mensajeOk("Exito!", "Laboratorio editado correctamente!", function () {

                           actualizarTablaLaboratoriosNoResultados();                                        
                       })
                    
                   }                
               }
               else {
                   if (pathname.includes("AgregarResultadoLaboratorio")) {
                       mensajeOk("Exito!", "Laboratorio agregado correctamente!", function () {
                           cambiarAEstadoEditar(data.Codigo)
                       })

                   }
                   else {
                       $("#modalAgregarLaboratorio").modal("hide");
                       mensajeOk("Exito!", "Laboratorio agregado correctamente!", function () {   
                           actualizarTablaLaboratoriosNoResultados();
                       })
                   }
              
               }
                    
           }

       });
    }
}


function cambiarAEstadoEditar(codigoLaboratorioNuevo) {

    $("#CodigoLaboratorio").val(codigoLaboratorioNuevo);
    $("#botonAgregarLaboratorio").removeClass("btn btn-primary");
    $("#botonAgregarLaboratorio").addClass("btn btn-success");
    $("#botonAgregarLaboratorio").html("Editar Laboratorio");
    $("#iconoBotonAgregarLaboratorio").addClass("fa fa-edit")
    $("#iconoBotonAgregarLaboratorio").removeClass("fa fa-plus");
    $("#ResultadoLaboratorioRegistro_Laboratorio").val(codigoLaboratorioNuevo)



}

$('#modalListarLaboratorios').on('shown.bs.modal', function (e) {


    listarLaboratorios();


});

$('#modalListarLaboratorios').on('hidden.bs.modal', function (e) {


    $('#modalListarLaboratorios #listarLaboratorios').DataTable().destroy();
    $('#modalListarLaboratorios #listarLaboratorios-datatable').empty();

});

$('#modalAgregarLaboratorio').on('hidden.bs.modal', function (e) {


    limpiarFormAgregarLaboratorio();

});








function listarLaboratorios() {
    var email = $("#pacienteResultadosLaboratorio").html();
    var emailSinEspacios = email.replace(/\s+/g, '');
    var emailEncoded = encodeURIComponent(emailSinEspacios);
    let table = $('#listarLaboratorios').DataTable({
        "ajax": {
            "url": "/Historial/GetLaboratorios/"+emailEncoded+"/",
            "dataSrc": ""
        },
        "columns": [
        { "data": "Codigo" },
        { "data": "Laboratorio1" },
        { "data": "Estado", },
        { "data": "NombrePanelLaboratorio" },
        { "data": "Solicitado", },
        { "data": "NumeroSecuencia" },
        {
            "data": "Fecha", "mRender": function (data) {
                if (data == null) return dtConvFromJSON(data);
                if (data.includes("Date"))
                    return dtConvFromJSON(data);
                else return data;
            }
        }
        ],
        "fnCreatedRow": function (nRow, aData, iDataIndex) {
            var str = aData.Codigo;
            $(nRow).attr('id', "Row" + str);
        },
        "aoColumnDefs": [
            {
                "aTargets": [7],
                "data": "Codigo",
                "mRender": function (data, type, full) {
                    var pathname = window.location.pathname; // Returns path only
                    if (pathname.includes("AgregarResultadoLaboratorio")) {
                        let bntEscogerLab = '<button class="btn btn-success btn-xs" >    <i class="fa  fa-chevron-left"> </i> Escoger </button>';
                        return bntEscogerLab + ' | <button class="btn btn-primary btn-xs">    <i class="fa fa-edit"> </i> Editar</button>';
                    }
                    else {
                        let btnVerResultados = '<button class="btn btn-success btn-xs" >    <i class="fa  fa-info"> </i> Resultados </button>';
                        return btnVerResultados + ' | <button class="btn btn-primary btn-xs">    <i class="fa fa-edit"> </i> Editar</button>';
                    }
                    

                },
            },
            { "type": "date-eu", "aTargets": 7 }
        ]
    });

    table.columns.adjust();


    $('#listarLaboratorios tbody').on('click', '.btn-success', function () {
        var data = table.row($(this).parents('tr')).data();
        var index = table.row($(this).parents('tr')).index();
        var pathname = window.location.pathname; // Returns path only
        if (pathname.includes("AgregarResultadoLaboratorio")) {
            escogerLaboratorio(data.Codigo);
        }
        else {
            listarResultados(data.Codigo);
        }

    });


    $('#listarLaboratorios tbody').on('click', ' .btn-primary', function () {
        var data = table.row($(this).parents('tr')).data();
        var index = table.row($(this).parents('tr')).index();      
        editarLaboratorio(data.Codigo, index);
    });

}



function escogerLaboratorio(codigo) {
    $("#modalListarLaboratorios").modal("hide");
    $("#ResultadoLaboratorioRegistro_Laboratorio").val(codigo);
    $("#botonAgregarLaboratorio").removeClass("btn btn-primary");
    $("#botonAgregarLaboratorio").addClass("btn btn-success");
    $("#botonAgregarLaboratorio").html("Cambiar Laboratorio");
    $("#iconoBotonAgregarLaboratorio").addClass("fa fa-edit")
    $("#iconoBotonAgregarLaboratorio").removeClass("fa fa-plus");
    swal("Exito!", "Laboratorio escogido correctamente!", "success")
}


function guardarResultadoLaboratorio() {
    if ($("#formAgregarResultado").valid()) {
        $('#ResultadoLaboratorioRegistro_Laboratorio').attr("disabled", false);
        $.post("/Historial/GuardarResultadoLaboratorio",
        $("#formAgregarResultado").serialize(),
       function (data) {
           if (data) {             
               limpiarFormAgregarResultado();
               swal("Exito!", "Resultado agregado correctamente!", "success");
           }

       });
    }
}

function limpiarFormAgregarResultado() {
    $('#ResultadoLaboratorioRegistro_Laboratorio').attr("disabled", true);
    $('#ResultadoLaboratorioRegistro_Nombre').val("");
    $('#ResultadoLaboratorioRegistro_Laboratorio').val("");
    $('#ResultadoLaboratorioRegistro_Valor').val("");
    $('#ResultadoLaboratorioRegistro_Unidad').val("");
    $('#ResultadoLaboratorioRegistro_Marca option')[0].selected = true;
    $("#botonAgregarLaboratorio").removeClass("btn btn-success");
    $("#botonAgregarLaboratorio").addClass("btn btn-primary");
    $("#botonAgregarLaboratorio").html('<i id="iconoBotonAgregarLaboratorio" class="fa fa-plus"></i> Escoger Laboratorio');
}


function editarLaboratorio(codigo,index) {
    $.get("/Historial/GetLaboratorio",
      {codigo : codigo},
      function (data) {
          if (data) {
             
              llenarFormEditar(data);
          }

      });
}


function llenarFormEditar(data) {
    $("#modalListarLaboratorios").modal("hide");
    $("#modalAgregarLaboratorio").modal("show");
    $("#formAgregarLaboratorio #laboratorioRegistro_Paciente").attr("disabled", true);
    $("#CodigoLaboratorio").val(data.Codigo);
    $("#laboratorioRegistro_Paciente").val(data.Paciente)
    $("#laboratorioRegistro_Unidad").val(data.NumeroSecuencia)
    $("#laboratorioRegistro_Laboratorio").val(data.Laboratorio1)
    $("#laboratorioRegistro_Solicitado").val(data.Solicitado)
    $("#laboratorioRegistro_Estado").val(data.Estado)
    $("#laboratorioRegistro_Fecha").val(dtConvFromJSON(data.Fecha))
    $("#laboratorioRegistro_NombrePanelLaboratorio").val(data.NombrePanelLaboratorio)
}

function limpiarFormAgregarLaboratorio() {
    $("#laboratorioRegistro_Unidad").val("")
    $("#laboratorioRegistro_Laboratorio").val("")
    $("#laboratorioRegistro_Solicitado").val("")
    $("#laboratorioRegistro_Fecha").val("")
    $("#laboratorioRegistro_NombrePanelLaboratorio").val("")
    $('#laboratorioRegistro_Estado option')[0].selected = true
}







