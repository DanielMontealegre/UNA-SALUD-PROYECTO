$(document).ready(function () {
    let table=$('#listaPacientes').DataTable({
        "ajax": {
            "url": "/Pacientes/GetPacientes/",
            "dataSrc": ""
        },
        "columns": [
        { "data": "Email" },
        { "data": "Nombre" },
        { "data": "Apellido1" },
        { "data": "Apellido2" },
        {
            "data": "Sexo",
            "mRender": function (data) {
                return (data) ? 'Hombre' : 'Mujer';
            }
        },
        {
            "data": "TipoSangre",
            "mRender": function (data) {
                return dtConvFromJSON(data);
            }
        },
        ],
        "fnCreatedRow": function (nRow, aData, iDataIndex) {
            var str = aData.Email;
            var res = str.replace("@", "A");
            $(nRow).attr('id', "Row" + res);
        },
        "aoColumnDefs": [
            {
              "aTargets": [6],
              "data": "Email",
              "mRender": function (data, type, full) {

                  let btnEliminar= '  <button class="btn btn-danger btn-xs" >    <i class="fa fa-trash"> </i> Eliminar</button>';
                  return '<button class="btn btn-primary btn-xs">    <i class="fa fa-edit"> </i> Editar</button> | ' + btnEliminar;
              },
            },
            {"type": "date-eu", "aTargets": [5]}
        ]
    });



    $('#listaPacientes tbody').on('click', '.btn-danger', function () {
        var data = table.row($(this).parents('tr')).data();
        var index = table.row($(this).parents('tr')).index();

        eliminarPaciente(data.Email);
    });


    $('#listaPacientes tbody').on('click', ' .btn-primary', function () {
        var data = table.row($(this).parents('tr')).data();
        var index = table.row($(this).parents('tr')).index();

        editarPaciente(data.Email,index);
    });







});


function eliminarPaciente(email) {
        swal({
            title: "Desea eliminar este usuario?",
            text: "El paciente "+email+" sera eliminado de forma permanente",
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
                    "/Pacientes/Remover",
                    { email: email },
                    function result(data){
                        if (data) {
                            var str = email
                            var res = str.replace("@", "A");
                            hideRow(res);
                            swal("Eliminado!", "Se ha eliminado el paciente"+email+"correctamente", "success");
                        }
                        else {
                            swal("Cancelled", "No se elimino el paciente "+email, "error");
                        }
                    });

            } else {
                swal("Cancelled", "No se elimino el paciente "+email, "error");
            }
        });
    
}

function editarPaciente(email,codigo) {
    $.get("/Pacientes/Obtener",
    { email: email },
    function( data ) {
        var json= JSON.stringify(data);
        $("#formEditarPaciente #Email").val(data.Email);
        $("#formEditarPaciente #Nombre").val(data.Nombre);
        $("#formEditarPaciente #Apellido1").val(data.Apellido1);
        $("#formEditarPaciente #Apellido2").val(data.Apellido2);        
        let dataSexo = data.Sexo;
        if (dataSexo == 1) $("#formEditarPaciente #sexoHombre #Sexo").prop("checked", true)
        else $("#formEditarPaciente #sexoMujer #Sexo").prop("checked", true)
        $("#formEditarPaciente #TipoSangre").val(data.TipoSangre);
        $("#modalEditarPaciente #Codigo").val(codigo);
        $("#modalEditarPaciente").modal("show");
    })

}


function guardarEditar(){
    $.post("/Pacientes/Editar",
          $("#formEditarPaciente").serialize(),
           function (data) {

               actualizarTablaPacientes($("#Codigo").val());
               swal("Exito!", "Paciente editado correctamente!", "success")
               $("#modalEditarPaciente").modal("hide");
           });


}



function actualizarTablaPacientes(dataIndex) {
    var tables = $('#listaPacientes').DataTable();
    var row = tables.row(parseInt(dataIndex)).node();
    $('#listaPacientes').dataTable().fnUpdate($("#formEditarPaciente #Nombre").val(), row, 1);
    $('#listaPacientes').dataTable().fnUpdate($("#formEditarPaciente #Apellido1").val(), row, 2);
    $('#listaPacientes').dataTable().fnUpdate($("#formEditarPaciente #Apellido2").val(), row, 3);
    $('#listaPacientes').dataTable().fnUpdate($("#formEditarPaciente #Sexo").val(), row, 4);
    $('#listaPacientes').dataTable().fnUpdate($("#formEditarPaciente #TipoSangre").val(), row, 5);
}


function hideRow(email) {
    var table = $('#listaPacientes').DataTable();
    $.fn.dataTable.ext.search.push(
      function (settings, data, dataIndex) {
          return $(table.row(dataIndex).node()).attr("id") != "Row"+email;
      }
    );
    table.draw();
}