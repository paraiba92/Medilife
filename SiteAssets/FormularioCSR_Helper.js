
//iContenedor = donde se guardará el control imaginario
var getCanvas;

function initControlesFormulario() {
    $('div[data-role=form]').before('<div id="contenedorFormulario"></div>');
    $('div[data-role=form]').before('<a id="btn-Convert-Html2Image" style="text-align:center;" class="botones" hidden="hidden"></a>');
}
function _evento_Autocompletar() {
    if (window.confirm("Desea autocompletar el stock en el detalle a mostrar?")) {
        SPD_CrearCuadroModal(0, 0, 0, "", "Cargando... por favor  espere unos segundos", false);
        setTimeout(function () {
            var columnas = _cols.Stock.find("td").last().find("select option");
            columnas.each(function () {
                if (this.value != undefined && this.value != null) {
                    var oItem = SPD_GetListItemById(_spPageContextInfo.webAbsoluteUrl, MD_STOCK, this.value);
                    if (oItem != "") {
                        var rta = oItem.NombreStock;

                        if (oItem.Medida != null && oItem.Medida != "") {
                            rta = rta + ", Medidas: " + oItem.Medida;
                        }
                        if (oItem.Marca != null && oItem.Marca != "") {
                            rta = rta + ", Marca: (" + oItem.Marca + ")";
                        }
                        if (oItem.LOT != null && oItem.LOT != "") {
                            rta = rta + ", LOT: (" + oItem.LOT + ")";
                        }
                        if (oItem.Medidas != null && oItem.Medidas != "") {
                            rta = rta + ", Medida: (" + oItem.Medidas + ")";
                        }
                        $('.SPD__Data .details').last().find(".SPD_Data_Detalle").val(rta);
                        $('.SPD__Data .details').last().find("#btnAgregarDetalle").click();
                    }
                }
            })
            SPD_CerrarCuadroModal();
        }, 100);
    }
}
function _evento_setearDescripcionEmpresa() {
    var oUsuario = SPD_GetListItemById(_spPageContextInfo.webAbsoluteUrl, MD_EMPLEADO, _cols.Empleado.val());
    $('#empleadoDescripcion').html("<span>Empresa: " + oUsuario.NombreEmpresa + "</span><br/>" +
    "<span>Razón social: " + oUsuario.NombreEmpleado + "</span><br/>" +
    "<span>Tel: " + oUsuario.Telefono + "</span><br/>" +
    "<span>Cuit: " + oUsuario.Cuit + "</span><br/>" +
    "<span>Dir: " + oUsuario.Direccion + "</span><br/>");
}
function SPStaff_initDateTimePikers() {
    $("[id$='DateTimeFieldDate']").datepicker();
    $("[id$='DateTimeFieldDateDatePickerImage']").parent().parent().html("<img title='Seleccione una fecha del calendario.' class='calendario' src='/_layouts/15/images/calendar_25.gif?rev=23' style='vertical-align:middle;cursor:pointer;'/>")
    $('.calendario').attr("onclick", "$(this).parent().parent().find(\".ms-input\").focus()");
}
function _evento_descargarImagen(imagenSectionId, type) {

    $('#' + imagenSectionId).show();
    html2canvas(document.querySelector("#" + imagenSectionId), {
        width: 800,
        height: parseInt($("#" + imagenSectionId).css("height"))
    }).then(canvas => {

    contenedorFormulario.appendChild(canvas);
    $("#" + imagenSectionId).hide();
    getCanvas = canvas;

    var nombreImagen = type + " N° " + _FormPrintData.Numero + " " + _FormPrintData.Proveedor;
    var imgageData = getCanvas.toDataURL("image/png");
    var newData = imgageData.replace(/^data:image\/png/, "data:application/octet-stream");
    $("#btn-Convert-Html2Image").attr("download", nombreImagen + ".png").attr("href", newData);
    $("#btn-Convert-Html2Image")[0].click();
    $('#contenedorFormulario').html("");
});
}
function _evento_ImprimirFormulario(elem)
{
    var mywindow = window.open('', 'PRINT', 'height=400,width=600');

    mywindow.document.write('<html><head><title>' + document.title  + '</title>');
    mywindow.document.write('</head><body >');
    mywindow.document.write('<h1>' + document.title  + '</h1>');
    mywindow.document.write(document.getElementById(elem).innerHTML);
    mywindow.document.write('</body></html>');

    mywindow.document.close(); // necessary for IE >= 10
    mywindow.focus(); // necessary for IE >= 10*/

    mywindow.print();
    mywindow.close();

    return true;
}
function _evento_SetearAreaValor() {
    var sumatoria = 0;
    var totales = _cols.PrecioT.val().split("#;");

    for (i = 0; i < totales.length; i++) {
        if(totales[i] != ""){
            sumatoria = sumatoria + parseFloat(totales[i])
        }
    }
    $('#areaValor').text(NumeroALetras(sumatoria));
    $('#textoareaValor').text("$ "+ sumatoria);
}
var countingBr = [];
function _evento_SetearEnPrespuestoDescripcion(areaId, control) {
    countingBr = [];
    $('#' + areaId).html("");
    var controlDatos = control.val().split("#;");
    for (i = 0; i < controlDatos.length; i++) {
        var count = 1;
        var oPalabra = controlDatos[i];
        var strudel = "";
        for (red = 0; red < oPalabra.length; red++) {
            strudel = strudel + oPalabra[red];
            if (red == 65 * count) {
                count++
                strudel = strudel + "<br/>";
            }
        }
        countingBr.push(count);
        $('#' + areaId).append(strudel + "<br/><br/>");
    }
}
function _evento_SetearEnPrespuesto(areaId, control) {
    $('#' + areaId).html("");

    var controlDatos = control.val().split("#;");
    for (i = 0; i < controlDatos.length; i++) {
        if(controlDatos[i] != "-1")
            $('#' + areaId).append(controlDatos[i] + "<br/><br/>");
        else
            $('#' + areaId).append("<br/><br/>");
        if (countingBr[i] != 0) {
            for (counte = 0; counte < (countingBr[i] - 1); counte++) {
                $('#' + areaId).append("<br/>");
            }
        }
    }
}