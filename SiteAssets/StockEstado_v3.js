
var _estadoStockIds = [];
var _indexSockIds = 0;
var _estadoOpcion = "";
var _institucionSelec = "";
var _comentario = "";
var _consignacion = false;
function _crearBotonCambiarEstado() {
    $('input[value=Guardar]').last().hide();
    $('input[value=Guardar]').last().parent().prepend('<button onclick="proceso_ActualizarEstadoInit();event.preventDefault();" style="border-radius: 5px;color: white;min-width: 30px!important;border: none;background: red;cursor:pointer;font-size:12px;font-weight:bold"><i class="fa fa-refresh"></i>&nbsp;Guardar</button>');
}

function proceso_ActualizarEstadoInit() {
    if (window.confirm("Actualizar el estado del stock antes de guardar?")) {
        proceso_ActualizarEstado_ABM();
    }
    else {
        $('input[value=Guardar]').last().click();
    }
}

function proceso_ActualizarEstado_ABM() {
    _estadoStockIds = [];
    _indexSockIds = 0;
    var html = "";

    $('.oCheck:checked').each(function () {
        _estadoStockIds.push($(this).attr("Id").split("curCheck")[1]);
        html = html + $(this).closest("tr").find("td").last().html() + "<br/>";
        console.log($(this).closest("tr").last("td"));
    });

    console.log(html);

    var selectFields = "<br/><label style='font-weight:bold;color:red;'>Estado: </label><select id='selectEstadoStock'>";

    var stockFields = SPD_GetListFields(_spPageContextInfo.webAbsoluteUrl, MD_STOCK).results
    var estadoField;

    for (tt = 0; tt < stockFields.length; tt++) {
        if (stockFields[tt].InternalName == "Estado") {
            estadoField = stockFields[tt];
        }
    }

    if (estadoField != null) {
        console.log(estadoField);

        var choices = estadoField.Choices.results;

        for (tt = 0 ; tt < choices.length; tt++) {
            selectFields = selectFields + "<option value='" + choices[tt] + "'>" + choices[tt] + "</option>";
        }

    }

    selectFields = selectFields + "</select>";

    //////////////////////
    selectFields = selectFields + "<br/><br/><label style='font-weight:bold;color:red;'>Deposito destino: </label><select id='select_institucionS'>";
    selectFields = selectFields + "<option value='-1'>Seleccione</option>";

    var viewXml = {
        ViewXml: "<View><Query><Where>" +
            "</Where><OrderBy><FieldRef Name='NombreInstitucion' Ascending='True' /></OrderBy></Query></View>"
    }

    var oItems = SPD_GetListItems_CamlQuery(_spPageContextInfo.webAbsoluteUrl, MD_INSTITUCION, viewXml).results;

   
    for (ins = 0; ins < oItems.length; ins++) {
        selectFields = selectFields + "<option value='" + oItems[ins].Id + "'>" + oItems[ins].NombreInstitucion + "</option>";
    }

    selectFields = selectFields + "</select>";

    selectFields = selectFields + "<br/><br/><label style='font-weight:bold;color:red;'>Comentario: </label><input type='text' maxlength='255' id='_comentario' style='width: 300px;' class='ms-long ms-spellcheck-true'>";

    selectFields = selectFields + "<br/><br/>";

    //

    selectFields = selectFields + "<label style='font-weight:bold;color:red;'>Consignado: </label><input type='checkbox' id='checkConsignacion'/><i><br/>Solo se actualizará la consignación en caso de estár marcado. Si se deja como está no se modificarán las consignaciones</i><br/>"

    html = html + selectFields;

    SPD_CrearCuadroModal(2, 800, 600, "Actualizar estado Stock", html, "evento_cambiarEstadoStock()");
}
function evento_cambiarEstadoStock() {
    if (_estadoStockIds.length > 0) {
        _estadoOpcion = $('#selectEstadoStock').val();
        _institucionSelec = $('#select_institucionS').val();
        _comentario = $('#_comentario').val();
        _consignacion = $('#checkConsignacion').prop("checked");
        SPD_CerrarCuadroModal();
        actualizarEstadoStock(0);
    }
    else {
        SPD_CerrarCuadroModal();
        $('input[value=Guardar]').last().click();
    }
}

function actualizarEstadoStock(_indexSockIds) {

    SPD_CrearCuadroModal(0, 0, 0, "", "Actualizando estado Stock... " + _indexSockIds + " de " + _estadoStockIds.length , false);

    var clientContext = SP.ClientContext.get_current()

    var oList = clientContext.get_web().get_lists().getById(MD_STOCK);

    this.oListItem = oList.getItemById(_estadoStockIds[_indexSockIds]);

    console.log(_estadoOpcion);
    console.log(_institucionSelec);
    console.log(_obtenerComentarioStock(_estadoStockIds[_indexSockIds]) + _comentario);

    oListItem.set_item('Estado', _estadoOpcion);
    if (_institucionSelec != "-1") {
        oListItem.set_item('Institucion', _institucionSelec);
    }
    if (_comentario != "") {
        oListItem.set_item('Comentario', _obtenerComentarioStock(_estadoStockIds[_indexSockIds]) + _comentario);
    }
    if (_consignacion) {
        oListItem.set_item('EnConsignacion', true);
    }


    oListItem.update();

    clientContext.executeQueryAsync(Function.createDelegate(this, this.onQuerySucceeded), Function.createDelegate(this, this.onQueryFailed));
}

function onQuerySucceeded() {
    SPD_CerrarCuadroModal();
    _indexSockIds++;
    if (_indexSockIds < _estadoStockIds.length)
        actualizarEstadoStock(_indexSockIds);
    else
        $('input[value=Guardar]').last().click();
}

function onQueryFailed(sender, args) {
    SPD_CerrarCuadroModal();
    alert('Falló operación. Contacte con administrador. ' + args.get_message() + '\n' + args.get_stackTrace());
}