function AbrilModalAgregarSeguro() {
 
    var paciente = $("#pacienteSeguro").html();
    $("#formAgregarSeguro #Paciente").val(paciente).attr("disabled", true);
    $("#modalAgregarSeguro").modal("show");
}


function guardarSeguro() {
    if ($("#formAgregarSeguro").valid()) {
        $("#formAgregarSeguro #Paciente").attr("disabled", false);

        var dInicio = toDate("#formAgregarSeguro #FechaInicio");
        var dFin = toDate("#formAgregarSeguro #FechaFin");

        $("#formAgregarSeguro #FechaFin").val(dFin);
        $("#formAgregarSeguro #FechaInicio").val(dInicio);


        $.post("/Seguros/AgregarSeguro",
        $("#formAgregarSeguro").serialize(),
       function (data) {
           limpiarFormularioAgregarSeguro();
           if (data.Resultado) {
               $("#modalAgregarSeguro").modal("hide");
               let table = $('#listarSeguros').DataTable();
               table.ajax.reload();
               swal("Exito!", "Seguro agregado correctamente!", "success")
           }
           else {
               swal("Error!", "Ha sucedido un error al agregar el seguro!", "error")
           }
       });
    }
}


function limpiarFormularioAgregarSeguro() {

    $("#formAgregarSeguro #FechaFin").val("");
    $("#formAgregarSeguro #FechaInicio").val("");
    $("#formAgregarSeguro #Principal").prop("checked", false);
    $("#formAgregarSeguro #IdentificadorAbonado").val("");
    $("#formAgregarSeguro #Detalle").val("");
    $('#Cobertura option')[0].selected = true

}




$(document).ready(function () {
    listarSeguros();

    $('#formAgregarSeguro #FechaInicio').datetimepicker({
        format: "DD/MM/YYYY",
        showClose: true,
        showClear: true,
        toolbarPlacement: 'top'
    });

    $('#formAgregarSeguro #FechaFin').datetimepicker({
        format: "DD/MM/YYYY",
        showClose: true,
        showClear: true,
        toolbarPlacement: 'top'
    });

    $('#formEditarSeguro #FechaInicio').datetimepicker({
        format: "DD/MM/YYYY",
        showClose: true,
        showClear: true,
        toolbarPlacement: 'top'
    });

    $('#formEditarSeguro #FechaFin').datetimepicker({
        format: "DD/MM/YYYY",
        showClose: true,
        showClear: true,
        toolbarPlacement: 'top'
    });


    validatorDateFormat();
});




function listarSeguros() {
    let tipoEstados;
    var email = $("#pacienteSeguro").html();
    var emailSinEspacios = email.replace(/\s+/g, '');
    var emailEncoded = encodeURIComponent(emailSinEspacios);
    let table = $('#listarSeguros').DataTable({
        "bDestroy": true,
        "order": [[5, "desc"]],
        "ajax": {
            "url": "/Seguros/GetSeguros/" + emailEncoded + "/",
            "dataSrc": ""
        },
        "columns": [
        { "data": "Codigo" },
        { "data": "Cobertura", },
        {
            "data": "Principal",
            "mRender": function (data) {
                if (data == true) return "Sí";
                else return "No";
            }


        },
        { "data": "IdentificadorAbonado" },
        {
            "data": "FechaInicio",
            "mRender": function (data) {
                if (data == null) return dtConvFromJSON(data);
                if (data.includes("Date"))
                    return dtConvFromJSON(data);
                else return data;
            }
        },
        {
            "data": "FechaFin",
            "mRender": function (data) {
                if (data == null) return dtConvFromJSON(data);
                if (data.includes("Date"))
                    return dtConvFromJSON(data);
                else return data;
            }
        },
        {"data":"Detalle"},
        ],
        "fnCreatedRow": function (nRow, aData, iDataIndex) {
            var str = aData.Codigo;
            $(nRow).attr('id', "RowSeguro" + str);
        },
        "aoColumnDefs": [
            {
                "aTargets": [7],
                "data": "Codigo",
                "mRender": function (data, type, full) {

                    let btnEliminar = '  <button class="btn btn-danger btn-xs"  >    <i class="fa fa-trash"> </i> Eliminar</button>';
                    return '<button class="btn btn-primary btn-xs">    <i class="fa fa-edit"> </i> Editar</button> | ' + btnEliminar;
                },
            },
             { "type": "date-eu", "aTargets": [4,5] },
        ]
    });


    $('#listarSeguros tbody').unbind('click');

    $('#listarSeguros tbody').on('click', '.btn-danger', function () {
        var data = table.row($(this).parents('tr')).data();
        var index = table.row($(this).parents('tr')).index();

        eliminarSeguro(data.Codigo);
    });

    $('#listarSeguros tbody').on('click', ' .btn-primary', function () {
        var data = table.row($(this).parents('tr')).data();
        var index = table.row($(this).parents('tr')).index();

        editarSeguro(data.Codigo, index);
    });


}

function editarSeguro(codigo, index) {
 
    $.get("/Seguros/ObtenerSeguro/",
 { codigo: codigo },
 function (data) {
     var json = JSON.stringify(data);
     var paciente = $("#pacienteSeguro").html();
     $("#formEditarSeguro #Paciente").val(paciente).attr("disabled", true);
     $("#formEditarSeguro #FechaFin").val(dtConvFromJSON(data.FechaFin));
     $("#formEditarSeguro #FechaInicio").val(dtConvFromJSON(data.FechaInicio));
     $("#formEditarSeguro #Cobertura").val(data.CodigoCobertura);
     $("#formEditarSeguro #Detalle").val(data.Detalle);
     $("#formEditarSeguro #IdentificadorAbonado").val(data.IdentificadorAbonado);
    // $("#formEditarSeguro #Principal").val(data.Principal);
     $("#formEditarSeguro #Principal").prop("checked", data.Principal);
     var codigoHtml = $("#formEditarSeguro #Codigo")
     codigoHtml.val(codigo);
     $("#modalEditarSeguro").modal("show");

 });
}

function guardarEditarSeguro() {
    if ($("#formEditarSeguro").valid()) {
        $("#formEditarSeguro #Paciente").attr("disabled", false);

        var dInicio = toDate("#formEditarSeguro #FechaInicio");
        var dFin = toDate("#formEditarSeguro #FechaFin");

        $("#formEditarSeguro #FechaFin").val(dFin);
        $("#formEditarSeguro #FechaInicio").val(dInicio);

        $.post("/Seguros/EditarSeguro",
        $("#modalEditarSeguro #formEditarSeguro").serialize(),
       function (data) {       
           if (data.Resultado) {
               $("#modalEditarSeguro").modal("hide");
               let table = $('#listarSeguros').DataTable();
               table.ajax.reload();
               swal("Exito!", "Seguro editado correctamente!", "success")
           }
           else {
               swal("Error!", "Ha sucedido un error al editar el seguro!", "error")
           }
       });
    }
}




function eliminarSeguro(codigo) {
    swal({
        title: "Desea eliminar este seguro?",
        text: "El seguro  sera eliminada de forma permanente de este paciente",
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
                "/Seguros/RemoverSeguro",
                { codigo: codigo },
                function result(data) {
                    if (data) {
                        swal({
                            title: "Exito!",
                            text: "El seguro fue eliminado de forma permanente!",
                            type: "success",
                            confirmButtonText: 'Ok',
                        },
                            function (isConfirm) {
                                $("#modalEditarAltura").modal("hide");
                                hideRow(codigo);
                            });

                    }
                    else {
                        swal("Cancelado", "No se elimino el seguro ", "error");
                    }
                });

        } else {
            swal("Cancelado", "No se elimino el seguro ", "error");
        }
    });

}

function hideRow(codigo) {
    var table = $('#listarSeguros').DataTable();
    $.fn.dataTable.ext.search.push(
      function (settings, data, dataIndex) {
          return $(table.row(dataIndex).node()).attr("id") != "RowSeguro" + codigo;
      }
    );
    table.draw();
}

