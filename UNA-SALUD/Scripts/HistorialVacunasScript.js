let ArrayAdministracion

$.get("/Historial/GetAdministracionesVacuna",
function (data) {
    var json = JSON.stringify(data);
    ArrayAdministracion = data;
});

$(document).ready(function () {
    let tipoEstados;
    let table = $('#listarVacunas').DataTable({
        "ajax": {
            "url": "/Historial/GetVacunas/",
            "dataSrc": ""
        },
        "columns": [
        { "data": "Nombre" },
        {
            "data": "FechaRecepcion", "mRender": function (data) {
                return dtConvFromJSON(data);
            }
        },
        { "data": "Administracion", },
        { "data": "NumeroSecuencia" },
        { "data": "EfectoSecundarios" },
        { "data": "ParteCuerpo" },
        { "data": "Detalle" },
        ],
        "fnCreatedRow": function (nRow, aData, iDataIndex) {
            var str = aData.Codigo;
            $(nRow).attr('id', "Row" + str);
        },
        "aoColumnDefs": [
            {
                "aTargets": [7],
                "data": "Paciente",
                "mRender": function (data, type, full) {

                    let btnEliminar = '  <button class="btn btn-danger btn-xs" >    <i class="fa fa-trash"> </i> Eliminar</button>';
                    return '<button class="btn btn-primary btn-xs">    <i class="fa fa-edit"> </i> Editar</button> | ' + btnEliminar;
                },
            },
            { "type": "date-eu", "aTargets": 1 }
        ]
    });


    $('#listarVacunas tbody').on('click', '.btn-danger', function () {
        var data = table.row($(this).parents('tr')).data();
        var index = table.row($(this).parents('tr')).index();

        eliminarVacuna(data.Codigo, data.Nombre);
    });


    $('#listarVacunas tbody').on('click', ' .btn-primary', function () {
        var data = table.row($(this).parents('tr')).data();
        var index = table.row($(this).parents('tr')).index();

        editarVacuna(data.Codigo, index);
    });
});

function guardarVacuna() {
    if ($("#formAgregarVacuna").valid()) {
        $("#formAgregarVacuna #Paciente").attr("disabled", false);
        $.post("/Historial/GuardarVacuna",
        $("#formAgregarVacuna").serialize(),
       function (data) {
           //limpiarFormularioAgregar();
           if (data.Resultado)
               $("#modalAgregarVacuna").modal("hide");
           actualizarTablaNewRow(data.CodigoVacuna);
           limpiarFormularioAgregar();
           swal("Exito!", "Vacuna agregada correctamente!", "success")
       });
    }
}

function AbrilModalAgregarVacuna() {
    var paciente = $("#pacienteVacunas").html();
    $("#formAgregarVacuna #Paciente").val(paciente).attr("disabled", true);
    $("#modalAgregarVacuna").modal("show");
}

function actualizarTablaNewRow(codigoVacuna) {
    var table = $('#listarVacunas').DataTable();
    var nombre = $("#formAgregarVacuna #Nombre").val();

    var Administracion = ArrayAdministracion.find(x => x.Codigo == ($("#formAgregarVacuna #Administracion").val())).Descripcion;


    var FechaRecepcion = $("#formAgregarVacuna #FechaRecepcion").val();

    var Notas = $("#formAgregarVacuna #Detalle").val();
    var NumSecuencia = $("#formAgregarVacuna #NumeroSecuencia").val();
    var ParteCuerpo = $("#formAgregarVacuna #ParteCuerpo").val();
    var EfectoSecundarios = $("#formAgregarVacuna #EfectoSecundarios").val();

    var dateRecepcion = new Date(FechaRecepcion);

    var StringRecepcion = (dateRecepcion.getDate() + 1) + '/' + (dateRecepcion.getMonth() + 1) + '/' + dateRecepcion.getFullYear();

    var row = table.row.add({
        "Nombre": nombre,
        "FechaRecepcion": StringRecepcion,
        "Administracion": Administracion,
        "NumeroSecuencia": NumSecuencia,
        "EfectoSecundarios": EfectoSecundarios,
        "ParteCuerpo": ParteCuerpo,
        "Detalle": Notas,
        "Codigo": codigoVacuna
    })
    .draw();

    row.nodes().to$().attr('id', 'Row' + codigoVacuna);
}

function limpiarFormularioAgregar() {
    $("#formAgregarVacuna #Paciente").val("");
    $("#formAgregarVacuna #Nombre").val("");
    $("#formAgregarVacuna #Administracion").val("");
    $("#formAgregarVacuna #Detalle").val("");
    $("#formAgregarVacuna #FechaRecepcion").val("");
    $("#formAgregarVacuna #NumeroSecuencia").val("");
    $("#formAgregarVacuna #ParteCuerpo").val("");
    $("#formAgregarVacuna #EfectoSecundarios").val("");
}

function editarVacuna(codigoVacuna, index) {
    $.get("/Historial/ObtenerVacuna",
{ codigo: codigoVacuna },
function (data) {
    var json = JSON.stringify(data);
    $("#formEditarVacuna #Paciente").val(data.Paciente).attr("disabled", true);
    $("#formEditarVacuna #Nombre").val(data.Nombre);
    $("#formEditarVacuna #Administracion").val(data.Administracion);
    $("#formEditarVacuna #Detalle").val(data.Detalle);
    $("#formEditarVacuna #FechaRecepcion").val(dtConvFromJSON(data.FechaRecepcion));
    $("#formEditarVacuna #NumeroSecuencia").val(data.NumeroSecuencia);
    $("#formEditarVacuna #ParteCuerpo").val(data.ParteCuerpo);
    $("#formEditarVacuna #EfectoSecundarios").val(data.EfectoSecundarios);
    var codigo = $("#formEditarVacuna #Codigo")
    codigo.val(codigoVacuna);
    $("#CodigoTR").val(index);
    $("#modalEditarVacuna").modal("show");
})
}

function guardarEditarVacuna() {
    $("#formEditarVacuna #Paciente").attr("disabled", false);
    $.post("/Historial/EditarVacuna",
  $("#formEditarVacuna").serialize(),
   function (data) {
       actualizarTablaVacunas($("#CodigoTR").val());
       swal("Exito!", "Vacuna editada correctamente!", "success")
       $("#modalEditarVacuna").modal("hide");
   });


    function actualizarTablaVacunas(dataIndex) {
        var table = $('#listarVacunas').DataTable();
        var row = table.row(parseInt(dataIndex)).node();

        var fechaRecepcion = $("#formEditarVacuna #FechaRecepcion").val();

        var dateRecepcion = new Date(fechaRecepcion);

        var StringRecepcion = (dateRecepcion.getDate() + 1) + '/' + (dateRecepcion.getMonth() + 1) + '/' + dateRecepcion.getFullYear();

        var Administracion = ArrayAdministracion.find(x => x.Codigo == ($("#formEditarVacuna #Administracion").val())).Descripcion;

        $('#listarVacunas').dataTable().fnUpdate($("#formEditarVacuna #Nombre").val(), row, 0);
        $('#listarVacunas').dataTable().fnUpdate(StringRecepcion, row, 1);
        $('#listarVacunas').dataTable().fnUpdate(Administracion, row, 2);
        $('#listarVacunas').dataTable().fnUpdate($("#formEditarVacuna #NumeroSecuencia").val(), row, 3);
        $('#listarVacunas').dataTable().fnUpdate($("#formEditarVacuna #EfectoSecundarios").val(), row, 4);
        $('#listarVacunas').dataTable().fnUpdate($("#formEditarVacuna #ParteCuerpo").val(), row, 5);
        $('#listarVacunas').dataTable().fnUpdate($("#formEditarVacuna #Detalle").val(), row, 6);
    }
}

function eliminarVacuna(codigo, nombre) {
    swal({
        title: "Desea eliminar esta vacuna?",
        text: "La vacuna " + nombre + " será eliminada de forma permanente de este paciente",
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
                "/Historial/RemoverVacuna",
                { codigo: codigo },
                function result(data) {
                    if (data) {
                        hideRow(codigo);
                        swal("Eliminada!", "Se ha eliminado la vacuna" + nombre + "correctamente", "success");
                    }
                    else {
                        swal("Cancelado", "No se elimino la vacuna " + nombre, "error");
                    }
                });

        } else {
            swal("Cancelado", "No se elimino la vacuna " + nombre, "error");
        }
    });

}

function hideRow(codigo) {
    var table = $('#listarVacunas').DataTable();
    $.fn.dataTable.ext.search.push(
      function (settings, data, dataIndex) {
          return $(table.row(dataIndex).node()).attr("id") != "Row" + codigo;
      }
    );
    table.draw();
}
