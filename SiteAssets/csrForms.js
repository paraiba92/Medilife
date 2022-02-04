var templates = {};
var gTrabajandoId;

function CSROnPreRender(ctx) {
    if (!ctx.FormContext){
		return;
	}
    var listId = ctx.FormContext.listAttributes.Id;
    var templ = templates[listId] || document.querySelector("[data-list-id='" + listId + "']") ||document.querySelector("[data-role='form']");
    if (!templ){
        return;
	}	
	if (typeof onPreRenderFunction == 'function') {
		//llama a la función local de cada formulario
		onPreRenderFunction(ctx);
    }
    if (!templates[listId]) {
        var table = document.querySelector("#WebPart" + ctx.FormUniqueId + " .ms-formtable");
        table.style.display = 'none';
        table.parentNode.insertBefore(templ, table);
        templ.style.display = '';
        templates[listId] = templ;
    }	
    var field = ctx.ListSchema.Field[0];
    var el = document.querySelector('tr > td > span#' + ctx.FormUniqueId + listId + field.Name);
    var target = templ.querySelector("[data-field~='" + field.Name + "']") || templ.querySelector("[data-field='\*']");
    if (target && el && field.Name != "Attachments") {
        if (target.attributes['data-field'].value == '*' ||
            target.attributes['data-field'].value.indexOf(' ') != -1) {
            target.style.display = 'none';
            var cloned = target.cloneNode(true);
            cloned.setAttribute("data-field", field.Name);
            cloned.style.display = '';
            target.parentNode.insertBefore(cloned, target);
            target = cloned;
        }
        var html = target.innerHTML;
        field.Value = Encoding.HtmlEncode(ctx.ListData.Items[0][field.Name]);
        html = html.replace(/{[^}]+}/g, function(m) {
            with(field) return eval(m);
        });
        target.innerHTML = html;
        var control = target.querySelector("[data-role='field-control']");
        control && control.parentNode.replaceChild(el, control);
    }
}

function CSROnPostRender(ctx) {
    if (ctx && (ctx.ListSchema.Field[0].Name == "Attachments" || ctx.ListSchema.Field[0].Name == "TaskOutcome")) {
        //Oculta el webpart
        $("div[id$='hideParentWebPart']").closest("div[id^='MSOZoneCell_WebPartct']").css("margin", 0); //Oculta el wepart que contiene el template del html. Se modifica el margin a 0, en vez de ocultarlo, ya que de lo contrario se pierde la posibilidad de modificarlo en la página de edición

        //Se reubica la posición de los botones
        $("table[id$='_toolBarTbl'][class='ms-formtoolbar']").parent().closest("table").attr("width", "50%");

        $("#MSOZoneCell_WebPartWPQ2").on('DOMNodeInserted', function(e) {
            if ($(e.target).is('.ms-formvalidation')) {
				//Se detecta que se incorporó un mensaje de error
				if($("#formtabs").length > 0){

					var divElement = e.target.closest("div[id^='tab-']");
					if (divElement) {
						var solapa = $("#formtabs > ul > li > a[href='#" + divElement.id + "']").html();
						var mensajeError = $("#MensajeError");
						mensajeError.css("display", "inherit");
						mensajeError.html("<span role='alert' id='errorSolapa'>Error, revise los errores en la solapa '" + solapa + "'<br></span>");
					}
				}
				SP.UI.Status.removeStatus(gTrabajandoId);
            }
        });
		
		//Se deshabilita el mensaje de error, en caso de volver a clickear el botón
		//$("input[id$='IOSaveItem']").click(function(event){
		//	$("span[id='errorSolapa']").css("display","none");
		//});

		if (typeof onPostRenderFunction == 'function') {
            //llama a la función local de cada formulario
			onPostRenderFunction(ctx);
        }
    }
}

function PreSaveAction() {

    SP.UI.Status.removeAllStatus(true);
    $("span[id='errorSolapa']").css("display", "none");
    gTrabajandoId = SP.UI.Status.addStatus("Trabajando...", "<img src='/_layouts/Images/progress.gif'/>");

    var resultStatus = true;

    if (typeof (PreSaveActionLocal) == "function") {
        resultStatus = PreSaveActionLocal();
    }
    if (resultStatus) {
        var currentCsrInterval = setInterval(function () {
            if (document.getElementsByClassName("ms-formvalidation ms-csrformvalidation").length > 0 || document.getElementsByClassName("ms-formvalidation sp-peoplepicker-errorMsg").length > 0) {

                csrForm_addErrorStatus();
                
                clearInterval(currentCsrInterval);
                
            }
        }, 1000);
    }
    else {
        if (document.getElementsByClassName("ms-status-blue").length > 0)
        {
            csrForm_addErrorStatus();
        }
    }
    return resultStatus;

}

function csrForm_addErrorStatus() {

    SP.UI.Status.removeAllStatus(true);
    gTrabajandoId = SP.UI.Status.addStatus("Revise si existen mensajes de validación en cada campo y / o al pie de la página...");
    SP.UI.Status.setStatusPriColor(gTrabajandoId, 'red');

}

function ajustarTituloPagina(nuevoTitulo) {
    $("#DeltaPlaceHolderPageTitleInTitleArea > span > a").html(nuevoTitulo);
}

function ajustarTextoBotonGuardar(textoBoton) {
    $("input[id$='idIOSaveItem']").attr("value", textoBoton);
}