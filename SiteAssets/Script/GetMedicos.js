var viewXml = {
    ViewXml: "<View><Query><Where></Where></Query></View>"
}

var elementos = SPD_GetListItems_CamlQuery(_spPageContextInfo.webAbsoluteUrl, MD_REMITO, viewXml).results;
var elementosMedico = []

for (r = 0; r < elementos.length; r++) {

    var existe = false;
    for (s = 0; s < elementosMedico.length; s++) {
        if (elementos[r].Doctor != null && elementosMedico[s] == elementos[r].Doctor.toUpperCase()) {
            existe = true;
        }
    }
    if (!existe && elementos[r].Doctor != null) {
        elementosMedico.push(elementos[r].Doctor.toUpperCase());
    }
}

elementos = SPD_GetListItems_CamlQuery(_spPageContextInfo.webAbsoluteUrl, MD_Presupuestos, viewXml).results;

for (r = 0; r < elementos.length; r++) {

    var existe = false;
    for (s = 0; s < elementosMedico.length; s++) {
        if (elementos[r].Doctor != null && elementosMedico[s] == elementos[r].Doctor.toUpperCase()) {
            existe = true;
        }
    }
    if (!existe && elementos[r].Doctor != null) {
        elementosMedico.push(elementos[r].Doctor.toUpperCase());
    }
}

elementosMedico = elementosMedico.sort();

console.log("Se agrraron " + elementosMedico.length);

var medicos = SPD_GetListItems_CamlQuery(_spPageContextInfo.webAbsoluteUrl, MD_MEDICO, viewXml).results;

var _medicosFinal = [];

for (k = 0; k < elementosMedico.length; k++) {
    var rta = false;
    for (l = 0; l < medicos.length; l++) {
        if (elementosMedico[k] == medicos[l].Title.toUpperCase()) {
            rta = true;
        }
    }
    if (!rta) {
        _medicosFinal.push(elementosMedico[k]);
    }
}
console.log("Total " + _medicosFinal.length);

var oData = "";

for (s = 0; s < _medicosFinal.length; s++) {
  // console.log(elementosMarca[s]);
    oData = oData + _medicosFinal[s] + "<br/>";
}

SPD_CrearCuadroModal(1, 800, 600, "Un buen título", oData, false);

//otra cosa

var viewXml = {
    ViewXml: "<View><Query><Where>" +
        "</Where><OrderBy><FieldRef Name='Title' Ascending='True' /></OrderBy></Query></View>"
}

var marcas = SPD_GetListItems_CamlQuery(_spPageContextInfo.webAbsoluteUrl, "f0ae70ea-349e-42a7-bc45-dca5786112f7", viewXml).results;

var oData = "";

for (k = 0; k < marcas.length; k++) {
    oData = oData + marcas[k].Title;
}

SPD_CrearCuadroModal(1, 800, 600, "Un buen título", oData, false);
