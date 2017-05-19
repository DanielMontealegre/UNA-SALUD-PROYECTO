$(document).ready(function () {
    $('#formEditarPresionArterial #Fecha').datetimepicker({
        format: "DD/MM/YYYY",
        showClose: true,
        showClear: true,
        toolbarPlacement: 'top'
    });

    $('#formAgregarPresionArterial #Fecha').datetimepicker({
        format: "DD/MM/YYYY",
        showClose: true,
        showClear: true,
        toolbarPlacement: 'top'
    });


    validatorDateFormat();

    let ctx = document.getElementById("chartPresionArterial");
    $.get("/PresionArterial/GetPresionesArteriales/daniel@gmail.com/",
    function (data) {
        $("#presionArterialActual").html(' ' + data[data.length - 1].Sistolica + '/' + data[data.length - 1].Diastolica+' mmHg');
        initializeTable(data);
        initializeChart(data, ctx);
    });

});

function initializeChart(data, ctx) {
    let arrayLabels = [];
    let arraySistolicas = [];
    let arrayDiastolicas = [];
    let arrayCodigos = [];
    data.forEach(presion=> {
        let fecha = dtConvFromJSON(presion.Fecha);
        arrayLabels.push(fecha);
        arrayDiastolicas.push(presion.Diastolica);
        arraySistolicas.push(presion.Sistolica);
        arrayCodigos.push(presion.Codigo);
    })

    let  maxD = arrayDiastolicas.reduce(function (a, b) { return Math.max(a, b);});
    let minD = arrayDiastolicas.reduce(function (a, b) {return Math.min(a, b);});
    let  maxS = arraySistolicas.reduce(function (a, b) {return Math.max(a, b);});
    let minS = arraySistolicas.reduce(function (a, b) {return Math.min(a, b);});
    let min = Math.min(minS, minD);
    let max = Math.max(maxD, maxS);

    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: arrayLabels,
            datasets: [
                {
                    label: "Sistolica",
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
                    data: arraySistolicas,
                    spanGaps: false,
                    codigos: arrayCodigos
                },
                                {
                    label: "Diastolica",
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
                    data: arrayDiastolicas,
                    spanGaps: false,
                },

            ]
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
                        return 'Medicion: ' + tooltipItem.yLabel + ' mmHg';
                    },
                }

            }
        }
    });
    $("#chartPresionArterial").click(function (evt) {
        let activePoints = myChart.getElementsAtEvent(evt);
        if (activePoints[0]) {
            let codigos = myChart.data.datasets[0].codigos;
            editarPresionArterial(codigos[activePoints[0]._index], activePoints[0]._index);
        }
    })
}

function initializeTable(data) {
    let table = $('#listarPresionArterial').DataTable({
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
            "data": "Sistolica",
            "mRender": function (data) {
                return data ;
            }
        },
        {
            "data": "Diastolica",
            "mRender": function (data) {
                return data;
            }
        },
        {
            "data": "Pulso",
            "mRender": function (data) {
                return data;
            }
        },
        {
            "data": "RitmoIrregular",
            "mRender": function (data) {
                return (data) ? 'Si' : 'No';
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
                "aTargets": [6],
                "data": "Paciente",
                "mRender": function (data, type, full) {

                    let btnEliminar = '  <button class="btn btn-danger btn-xs" >    <i class="fa fa-trash"> </i> Eliminar</button>';
                    return '<button class="btn btn-primary btn-xs">    <i class="fa fa-edit"> </i> Editar</button>' + btnEliminar;
                },
            },
            { "type": "date-eu", "aTargets": [0] },
        ]
    });

    $('#listarPresionArterial tbody').unbind('click');

    $('#listarPresionArterial tbody').on('click', '.btn-primary', function () {
        var data = table.row($(this).parents('tr')).data();
        var index = table.row($(this).parents('tr')).index();

        editarPresionArterial(data.Codigo, index);
    });

    $('#listarPresionArterial tbody').on('click', '.btn-danger', function () {
        var data = table.row($(this).parents('tr')).data();
        var index = table.row($(this).parents('tr')).index();

        eliminarPresionArterial(data.Codigo);
    });
}

function AbrirModalAgregarPresionArterial() {
    let paciente = $("#pacienteEmail").html();
    $("#formAgregarPresionArterial #Paciente").val(paciente).attr("disabled", true);
    $("#formAgregarPresionArterial .modal-header").addClass("transitionIn");

    $("#modalAgregarPresionArterial").modal("show");
}

function guardarPresionArterial() {
    if ($("#formAgregarPresionArterial").valid()) {
        $("#formAgregarPresionArterial #Paciente").attr("disabled", false);
        $("#formAgregarPresionArterial #RitmoIrregular").val($("#formAgregarPresionArterial #RitmoIrregular").prop('checked'));
        $.post("/PresionArterial/AgregarPresionArterial",
        $("#formAgregarPresionArterial").serialize(),
       function (data) {
           //limpiarFormularioAgregar();
           if (data.Resultado) {
               $("#modalAgregarPresionArterial").modal("hide");
               swal("Exito!", "PresionArterial agregado correctamente!", "success")
               updateChart(data.PresionArterial)
               updateTablaNewRow(data.PresionArterial.Codigo);
           }
       });
    }
}





function updateChart(presion) {
    let size = myChart.data.labels.length;
    let index =  findIndex(dtConvFromJSON(presion.Fecha));
    alert(index);
    myChart.data.labels.splice(index,0,dtConvFromJSON(presion.Fecha));
    myChart.data.datasets[0].data.splice(index, 0, presion.Sistolica);
    myChart.data.datasets[1].data.splice(index, 0, presion.Diastolica);
    myChart.data.datasets[0].codigos.splice(index, 0, presion.Codigo);

    myChart.options.scales.yAxes[0].ticks.min = calculaMinimo(myChart.data.datasets[1].data);
    myChart.options.scales.yAxes[0].ticks.max = calculaMaximo(myChart.data.datasets[0].data);

    myChart.update();
}

function updateChartByIndex(index, presion) {

    //lo elimino
    let pos = myChart.data.datasets[0].codigos.indexOf(parseInt(presion.Codigo));
    myChart.data.datasets[0].codigos.splice(pos, 1);
    myChart.data.datasets[0].data.splice(pos, 1);
    myChart.data.datasets[1].data.splice(pos, 1);
    myChart.data.labels.splice(pos, 1);

    //Lo agrego de nuevo 
    updateChart(presion);

}

function eraseDataChart(codigoPresionArterial) {
    let pos = myChart.data.datasets[0].codigos.indexOf(parseInt(codigoPresionArterial));
    myChart.data.datasets[0].codigos.splice(pos, 1);
    myChart.data.datasets[0].data.splice(pos, 1);
    myChart.data.datasets[1].data.splice(pos, 1);

    myChart.data.labels.splice(pos, 1);

    myChart.options.scales.yAxes[0].ticks.min = calculaMinimo(myChart.data.datasets[1].data);
    myChart.options.scales.yAxes[0].ticks.max = calculaMaximo(myChart.data.datasets[0].data);

    myChart.update();
}

function hideRow(codigo) {
    var table = $('#listarPresionArterial').DataTable();
    $.fn.dataTable.ext.search.push(
      function (settings, data, dataIndex) {
          return $(table.row(dataIndex).node()).attr("id") != "Row" + codigo;
      }
    );
    table.draw();
}

function updateTableRow(codigo) {
    let table = $('#listarPresionArterial').DataTable();
    let row = table.row("#Row" + codigo).node();

    let fecha = $("#formEditarPresionArterial #Fecha").val();

    let sistolica = $("#formEditarPresionArterial #Sistolica").val();
    let diastolica = $("#formEditarPresionArterial #Diastolica").val();
    let pulso = $("#formEditarPresionArterial #Pulso").val();
    //Cambiar por val?? probarlo 
    let ritmoIrregular = $("#formEditarPresionArterial #RitmoIrregular").val();

    $('#listarPresionArterial').dataTable().fnUpdate(fecha, row, 0);
    $('#listarPresionArterial').dataTable().fnUpdate(sistolica, row, 1);
    $('#listarPresionArterial').dataTable().fnUpdate(diastolica, row, 2);
    $('#listarPresionArterial').dataTable().fnUpdate(pulso, row, 3);
    $('#listarPresionArterial').dataTable().fnUpdate((ritmoIrregular)?'Si':'No', row, 4);

    $('#listarPresionArterial').dataTable().fnUpdate($("#formEditarPresionArterial #Detalle").val(), row, 5);

}

function updateTablaNewRow(codigoPresionArterial) {
    let table = $('#listarPresionArterial').DataTable();
    let sistolica = $("#formAgregarPresionArterial #Sistolica").val();
    let diastolica = $("#formAgregarPresionArterial #Diastolica").val();
    let pulso = $("#formAgregarPresionArterial #Pulso").val();
    //Cambiar por val?? probarlo 
    let ritmoIrregular = $("#formAgregarPresionArterial #RitmoIrregular").prop("checked");


    let fecha = $("#formAgregarPresionArterial #Fecha").val();
    let Notas = $("#formAgregarPresionArterial #Detalle").val()



    let row = table.row.add({
        "Fecha": fecha,
        "Sistolica": sistolica,
        "Diastolica": diastolica,
        "Pulso": pulso,
        "RitmoIrregular":ritmoIrregular,
        "Detalle": Notas,
        "Codigo": codigoPresionArterial
    })
    .draw();

    row.nodes().to$().attr('id', 'Row' + codigoPresionArterial);
}

function editarPresionArterial(codigoPresionArterial, index) {
    $.get("/PresionArterial/ObtenerPresionArterial",
    { codigo: codigoPresionArterial },
    function (data) {
        var json = JSON.stringify(data);
        $("#formEditarPresionArterial #Paciente").val(data.Paciente).attr("disabled", true);
        $("#formEditarPresionArterial #Fecha").val(dtConvFromJSON(data.Fecha));
        $("#formEditarPresionArterial #Sistolica").val(data.Sistolica);
        $("#formEditarPresionArterial #Diastolica").val(data.Diastolica);
        $("#formEditarPresionArterial #Pulso").val(data.Pulso);
        $("#formEditarPresionArterial #Detalle").val(data.Detalle);
        $("#formEditarPresionArterial #RitmoIrregularE").prop('checked',data.RitmoIrregular);
        var codigo = $("#formEditarPresionArterial #Codigo")
        codigo.val(codigoPresionArterial);
        $("#CodigoTR").val(index);
        $("#modalEditarPresionArterial .modal-header").addClass("transitionIn");
        $("#modalEditarPresionArterial").modal("show");
    })
}



function guardarEditarPresionArterial() {
    if ($("#formEditarPresionArterial").valid()) {
        $("#formEditarPresionArterial #Paciente").attr("disabled", false);
        $("#formEditarPresionArterial #RitmoIrregular").val($("#formEditarPresionArterial #RitmoIrregularE").prop('checked'));
        $.post("/PresionArterial/EditarPresionArterial",
      $("#formEditarPresionArterial").serialize(),
       function (data) {
           if (data.Resultado) {
               updateChartByIndex($("#CodigoTR").val(), data.PresionArterial);
               updateTableRow($("#formEditarPresionArterial #Codigo").val());
               swal("Exito!", "afección editada correctamente!", "success")
               $("#modalEditarPresionArterial").modal("hide");
           }
       });
    }
}




function eliminarPresionArterial(codigoPresionArterial) {
    swal({
        title: "Desea eliminar este registro?",
        text: "El registro de presion arterial  sera eliminad0 de forma permanente de este paciente",
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
                "/PresionArterial/RemoverPresionArterial",
                { codigo: codigoPresionArterial },
                function result(data) {
                    if (data) {

                        swal({
                            title: "Exito!",
                            text: "You will not be able to recover this imaginary file!",
                            type: "success",
                            confirmButtonText: 'Ok',
                        },
                            function (isConfirm) {
                                $("#modalEditarPresionArterial").modal("hide");
                                eraseDataChart(codigoPresionArterial);
                                hideRow(codigoPresionArterial)
                            });

                    }
                    else {
                        swal("Cancelado", "No se elimino el registro del peso ", "error");
                    }
                });

        } else {
            swal("Cancelado", "No se elimino el registro del peso ", "error");
        }
    });

}

function eliminarPresionArterialFromModal() {
    let codigoPresionArterial = $("#formEditarPresionArterial #Codigo").val();
    eliminarPresionArterial(codigoPresionArterial);
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

function findIndex(fecha) {
    let index = 0;    
    for (let i = 0; i < myChart.data.labels.length; i++) {
        if(compareDateString(fecha,myChart.data.labels[i])<0){
            return index;
        }
        index++;
    }
    return index;
}

function compareDateString(e1,e2){
        let a = e1.split('/').reverse().join('');
        let b = e2.split('/').reverse().join('');
        return a > b ? 1 : a < b ? -1 : 0;
}