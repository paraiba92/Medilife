function actualizarEstadoStock() {
    if (_indexSockIds < medicos_analizar.length) {

        SPD_CrearCuadroModal(0, 0, 0, "", "Actualizando estado Stock " + _indexSockIds + " de " + medicos_analizar.length, false);

        var clientContext = SP.ClientContext.get_current()

        var oList = clientContext.get_web().get_lists().getById(currentId);

        this.oListItem = oList.getItemById(medicos_analizar[_indexSockIds]);

        oListItem.set_item('NuevoMedico', medicoId);

        oListItem.update();

        clientContext.executeQueryAsync(Function.createDelegate(this, this.onQuerySucceeded), Function.createDelegate(this, this.onQueryFailed));
    }
    else {
        if (ejecucion < 1) {
            ejecucion++;
            _indexSockIds = 0;
            medicos_analizar = [];
            console.log("SEGUNDA VUELTA");
            _proceso(MD_Presupuestos);
        }
        else {
            ejecucion = 0;
        }

    }
}

function onQuerySucceeded() {
    SPD_CerrarCuadroModal();
    _indexSockIds++;
    actualizarEstadoStock();
}

function onQueryFailed(sender, args) {
    _indexSockIds++;
    SPD_CerrarCuadroModal();
    alert('Falló operación. Contacte con administrador. ' + args.get_message() + '\n' + args.get_stackTrace());
}

function _proceso(idx) {
    var viewXml = {
        ViewXml: "<View><Query><Where><And><IsNull><FieldRef Name='NuevoMedico' /></IsNull><IsNotNull><FieldRef Name='Doctor' /></IsNotNull></And></Where></Query></View>"
    }
    var elementos = SPD_GetListItems_CamlQuery(_spPageContextInfo.webAbsoluteUrl, idx, viewXml).results;
    //var elementos = SPD_GetListItems_CamlQuery(_spPageContextInfo.webAbsoluteUrl, idx MD_REMITO, viewXml).results;
    //var elementos = SPD_GetListItems_CamlQuery(_spPageContextInfo.webAbsoluteUrl, MD_Presupuestos, viewXml).results;

    for (k = 0; k < elementos.length; k++) {
        if (medicoBuscar.toUpperCase() == elementos[k].Doctor.toUpperCase()) {
            medicos_analizar.push(elementos[k].ID);
        }
    }
    currentId = idx;
    console.log(medicos_analizar);
    actualizarEstadoStock();
}

var medicoBuscar = "ALVAREZ IORIO";
var medicoId = 2;

var medicos_analizar = [];
var _indexSockIds = 0;
var ejecucion = 0;
var currentId = 0;
_proceso(MD_REMITO);