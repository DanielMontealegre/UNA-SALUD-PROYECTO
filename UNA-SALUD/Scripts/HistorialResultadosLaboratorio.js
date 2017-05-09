
let codigoLaboratorioActual
let ArrayTipoMarca

$.get("/Historial/GetTiposMarcas",
function (data) {
    var json = JSON.stringify(data);
    ArrayTipoMarca = data;
});


$(document).ready(function () {

    $('#laboratorioRegistro_Fecha').datetimepicker({
        format: "DD/MM/YYYY",
        showClose: true,
        showClear: true,
        toolbarPlacement: 'top'
    });



    listarLaboratorios();
});

function listarResultados(CodigoLaboratorio) {
    let tipoEstados;
    codigoLaboratorioActual = CodigoLaboratorio;
    $("#modalListarResultados").modal("show");
    let table = $('#listarResultadosLaboratorio').DataTable({
        "bDestroy": true,  
            "ajax": {
                "url": "/Historial/GetResultadosDelLaboratorio/" + CodigoLaboratorio + "/",
                "dataSrc": ""
            },
            "columns": [
            { "data": "Nombre" },
            { "data": "Marca", },
            { "data": "Valor" },
            { "data": "Unidad" },
            { "data": "Laboratorio" },
            ],
            "fnCreatedRow": function (nRow, aData, iDataIndex) {
                var str = aData.Codigo;
                $(nRow).attr('id', "RowResultado" + str);
            },
            "aoColumnDefs": [
                {
                    "aTargets": [5],
                    "data": "Codigo",
                    "mRender": function (data, type, full) {

                        let btnEliminar = '  <button class="btn btn-danger btn-xs"  >    <i class="fa fa-trash"> </i> Eliminar</button>';
                        return '<button class="btn btn-primary btn-xs">    <i class="fa fa-edit"> </i> Editar</button> | ' + btnEliminar;
                    },
                },
                { "width": 5000, "aTargets": 5 },
            ]
        });


    $('#listarResultadosLaboratorio tbody').unbind('click');

    $('#listarResultadosLaboratorio tbody').on('click', '.btn-danger', function () {
        var data = table.row($(this).parents('tr')).data();
        var index = table.row($(this).parents('tr')).index();

        eliminarResultadoLaboratorio(data.Codigo);
    });

    /*

    $('#example').off( 'click.rowClick' ).on('click.rowClick', 'td', function () {

    */

    $('#listarResultadosLaboratorio tbody').on('click', ' .btn-primary', function () {
        var data = table.row($(this).parents('tr')).data();
        var index = table.row($(this).parents('tr')).index();

        editarResultadoLaboratorio(data.Codigo, index);
    });


}





function volverAlistarResultados() {
    $("#modalEditarResultadoLaboratorio").modal("hide");
    $("#modalListarResultados").modal("show");
}





function editarResultadoLaboratorio(codigo,index) {
  
    $.get("/Historial/GetResultadoLaboratorio",
  { codigo: codigo },
  function (data) {
      if (data) {
          $("#CodigoTR").val(index);
          $("#CodigoResultadoLaboratorio").val(codigo);
          llenarFormEditarResultadoLaboratorio(data);
      }

  });


}


function llenarFormEditarResultadoLaboratorio(data) {
    $("#modalListarResultados").modal("hide");
    $("#modalEditarResultadoLaboratorio").modal("show");
    $("#modalEditarResultadoLaboratorio #ResultadoLaboratorioRegistro_Nombre").val(data.Nombre);
    $("#modalEditarResultadoLaboratorio #ResultadoLaboratorioRegistro_Valor").val(data.Valor);
    $("#modalEditarResultadoLaboratorio #ResultadoLaboratorioRegistro_Marca").val(data.Marca);
    $("#modalEditarResultadoLaboratorio #ResultadoLaboratorioRegistro_Unidad").val(data.Unidad);
}

function guardarEditarResultadoLaboratorio(){
    var form = $("#formAgregarLaboratorio").serialize();
    $.post("/Historial/EditarResultadoLaboratorio",
    $("#formEditarResultadoLaboratorio").serialize(),
   function (data) {
       if (data) {
           $("#modalEditarResultadoLaboratorio").modal("hide");
           mensajeOk("Exito","Resultado del Laboratorio editado correctamente!", function () {            
               $("#modalListarResultados").modal("show");
               actualizarTablaLaboratorios();
           });
       }

   });

}


function actualizarTablaLaboratorios() {
    var table = $('#listarResultadosLaboratorio').DataTable();
    table.ajax.reload();
}

function actualizarTablaLaboratoriosNoResultados() {
    var table = $('#listarLaboratorios').DataTable();
    table.ajax.reload();
}



function  eliminarResultadoLaboratorio(codigo) {
    $("#modalListarResultados").modal("hide");
    swal({
        title: "Desea eliminar este resultado?",
        text: "El resultado sera eliminado de forma permanente de este paciente",
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
                "/Historial/RemoverResultadoLaboratorio",
                { codigo: codigo },
                function result(data) {
                    if (data) {
                        mensajeOk("Eliminado!", "Se ha eliminado el resultado correctamente", function () {
                            $("#modalListarResultados").modal("show");
                            var table = $('#listarResultadosLaboratorio').DataTable();
                            table.ajax.reload();
                        });

                    }
                    else {
                        swal("Cancelado", "No se elimino el resultado", "error");
                    }
                });

        } else {
            $("#modalListarResultados").modal("show");
            swal("Cancelado", "No se elimino el resultado", "error");
        }
    });

}

function hideRowResultados(codigo) {
    var table = $('#listarResultadosLaboratorio').DataTable();
    $.fn.dataTable.ext.search.push(
      function (settings, data, dataIndex) {
          return $(table.row(dataIndex).node()).attr("id") != "RowResultado" + codigo;
      }
    );
    table.draw();
}

