var MD_STOCK = '827b7db6-da29-412f-86b8-aa5e5cdc696b';
var STOCKS = [];

function _evento_renderizarControl() {

    STOCKS = _evento_obtenerStock();
    $('div[data-field=Stock]').hide();
    var controlStock = "<div class='my-formfield' style='width: 800px;'><label>Stock</label><span><span dir='none' id='controlStock'><br></span><span class='ms-metadata'></span></span></div>"
    $('div[data-field=Stock]').before(controlStock);

    $('#controlStock').append("<input id='searchBox' style='width:238px;' placeHolder='Ingrese nombre para filtrar' id='filtroNombre' onkeyup='_evento_filtrarGrilla()'/>" + ObtenerComboEstados() + "<br/><br/><div style='height:350px;overflow:auto;'><table id='comandoStock'></table></div>");
    //$('#comandoStock').remove()
    for (q = 0; q < STOCKS.length; q++) {
        var rta = false;
        $("[id^='Stock'][id$='SelectResult']").find('option').each(function () {
            if ($(this).val() == STOCKS[q].Id) {
                rta = true;
            }
        });
        if (!rta) {
            $('#comandoStock').append("<tr class='trCheck'><td><input id='curCheck" + +STOCKS[q].Id + "' class='oCheck' onclick='_evento_CambiarCheck(this, " + STOCKS[q].Id + ")' type='checkbox'/></td><td><b class='wordC'>" + STOCKS[q].NombreStock + "</b> <b style='color:steelblue;'>LOT: " + STOCKS[q].LOT + "</b> <b style='color:steelblue;'>REF: " + STOCKS[q].REF + "</b> <b style='color:steelblue;'>Medida: " + STOCKS[q].Medida + "</b><label style='display:none;' class='hiddenEstado'>" + STOCKS[q].Estado + "</label></td></tr>")
        }
        else {
            $('#comandoStock').append("<tr class='trCheck'><td><input id='curCheck" + +STOCKS[q].Id + "' checked='checked' class='oCheck' onclick='_evento_CambiarCheck(this, " + STOCKS[q].Id + ")' type='checkbox'/></td><td><b class='wordC'>" + STOCKS[q].NombreStock + "</b> <b style='color:steelblue;'>LOT: " + STOCKS[q].LOT + "</b> <b style='color:steelblue;'>REF: " + STOCKS[q].REF + "</b> <b style='color:steelblue;'>Medida: " + STOCKS[q].Medidas + "</b><label style='display:none;' class='hiddenEstado'>" + STOCKS[q].Estado + "</label></td></tr>")
        }

    }

}
var selector = "[id$='MultiLookup']"; //for 2013

function _evento_filtrarGrilla() {

    $('.trCheck').show();
    var filtroCheck = $('#selectEstadoStcok').val();
    $('.trCheck').each(function () {
        if ($(this).find('.wordC').html().toUpperCase().indexOf($('#searchBox').val().toUpperCase()) == -1) {
            $(this).hide();
        }
        if (filtroCheck != "-1" && $(this).find('.hiddenEstado').text().toUpperCase().indexOf(filtroCheck.toUpperCase()) == -1) {
            $(this).hide();
        }
    });


    console.log($('#searchBox').val())
}

function _evento_CambiarCheck(control, idx) {
    console.log(control.checked)
    console.log(idx)
    if (control.checked) {
        addChoice(idx);
    }
    else {
        removeChoice(idx);
    }
}

function addChoice(text) {
    $("[id$='_SelectCandidate'] option").each(function () {
        if ($(this).val() == text) {
            $(this).appendTo($("[id$='_SelectResult']"));
            var multilookupPickerVal = $(selector).val();
            if ($(selector).val() == undefined || $(selector).val().length == 0) {
                $(selector).val($(this).val() + "|t" + $(this).text());
            }
            else {
                $(selector).val(multilookupPickerVal + "|t" + $(this).val() + "|t" + $(this).text());
            }
        }
    });
}

function removeChoice(text) {
    $("[id$='_SelectResult'] option").each(function () {
        if ($(this).val() == text) {
            $(this).appendTo($("[id$='_SelectCandidate']"));
            var multilookupPickerVal = $(selector).val();
            var valToRemove = $(this).val() + "|t" + $(this).text();
            var newValue = multilookupPickerVal.replace(valToRemove, "");
            $(selector).val(newValue);
        }
    });
}

function _evento_obtenerStock() {
    var viewXml = {
        ViewXml: GenerarCamlQuery(DevolverNodosStock())
    }
    var elementos = SPD_GetListItems_CamlQuery(_spPageContextInfo.webAbsoluteUrl, MD_STOCK, viewXml).results;
    return elementos;
}
function GenerarCamlQuery(oNodos) {
    var inicioQ = "<View><Query><Where>";
    var abroA = "<And>";
    var cierroA = "</And>";
    var finQ = "</Where><OrderBy><FieldRef Name='NombreStock' Ascending='False' /></OrderBy></Query></View>";
    var Nodos = oNodos;
    var cont = 0;
    var arregloY = [];
    var nodo = "";
    //Este algoritmo agrupa los nodos de a pares uniendolos con "<And>" recursivamente
    for (k = 0; k < Nodos.length; k++) {
        cont++;
        if (cont == 1) {
            nodo = Nodos[k];
            if (k == (Nodos.length - 1))
                arregloY.push(nodo);
        }
        if (cont == 2) {
            nodo = abroA + nodo + Nodos[k] + cierroA;
            arregloY.push(nodo);
            nodo = "";
            cont = 0;
        }
        if (k == (Nodos.length - 1)) {
            Nodos = arregloY;
            if (arregloY.length == 1)
                break;
            k = -1;
            cont = 0;
            arregloY = [];
        }
    }
    if (arregloY.length > 0)
        inicioQ = inicioQ + arregloY[0];

    inicioQ = inicioQ + finQ;
    datos = inicioQ;
    return inicioQ;
}

function DevolverNodosStock() {
    var nodos = [];
    nodos.push('<Contains><FieldRef Name="Estado" /><Value Type="Text">En depósito</Value></Contains>');
    return nodos;
}

function ObtenerComboEstados() {
    var selectFields = "<br/><select id='selectEstadoStcok' onclick='_evento_filtrarGrilla();'><option value='-1'>Todos</option>";
    var stockFields = SPD_GetListFields(_spPageContextInfo.webAbsoluteUrl, MD_STOCK).results
    var estadoField;
    for (tt = 0; tt < stockFields.length; tt++) {
        if (stockFields[tt].InternalName == "Estado") {
            estadoField = stockFields[tt];
        }
    }

    if (estadoField != null) {
        var choices = estadoField.Choices.results;
        for (tt = 0 ; tt < choices.length; tt++) {
            selectFields = selectFields + "<option value='" + choices[tt] + "'>" + choices[tt] + "</option>";
        }
    }
    selectFields = selectFields + "</select>";

    return selectFields;
}