let ArrayTipo

$.get("/Historial/GetTiposAlergias",
function (data) {
    var json = JSON.stringify(data);
    ArrayTipo = data;
});

let ArrayReacciones

$.get("/Historial/GetTiposReacciones",
function (data) {
    var json = JSON.stringify(data);
    ArrayReacciones = data;
});

$(document).ready(function () {
    let table = $('#listarAlergias').DataTable({
        "ajax": {
            "url": "/Historial/GetAlergias/",
            "dataSrc": ""
        },
        "columns": [
        { "data": "Tipo.Descripcion" },
        { "data": "Reaccion.Descripcion", },
        {"data": "Tratamiento"},
        {"data": "Detalle"},
        ],
        "fnCreatedRow": function (nRow, aData, iDataIndex) {
            var str = aData.Codigo;
            $(nRow).attr('id', "Row" + str);
        },
        "aoColumnDefs": [
            {
                "aTargets": [4],
                "data": "Paciente",
                "mRender": function (data, type, full) {

                    let btnEliminar = '  <button class="btn btn-danger btn-xs" >    <i class="fa fa-trash"> </i> Eliminar</button>';
                    return '<button class="btn btn-primary btn-xs">    <i class="fa fa-edit"> </i> Editar</button> | ' + btnEliminar;
                },
            }
        ]
    });


    $('#listarAlergias tbody').on('click', '.btn-danger', function () {
        var data = table.row($(this).parents('tr')).data();
        var index = table.row($(this).parents('tr')).index();

        eliminarAlergia(data.Codigo);
    });


    $('#listarAlergias tbody').on('click', ' .btn-primary', function () {
        var data = table.row($(this).parents('tr')).data();
        var index = table.row($(this).parents('tr')).index();

        editarAlergia(data.Codigo, index);
    });
});


function guardarAlergia() {
    if ($("#formAgregarAlergia").valid()) {
        $("#formAgregarAlergia #Paciente").attr("disabled", false);
        $.post("/Historial/GuardarAlergia",
        $("#formAgregarAlergia").serialize(),
       function (data) {
           //limpiarFormularioAgregar();
           if (data.Resultado)
               $("#modalAgregarAlergia").modal("hide");
           actualizarTablaNewRow(data.CodigoAlergia);
           limpiarFormularioAgregar();
           swal("Exito!", "Alergia agregada correctamente!", "success")
       });
    }

}


function AbrilModalAgregarAlergia() {
    var paciente = $("#pacienteAlergias").html();
    $("#formAgregarAlergia #Paciente").val(paciente).attr("disabled", true);
    $("#modalAgregarAlergia").modal("show");
}

function actualizarTablaNewRow(codigoAlergia) {
    var table = $('#listarAlergias').DataTable();
    var tratamiento = $("#formAgregarAlergia #Tratamiento").val();


    var tipo = ArrayTipo.find(x => x.Codigo == ($("#formAgregarAlergia #Tipo").val()));


    var reaccion = ArrayReacciones.find(x => x.Codigo == ($("#formAgregarAlergia #Reaccion").val()));
    var detalle = $("#formAgregarAlergia #Detalle").val();



    var row = table.row.add({
        "Tratamiento": tratamiento,
        "Tipo": tipo,
        "Reaccion": reaccion,
        "Detalle": detalle,
        "Codigo": codigoAlergia
    })
    .draw();

    row.nodes().to$().attr('id', 'Row' + codigoAlergia);
}


function limpiarFormularioAgregar() {
    $("#formAgregarAlergia #Paciente").val("");
    $("#formAgregarAlergia  #Tratamiento").val("");
    $("#formAgregarAlergia  #Tipo").val("");
    $("#formAgregarAlergia  #Detalle").val("");
    $("#formAgregarAlergia  #Reaccion").val("");
}


function editarAlergia(codigoAlergia, index) {
    $.get("/Historial/ObtenerAlergia",
{ codigo: codigoAlergia },
function (data) {
    var json = JSON.stringify(data);
    $("#formEditarAlergia #Paciente").val(data.Paciente).attr("disabled", true);
    $("#formEditarAlergia #Reaccion").val(data.Reaccion);
    $("#formEditarAlergia #Tipo").val(data.Tipo);
    $("#formEditarAlergia #Detalle").val(data.Detalle);
    $("#formEditarAlergia #Tratamiento").val(data.Tratamiento);
    var codigo = $("#formEditarAlergia #Codigo")
    codigo.val(codigoAlergia);
    $("#CodigoTR").val(index);
    $("#modalEditarAlergia").modal("show");
})
}

function guardarEditarAlergia() {
    $("#formEditarAlergia #Paciente").attr("disabled", false);
    $.post("/Historial/EditarAlergia",
  $("#formEditarAlergia").serialize(),
   function (data) {
       actualizarTablaAlergias($("#CodigoTR").val());
       swal("Exito!", "alergia editada correctamente!", "success")
       $("#modalEditarAlergia").modal("hide");
   });


    function actualizarTablaAlergias(dataIndex) {
        var table = $('#listarAlergias').DataTable();
        var row = table.row(parseInt(dataIndex)).node();

        var Tipo = ArrayTipo.find(x => x.Codigo == ($("#formEditarAlergia #Tipo").val())).Descripcion;
        var Reaccion = ArrayReacciones.find(x=>x.Codigo == ($("#formEditarAlergia #Reaccion").val())).Descripcion;
        $('#listarAlergias').dataTable().fnUpdate(Tipo, row, 0);
        $('#listarAlergias').dataTable().fnUpdate(Reaccion, row, 1);
        $('#listarAlergias').dataTable().fnUpdate($("#formEditarAlergia #Tratamiento").val(), row, 2);
        $('#listarAlergias').dataTable().fnUpdate($("#formEditarAlergia #Detalle").val(), row, 3);
    }
}




function eliminarAlergia(codigo) {
    swal({
        title: "Desea eliminar esta alergia?",
        text: "La alergia   sera eliminada de forma permanente de este paciente",
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
                "/Historial/RemoverAlergia",
                { codigo: codigo },
                function result(data) {
                    if (data) {
                        hideRow(codigo);
                        swal("Eliminada!", "Se ha eliminado la alergia correctamente", "success");
                    }
                    else {
                        swal("Cancelado", "No se elimino la alergia", "error");
                    }
                });

        } else {
            swal("Cancelado", "No se elimino la alergia " , "error");
        }
    });

}

function hideRow(codigo) {
    var table = $('#listarAlergias').DataTable();
    $.fn.dataTable.ext.search.push(
      function (settings, data, dataIndex) {
          return $(table.row(dataIndex).node()).attr("id") != "Row" + codigo;
      }
    );
    table.draw();
}