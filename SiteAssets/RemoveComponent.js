function _evento_eliminar_elemento(itemId, listId) {
    SPD_CrearCuadroModal(0, 0, 0, "", "Eliminando... por favor  espere unos segundos", false);
    var clientContext = SP.ClientContext.get_current()
    var oList = clientContext.get_web().get_lists().getById(listId);
    this.oListItem = oList.getItemById(itemId);
    oListItem.deleteObject();
    clientContext.executeQueryAsync(Function.createDelegate(this, this.onQuerySucceeded), Function.createDelegate(this, this.onQueryFailed));
}

function onQuerySucceeded() {
    SPD_CerrarCuadroModal();
    $('#linkActualizar').click();
}

function onQueryFailed(sender, args) {
    alert("error al eliminar un item, contacte con el administrador ! ");
    SPD_CerrarCuadroModal();
    $('#linkActualizar').click();

}