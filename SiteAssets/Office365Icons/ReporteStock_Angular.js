var myAngApp = angular.module('miApp', ['ngRoute', 'angularUtils.directives.dirPagination']).config(['$compileProvider', function ($compileProvider) {
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|skype|chrome-extension):/);
}]);

var gUsuarioAccountName;
function init() {
    AngularController();
};
init();
function AngularController() {

    myAngApp.controller('spResultado', function ($scope, $location, $http, $anchorScroll, $timeout) {
       
        $scope.showSection = false;
        $scope.showLoading = false;
        $scope.jSON = [];
        $scope.sortingOrder = "None"; //orden por default
        $scope.reverse = false;
        $scope.currentPage = 1;
        $scope.registrosPagina = 20;

        $scope.creditoTotal = 0;
        $scope.debitoTotal = 0;
        $scope.totalidad = 0;

        $scope.sortKey = 'id';
        $scope.sort = function (keyname) {
            $scope.sortKey = keyname;
            $scope.reverse = !$scope.reverse;
            $scope.currentPage = 1;
        }	

        $scope.sortBy = function (sortType) {
            if ($scope.sortingOrder == sortType) {
                $scope.reverse = !$scope.reverse;
            }
            $scope.sortingOrder = sortType;
        };
        $scope.ejecutarWS = function () {
            $scope.showLoading = true;
            $timeout(function () {
                
                var viewXml = {
                    ViewXml: GenerarCamlQuery(DevolverNodos())
                }

                var elementos = SPD_GetListItems_CamlQuery(_spPageContextInfo.webAbsoluteUrl, MD_STOCK, viewXml).results;

                procesarJSON(elementos);
                $scope.showLoading = false;

                var element = document.getElementById("customers");

                element.scrollIntoView();

            })
        }
        function procesarJSON(elementos) {

            $scope.jSON = [];
            $scope.creditoTotal = 0;
            $scope.debitoTotal = 0;
            $scope.totalidad = 0;

            for (rec = 0; rec < elementos.length; rec++) {

                var rta = true;

                if (elementos[rec].FechaVencimientoStock != null) {
                    elementos[rec].FechaVencimientoStock = new Date(elementos[rec].FechaVencimientoStock).format("dd/MM/yyyy");
                }

                if (elementos[rec].FechaRemito != null) {
                    elementos[rec].FechaRemito = new Date(elementos[rec].FechaRemito).format("dd/MM/yyyy");
                }
                if (rta) {
                    $scope.jSON.push(elementos[rec]);
                }
            }

            elementos[rec].InstitucionNombre = "";

            if (elementos[rec].InstitucionId != null) {
                elementos[rec].InstitucionNombre = _evento_obtener_Institucion(elementos[rec].InstitucionId);
            }

        }
            $scope.totalidad = $scope.creditoTotal - $scope.debitoTotal;

           if (!$scope.$$phase)
                $scope.$apply();
        }
    });
}
function GenerarCamlQuery(oNodos) {
    var inicioQ = "<View><Query><Where>";
    var abroA = "<And>";
    var cierroA = "</And>";
    var finQ = "</Where></Query></View>";
    var Nodos = oNodos;
    var cont = 0;
    var arregloY = [];
    var nodo = "";
    //Este algoritmo agrupa los nodos de a pares uniendolos con "<And>" recursivamente
    for (k = 0; k < Nodos.length; k++) {
        cont++;
        if (cont == 1) {
            nodo = Nodos[k];
            if (k == (Nodos.length - 1))
                arregloY.push(nodo);
        }
        if (cont == 2) {
            nodo = abroA + nodo + Nodos[k] + cierroA;
            arregloY.push(nodo);
            nodo = "";
            cont = 0;
        }
        if (k == (Nodos.length - 1)) {
            Nodos = arregloY;
            if (arregloY.length == 1)
                break;
            k = -1;
            cont = 0;
            arregloY = [];
        }
    }
    if (arregloY.length > 0)
        inicioQ = inicioQ + arregloY[0];

    inicioQ = inicioQ + finQ;
    datos = inicioQ;
    return inicioQ;
}
function DevolverNodos() {
    var nodos = [];
    var date = new Date();
    date = date.format("yyyy-MM-dd");
    if (sp_controls.Medida.val() != "") {
        nodos.push('<Contains><FieldRef Name="Medida" /><Value Type="Text">' + sp_controls.Medida.val() + '</Value></Contains>');
    }
    if (sp_controls.Nombre.val() != "") {
        nodos.push('<Contains><FieldRef Name="NombreStock" /><Value Type="Text">' + sp_controls.Nombre.val() + '</Value></Contains>');
    }
    if (sp_controls.Marca.val() != "") {
        nodos.push('<Contains><FieldRef Name="Marca" /><Value Type="Text">' + sp_controls.Nombre.val() + '</Value></Contains>');
    }
    if (sp_controls.sn.val() != "") {
        nodos.push('<Contains><FieldRef Name="SN" /><Value Type="Text">' + sp_controls.sn.val() + '</Value></Contains>');
    }
    if (sp_controls.getin.val() != "") {
        nodos.push('<Contains><FieldRef Name="GETIN" /><Value Type="Text">' + sp_controls.getin.val() + '</Value></Contains>');
    }
    if (sp_controls.Lot.val() != "") {
        nodos.push('<Contains><FieldRef Name="LOT" /><Value Type="Text">' + sp_controls.Lot.val() + '</Value></Contains>');
    }
    if (sp_controls.Ref.val() != "") {
        nodos.push('<Contains><FieldRef Name="REF" /><Value Type="Text">' + sp_controls.Ref.val() + '</Value></Contains>');
    }
    if (sp_controls.Estado.val() != "(Todos)") {
        nodos.push('<Contains><FieldRef Name="Estado" /><Value Type="Text">' + sp_controls.Estado.find("option:selected").text() + '</Value></Contains>');
    }
    if (sp_controls.Vencimiento.val() == "S") {
        nodos.push('<Leq><FieldRef Name="FechaVencimientoStock" /><Value IncludeTimeValue="False" Type="DateTime">' + date + 'T06:53:16Z</Value></Leq>');
    }
    else {
        if (sp_controls.Vencimiento.val() == "N") {
            nodos.push('<Geq><FieldRef Name="FechaVencimientoStock" /><Value IncludeTimeValue="False" Type="DateTime">' + date + 'T06:53:16Z</Value></Geq>');
        }
        else {
            if (sp_controls.Vencimiento.val() == "SN") {

                var date = new Date();
                date = date.format("yyyy-MM-dd");

                var oneDay = 24 * 60 * 60 * 1000, // 24h
                    today = new Date().getTime(), // in ms
                    firstDate,
                    secondDate;

                firstDate = new Date(today + 60 * oneDay);

                nodos.push('<Geq><FieldRef Name="FechaVencimientoStock" /><Value IncludeTimeValue="False" Type="DateTime">' + date + 'T06:53:16Z</Value></Geq>');
                nodos.push('<Leq><FieldRef Name="FechaVencimientoStock" /><Value IncludeTimeValue="False" Type="DateTime">' + firstDate.format("yyyy-MM-dd") + 'T06:53:16Z</Value></Leq>');
            }
        }
    }
    if (sp_controls.CompraDesde.val() != "") {
        var desde = sp_controls.CompraDesde.val().split('/');
        if (desde.length == 3) {
            desde = desde[2] + "-" + desde[1] + "-" + desde[0];
            nodos.push('<Geq><FieldRef Name="FechaCompraStock" /><Value IncludeTimeValue="False" Type="DateTime">' + desde + 'T06:53:16Z</Value></Geq>');
        }
    }
    if (sp_controls.CompraDesde.val() != "") {
        var desde = sp_controls.CompraDesde.val().split('/');
        if (desde.length == 3) {
            desde = desde[2] + "-" + desde[1] + "-" + desde[0];
            nodos.push('<Leq><FieldRef Name="FechaCompraStock" /><Value IncludeTimeValue="False" Type="DateTime">' + desde + 'T06:53:16Z</Value></Leq>');
        }
    }

    return nodos;
}