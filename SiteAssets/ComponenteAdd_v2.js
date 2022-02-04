var lastId;
var lastControlId;
function ComponenteAdd_Plus(control, listPath, listId, controlPath) {

    control.next().remove();
    control.parent().append("  <i class='fa fa-plus' style='cursor:pointer;color:blue;' onclick='_evento_componente_ad(\"" + listPath + "\", \"" + listId + "\", \"" + controlPath + "\")'></i>");

}
function _evento_componente_ad(listPath, listId, controlId) {

    lastId = listId;
    lastControlId = controlId;
    var urlData = _spPageContextInfo.webAbsoluteUrl + "/Lists/" + listPath + "/NewForm.aspx";
    var options = {
        title: "",
        width: screen.height * 0.9,
        height: screen.width * 0.7,
        url: urlData,
        dialogReturnValueCallback: function (result, returnValue) { _callbackRespuesta(result, returnValue) }
    };
    a = SP.UI.ModalDialog.showModalDialog(options);
}
function _callbackRespuesta(result, returnValue) {
    switch(result) {
        case SP.UI.DialogResult.OK:
            
            var viewXml = { ViewXml: "<View><Query><Where></Where><OrderBy><FieldRef Name=\'ID\' Ascending=\'False\' /></OrderBy></Query><RowLimit>1</RowLimit></View>" }
            var oItem = SPD_GetListItems_CamlQuery(_spPageContextInfo.webAbsoluteUrl, lastId, viewXml).results;
            if (oItem.length == 1) {

                if (lastId == MD_OS) {
                    _cols[lastControlId].append("<option value='" + oItem[0].Id + "'>" + oItem[0].Nombre + "</option>")
                    _cols[lastControlId].val(oItem[0].Id);
                }
                if (lastId == MD_INSTITUCION) {
                    _cols[lastControlId].append("<option value='" + oItem[0].Id + "'>" + oItem[0].NombreInstitucion + "</option>")
                    _cols[lastControlId].val(oItem[0].Id);
                }
                if (lastId == MD_MEDICO || lastId == MD_TIPOFACTURA || lastId == MD_MARCA) {
                    _cols[lastControlId].append("<option value='" + oItem[0].Id + "'>" + oItem[0].Title + "</option>")
                    _cols[lastControlId].val(oItem[0].Id);
                }
            }
            // reload data as necessary here
            break;
        case SP.UI.DialogResult.cancel:
            console.log("You clicked cancel or close.");
            break;
    }
}