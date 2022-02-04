/*
    var _FormPrintData = {
        Tarea: "Descargar"
        FormId : "FORMULARIO_PRESUPUESTO",
        Tipo : "Presupuesto",
        Empresa : "Mefilife Salud",
        RazonSocial :  "Cristian Delfabro",
        Telefono : "2234363105",
        Cuit : "20-20404040404-0",
        Direccion : "Blas pareda 5050",
        Fecha : "15/02/1992",
        Numero : "0-900060",
        Doctor : "Mendiburu",
        Institucion : "Clínica Pueyrredón",
        Proveedor : "Obra social personal de la sanidad ARG",
        Paciente : "Gutierrez pacheco martín",
        Data : Data,
        PagoA : "El pago será contemplado 30 días despues de ser emitido",
        TextoTotal : "Quinientos veinti tres con trescientos cincuenta y cinco con 00/100",
        ValorTotal : 500.50
    }
*/
var _FormPrintData = {};

function _evento_Form_Procesar() {
    $('#' + _FormPrintData.FormId).show();
    _FORM_INIT(_FormPrintData.FormId);
    _FORM_INIT_HEAD(_FormPrintData.Empresa,
        _FormPrintData.RazonSocial,
        _FormPrintData.Telefono,
        _FormPrintData.Cuit,
        _FormPrintData.Direccion,
        _FormPrintData.Tipo,
        _FormPrintData.Fecha,
        _FormPrintData.Numero);
    _FORM_INIT_HEAD_INS_DOC(_FormPrintData.Institucion, _FormPrintData.Doctor);
    _FORM_INIT_HEAD_OS_PAC(_FormPrintData.Proveedor, _FormPrintData.Paciente);
    _FORM_INIT_BODY_DESC(_FormPrintData.Tipo);

    for (r = 0; r < _FormPrintData.Data.length; r++) {
        _FORM_INIT_BODY_CUERPE(r, _FormPrintData.Tipo, _FormPrintData.Data[r].Cantidad, _FormPrintData.Data[r].Descripcion, _FormPrintData.Data[r].PU, _FormPrintData.Data[r].PT);
    }

    $('#_FORM_TABLE').append("<tr id='_FORM_TABLE_BODY_CUERPEFINAL'><td style='border-bottom:1px solid lightgrey;'></td></tr>");
    _FORM_TABLE_FOOTER1(_FormPrintData.Tipo, _FormPrintData.TextoTotal, _FormPrintData.ValorTotal);
    _FORM_TABLE_FOOTER2(_FormPrintData.Tipo, _FormPrintData.PagoA);
    console.log($('#_FORM_TABLE').css("height"))
    if (parseInt($('#_FORM_TABLE').css("height")) < 800) {
        $('#_FORM_TABLE_BODY_CUERPEFINAL').css("height", 800 - parseInt($('#_FORM_TABLE').css("height")));
    }
    if (_FormPrintData.Tarea == "Descargar") {
        _evento_descargarImagen(_FormPrintData.FormId, _FormPrintData.Tipo);
    }
    if (_FormPrintData.Tarea == "Imprimir") {
        _evento_ImprimirFormulario(_FormPrintData.FormId);
    }
        
}


function _FORM_INIT(idx) {
    $('#' + idx).html("");
    $('#' + idx).html("<table id='_FORM_TABLE' style='border:1px solid lightgrey;min-width:800px;max-width:800px;font-family:Times New Roman'></table>")

    $('#_FORM_TABLE').append("<tr id='_FORM_TABLE_HEAD'></tr>");
    $('#_FORM_TABLE').append("<tr id='_FORM_TABLE_HEAD_INS_DOC'></tr>");
    $('#_FORM_TABLE').append("<tr id='_FORM_INIT_HEAD_OS_PAC'></tr>");
    $('#_FORM_TABLE').append("<tr id='_FORM_TABLE_BODY_DESC'></tr>");

}
function _FORM_INIT_HEAD(nombreEmpresa, razonSocial, telefono, cuit, direccion, tipo, fecha, numero) {

    var table = "<table><tr>";

    var firstTD = "<td style='min-width:400px;max-width:400px;text-align:center;border-right:1px solid lightgrey;'>" +
        "<label class='FORM_ROTULO_HEAD'>" + nombreEmpresa + "</label><br/>" +
        "<label class='MIN_FORM_ROTULO'>Razón social: " + razonSocial + "</label><br/>" +
        "<label class='MIN_FORM_ROTULO'>Teléfono: " + telefono + "</label><br/>" +
        "<label class='MIN_FORM_ROTULO'>CUIT: " + cuit + "</label><br/>" +
        "<label class='MIN_FORM_ROTULO'>Dirección: " + direccion + "</label><br/></td>";

    + "</td>";
    var secondTD = "<td style='min-width:150px;max-width150px;text-align:center;border-right:1px solid lightgrey;'>" +
        "<label class='FORM_ROTULO_HEAD'>" + tipo + "</label><br/><br/>" +
        "<label class='FORM_ROTULO_HEAD'>X</label><br/>" +
        "</td>";
    var thirdTD = "<td style='min-width:250px;max-width:250px;text-align:center;botder-right:1px solid lightgrey;'>" +
        "<label class='FORM_ROTULO'>FECHA</label><br/>" +
        "<label class='MIN_FORM_ROTULO'>" + fecha + "</label><br/><br/>" +
        "<label class='FORM_ROTULO'>NÚMERO</label><br/>" +
        "<label class='MIN_FORM_ROTULO'>" + numero + "</label><br/>" +
        "</td>";

    table = table + firstTD + secondTD + thirdTD + "</tr></table>";

    $('#_FORM_TABLE_HEAD').append("<td style='border-bottom: 1px solid lightgrey;'>" + table + "</td>");

}
function _FORM_INIT_HEAD_INS_DOC(institucion, doctor) {

    var table = "<table><tr>";

    var firstTD = "<td style='min-width:400px;max-width:400px;'>" +
        "<label class='MIN_FORM_ROTULO'><b>Institución:</b> " + institucion + "</label></td>";
    var secondTD = "<td style='min-width:400px;max-width:400px;'>" +
        "<label class='MIN_FORM_ROTULO'><b>Doctor:</b> " + doctor + "</label></td>";

    table = table + firstTD + secondTD + "</tr></table>";

    $('#_FORM_TABLE_HEAD_INS_DOC').append("<td>" + table + "</td>");

}
function _FORM_INIT_HEAD_OS_PAC(Proveedor, paciente) {

    var table = "<table><tr>";

    var firstTD = "<td style='min-width:400px;max-width:400px;'>" +
        "<label class='MIN_FORM_ROTULO'><b>Obra social:</b> " + Proveedor + "</label></td>";
    var secondTD = "<td style='min-width:400px;max-width:400px;'>" +
        "<label class='MIN_FORM_ROTULO'><b>Paciente:</b> " + paciente + "</label></td>";

    table = table + firstTD + secondTD + "</tr></table>";


    $('#_FORM_INIT_HEAD_OS_PAC').append("<td style='border-bottom: 1px solid lightgrey;'>" + table + "</td>");

}
function _FORM_INIT_BODY_DESC(tipo) {

    var table = "<table><tr>";


    if (tipo == "Presupuesto") {
        var firstTD = "<td style='bmin-width:50px;max-width:50px;text-align: center;'>" +
            "<label class='FORM_ROTULO'>Cantidad</label></td>";
        var secondTD = "<td style='min-width:450px;max-width:450px;'>" +
            "<label class='FORM_ROTULO'>Descripción</label></td>";
        var thirdTD = "<td style='min-width:150px;max-width:150px;text-align: center;'>" +
            "<label class='FORM_ROTULO'>Precio (u)</label></td>";
        var fourTD = "<td style='min-width:150px;max-width:150px;text-align: center;'>" +
            "<label class='FORM_ROTULO'>Precio (t)</label></td>";

        table = table + firstTD + secondTD + thirdTD + fourTD + "</tr></table>";


        $('#_FORM_TABLE_BODY_DESC').append("<td style='border-bottom: 1px solid lightgrey;'>" + table + "</td>");

    }
    else {
        var firstTD = "<td  style='min-width:50px;max-width:50px;width:50px;text-align: center;'>" +
            "<label class='FORM_ROTULO'>Cantidad</label></td>";
        var secondTD = "<td style='min-width:750px;max-width:750px;width:750px;'>" +
            "<label class='FORM_ROTULO'>Descripción</label></td>";

        table = table + firstTD + secondTD + "</tr></table>";

        $('#_FORM_TABLE_BODY_DESC').append("<td style='border-bottom: 1px solid lightgrey;'>" + table + "</td>");
    }

}
function _FORM_INIT_BODY_CUERPE(index, tipo, cantidad, descripcion, pu, pt) {

    var table = "<table><tr>";


    $('#_FORM_TABLE').append("<tr id='_FORM_TABLE_BODY_CUERPE" + index + "'></tr>");

    if (tipo == "Presupuesto") {
        var firstTD = "<td style='min-width:50px;max-width:50px;vertical-align:top;text-align: center;'>" +
            "<label class='CUERPEROTULO'>" + (cantidad != -1 ? "(" + cantidad + ")" : "") + "</label></td>";
        var secondTD = "<td class='parent-canvas' width='450' style='padding-bottom: 10px;min-width:450px;max-width:450px;;vertical-align:top;  display: inline-block;overflow: hidden;position: relative;'>" +
            "<label class='CUERPEROTULO' style='word-break: break-all;word-break: break-all;max-width: 100%;'>" + fillText(descripcion) + "</label></td>";
        var thirdTD = "<td style='min-width:150px;max-width:150px;vertical-align:top;text-align: center;'>" +
            "<label class='CUERPEROTULO'>" + (pu != -1 ? "($) " + pu : "") + "</label></td>";
        var fourTD = "<td style='min-width:150px;max-width:150px;vertical-align:top;text-align: center;'>" +
            "<label class='CUERPEROTULO'>" + (pt != -1 ? "($) " + pt : "") + "</label></td>";

        table = table + firstTD + secondTD + thirdTD + fourTD + "</tr></table>";


        $('#_FORM_TABLE_BODY_CUERPE' + index).append("<td>" + table + "</td>");

    }
    else {
        var firstTD = "<td style='min-width:50px;max-width:50px;width:50px;vertical-align:top;text-align: center;'>" +
            "<label class='CUERPEROTULO'>" + (cantidad != -1 ? "(" + cantidad + ")" : "") + "</label></td>";
        var secondTD = "<td  width='700'  style='padding-bottom: 10px;word-break: break-all;vertical-align:top;min-width:700px;max-width:700px;width:700px;'>" +
            "<label class='CUERPEROTULO'  style='word-break: break-all;'>" + descripcion + "</label></td>";

        table = table + firstTD + secondTD + "</tr></table>";

        $('#_FORM_TABLE_BODY_CUERPE' + index).append("<td>" + table + "</td>");
    }

}

function fillText(descripcion) {
    var count = 90;
    var count2 = 1;
    var word = "";
    for (qe = 0; qe < descripcion.length; qe++) {
        word = word + descripcion[qe];
        if (qe == count2 * count) {
            word = word + "<br/>";
            count2++;
        }
    }
    return word;
}

function _FORM_TABLE_FOOTER1(tipo, totalTexto, totalValor) {
    $('#_FORM_TABLE').append("<tr id='_FORM_TABLE_FOOTER1'></tr>");
    var table = "<table><tr>";

    if (tipo == "Presupuesto") {

        var firstTD = "<td style='min-width:650px;max-width:650px;'>" +
            "<label class='FORM_ROTULO'>" + totalTexto + "</label></td>";
        var secondTD = "<td style='min-width:150px;max-width:150px;text-align: center;'>" +
            "<label class='FORM_ROTULO'>($) " + totalValor + "</label></td>";

        table = table + firstTD + secondTD + "</tr></table>";

        $('#_FORM_TABLE_FOOTER1').append("<td style='border-bottom: 1px solid lightgrey;'>" + table + "</td>");

    }
    else {
        var firstTD = "<td style='min-width:650px;max-width:650px;padding-top:20px;'>" +
            "<label class='FORM_ROTULO_HEAD'>FIRMA:__________________</label></td>";
        table = table + firstTD + "</tr></table>";

        $('#_FORM_TABLE_FOOTER1').append("<td style='border-bottom: 1px solid lightgrey;'>" + table + "</td>");

    }

}
function _FORM_TABLE_FOOTER2(tipo, pagoA) {

    if (tipo == "Presupuesto") {

        $('#_FORM_TABLE').append("<tr id='_FORM_TABLE_FOOTER2'></tr>");

        var table = "<table><tr>";

        var firstTD = "<td style='min-width:400px;max-width:400px;'>" +
            "<label class='FORM_ROTULO'>* " + pagoA + "</label></td>";

        table = table + firstTD + "</tr></table>";


        $('#_FORM_TABLE_FOOTER2').append("<td style='border-bottom: 1px solid lightgrey;'>" + table + "</td>");
    }
}