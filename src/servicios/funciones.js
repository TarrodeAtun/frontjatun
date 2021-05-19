export var funciones = {
    formatearRut,
    quitarFormato,
    getRutFormateado,
    validarEmail,
    nombreDia

};

async function formatearRut(rutCrudo, dv) {
    var sRut = new String(rutCrudo);
    var sRutFormateado = '';
    sRut = quitarFormato(sRut);
    if (dv) {
        console.log(":D");
        var sDV = sRut.charAt(sRut.length - 1);
        sRut = sRut.substring(0, sRut.length - 1);
    }
    while (sRut.length > 3) {
        sRutFormateado = "." + sRut.substr(sRut.length - 3) + sRutFormateado;
        sRut = sRut.substring(0, sRut.length - 3);
    }
    console.log(sDV);
    sRutFormateado = sRut + sRutFormateado;
    if (sRutFormateado != "" && dv) {
        sRutFormateado += "-" + sDV;
    }
    else if (dv) {
        sRutFormateado += sDV;
    }

    return sRutFormateado;
}
function quitarFormato(rutCrudo) {
    var strRut = new String(rutCrudo);
    while (strRut.indexOf(".") != -1) {
        strRut = strRut.replace(".", "");
    }
    while (strRut.indexOf("-") != -1) {
        strRut = strRut.replace("-", "");
    }
    return strRut;
}

function getDigito(rut) {
    var dvr = '0';
    var suma = 0;
    var mul = 2;
    for (var i = rut.length - 1; i >= 0; i--) {
        suma = suma + rut.charAt(i) * mul;
        if (mul === 7) {
            mul = 2;
        }
        else {
            mul++;
        }
    }
    var res = suma % 11;
    if (res === 1) {
        return 'k';
    }
    else if (res === 0) {
        return '0';
    }
    else {
        return 11 - res;
    }
}

async function getRutFormateado(rutCrudo, dv) {
    var rut = await formatearRut(rutCrudo);
    rut = rut + "-" + dv
    return rut;
}

async function validarEmail(valor) {
    if (/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(valor)) {
        return true;
    } else {
        return false
    }
}

function nombreDia(fecha) {
    var arrayOfWeekdays = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sabado"]
    var weekdayNumber = fecha.getDay();
    console.log(weekdayNumber);
    var weekdayName = arrayOfWeekdays[weekdayNumber]
    return weekdayName;
}