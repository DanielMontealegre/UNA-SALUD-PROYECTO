function redondeoHaciaArriba(a) {
    var math = Math.round(a);
    return math + (10 - a % 10);
}

function redondeoHaciaAbajo(a) {
    var math = Math.round(a);
    if (math % 10 == 0)
        return math - 10;
    return math - (a % 10);
}

$(document).ready(function () {
    $('#formEditarAltura #Fecha').datetimepicker({
        format: "DD/MM/YYYY",
        showClose: true,
        showClear: true,
        toolbarPlacement: 'top'
    });

    $('#formAgregarAltura #Fecha').datetimepicker({
        format: "DD/MM/YYYY",
        showClose: true,
        showClear: true,
        toolbarPlacement: 'top'
    });


    validatorDateFormat();

    let ctx = document.getElementById("chartAltura");
    $.get("/Alturas/GetAlturas/daniel@gmail.com/",
    function (data) {
        $("#alturaActual").html(' ' + data[data.length - 1].Altura1 + ' cm');
        initializeTable(data);
        initializeChart(data, ctx);
    });

});


function initializeChart(data, ctx) {
    let arrayLabels = [];
    let arrayAlturas = [];
    let arrayCodigos = [];
    data.forEach(altura=> {
        let fecha = dtConvFromJSON(altura.Fecha);
        arrayLabels.push(fecha);
        arrayAlturas.push(altura.Altura1);
        arrayCodigos.push(altura.Codigo);
    })

    var max = arrayAlturas.reduce(function (a, b) {
        return Math.max(a, b);
    });

    var min = arrayAlturas.reduce(function (a, b) {
        return Math.min(a, b);
    });

    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: arrayLabels,
            datasets: [
                {
                    label: "Altura",
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
                    data: arrayAlturas,
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
                        return 'Altura: ' + tooltipItem.yLabel + ' cm';
                    },
                }

            }
        }
    });
    $("#chartAltura").click(function (evt) {
        let activePoints = myChart.getElementsAtEvent(evt);
        if (activePoints[0]) {
            let codigos = myChart.data.datasets[0].codigos;
            editarAltura(codigos[activePoints[0]._index], activePoints[0]._index);
        }
    })
}



function AbrilModalAgregarAltura() {
    var paciente = $("#pacienteAltura").html();
    $("#formAgregarAltura #Paciente").val(paciente).attr("disabled", true);
    $("#modalAgregarAltura").modal("show");
}

function guardarAltura() {
    if ($("#formAgregarAltura").valid()) {
        $("#formAgregarAltura #Paciente").attr("disabled", false);
        $.post("/Alturas/AgregarAltura",
        $("#formAgregarAltura").serialize(),
       function (data) {
           //limpiarFormularioAgregar();
           if (data.Resultado)
               $("#modalAgregarAltura").modal("hide");
           swal("Exito!", "Altura agregado correctamente!", "success")
           updateTable();
           addData(data.Altura)

       });
    }
}

function initializeTable(data) {
    let table = $('#listarAlturas').DataTable({
        "bDestroy": true,
        "data": data,
        "order": [[0, "desc" ]],
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
        { "data": "Altura1" },
        { "data": "Detalle" },
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
            { "width": 140, "aTargets": [3] }
        ]
    });


    $('#listarAlturas tbody').unbind('click');

    $('#listarAlturas tbody').on('click', '.btn-danger', function () {
        var data = table.row($(this).parents('tr')).data();
        var index = table.row($(this).parents('tr')).index();

        eliminarAltura(data.Codigo);
       
    });


    $('#listarAlturas tbody').on('click', ' .btn-primary', function () {
        var data = table.row($(this).parents('tr')).data();
        var index = table.row($(this).parents('tr')).index();

        editarAltura(data.Codigo, index);
    });


}


function calculaMaximo(array) {
    let max = array.reduce(function (a, b) {
        return Math.max(a, b);
    });

    return redondeoHaciaArriba(max);
}

function calculaMinimo(array) {
    let min = array.reduce(function (a, b) {
        return Math.min(a, b);
    });

    return redondeoHaciaAbajo(min);
}

function addData(altura) {
    let size = myChart.data.labels.length;
    myChart.data.labels[size] = dtConvFromJSON(altura.Fecha);
    myChart.data.datasets[0].data[size] = altura.Altura1
    myChart.data.datasets[0].codigos[size] = altura.Codigo;

    myChart.options.scales.yAxes[0].ticks.min = calculaMinimo(myChart.data.datasets[0].data);
    myChart.options.scales.yAxes[0].ticks.max = calculaMaximo(myChart.data.datasets[0].data);

    myChart.update();
}



function editarAltura(codigoAltura, index) {
    $.get("/Alturas/ObtenerAltura",
    { codigo: codigoAltura },
    function (data) {
        var json = JSON.stringify(data);
        $("#formEditarAltura #Paciente").val(data.Paciente).attr("disabled", true);
        $("#formEditarAltura #Fecha").val(dtConvFromJSON(data.Fecha));
        $("#formEditarAltura #Altura1").val(data.Altura1);
        $("#formEditarAltura #Detalle").val(data.Detalle);
        var codigo = $("#formEditarAltura #Codigo")
        codigo.val(codigoAltura);
        $("#CodigoTR").val(index);
        $("#modalEditarAltura").modal("show");
    })
}

function guardarEditarAltura() {
    if ($("#formEditarAltura").valid()) {
        $("#formEditarAltura #Paciente").attr("disabled", false);
        $.post("/Alturas/EditarAltura",
      $("#formEditarAltura").serialize(),
       function (data) {
           if (data.Resultado) {
               actualizarGrafico($("#CodigoTR").val(), data.Altura);
               updateTable();
               swal("Exito!", "Altura editada correctamente!", "success")
               $("#modalEditarAltura").modal("hide");
           }
       });
    }
}

function actualizarGrafico(index, altura) {
    console.log($("#formEditarAltura #Fecha").val());
    myChart.data.datasets[0].data[index] = altura.Altura1;
    myChart.data.labels[index] = dtConvFromJSON(altura.Fecha);

    myChart.options.scales.yAxes[0].ticks.min = calculaMinimo(myChart.data.datasets[0].data);
    myChart.options.scales.yAxes[0].ticks.max = calculaMaximo(myChart.data.datasets[0].data);

    myChart.update();
}





function eliminarAltura(codigo) {
    swal({
        title: "Desea eliminar este registro?",
        text: "La altura  sera eliminada de forma permanente de este paciente",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "No, cancelar",
        closeOnConfirm: false,
        closeOnCancel: false
    },
    function (isConfirm) {
        let codigoAltura = $("#formEditarAltura #Codigo").val();
        if (codigoAltura.length <= 0) {
            codigoAltura = codigo;
        }
        if (isConfirm) {

            $.post(
                "/Alturas/RemoverAltura",
                { codigo: codigoAltura },
                function result(data) {
                    if (data) {
                        swal({
                            title: "Exito!",
                            text: "La altura sera eliminado de forma permanente!",
                            type: "success",
                            confirmButtonText: 'Ok',
                        },
                            function (isConfirm) {
                                $("#modalEditarAltura").modal("hide");
                                eraseData(codigoAltura);
                                hideRow(codigoAltura);
                            });

                    }
                    else {
                        swal("Cancelado", "No se elimino el registro de la altura ", "error");
                    }
                });

        } else {
            swal("Cancelado", "No se elimino el registro de la altura  ", "error");
        }
    });

}


function eraseData(codigoAltura) {
    console.log(myChart.data.datasets[0].codigos)
    let pos = myChart.data.datasets[0].codigos.indexOf(parseInt(codigoAltura));
    myChart.data.datasets[0].codigos.splice(pos, 1);
    myChart.data.datasets[0].data.splice(pos, 1);

    myChart.data.labels.splice(pos, 1);

    myChart.options.scales.yAxes[0].ticks.min = calculaMinimo(myChart.data.datasets[0].data);
    myChart.options.scales.yAxes[0].ticks.max = calculaMaximo(myChart.data.datasets[0].data);

    myChart.update();

}


function expandChart() {
    $("#chart-container").removeClass("col-md-6");
    $("#chart-container").addClass("col-md-12");
    $("#table-container").removeClass("col-md-6").css("display", "none");
}


function hideRow(codigo) {
    var table = $('#listarAlturas').DataTable();
    $.fn.dataTable.ext.search.push(
      function (settings, data, dataIndex) {
          return $(table.row(dataIndex).node()).attr("id") != "Row" + codigo;
      }
    );
    table.draw();
}

function updateTable() {
    $.get("/Alturas/GetAlturas/daniel@gmail.com/",
    function (data) {
        $("#alturaActual").html(' ' + data[data.length - 1].Altura1 + ' cm');
        initializeTable(data);
    });

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
        tipoVista.attr('data-tooltip', 'Vista de lista')
    }
    else {
        table.addClass('hidden');
        chart.removeClass('hidden');
        icon.removeClass('fa-list').addClass('fa-line-chart');
        tipoVista.attr('data-tooltip', 'Vista de gráfico')
    }
}