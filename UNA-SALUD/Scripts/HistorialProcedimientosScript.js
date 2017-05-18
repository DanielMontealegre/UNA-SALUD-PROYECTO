$(document).ready(function () {
    var email = $("#pacienteProcedimientos").html();
    var emailSinEspacios = email.replace(/\s+/g, '');
    var emailEncoded = encodeURIComponent(emailSinEspacios);
    let table = $('#listarProcedimientos').DataTable({
        "ajax": {
            "url": "/Historial/GetProcedimientos/" + emailEncoded + "/",
            "dataSrc": ""
        },
        "columns": [
        { "data": "Procedimiento1" },
        { "data": "UbicacionAnatomica", },
        { "data": "Motivo"},
        {
            "data": "Fecha", "mRender": function (data) {
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
            { "type": "date-eu", "aTargets": 3 }
        ]
    });



    $('#listarProcedimientos tbody').on('click', '.btn-danger', function () {
        var data = table.row($(this).parents('tr')).data();
        var index = table.row($(this).parents('tr')).index();

        eliminarProcedimiento(data.Codigo, data.Nombre);
    });


    $('#listarProcedimientos tbody').on('click', ' .btn-primary', function () {
        var data = table.row($(this).parents('tr')).data();
        var index = table.row($(this).parents('tr')).index();

        editarProcedimiento(data.Codigo, index);
    });

});

function AbrilModalAgregarProcedimiento() {
    var paciente = $("#pacienteProcedimientos").html();
    $("#formAgregarProcedimiento #Paciente").val(paciente).attr("disabled", true);
    $("#modalAgregarProcedimiento").modal("show");
}

function guardarProcedimiento() {
    if ($("#formAgregarProcedimiento").valid()) {
        $("#formAgregarProcedimiento #Paciente").attr("disabled", false);
        $.post("/Historial/AgregarProcedimiento",
        $("#formAgregarProcedimiento").serialize(),
       function (data) {
           //limpiarFormularioAgregar();
           if (data.Resultado)
               $("#modalAgregarProcedimiento").modal("hide");
           actualizarTablaNewRow(data.CodigoProcedimiento);
           limpiarFormularioAgregar();
           swal("Exito!", "Procedimiento agregado correctamente!", "success");
       });
    }

}

function limpiarFormularioAgregar() {
    $("#formAgregarProcedimiento #Paciente").val("");
    $("#formAgregarProcedimiento #Procedimiento1").val("");
    $("#formAgregarProcedimiento #UbicacionAnatomica").val("");
    $("#formAgregarProcedimiento #Motivo").val("");
    $("#formAgregarProcedimiento #Fecha").val("");
    $("#formAgregarProcedimiento #Detalle").val("");
}


function actualizarTablaNewRow(codigoProcedimiento) {
    var table = $('#listarProcedimientos').DataTable();
    var Procedimiento = $("#formAgregarProcedimiento #Procedimiento1").val();
    var UbicacionAnatomica = $("#formAgregarProcedimiento #UbicacionAnatomica").val();
    var motivo = $("#formAgregarProcedimiento #Motivo").val();

    var Fecha= $("#formAgregarProcedimiento #Fecha").val();
    var Notas = $("#formAgregarProcedimiento #Detalle").val();

    var date= new Date(Fecha);

    var StringFecha= (date.getDate() + 1) + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();

    var row = table.row.add({
        "Procedimiento1": Procedimiento,
        "UbicacionAnatomica": UbicacionAnatomica,
        "Motivo": motivo,
        "FechaInicio": StringFecha,
        "Detalle": Notas,
        "Codigo": codigoProcedimiento
    })
    .draw();

    row.nodes().to$().attr('id', 'Row' + codigoProcedimiento);
}

function editarProcedimiento(codigoProcedimiento, index) {
    $.get("/Historial/ObtenerProcedimiento",
    { codigo: codigoProcedimiento },
    function (data) {
        var json = JSON.stringify(data);
        $("#formEditarProcedimiento #Paciente").val(data.Paciente).attr("disabled", true);
        $("#formEditarProcedimiento #Procedimiento1").val(data.Procedimiento1);
        $("#formEditarProcedimiento #UbicacionAnatomica").val(data.UbicacionAnatomica);
        $("#formEditarProcedimiento #Motivo").val(data.Motivo);
        $("#formEditarProcedimiento #Fecha").val(dtConvFromJSON(data.Fecha));
        $("#formEditarProcedimiento #Detalle").val(data.Detalle);
        var codigo = $("#formEditarProcedimiento #Codigo")
        codigo.val(codigoProcedimiento);
        $("#CodigoTR").val(index);
        $("#modalEditarProcedimiento").modal("show");
    })
}

function guardarEditarProcedimiento() {
    $("#formEditarProcedimiento #Paciente").attr("disabled", false);
    $.post("/Historial/EditarProcedimiento",
        $("#formEditarProcedimiento").serialize(),
   function (data) {
       actualizarTablaProcedimientos($("#CodigoTR").val());
       swal("Exito!", "Procedimiento editado correctamente!", "success")
       $("#modalEditarProcedimiento").modal("hide");
   });


    function actualizarTablaProcedimientos(dataIndex) {
        var table = $('#listarProcedimientos').DataTable();
        var row = table.row(parseInt(dataIndex)).node();

        var fechaInicio = $("#formEditarProcedimiento #Fecha").val();

        var dateInicio = new Date(fechaInicio);

        var StringInicio = (dateInicio.getDate() + 1) + '/' + (dateInicio.getMonth() + 1) + '/' + dateInicio.getFullYear();

        $('#listarProcedimientos').dataTable().fnUpdate($("#formEditarProcedimiento #Procedimiento1").val(), row, 0);
        $('#listarProcedimientos').dataTable().fnUpdate($("#formEditarProcedimiento #UbicacionAnatomica").val(), row, 1);
        $('#listarProcedimientos').dataTable().fnUpdate($("#formEditarProcedimiento #Motivo").val(), row, 2);
        $('#listarProcedimientos').dataTable().fnUpdate(StringInicio, row, 3);
        $('#listarProcedimientos').dataTable().fnUpdate($("#formEditarProcedimiento #Detalle").val(), row, 4);
    }
}

function eliminarProcedimiento(codigo) {
    swal({
        title: "Desea eliminar este procedimiento?",
        text: "El procedimiento será eliminado de forma permanente de este paciente",
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
                "/Historial/RemoverProcedimiento",
                { codigo: codigo },
                function result(data) {
                    if (data) {
                        hideRow(codigo);
                        swal("Eliminada!", "Se ha eliminado el procedimiento correctamente", "success");
                    }
                    else {
                        swal("Cancelado", "No se eliminó el procedimiento", "error");
                    }
                });

        } else {
            swal("Cancelado", "No se eliminó el procedimiento ", "error");
        }
    });

}

function hideRow(codigo) {
    var table = $('#listarProcedimientos').DataTable();
    $.fn.dataTable.ext.search.push(
      function (settings, data, dataIndex) {
          return $(table.row(dataIndex).node()).attr("id") != "Row" + codigo;
      }
    );
    table.draw();
}

