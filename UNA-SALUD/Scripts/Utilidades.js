function dtConvFromJSON(data) {
    if (data == null) return '1/1/1950';
    let r = /\/Date\(([0-9]+)\)\//gi
    let matches = data.match(r);
    if (matches == null) return '1/1/1950';
    let result = matches.toString().substring(6, 19);
    let epochMilliseconds = result.replace(
    /^\/Date\(([0-9]+)([+-][0-9]{4})?\)\/$/,
    '$1');
    let b = new Date(parseInt(epochMilliseconds));
    let c = new Date(b.toString());
    let curr_date = c.getDate();
    let curr_month = c.getMonth() + 1;
    let curr_year = c.getFullYear();
    let curr_h = c.getHours();
    let curr_m = c.getMinutes();
    let curr_s = c.getSeconds();
    let curr_offset = c.getTimezoneOffset() / 60
    let d = ((curr_date < 10) ? '0' + curr_date : curr_date) + '/' + ((curr_month < 10) ? '0' + curr_month.toString() : curr_month.toString()) + '/' + curr_year;
    return d;
}


function mensajeOk(titulo, texto, funcion) {
    swal({
        title: titulo,
        text: texto,
        type: "success",
        confirmButtonText: 'Ok',
    },
          function (isConfirm) {
              funcion();

          });
}

function validatorDateFormat() {
    $.validator.methods.date = function (value, element) {
        return this.optional(element) || Date.parseExact(value,'d/M/yyyy') !== null;
    };
}


function redondeoHaciaArriba(a) {
    var math = Math.round(a);
    if (math % 10 == 0)
        return math + 5;
    return math + (10 - a % 10);
}

function redondeoHaciaAbajo(a) {
    var math = Math.round(a);
    if (math % 10 == 0)
        return math - 5;
    return math - (a % 10);
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