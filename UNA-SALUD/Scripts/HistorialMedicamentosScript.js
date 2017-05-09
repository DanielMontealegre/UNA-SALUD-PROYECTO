let ArrayConcentracion

$.get("/Historial/GetTiposConcentracion",
function (data) {
    var json = JSON.stringify(data);
    ArrayConcentracion = data;
});

let ArrayDosis

$.get("/Historial/GetTiposDosis",
function (data) {
    var json = JSON.stringify(data);
    ArrayDosis = data;
});

let ArrayAdministracion

$.get("/Historial/GetTiposAdministracion",
function (data) {
    var json = JSON.stringify(data);
    ArrayAdministracion = data;
});

$(document).ready(function () {
    var email = $("#pacienteMedicamentos").html();
    var emailSinEspacios = email.replace(/\s+/g, '');
    var emailEncoded = encodeURIComponent(emailSinEspacios);
    let tipoEstados;
    let table = $('#listarMedicamentos').DataTable({
        "ajax": {
            "url": "/Historial/GetMedicamentos/" + emailEncoded + "/",
            "dataSrc": ""
        },
        "columns": [
        { "data": "Concentracion.Descripcion" },
        { "data": "Dosis.Descripcion" },
        { "data": "Administracion.Descripcion" },
        { "data": "Nombre" },
        { "data": "Frecuencia" },
        { "data": "Motivo" },
        {
            "data": "FechaInicio", "mRender": function (data) {
                if (data == null) return dtConvFromJSON(data);
                if (data.includes("Date"))
                    return dtConvFromJSON(data);
                else return data;
            }
        },
        {
            "data": "FechaFin", "mRender": function (data) {
                if (data == null) return dtConvFromJSON(data);
                if (data.includes("Date"))
                    return dtConvFromJSON(data);
                else return data;
            }
        },
        { "data": "Detalle" },
        ],
        "fnCreatedRow": function (nRow, aData, iDataIndex) {
            var str = aData.Codigo;
            $(nRow).attr('id', "Row" + str);
        },
        "aoColumnDefs": [
            {
                "aTargets": [9],
                "data": "Paciente",
                "mRender": function (data, type, full) {

                    let btnEliminar = '  <button class="btn btn-danger btn-xs" >    <i class="fa fa-trash"> </i> Eliminar</button>';
                    return '<button class="btn btn-primary btn-xs">    <i class="fa fa-edit"> </i> Editar</button> | ' + btnEliminar;
                },
            },
            { "type": "date-eu", "aTargets": [6, 7] }
        ]
    });



    $('#listarMedicamentos tbody').on('click', '.btn-danger', function () {
        var data = table.row($(this).parents('tr')).data();
        var index = table.row($(this).parents('tr')).index();

        eliminarMedicamento(data.Codigo, data.Nombre);
    });


    $('#listarMedicamentos tbody').on('click', ' .btn-primary', function () {
        var data = table.row($(this).parents('tr')).data();
        var index = table.row($(this).parents('tr')).index();

        editarMedicamento(data.Codigo, index);
    });
});

function AbrilModalAgregarMedicamento() {
    var paciente = $("#pacienteMedicamentos").html();
    $("#formAgregarMedicamento #Paciente").val(paciente).attr("disabled", true);
    $("#modalAgregarMedicamento").modal("show");
}

function guardarMedicamento() {
    if ($("#formAgregarMedicamento").valid()) {
        $("#formAgregarMedicamento #Paciente").attr("disabled", false);
        $.post("/Historial/GuardarMedicamento",
        $("#formAgregarMedicamento").serialize(),
       function (data) {
           //limpiarFormularioAgregar();
           if (data.Resultado)
               $("#modalAgregarMedicamento").modal("hide");
           actualizarTablaNewRow(data.CodigoMedicamento);
           limpiarFormularioAgregar();
           swal("Exito!", "Medicamento agregado correctamente!", "success");
       });
    }

}

function limpiarFormularioAgregar() {
    $("#formAgregarMedicamento #Paciente").val("");
    $("#formAgregarMedicamento #Nombre").val("");
    $("#formAgregarMedicamento #Concentracion").val("");
    $("#formAgregarMedicamento #Detalle").val("");
    $("#formAgregarMedicamento #FechaInicio").val("");
    $("#formAgregarMedicamento #FechaFin").val("");
    $("#formAgregarMedicamento #Dosis").val("");
    $("#formAgregarMedicamento #Frecuencia").val("");
    $("#formAgregarMedicamento #Administracion").val("");
    $("#formAgregarMedicamento #Motivo").val("");
}

function actualizarTablaNewRow(codigoMedicamento) {
    var table = $('#listarMedicamentos').DataTable();
    var nombre = $("#formAgregarMedicamento #Nombre").val();
    var frecuencia = $("#formAgregarMedicamento #Frecuencia").val();
    var motivo = $("#formAgregarMedicamento #Motivo").val();

    var Concentracion = ArrayConcentracion.find(x => x.Codigo == ($("#formAgregarMedicamento #Concentracion").val()));
    var Dosis = ArrayDosis.find(x => x.Codigo == ($("#formAgregarMedicamento #Dosis").val()));
    var Administracion = ArrayAdministracion.find(x => x.Codigo == ($("#formAgregarMedicamento #Administracion").val()));

    var FechaInicio = $("#formAgregarMedicamento #FechaInicio").val();
    var FechaFin = $("#formAgregarMedicamento #FechaFin").val();
    var Notas = $("#formAgregarMedicamento #Detalle").val();

    var dateInicio = new Date(FechaInicio);
    var dateFin = new Date(FechaFin);

    var StringInicio = (dateInicio.getDate() + 1) + '/' + (dateInicio.getMonth() + 1) + '/' + dateInicio.getFullYear();
    var StringFin = (dateFin.getDate() + 1) + '/' + (dateFin.getMonth() + 1) + '/' + dateFin.getFullYear();

    var row = table.row.add({
        "Concentracion": Concentracion,
        "Dosis": Dosis,
        "Administracion": Administracion,
        "Nombre": nombre,
        "Frecuencia": frecuencia,
        "Motivo": motivo,
        "FechaInicio": StringInicio,
        "FechaFin": StringFin,
        "Detalle": Notas,
        "Codigo": codigoMedicamento
    })
    .draw();

    row.nodes().to$().attr('id', 'Row' + codigoMedicamento);
}

function editarMedicamento(codigoMedicamento, index) {
    $.get("/Historial/ObtenerMedicamento",
    { codigo: codigoMedicamento },
    function (data) {
        var json = JSON.stringify(data);
        $("#formEditarMedicamento #Paciente").val(data.Paciente).attr("disabled", true);
        $("#formEditarMedicamento #Concentracion").val(data.Concentracion);
        $("#formEditarMedicamento #Dosis").val(data.Dosis);
        $("#formEditarMedicamento #Administracion").val(data.Administracion);
        $("#formEditarMedicamento #Nombre").val(data.Nombre);
        $("#formEditarMedicamento #Frecuencia").val(data.Frecuencia);
        $("#formEditarMedicamento #Motivo").val(data.Motivo);
        $("#formEditarMedicamento #FechaInicio").val(dtConvFromJSON(data.FechaInicio));
        $("#formEditarMedicamento #FechaFin").val(dtConvFromJSON(data.FechaFin));
        $("#formEditarMedicamento #Detalle").val(data.Detalle);
        var codigo = $("#formEditarMedicamento #Codigo")
        codigo.val(codigoMedicamento);
        $("#CodigoTR").val(index);
        $("#modalEditarMedicamento").modal("show");
    })
}

function guardarEditarMedicamento() {
    $("#formEditarMedicamento #Paciente").attr("disabled", false);
    $.post("/Historial/EditarMedicamento",
        $("#formEditarMedicamento").serialize(),
   function (data) {
       actualizarTablaMedicamentos($("#CodigoTR").val());
       swal("Exito!", "Medicamento editado correctamente!", "success")
       $("#modalEditarMedicamento").modal("hide");
   });


    function actualizarTablaMedicamentos(dataIndex) {
        var table = $('#listarMedicamentos').DataTable();
        var row = table.row(parseInt(dataIndex)).node();

        var Concentracion = ArrayConcentracion.find(x => x.Codigo == ($("#formEditarMedicamento #Concentracion").val())).Descripcion;
        var Dosis = ArrayDosis.find(x=>x.Codigo == ($("#formEditarMedicamento #Dosis").val())).Descripcion;
        var Administracion = ArrayAdministracion.find(x=>x.Codigo == ($("#formEditarMedicamento #Administracion").val())).Descripcion;

        var fechaInicio = $("#formEditarMedicamento #FechaInicio").val();
        var fechaFin = $("#formEditarMedicamento #FechaFin").val();

        var dateInicio = new Date(fechaInicio);
        var dateFin = new Date(fechaFin);

        var StringInicio = (dateInicio.getDate() + 1) + '/' + (dateInicio.getMonth() + 1) + '/' + dateInicio.getFullYear();
        var StringFin = (dateFin.getDate() + 1) + '/' + (dateFin.getMonth() + 1) + '/' + dateFin.getFullYear();

        $('#listarMedicamentos').dataTable().fnUpdate(Concentracion, row, 0);
        $('#listarMedicamentos').dataTable().fnUpdate(Dosis, row, 1);
        $('#listarMedicamentos').dataTable().fnUpdate(Administracion, row, 2);
        $('#listarMedicamentos').dataTable().fnUpdate($("#formEditarMedicamento #Nombre").val(), row, 3);
        $('#listarMedicamentos').dataTable().fnUpdate($("#formEditarMedicamento #Frecuencia").val(), row, 4);
        $('#listarMedicamentos').dataTable().fnUpdate($("#formEditarMedicamento #Motivo").val(), row, 5);
        $('#listarMedicamentos').dataTable().fnUpdate(StringInicio, row, 6);
        $('#listarMedicamentos').dataTable().fnUpdate(StringFin, row, 7);
        $('#listarMedicamentos').dataTable().fnUpdate($("#formEditarMedicamento #Detalle").val(), row, 8);
    }
}

function eliminarMedicamento(codigo) {
    swal({
        title: "Desea eliminar esta medicamento?",
        text: "El medicamento sera eliminada de forma permanente de este paciente",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "No, cancelar",
        closeOnConfirm: false,
        closeOnCancel: false
    },
    function (isConfirm) {
        if (isConfirm) {

            $.post(
                "/Historial/RemoverMedicamento",
                { codigo: codigo },
                function result(data) {
                    if (data) {
                        hideRow(codigo);
                        swal("Eliminada!", "Se ha eliminado el medicamento correctamente", "success");
                    }
                    else {
                        swal("Cancelado", "No se eliminó el medicamento", "error");
                    }
                });

        } else {
            swal("Cancelado", "No se eliminó el medicamento ", "error");
        }
    });

}

function hideRow(codigo) {
    var table = $('#listarMedicamentos').DataTable();
    $.fn.dataTable.ext.search.push(
      function (settings, data, dataIndex) {
          return $(table.row(dataIndex).node()).attr("id") != "Row" + codigo;
      }
    );
    table.draw();
}
