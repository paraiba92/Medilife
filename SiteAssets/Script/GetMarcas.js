var viewXml = {
    ViewXml: "<View><Query><Where></Where></Query></View>"
}

var elementos = SPD_GetListItems_CamlQuery(_spPageContextInfo.webAbsoluteUrl, MD_STOCK, viewXml).results;
var elementosMarca = []

for (r = 0; r < elementos.length; r++) {

    var existe = false;
    for (s = 0; s < elementosMarca.length; s++) {
        if (elementos[r].Marca != null && elementosMarca[s] == elementos[r].Marca.toUpperCase()) {
            existe = true;
        }
    }
    if (!existe && elementos[r].Marca != null) {
        elementosMarca.push(elementos[r].Marca.toUpperCase());
    }
}

elementos = SPD_GetListItems_CamlQuery(_spPageContextInfo.webAbsoluteUrl, "731f7218-0ba3-494d-b6ef-7b150bd42de1", viewXml).results;

for (r = 0; r < elementos.length; r++) {

    var existe = false;
    for (s = 0; s < elementosMarca.length; s++) {
        if (elementos[r].Marca != null && elementosMarca[s] == elementos[r].Marca.toUpperCase()) {
            existe = true;
        }
    }
    if (!existe && elementos[r].Marca != null) {
        elementosMarca.push(elementos[r].Marca.toUpperCase());
    }
}

elementosMarca = elementosMarca.sort();

var oData = "";

for (s = 0; s < elementosMarca.length; s++) {
  // console.log(elementosMarca[s]);
    oData = oData + elementosMarca[s] + "<br/>";
}

SPD_CrearCuadroModal(1, 800, 600, "Un buen título", oData, false);
