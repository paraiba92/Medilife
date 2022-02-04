var viewXml = {
    ViewXml: "<View><Query><Where></Where></Query></View>"
}
var _indexData = 0;
var _indexSockIds = 0;
var filarProcesar = [];
console.log("ObteniendoMarcas");

var elementosMarca = SPD_GetListItems_CamlQuery(_spPageContextInfo.webAbsoluteUrl, 'f0ae70ea-349e-42a7-bc45-dca5786112f7', viewXml).results;

var viewXml2 = {
    ViewXml: "<View><Query><Where><And><IsNull><FieldRef Name='NuevaMarca' /></IsNull><IsNotNull><FieldRef Name='Marca' /></IsNotNull></And></Where></Query></View>"
}

var elementos = SPD_GetListItems_CamlQuery(_spPageContextInfo.webAbsoluteUrl, '731f7218-0ba3-494d-b6ef-7b150bd42de1', viewXml2).results;

var marca = "";

var elementosMarcaStock = []

for (r = 0; r < elementos.length; r++) {

    var existe = false;
    for (s = 0; s < elementosMarcaStock.length; s++) {
        if (elementos[r].Marca != null && elementosMarcaStock[s].Marca == elementos[r].Marca.trimEnd()) {
            existe = true;
        }
    }
    if (!existe && elementos[r].Marca != null) {
        elementosMarcaStock.push({ Marca: elementos[r].Marca.trimEnd(), Procesado: false });
    }
}

elementos = SPD_GetListItems_CamlQuery(_spPageContextInfo.webAbsoluteUrl, "731f7218-0ba3-494d-b6ef-7b150bd42de1", viewXml).results;

for (r = 0; r < elementos.length; r++) {

    var existe = false;
    for (s = 0; s < elementosMarcaStock.length; s++) {
        if (elementos[r].Marca != null && elementosMarcaStock[s].Marca == elementos[r].Marca.trimEnd()) {
            existe = true;
        }
    }
    if (!existe && elementos[r].Marca != null) {
        elementosMarcaStock.push({ Marca: elementos[r].Marca.trimEnd(), Procesado: false });
    }
}

console.log("Obteniendo marcas totales");
console.log(elementosMarcaStock);

//elementosMarcaStock = elementosMarcaStock.sort();

console.log(elementosMarcaStock);

//Procesando script

procesamiento(0);

function procesamiento(index) {

    if (index < elementosMarcaStock.length) {

        var marcaId = obtener_marcaId(elementosMarcaStock[index].Marca);

        if (marcaId != 0) {

            elementosMarcaStock[index].MarcaId = marcaId;

            console.log("Se ha encontrado la siguiente marca " + marcaId);

            var indexe = index + 1;
            procesamiento(indexe);
        }
        else {
            console.log("Este es un caso especial :" + elementosMarcaStock[index].Marca);
            var indexe = index + 1;
            procesamiento(indexe);
        }

    }
    else {
        console.log("PROCESAMIENTO COMPLETO");
        console.log(elementosMarcaStock);
        _procesar_();
    }

}

function _procesar_() {

    if (_indexData < elementosMarcaStock.length) {

        var viewXml3 = {
            ViewXml: "<View><Query><Where><And><IsNull><FieldRef Name='NuevaMarca' /></IsNull><Eq><FieldRef Name='Marca' /><Value Type='Text'>" + elementosMarcaStock[_indexData].Marca + "</Value></Eq></And></Where></Query></View>"
        }

        var elementos = SPD_GetListItems_CamlQuery(_spPageContextInfo.webAbsoluteUrl, '731f7218-0ba3-494d-b6ef-7b150bd42de1', viewXml3).results;

        console.log("filas a procesar")

        for (o = 0; o < elementos.length; o++) {
            filarProcesar.push({
                StockId: elementos[o].ID,
                MarcaId: elementosMarcaStock[_indexData].MarcaId,
                MarcaVieja: elementosMarcaStock[_indexData].Marca,
                MarcaNueva: _buscarMarcaPorId(elementosMarcaStock[_indexData].MarcaId)
            });
        }

        console.log(filarProcesar);

       actualizarEstadoStock();
    }
    else {
        alert("Terminé!")
    }

}
function actualizarEstadoStock() {
    if (_indexSockIds < filarProcesar.length) {

        SPD_CrearCuadroModal(0, 0, 0, "", "Actualizando estado Stock " + filarProcesar[_indexSockIds].MarcaVieja + " > " + filarProcesar[_indexSockIds].MarcaNueva+ "... " + _indexSockIds + " de " + filarProcesar.length, false);

        var clientContext = SP.ClientContext.get_current()

        var oList = clientContext.get_web().get_lists().getById('731f7218-0ba3-494d-b6ef-7b150bd42de1');

        this.oListItem = oList.getItemById(filarProcesar[_indexSockIds].StockId);

       oListItem.set_item('NuevaMarca', filarProcesar[_indexSockIds].MarcaId);

        //oListItem.set_item('NuevaMarca', 137);

        oListItem.update();

        clientContext.executeQueryAsync(Function.createDelegate(this, this.onQuerySucceeded), Function.createDelegate(this, this.onQueryFailed));
    }
    else {
        filarProcesar = [];
        _indexSockIds = 0;
        _indexData = _indexData + 1;
        _procesar_();
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

function obtener_marcaId(valor) {
    for (k = 0; k < elementosMarca.length; k++) {
        if (valor.toUpperCase() == elementosMarca[k].Title) {
            return elementosMarca[k].ID;
        }
    }
    return 0;
}
function _buscarMarcaPorId(idx) {
    for (k = 0; k < elementosMarca.length; k++) {
        if (idx == elementosMarca[k].ID) {
            return elementosMarca[k].Title;
        }
    }
    return "";
}
