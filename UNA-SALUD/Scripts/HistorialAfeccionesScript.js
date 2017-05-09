


let ArrayEstado

$.get("/Historial/GetEstadosAfeccion",
function (data) {
    var json = JSON.stringify(data);
    ArrayEstado = data;
});



$(document).ready(function () {


    let tipoEstados;
    let table = $('#listarAfecciones').DataTable({
        "ajax": {
            "url": "/Historial/GetAfecciones/",
            "dataSrc": ""
        },
        "columns": [
        { "data": "Nombre" },
        { "data": "Estado", },
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
                "aTargets": [5],
                "data": "Paciente",
                "mRender": function (data, type, full) {

                    let btnEliminar = '  <button class="btn btn-danger btn-xs" >    <i class="fa fa-trash"> </i> Eliminar</button>';
                    return '<button class="btn btn-primary btn-xs">    <i class="fa fa-edit"> </i> Editar</button> | ' + btnEliminar;
                },
            },
            { "type": "date-eu", "aTargets": [2, 3] }
        ]
    });



    $('#listarAfecciones tbody').on('click', '.btn-danger', function () {
        var data = table.row($(this).parents('tr')).data();
        var index = table.row($(this).parents('tr')).index();

        eliminarAfeccion(data.Codigo, data.Nombre);
    });


    $('#listarAfecciones tbody').on('click', ' .btn-primary', function () {
        var data = table.row($(this).parents('tr')).data();
        var index = table.row($(this).parents('tr')).index();

        editarAfeccion(data.Codigo, index);
    });
});


function guardarAfeccion() {
    if ($("#formAgregarAfeccion").valid()) {
    $("#formAgregarAfeccion #Paciente").attr("disabled", false);
    $.post("/Historial/GuardarAfeccion",
    $("#formAgregarAfeccion").serialize(),
   function (data) {
       //limpiarFormularioAgregar();
       if (data.Resultado)
           $("#modalAgregarAfeccion").modal("hide");
       actualizarTablaNewRow(data.CodigoAfeccion);
       limpiarFormularioAgregar();
       swal("Exito!", "Afección agregada correctamente!", "success")
   });
    }

}


function AbrilModalAgregarAfeccion() {
    var paciente = $("#pacienteAfecciones").html();
    $("#formAgregarAfeccion #Paciente").val(paciente).attr("disabled", true);
    $("#modalAgregarAfeccion").modal("show");


}

function actualizarTablaNewRow(codigoAfeccion) {
    var table = $('#listarAfecciones').DataTable();
    var nombre = $("#formAgregarAfeccion #Nombre").val();


    var Estado = ArrayEstado.find(x => x.Codigo == ($("#formAgregarAfeccion #Estado").val())).Descripcion;


    var FechaInicio = $("#formAgregarAfeccion #FechaInicio").val();
    var FechaFin = $("#formAgregarAfeccion #FechaFin").val();
    var Notas = $("#formAgregarAfeccion #Detalle").val()

    var dateInicio = new Date(FechaInicio);
    var dateFin = new Date(FechaFin);

    var StringInicio = (dateInicio.getDate() + 1) + '/' + (dateInicio.getMonth() + 1) + '/' + dateInicio.getFullYear();
    var StringFin = (dateFin.getDate() + 1) + '/' + (dateFin.getMonth() + 1) + '/' + dateFin.getFullYear();

    var row = table.row.add({
        "Nombre": nombre,
        "Estado": Estado,
        "FechaInicio": StringInicio,
        "FechaFin": StringFin,
        "Detalle": Notas,
        "Codigo": codigoAfeccion
    })
    .draw();

    row.nodes().to$().attr('id', 'Row' + codigoAfeccion);
}


function limpiarFormularioAgregar() {
    $("#formAgregarAfeccion #Paciente").val("");
    $("#formAgregarAfeccion #Nombre").val("");
    $("#formAgregarAfeccion #Estado").val("");
    $("#formAgregarAfeccion #Detalle").val("");
    $("#formAgregarAfeccion #FechaInicio").val("");
    $("#formAgregarAfeccion #FechaFin").val("");
}


function editarAfeccion(codigoAfeccion, index) {
    $.get("/Historial/ObtenerAfeccion",
{ codigo: codigoAfeccion },
function (data) {
    var json = JSON.stringify(data);
    $("#formEditarAfeccion #Paciente").val(data.Paciente).attr("disabled", true);
    $("#formEditarAfeccion #Nombre").val(data.Nombre);
    $("#formEditarAfeccion #Estado").val(data.Estado);
    $("#formEditarAfeccion #Detalle").val(data.Detalle);
    $("#formEditarAfeccion #FechaInicio").val(dtConvFromJSON(data.FechaInicio));
    $("#formEditarAfeccion #FechaFin").val(dtConvFromJSON(data.FechaFin));
    var codigo = $("#formEditarAfeccion #Codigo")
    codigo.val(codigoAfeccion);
    $("#CodigoTR").val(index);
    $("#modalEditarAfeccion").modal("show");
})
}

function guardarEditarAfeccion() {
    $("#formEditarAfeccion #Paciente").attr("disabled", false);
    $.post("/Historial/EditarAfeccion",
  $("#formEditarAfeccion").serialize(),
   function (data) {
       actualizarTablaAfecciones($("#CodigoTR").val());
       swal("Exito!", "afección editada correctamente!", "success")
       $("#modalEditarAfeccion").modal("hide");
   });


    function actualizarTablaAfecciones(dataIndex) {
        var table = $('#listarAfecciones').DataTable();
        var row = table.row(parseInt(dataIndex)).node();

        var fechaInicio = $("#formEditarAfeccion #FechaInicio").val();
        var fechaFin = $("#formEditarAfeccion #FechaFin").val();

        var dateInicio = new Date(fechaInicio);
        var dateFin = new Date(fechaFin);

        var StringInicio = (dateInicio.getDate() + 1) + '/' + (dateInicio.getMonth() + 1) + '/' + dateInicio.getFullYear();
        var StringFin = (dateFin.getDate() + 1) + '/' + (dateFin.getMonth() + 1) + '/' + dateFin.getFullYear();

        var Estado = ArrayEstado.find(x => x.Codigo == ($("#formEditarAfeccion #Estado").val())).Descripcion;

        $('#listarAfecciones').dataTable().fnUpdate($("#formEditarAfeccion #Nombre").val(), row, 0);
        $('#listarAfecciones').dataTable().fnUpdate(Estado, row, 1);
        $('#listarAfecciones').dataTable().fnUpdate(StringInicio, row, 2);
        $('#listarAfecciones').dataTable().fnUpdate(StringFin, row, 3);
        $('#listarAfecciones').dataTable().fnUpdate($("#formEditarAfeccion #Detalle").val(), row, 4);
    }
}




function eliminarAfeccion(codigo, nombre) {
    swal({
        title: "Desea eliminar esta afección?",
        text: "La afección " + nombre + " sera eliminada de forma permanente de este paciente",
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
                "/Historial/RemoverAfeccion",
                { codigo: codigo },
                function result(data) {
                    if (data) {
                        hideRow(codigo);
                        swal("Eliminada!", "Se ha eliminado la afección" + nombre + "correctamente", "success");
                    }
                    else {
                        swal("Cancelado", "No se elimino la afección " + nombre, "error");
                    }
                });

        } else {
            swal("Cancelado", "No se elimino la afeccion " + nombre, "error");
        }
    });

}

function hideRow(codigo) {
    var table = $('#listarAfecciones').DataTable();
    $.fn.dataTable.ext.search.push(
      function (settings, data, dataIndex) {
          return $(table.row(dataIndex).node()).attr("id") != "Row" + codigo;
      }
    );
    table.draw();
}
