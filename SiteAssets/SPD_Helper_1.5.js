//Variables globales
SPD_TimeZone = "";
SPD_RegionalSettings = "";

function SPD_AjaxRequest(uri, type) {
    var currentData = "";
    $.ajax({
        async: false,
        type: type,
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        url: uri,
        success: function (data) {
            currentData = data.d;
        },
        error: function (data) { console.log(data); },
        headers: { Accept: "application/json;odata=verbose", "X-RequestDigest": jQuery("#__REQUESTDIGEST").val() }
    });
    return currentData;
}
function SPD_GetLists(webUrl) {
    return SPD_AjaxRequest(webUrl + "/_api/web/lists", "GET",false);
}
function SPD_GetListById(webUrl, listId) {
    return SPD_AjaxRequest(webUrl + "/_api/web/lists/getbyid('" + listId + "')", "GET", false);
}
function SPD_GetListByTitle(webUrl, listTitle) {
    return SPD_AjaxRequest(webUrl + "/_api/web/lists/getbytitle('" + listTitle + "')", "GET", false);
}
function SPD_GetListItems(webUrl, listId) {
    return SPD_AjaxRequest(webUrl + "/_api/web/lists/getbyid('" + listId + "')/items", "GET", false);
}
//SPD_GetListItems_AplicaFiltro(_spPageContextInfo.webAbsoluteUrl,SPStaff_ListId_IndicadorCalculado,"?$top=1000");
function SPD_GetListItems_AplicaFiltro(webUrl, listId, filtro) {
    return SPD_AjaxRequest(webUrl + "/_api/web/lists/getbyid('" + listId + "')/items"+filtro, "GET", false);
}
function SPD_GetListItems_CamlQuery(webUrl, listId, calmQuery) {
    return SPD_AjaxRequest(webUrl + "/_api/web/lists/GetById('" + listId + "')/GetItems(query=@v1)?" +
                    "@v1=" + JSON.stringify(calmQuery), "POST", false);
}
function SPD_GetListRootFolder(webUrl, listId) {
    return SPD_AjaxRequest(webUrl + "/_api/web/lists/getbyid('" + listId + "')/RootFolder", "GET", false);
}
function SPD_GetListItemFolderById(webUrl, listId, itemId) {
    return SPD_AjaxRequest(webUrl + "/_api/web/lists/getbyid('" + listId + "')/items/getbyid('" + itemId + "')/Folder", "GET", false);
}
function SPD_GetLisViews(webUrl, listId) {
    return SPD_AjaxRequest(webUrl + "/_api/web/lists/getbyid('" + listId + "')/Views", "GET", false);
}
function SPD_GetLisViewById(webUrl, listId, viewId) {
    return SPD_AjaxRequest(webUrl + "/_api/web/lists/getbyid('" + listId + "')/Views/getbyid('" + viewId + "')/ViewQuery", "GET", false);
}
function SPD_GetListContentTypes(webUrl, listId) {
    return SPD_AjaxRequest(webUrl + "/_api/web/lists/getbyid('" + listId + "')/contenttypes", "GET", false);
}
function SPD_GetListItemById(webUrl, listId, itemId) {
    return SPD_AjaxRequest(webUrl + "/_api/web/lists/getbyid('" + listId + "')/items/getbyid('" + itemId + "')", "GET", false);
}
function SPD_GetListFields(webUrl, listId) {
    return SPD_AjaxRequest(webUrl + "/_api/web/lists/getbyid('" + listId + "')/fields", "GET", false);
}

function SPD_Usuario_Miembro_Grupo(webUrl, userId, groupId) {
    var response = SPD_AjaxRequest(webUrl + "/_api/web/sitegroups/getById('" + groupId + "')/Users?$filter=Id eq " + userId, "GET", false).results;
    if (response.length != 0) {
        return true;
    }
    return false;
}
function SPD_IsGroupMember(webUrl, userId, groupId) {
    return SPD_AjaxRequest(webUrl + "/_api/web/sitegroups/getById('" + groupId + "')/Users?$filter=Id eq " + userId, "GET", false);
}
function SPD_GetSiteGroups(webUrl) {
    return SPD_AjaxRequest(webUrl + "/_api/web/sitegroups", "GET", false);
}
function SPD_GetGroupById(webUrl, groupId) {
    return SPD_AjaxRequest(webUrl + "/_api/web/sitegroups/GetById('" + groupId + "')", "GET", false);
}
function SPD_GetGroupMembers(webUrl, groupId) {
    return SPD_AjaxRequest(webUrl + "/_api/web/sitegroups/GetById('" + groupId + "')/Users", "GET", false);
}
function SPD_GetSiteContenTypes(webUrl) {
    return SPD_AjaxRequest(webUrl + "/_api/web/ContentTypes", "GET", false);
}
function SPD_GetFileFromList(webUrl, listaId, itemId) {
    return SPD_AjaxRequest(webUrl + "/_api/Web/lists/getbyid('" + listaId + "')/Items(" + itemId + ")/File", "GET", false);
}
//Usuarios
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
var SPD_Context_Users = [];
function SPD_Buscar_Usuario(webUrl, userId) {
    for (SPD_UserCounter = 0; SPD_UserCounter < SPD_Context_Users.length; SPD_UserCounter++) {
        if (SPD_Context_Users[SPD_UserCounter].Id == userId) {
            return SPD_Context_Users[SPD_UserCounter];
        }
    }
    var SPD_User_Search_Context = SPD_GetUserById(webUrl, userId);
    if (SPD_User_Search_Context != "") {
        SPD_Context_Users.push(SPD_User_Search_Context);
        return SPD_User_Search_Context;
    }
    else {
        return false;
    }
}
function SPD_GetUserById(webUrl, userId) {
    return SPD_AjaxRequest(webUrl + "/_api/web/getuserbyid('" + userId + "')", "GET", false);
}
function SPD_GetUserByLoginName(webUrl, loginName) {
    return SPD_AjaxRequest(webUrl + "/_api/web/siteusers(@v)?@v='" +
                    encodeURIComponent(loginName) + "'", "GET", false);
}
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
//SPD_MapToIcon(_spPageContextInfo.webAbsoluteUrl,"Pruebas.docx","32")
function SPD_MapToIcon(webUrl, fileName, size) {
    return SPD_AjaxRequest(webUrl + "/_api/web/mapToIcon(filename='" + fileName + "',progid='',size=" + size + ")", "GET", false);
}
function SPD_GetRegionalSettings(webUrl) {
    return SPD_AjaxRequest(webUrl + "/_api/web/RegionalSettings", "GET", false);
}
function SPD_GetRegionalSettings_TimeZone(webUrl) {
    return SPD_AjaxRequest(webUrl + "/_api/web/RegionalSettings/TimeZone", "GET", false);
}
function SPD_Obtener_Configuracion_Regional() {
    SPD_TimeZone = SPD_GetRegionalSettings_TimeZone(_spPageContextInfo.webAbsoluteUrl);
    SPD_RegionalSettings = SPD_GetRegionalSettings(_spPageContextInfo.webAbsoluteUrl);
}
//WEB URLs
////////////////////////////////////////////////////////////////////////////////////////////////////
function SPD_Get_CurrentForm(formType) {
    if ($(location).attr('href').indexOf(formType) != -1)
        return true;
    return false;
}
function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;
    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] === sParam)
            return sParameterName[1] === undefined ? true : sParameterName[1];
    }
}
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
//HOT FIX
////////////////////////////////////////////////////////////////////////////////////////////////////
//Repara descripciones duplicadas. Ejecutar en un onPostRender()
function SPD_Corregir_Ms_Metadata_Duplicado() {
    $('.my-formfield').each(function () {
        if ($(this).find(".ms-metadata").length > 1) {
            $(this).find(".ms-metadata").last().remove()
        }
    });
}
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
//SPD_Setear_ControlUsuario("UsuarioEmpleado", "straverso@emmsa.net")
function SPD_ControlUsuario_Setear(controlId, usuarioEmail) {
    var controlEmpleado = $("[id^='" + controlId + "'][id$='ClientPeoplePicker_EditorInput']")[0];
    if (controlEmpleado) {
        if (SPClientPeoplePicker) {
            var peoplepicker = SPClientPeoplePicker.PickerObjectFromSubElement(controlEmpleado)
            if (peoplepicker) {
                peoplepicker.AddUserKeys(usuarioEmail);
            }
        }
    }
}
function SPD_ControlUsuario_Setear_DefaultUser(controlId) {
    var SPD_CurrentUser = SPD_Buscar_Usuario(_spPageContextInfo.webAbsoluteUrl, _spPageContextInfo.userId);
    if (SPD_CurrentUser != "") {
        var controlEmpleado = $("[id^='" + controlId + "'][id$='_EditorInput']")[0];
        if (controlEmpleado) {
            if (SPClientPeoplePicker) {
                var peoplepicker = SPClientPeoplePicker.PickerObjectFromSubElement(controlEmpleado)
                if (peoplepicker) {
                    peoplepicker.AddUserKeys(SPD_CurrentUser.Email);
                }
            }
        }
    }
}
function SPD_ControlUsuario_Devolver_Cantidad_Usuarios(controlId) {
    var controlEmpleado = $("[id^='" + controlId + "'][id$='_EditorInput']")[0];
    if (controlEmpleado) {
        if (SPClientPeoplePicker) {
            var peoplepicker = SPClientPeoplePicker.PickerObjectFromSubElement(controlEmpleado)
            if (peoplepicker) {
                return peoplepicker.TotalUserCount;
            }
        }
    }
}
function SPD_ControlUsuario_Limpiar(controlId) {
    var controlEmpleado = $("[id^='" + controlId + "'][id$='_EditorInput']")[0];
    if (controlEmpleado) {
        if (SPClientPeoplePicker) {
            var peoplepicker = SPClientPeoplePicker.PickerObjectFromSubElement(controlEmpleado)
            if (peoplepicker) {
                var TotalUserCount = peoplepicker.TotalUserCount;
                for (usCount = 0; usCount < TotalUserCount; usCount++) {
                    peoplepicker.DeleteProcessedUser();
                }
            }
        }
    }
}
function SPD_ControlUsuario_DevolverDatos(controlId) {
    var controlEmpleado = $("[id^='" + controlId + "'][id$='_EditorInput']")[0];
    if (controlEmpleado) {
        if (SPClientPeoplePicker) {
            var peoplepicker = SPClientPeoplePicker.PickerObjectFromSubElement(controlEmpleado)
            if (peoplepicker) {
                return peoplepicker.GetAllUserInfo();
            }
        }
    }
    return false;
}
function SPD_ControlUsuario_AjustarCSS(idx, width) {
    $('#' + idx).find("*").css("width", width);
    $('#' + idx).find('#' + idx + '_TopSpan_InitialHelpText').remove();
}
//<div id='people'></div> ==> SPD_ControlUsuario_CrearControl("people", 12); El grupo es opcional
function SPD_ControlUsuario_CrearControl_Default(peoplePickerElementId, groupId) {
    var schema = {};
    schema['PrincipalAccountType'] = 'User,DL,SecGroup,SPGroup';
    schema['SearchPrincipalSource'] = 15;
    schema['ResolvePrincipalSource'] = 15;
    schema['AllowMultipleValues'] = false;
    schema['MaximumEntitySuggestions'] = 50;
    if (groupId != 0)
        schema['SharePointGroupID'] = groupId;
    schema['Width'] = '300px';
    var users = new Array(1);
    SPClientPeoplePicker_InitStandaloneControlWrapper(peoplePickerElementId, users, schema);
}
function SPD_ControlUsuario_CrearControl(peoplePickerElementId, schema, groupId) {
    if (schema) {
        if (groupId != 0)
            schema['SharePointGroupID'] = groupId;
        var users = new Array(1);
        SPClientPeoplePicker_InitStandaloneControlWrapper(peoplePickerElementId, users, schema);
    }
}
//TAXONOMY CONTROL
function SPD_ControlTaxonomy_GetControl(controlId) {
    return $("[id^='" + controlId + "'][id$='_$container']");
}
function SPD_ControlTaxonomy_GetControl_Value(controlId) {
    var taxonomyControl = $("[id^='" + controlId + "'][id$='_$input']")[0];
    if (taxonomyControl) {
        return taxonomyControl.value;
    }
    return false;
}
//SPD_ControlTaxonomy_SetearValor("Empresa_$container","La Empresa S.A.|443417ad-ab63-4e14-b2a9-98786a5c2fcf")
function SPD_ControlTaxonomy_SetearValor(controlId, termValue) {
    var webTaggingCtl = $get(controlId);
    var taxCtlObj = new Microsoft.SharePoint.Taxonomy.ControlObject(webTaggingCtl);
    taxCtlObj.enableControl(true);
    taxCtlObj.setRawText(termValue);
    taxCtlObj.retrieveTerms();
}
//ADD
function SPD_ControlTaxonomy_SetearValor_Add(controlId, termId, termText) {
    var webTaggingCtl = $get(controlId);
    var taxCtlObj = new Microsoft.SharePoint.Taxonomy.ControlObject(webTaggingCtl);
    taxCtlObj.enableControl(true);
    taxCtlObj.addTerm(termId, termText);
}
function SPD_ControlTaxonomy_Habilitar_Estado(controlId, estado) {
    var webTaggingCtl = $get(controlId);
    var taxCtlObj = new Microsoft.SharePoint.Taxonomy.ControlObject(webTaggingCtl);
    taxCtlObj.enableControl(estado);
}
function SPD_ControlTaxonomy_Validar(controlId) {
    var webTaggingCtl = $get(controlId);
    var taxCtlObj = new Microsoft.SharePoint.Taxonomy.ControlObject(webTaggingCtl);
    return taxCtlObj.get_allTermsValid();
}
function SPD_ControlTaxonomy_Remove(controlId) {
    var webTaggingCtl = $get(controlId);
    var taxCtlObj = new Microsoft.SharePoint.Taxonomy.ControlObject(webTaggingCtl);
    taxCtlObj.replaceTerm();
}
//////////////////////////////////////////////////////////////////
//Datepikers de sharepoint se convierten en JQUERYPickers
function SPStaff_initDateTimePikers() {
    $("[id$='DateTimeFieldDate']").datepicker();
    $("[id$='DateTimeFieldDateDatePickerImage']").parent().parent().html("<img title='Seleccione una fecha del calendario.' class='calendario' src='/_layouts/15/images/calendar_25.gif?rev=23' style='vertical-align:middle;cursor:pointer;'/>")
    $('.calendario').attr("onclick", "$(this).parent().parent().find(\".ms-input\").focus()");
}
function SPD_FormatearFechas(dateISOString, includeHours) {
    if (SPD_RegionalSettings == "") {
        SPD_Obtener_Configuracion_Regional();
    }
    if (dateISOString) {
        var dateObj = moment.utc(dateISOString, moment.ISO_8601);
        dateObj.add(-1 * SPD_TimeZone.Information.Bias, "minutes");
        var userDate = dateObj.format("DD/MM/YYYY");
        var userHour = parseInt(dateObj.format("HH"), 10);
        var userMinutes = parseInt(dateObj.format("mm"), 10);

        if (!includeHours) {
            return userDate;
        } else if (SPD_RegionalSettings.Time24) {
            return userDate + " " + ((userHour < 10) ? "0" : "") + userHour.toString() + ":" + ((userMinutes < 10) ? "0" : "") + userMinutes;
        } else if (userHour < 12) {
            return userDate + " " + ((userHour < 10) ? "0" : "") + userHour.toString() + ":" + ((userMinutes < 10) ? "0" : "") + userMinutes + " " + SPD_RegionalSettings.AM;
        } else {
            return userDate + " " + ((userHour < 10) ? "0" : "") + (userHour - 12).toString() + ":" + ((userMinutes < 10) ? "0" : "") + userMinutes + " " + SPD_RegionalSettings.PM;
        }
    } else {
        return "";
    }
}
function SPD_Date_Validar_Formato_DDMMYYYY(fecha) {
    var dtCh = "/";
    var minYear = 1900;
    var maxYear = 2300;
    function isInteger(s) {
        var i;
        for (i = 0; i < s.length; i++) {
            var c = s.charAt(i);
            if (((c < "0") || (c > "9"))) return false;
        }
        return true;
    }
    function stripCharsInBag(s, bag) {
        var i;
        var returnString = "";
        for (i = 0; i < s.length; i++) {
            var c = s.charAt(i);
            if (bag.indexOf(c) == -1) returnString += c;
        }
        return returnString;
    }
    function daysInFebruary(year) {
        return (((year % 4 == 0) && ((!(year % 100 == 0)) || (year % 400 == 0))) ? 29 : 28);
    }
    function DaysInMonth(n) {
        if (n == 4 || n == 6 || n == 9 || n == 11) {
            return 30;
        }
        if (n == 2) {
            return 29
        }
        return 31;
    }
    function isDate(dtStr) {
        var pos1 = dtStr.indexOf(dtCh)
        var pos2 = dtStr.indexOf(dtCh, pos1 + 1)
        var strDay = dtStr.substring(0, pos1)
        var strMonth = dtStr.substring(pos1 + 1, pos2)
        var strYear = dtStr.substring(pos2 + 1)
        strYr = strYear
        if (strDay.charAt(0) == "0" && strDay.length > 1) strDay = strDay.substring(1)
        if (strMonth.charAt(0) == "0" && strMonth.length > 1) strMonth = strMonth.substring(1)
        for (var i = 1; i <= 3; i++) {
            if (strYr.charAt(0) == "0" && strYr.length > 1) strYr = strYr.substring(1)
        }
        month = parseInt(strMonth)
        day = parseInt(strDay)
        year = parseInt(strYr)
        if (pos1 == -1 || pos2 == -1) {
            return false
        }
        if (strMonth.length < 1 || month < 1 || month > 12) {
            return false
        }
        if (strDay.length < 1 || day < 1 || day > 31 || (month == 2 && day > daysInFebruary(year)) || day > DaysInMonth(month)) {
            return false
        }
        if (strYear.length != 4 || year == 0 || year < minYear || year > maxYear) {
            return false
        }
        if (dtStr.indexOf(dtCh, pos2 + 1) != -1 || isInteger(stripCharsInBag(dtStr, dtCh)) == false) {
            return false
        }
        return true
    }
    if (isDate(fecha)) {
        return true;
    } else {
        return false;
    }
}
//prototype
String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
}
////////////////////////////////////////////////////
//Cookies
function SPD_Leer_Cookie(nombre) {
    var nameEQ = nombre + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}
function SPD_Setear_Cookie(nombreCookie, valor) {
    document.cookie = nombreCookie+"= "+valor+"; path=/";
}
function SPD_Limpiar_Cookie(nombreCookie) {
    document.cookie = nombreCookie + "= " + "; path=/";
}
////////////////////////////////////////////////////
//SPD_MODAL
////////////////////////////////////////////////////
/*Examples
    SPD_Modal_Extencion_Errores(arr,"<b>No se pudo registrar</b>")
    SPD_CrearCuadroModal(0, 0, 0, "", "Cargando... por favor  espere unos segundos", false);
    SPD_CrearCuadroModal(1, 800, 600, "Un buen título", "<label style='padding-right:20px;'>Hola mundo</label><input type='text'/><br/><br/><input type='button' value='Guardar'/>",false);
    SPD_CrearCuadroModal(1, 800, 600, "", "<label style='padding-right:20px;'>Hola mundo</label><input type='text'/><br/><br/><input type='button' value='Guardar'/>", false);
    SPD_CrearCuadroModal(2, 800, 600, "Un buen título", "<label style='padding-right:20px;'>Hola mundo</label><input type='text'/><br/><br/><input type='button' value='Guardar'/>", "Callback()");
    SPD_CrearCuadroModal(2, 800, 600, "Un buen título", "<label style='padding-right:20px;'>Hola mundo</label><input type='text'/><br/><br/><input type='button' value='Guardar'/>", "comer('Pizza')");
    function Callback() {
        alert("Callback !!!:)");
    }
    function comer(comida) {
        alert(comida);
    }
*/
var SPD_templates = {
    0: "WAITING",
    1: "GENERAL",
    2: "CALLBACK"
}
function SPD_CrearCuadroModal(templateId, width, height, titulo, contenido, callBack) {

    SPD_CerrarCuadroModal();

    $('body').append('<div class="modal-wrapper" id="popup" style="overflow: auto; visibility:hidden; margin-top:0px;opacity:0 "></div>');
    $('#popup').append('<div class="popup-contenedor" style="position:relative; margin: 7% auto; padding:30px 50px;  background-color: #fafafa; color:#333; border-radius:3px"></div>');

    SPD_AbrirCuadroModal();

    var modalTitulo = "";
    if (titulo != "") {
        modalTitulo = '<label style="font-size: 20px;">' + titulo + '</label><br /><br /><br />';
    }
    if (SPD_templates[templateId] == "WAITING") {
        $('.popup-contenedor').css("width", 1000);
        $('.popup-contenedor').css("width", 400);
        $('.popup-contenedor').append('<table><tr><td style="vertical-align:top;padding:10px;"><img align="middle" src="/_layouts/images/gears_anv4.gif"/></td><td><label style="font-size:15px;">' + contenido + '<label></td></tr></table>');
    }
    if (SPD_templates[templateId] == "GENERAL") {
        $('.popup-contenedor').css("width", width);
        $('.popup-contenedor').css("width", width);
        $('.popup-contenedor').append(modalTitulo + '<div id="Data">' + contenido + '</div><div id="ModalDivBotones" style="position: absolute;bottom: 8px; right: 15px;"><br/><br/><input type="button" class="ms-ButtonHeightWidth" id="modalCancelar" value="Cancelar" onclick="SPD_CerrarCuadroModal()" style="bottom: 8px; right: 15px;"/></div>');
    }
    if (SPD_templates[templateId] == "CALLBACK") {
        $('.popup-contenedor').css("width", width);
        $('.popup-contenedor').css("width", width);
        $('.popup-contenedor').append(modalTitulo + '<div id="Data">' + contenido + '</div><div id="ModalDivBotones" style="position: absolute;bottom: 8px; right: 15px;"><br/><br/><img id="DivCargandoModal" src="/_Layouts/Images/progress.gif" hidden="hidden" /><input type="button" id="modalAceptar" class="ms-ButtonHeightWidth" value="Aceptar" style="bottom: 8px; right: 15px;" onclick="' + callBack + '"/><input type="button" class="ms-ButtonHeightWidth" id="modalCancelar" value="Cancelar" onclick="SPD_CerrarCuadroModal()" style="bottom: 8px; right: 15px;"/></div>');
    }
}
function SPD_CerrarCuadroModal() {
    $('.popup-contenedor').remove();
    $('#popup').remove();
}
function SPD_AbrirCuadroModal() {
    window.location = "#popup";
    $("#popup:target").css({ "visibility": "visible", "opacity": "1", "background-color": "rgba(0,0,0,0.3)", "position": "fixed", "top": "0", "left": "0", "right": "0", "bottom": "0", "margin": "0", "z-index": "999", "-webkit-transition": "all 1s", "-moz-transition": "all 1s", "transition": "all 1s" });
    $('#txtNombreArchivo').focus();
}
function SPD_GetListItems_CamlQuery(webUrl, listId, calmQuery) {
    return SPD_AjaxRequest(webUrl + "/_api/web/lists/GetById('" + listId + "')/GetItems(query=@v1)?" +
                    "@v1=" + JSON.stringify(calmQuery), "POST", false);
}
function SPD_Modal_Extencion_Errores(arrayList, titulo) {
    var nodes = "";
    if (arrayList.length == 0) {
        nodes = nodes + "<img src='/_layouts/15/images/GreenCheck.gif' align='middle'/><a style='color:green;padding-left:20px;text-decoration:none;'>Sucess !</a>"
    }
    else {
        for (zzz = 0; zzz < arrayList.length; zzz++) {
            nodes = nodes + "<label style='color:red;'>" + arrayList[zzz] + "</label><hr/><br/>";
        }
    }
    SPD_CrearCuadroModal(1, 600, 400, titulo, nodes, false);
}
function SPD_Modal_Extencion_SinBotones() {
    $('#ModalDivBotones').hide();
}
function SPD_Modal_Extencion_DesencadenadorCancelar(tipoMetodo, metodoString) {
    $('#modalCancelar').attr(tipoMetodo, metodoString);
}
function SPD_SharepointModal_AbrirCuadroModal_default(urlData) {
    var options = {
        title: "",
        width: screen.height * 0.9,
        height: screen.width * 0.7,
        url: urlData
    };
    SP.UI.ModalDialog.showModalDialog(options);
}
function SPD_SharepointModal_AbrirCuadroModal(options) {
    if (options) {
        SP.UI.ModalDialog.showModalDialog(options);
    }
} var AcceptButtonUrl;
function SPD_SharepointModal_AbrirCuadroModal_Extendido(titulo, mensaje, error, altura, ancho, redirectUrl) {

    if (!altura || altura == "") {
        altura = 60; //altura por defecto
    }

    if (!ancho || ancho == "") {
        ancho = 720; //ancho por defecto
    }

    var modalDialog = document.createElement('div');
    var modalDialogMessage = document.createElement('div');
    modalDialogMessage.innerHTML = mensaje;
    var modalDialogButtons = document.createElement('div');
    modalDialogButtons.align = "right";
    var input = document.createElement("input");
    input.type = "button";
    input.style.width = "75px"

    //Boton Aceptar
    input.id = "BotonAceptar";
    input.value = "Aceptar";

    if (input.attachEvent) //ie
    {
        input.attachEvent("onclick", function () {
            // 20161107 ddignazi
            //SP.UI.ModalDialog.commonModalDialogClose();
            SP.UI.ModalDialog.commonModalDialogClose(SP.UI.DialogResult.Aceptar, 'Aceptar');
            return false;
        });
    } else if (input.setAttribute) //chrome y firefox
    {
        input.setAttribute("onclick", "SP.UI.ModalDialog.commonModalDialogClose(SP.UI.DialogResult.Aceptar, 'Aceptar'); return false;");
    }

    modalDialogButtons.appendChild(input);
    modalDialogButtons = modalDialogButtons.cloneNode(true);

    modalDialog.appendChild(modalDialogMessage);
    modalDialog = modalDialog.cloneNode(true);
    modalDialog.appendChild(modalDialogButtons);

    var showClose = true;
    if (redirectUrl) {
        showClose = false;
        AcceptButtonUrl = redirectUrl;
    } else {
        // 20161107 ddignazi
        AcceptButtonUrl = undefined;
    }

    var options = {
        html: modalDialog,
        title: titulo,
        allowMaximize: false,
        showClose: showClose,
        dialogReturnValueCallback: CloseDialogWFRedirect,
        width: ancho,
        height: altura
    };
    SP.UI.ModalDialog.showModalDialog(options);

    if (titulo == "") {
        var modalDialogTitle = document.getElementsByClassName("ms-dlgTitle");
        if (modalDialogTitle[0]) {
            modalDialogTitle[0].getElementsByTagName("h1")[0].innerHTML = "";
            modalDialogTitle[0].style.height = "0px";
        }
    }
}
function CloseDialogWFRedirect(dialogResult, returnValue) {
    // 20161107 ddignazi
    //if (returnValue == 'Aceptar') {
    if (returnValue == 'Aceptar' && AcceptButtonUrl) {
        //redirigir a AcceptButtonUrl
        window.open(AcceptButtonUrl, '_self');
        return false;
    }
}

function showUrlInModalDialog(url) {
    var options = SP.UI.$create_DialogOptions();
    options.url = url;
    SP.UI.ModalDialog.showModalDialog(options);
}
/*var options = {
    url: "",
    title: "Contenedor",
    dialogReturnValueCallback: SPBox_Renderizar_Contenedores,
    width: $(window).width() * 0.8,
    height: $(window).height() * 0.8
};*/
(function (factory) {
    if (typeof define === "function" && define.amd) {
        // AMD. Register as an anonymous module.
        define(["../widgets/datepicker"], factory);
    } else {
        // Browser globals
        factory(jQuery.datepicker);
    }
}(function (datepicker) {

    if (datepicker.regional) {

        datepicker.regional.es = {
            closeText: "Cerrar",
            prevText: "&#x3C;Ant",
            nextText: "Sig&#x3E;",
            currentText: "Hoy",
            monthNames: ["enero", "febrero", "marzo", "abril", "mayo", "junio",
            "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"],
            monthNamesShort: ["ene", "feb", "mar", "abr", "may", "jun",
            "jul", "ago", "sep", "oct", "nov", "dic"],
            dayNames: ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"],
            dayNamesShort: ["dom", "lun", "mar", "mié", "jue", "vie", "sab"],
            dayNamesMin: ["D", "L", "M", "X", "J", "V", "S"],
            weekHeader: "Sm",
            dateFormat: "dd/mm/yy",
            firstDay: 1,
            isRTL: false,
            showMonthAfterYear: false,
            yearSuffix: ""
        };
        datepicker.setDefaults(datepicker.regional.es);
        return datepicker.regional.es;
    }
}));