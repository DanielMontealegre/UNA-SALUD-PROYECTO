$(document).ready(function () {
    $('#formEditarPeso #Fecha').datetimepicker({
        format : "DD/MM/YYYY", 
        showClose: true,
        showClear: true,
        toolbarPlacement: 'top'
    });

    $('#formAgregarPeso #Fecha').datetimepicker({
        format: "DD/MM/YYYY",
        showClose: true,
        showClear: true,
        toolbarPlacement: 'top'
    });


    validatorDateFormat();

    let ctx = document.getElementById("chartPeso");
    $.get("/Pesos/GetPesos/daniel@gmail.com/",
    function (data) {
        $("#pesoActual").html(' ' + data[data.length - 1].Peso1 + ' Kg');
        initializeTable(data);
        initializeChart(data, ctx);
    });

});

function initializeChart(data, ctx) {
    let arrayLabels = [];
    let arrayPesos = [];
    let arrayCodigos = [];
    data.forEach(peso=> {
        let fecha = dtConvFromJSON(peso.Fecha);
        arrayLabels.push(fecha);
        arrayPesos.push(peso.Peso1);
        arrayCodigos.push(peso.Codigo);
    })

    var max = arrayPesos.reduce(function (a, b) {
        return Math.max(a, b);
    });

    var min = arrayPesos.reduce(function (a, b) {
        return Math.min(a, b);
    });

    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: arrayLabels,
            datasets: [
                {
                    label: "Peso",
                    fill: false,
                    lineTension: 0.4,
                    backgroundColor: "rgba(75,192,192,0.4)",
                    borderColor: "rgba(75,192,192,1)",
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBorderColor: "rgba(75,192,192,1)",
                    pointBackgroundColor: "#fff",
                    pointBorderWidth: 5,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: "rgba(75,192,192,1)",
                    pointHoverBorderColor: "rgba(220,220,220,1)",
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 10,
                    data: arrayPesos,
                    spanGaps: false,
                    codigos: arrayCodigos
                }]
        },
        options: {
            responsive: true,
            scales: {
                yAxes: [{
                    ticks: {
                        max: redondeoHaciaArriba(max),
                        min: redondeoHaciaAbajo(min),
                        stepSize: 5
                    }
                }]
            },
            tooltips: {

                callbacks: { // HERE YOU CUSTOMIZE THE LABELS
                    title: function () {
                        return '';
                    },
                    beforeLabel: function (tooltipItem, data) {
                        return 'Fecha: ' + tooltipItem.xLabel;
                    },
                    label: function (tooltipItem, data) {
                        return '';
                    },
                    afterLabel: function (tooltipItem, data) {
                        return 'Peso: ' + tooltipItem.yLabel+' Kg';
                    },
                }

            }
        }
    });
    $("#chartPeso").click(function (evt) {
        let activePoints = myChart.getElementsAtEvent(evt);
        if (activePoints[0]) {
            let codigos = myChart.data.datasets[0].codigos;
            editarPeso(codigos[activePoints[0]._index], activePoints[0]._index);
        }
    })
}

function initializeTable(data) {
    let table = $('#listarPesos').DataTable({
        "data": data,
        "columns": [
        {
            "data": "Fecha",
            "mRender": function (data) {
                if (data == null) return dtConvFromJSON(data);
                if (data.includes("Date"))
                    return dtConvFromJSON(data);
                else return data;
            }
        },
        {
            "data": "Peso1",
            "mRender": function (data) {
                return data + ' Kg';
            }
        },
        { "data": "Detalle" }
        ],
        "fnCreatedRow": function (nRow, aData, iDataIndex) {
            var str = aData.Codigo;
            $(nRow).attr('id', "Row" + str);
        },
        "aoColumnDefs": [
            {
                "aTargets": [3],
                "data": "Paciente",
                "mRender": function (data, type, full) {

                    let btnEliminar = '  <button class="btn btn-danger btn-xs" >    <i class="fa fa-trash"> </i> Eliminar</button>';
                    return '<button class="btn btn-primary btn-xs">    <i class="fa fa-edit"> </i> Editar</button>' + btnEliminar;
                },
            },
            { "type": "date-eu", "aTargets": [0] },
        ]
    });

    $('#listarPesos tbody').unbind('click');

    $('#listarPesos tbody').on('click', '.btn-primary', function () {
        var data = table.row($(this).parents('tr')).data();
        var index = table.row($(this).parents('tr')).index();

        editarPeso(data.Codigo, index);
    });

    $('#listarPesos tbody').on('click', '.btn-danger', function () {
        var data = table.row($(this).parents('tr')).data();
        var index = table.row($(this).parents('tr')).index();

        eliminarPeso(data.Codigo);
    });
}

function AbrilModalAgregarPeso() {
    var paciente = $("#pacientePeso").html();
    $("#formAgregarPeso #Paciente").val(paciente).attr("disabled", true);
    $("#formAgregarPeso .modal-header").addClass("transitionIn");

    $("#modalAgregarPeso").modal("show");

}

function guardarPeso() {
    if ($("#formAgregarPeso").valid()) {
        $("#formAgregarPeso #Paciente").attr("disabled", false);
        $.post("/Pesos/AgregarPeso",
        $("#formAgregarPeso").serialize(),
       function (data) {
           //limpiarFormularioAgregar();
           if (data.Resultado) {
               $("#modalAgregarPeso").modal("hide");
               swal("Exito!", "Peso agregado correctamente!", "success")
               updateChart(data.Peso)
               updateTablaNewRow(data.Peso.Codigo);
           }
       });
    }
}





function updateChart(peso) {
    let size = myChart.data.labels.length;
    myChart.data.labels[size] =dtConvFromJSON(peso.Fecha);
    myChart.data.datasets[0].data[size] = peso.Peso1
    myChart.data.datasets[0].codigos[size] = peso.Codigo;

    myChart.options.scales.yAxes[0].ticks.min = calculaMinimo(myChart.data.datasets[0].data);
    myChart.options.scales.yAxes[0].ticks.max = calculaMaximo(myChart.data.datasets[0].data);

    myChart.update();
}

function updateChartByIndex(index, peso) {
    console.log($("#formEditarPeso #Fecha").val());
    myChart.data.datasets[0].data[index] = peso.Peso1;
    myChart.data.labels[index] = dtConvFromJSON(peso.Fecha);

    myChart.options.scales.yAxes[0].ticks.min = calculaMinimo(myChart.data.datasets[0].data);
    myChart.options.scales.yAxes[0].ticks.max = calculaMaximo(myChart.data.datasets[0].data);

    myChart.update();
}

function eraseDataChart(codigoPeso) {
    console.log(myChart.data.datasets[0].codigos)
    let pos = myChart.data.datasets[0].codigos.indexOf(parseInt(codigoPeso));
    myChart.data.datasets[0].codigos.splice(pos, 1);
    myChart.data.datasets[0].data.splice(pos, 1);

    myChart.data.labels.splice(pos, 1);

    myChart.options.scales.yAxes[0].ticks.min = calculaMinimo(myChart.data.datasets[0].data);
    myChart.options.scales.yAxes[0].ticks.max = calculaMaximo(myChart.data.datasets[0].data);

    myChart.update();
}

function hideRow(codigo) {
    var table = $('#listarPesos').DataTable();
    $.fn.dataTable.ext.search.push(
      function (settings, data, dataIndex) {
          return $(table.row(dataIndex).node()).attr("id") != "Row" + codigo;
      }
    );
    table.draw();
}

function updateTableRow(codigo) {
    var table = $('#listarPesos').DataTable();
    var row = table.row("#Row"+codigo).node();

    var fecha = $("#formEditarPeso #Fecha").val();

    var date= new Date(fecha);

    var StringDate = (date.getDate() + 1) + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();


    $('#listarPesos').dataTable().fnUpdate(fecha, row, 0);
    $('#listarPesos').dataTable().fnUpdate($("#formEditarPeso #Peso1").val(), row, 1);
    $('#listarPesos').dataTable().fnUpdate($("#formEditarPeso #Detalle").val(), row, 2);
    
}

function updateTablaNewRow(codigoPeso) {
    var table = $('#listarPesos').DataTable();
    var peso = $("#formAgregarPeso #Peso1").val();


    var fecha = $("#formAgregarPeso #Fecha").val();
    var Notas = $("#formAgregarPeso #Detalle").val()



    var row = table.row.add({
        "Fecha": fecha,
        "Peso1": peso,
        "Detalle": Notas,
        "Codigo": codigoPeso
    })
    .draw();

    row.nodes().to$().attr('id', 'Row' + codigoPeso);
}

function editarPeso(codigoPeso, index) {
    $.get("/Pesos/ObtenerPeso",
    { codigo: codigoPeso },
    function (data) {
        var json = JSON.stringify(data);
        $("#formEditarPeso #Paciente").val(data.Paciente).attr("disabled", true);
        $("#formEditarPeso #Fecha").val(dtConvFromJSON(data.Fecha));
        $("#formEditarPeso #Peso1").val(data.Peso1);
        $("#formEditarPeso #Detalle").val(data.Detalle);
        var codigo = $("#formEditarPeso #Codigo")
        codigo.val(codigoPeso);
        $("#CodigoTR").val(index);
        $("#modalEditarPeso .modal-header").addClass("transitionIn");
        $("#modalEditarPeso").modal("show");
    })
}



function guardarEditarPeso() {
    if ($("#formEditarPeso").valid()) {
        $("#formEditarPeso #Paciente").attr("disabled", false);
        $.post("/Pesos/EditarPeso",
      $("#formEditarPeso").serialize(),
       function (data) {
           if (data.Resultado) {
               updateChartByIndex($("#CodigoTR").val(), data.Peso);
               updateTableRow($("#formEditarPeso #Codigo").val());
               swal("Exito!", "afección editada correctamente!", "success")
               $("#modalEditarPeso").modal("hide");
           }
       });
    }
}




function eliminarPeso(codigoPeso) {
    swal({
        title: "Desea eliminar este registro?",
        text: "El peso  sera eliminad0 de forma permanente de este paciente",
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
                "/Pesos/RemoverPeso",
                { codigo: codigoPeso },
                function result(data) {
                    if (data) {

                        swal({
                            title: "Exito!",
                            text: "You will not be able to recover this imaginary file!",
                            type: "success",
                            confirmButtonText: 'Ok',
                        },
                            function (isConfirm) {
                                $("#modalEditarPeso").modal("hide"); 
                                eraseDataChart(codigoPeso);
                                hideRow(codigoPeso)
                            });
                        
                    }
                    else {
                        swal("Cancelado", "No se elimino el registro del peso ", "error");
                    }
                });

        } else {
            swal("Cancelado", "No se elimino el registro del peso " , "error");
        }
    });

}

function eliminarPesoFromModal() {
    let codigoPeso = $("#formEditarPeso #Codigo").val();
    eliminarPeso(codigoPeso);
}







function toggleVisibility() {
    let table = $('#table-container');
    let chart = $('#chart-container');
    let icon = $('#iconView');
    let tipoVista = $("#tipoVista")
    if (table.hasClass('hidden')) {
        chart.addClass('hidden');
        table.removeClass('hidden');
        icon.removeClass('fa-line-chart').addClass('fa-list');
        tipoVista.attr('data-tooltip','Vista de lista')
    }
    else {
        table.addClass('hidden');
        chart.removeClass('hidden');
        icon.removeClass('fa-list').addClass('fa-line-chart');
        tipoVista.attr('data-tooltip', 'Vista de gráfico')
    }
}