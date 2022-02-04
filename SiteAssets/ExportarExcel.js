setInterval(function () {
    $('#idHomePageNewItem').parent().html("<a id='linkExportarEx' onclick='_evento_exportarExcel();' style='cursor:pointer;'><img style='width:20px;padding-right:10px' src='" + _spPageContextInfo.webAbsoluteUrl + "/SiteAssets/Images/excel_logo-32.png'>Exportar a excel</a>");
    $('#linkExportarEx').parent().css("padding-top", "40px");
    $('.ms-listviewtable').hide();
}, 1000);

function _evento_exportarExcel() {
    var exporturl = _spPageContextInfo.webAbsoluteUrl + "/_vti_bin/owssvr.dll?CS=109&Using=_layouts/query.iqy&List=" + _spPageContextInfo.pageListId + "" + "&View=" + _spPageContextInfo.viewId + "&CacheControl=1";
    window.location.href = exporturl;
}
