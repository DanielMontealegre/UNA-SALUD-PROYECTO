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

    $('#formEditarPeso #Fecha').datetimepicker({
        format : "DD/MM/YYYY", 
        showClose: true,
        showClear: true,
        toolbarPlacement: 'top'
    });

    var ctx = document.getElementById("chartPeso");
    $.get("/Pesos/GetPesos/daniel@gmail.com/",
    function (data) {
        initializeTable(data);
        let arrayLabels = [];
        let arrayPesos = [];
        let arrayCodigos = [];
        data.forEach(peso=> {
            let fecha = dtConvFromJSON(peso.Fecha);
            arrayLabels.push(fecha);
            arrayPesos.push(peso.Peso1);
            arrayCodigos.push(peso.Codigo);
        })

        var max = arrayPesos.reduce(function(a, b) {
            return Math.max(a, b);
        });

        var min =arrayPesos.reduce(function(a, b) {
            return Math.min(a, b);
        });

        console.log(arrayPesos);
        console.log(arrayLabels);

        myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: arrayLabels,
                datasets: [
                    {
                        label: "Peso",
                        fill: false,
                        lineTension: 0.1,
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
                            return 'Peso: '+tooltipItem.yLabel;
                        },
                    }

                }
            }
        });
        $("#chartPeso").click(function (evt) {
            let activePoints = myChart.getElementsAtEvent(evt);
            if (activePoints[0]) {
                let codigos = myChart.data.datasets[0].codigos;
                editarPeso(codigos[activePoints[0]._index],activePoints[0]._index);
            }
            console.log(activePoints[0])
        })
    });

});


function AbrilModalAgregarPeso() {
    var paciente = $("#pacientePeso").html();
    $("#formAgregarPeso #Paciente").val(paciente).attr("disabled", true);
    $("#modalAgregarPeso").modal("show");
}

function guardarPeso() {
    if ($("#formAgregarPeso").valid()) {
        $("#formAgregarPeso #Paciente").attr("disabled", false);
        $.post("/Pesos/AgregarPeso",
        $("#formAgregarPeso").serialize(),
       function (data) {
           //limpiarFormularioAgregar();
           if (data.Resultado)
               $("#modalAgregarPeso").modal("hide");
           swal("Exito!", "Peso agregado correctamente!", "success")
           addData(data.Peso)

       });
    }
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
        { "data": "Peso1" },
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
            {"width": 140,"aTargets":[3]}
        ]
    });
}


function calculaMaximo(array) {
   let max =array.reduce(function (a, b) {
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

function addData(peso) {
    let size = myChart.data.labels.length;
    myChart.data.labels[size] =dtConvFromJSON(peso.Fecha);
    myChart.data.datasets[0].data[size] = peso.Peso1
    myChart.data.datasets[0].codigos[size] = peso.Codigo;

    myChart.options.scales.yAxes[0].ticks.min = calculaMinimo(myChart.data.datasets[0].data);
    myChart.options.scales.yAxes[0].ticks.max = calculaMaximo(myChart.data.datasets[0].data);

    myChart.update();
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
               actualizarGrafico($("#CodigoTR").val(), data.Peso);
               swal("Exito!", "afección editada correctamente!", "success")
               $("#modalEditarPeso").modal("hide");
           }
       });
    }
}

function actualizarGrafico(index,peso) {
    console.log($("#formEditarPeso #Fecha").val());
    myChart.data.datasets[0].data[index] = peso.Peso1;
    myChart.data.labels[index] = dtConvFromJSON(peso.Fecha);

    myChart.options.scales.yAxes[0].ticks.min = calculaMinimo(myChart.data.datasets[0].data);
    myChart.options.scales.yAxes[0].ticks.max = calculaMaximo(myChart.data.datasets[0].data);

    myChart.update();
}


function eliminarPeso() {
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
        let codigoPeso = $("#formEditarPeso #Codigo").val();
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
                                eraseData(codigoPeso);
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


function eraseData(codigoPeso) {
    console.log(myChart.data.datasets[0].codigos)
    let pos =myChart.data.datasets[0].codigos.indexOf(parseInt(codigoPeso));
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
    $("#table-container").removeClass("col-md-6").css("display","none");
}