﻿var myAngApp = angular.module('miApp', ['ngRoute', 'angularUtils.directives.dirPagination']).config(['$compileProvider', function ($compileProvider) {
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

                var elementos = SPD_GetListItems_CamlQuery(_spPageContextInfo.webAbsoluteUrl, MD_FACTURA, viewXml).results;

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

           for(rec=0; rec < elementos.length; rec++) {
            elementos[rec].Stock = [];
            var rta = true;

            if (elementos[rec].FechaEmitida != null) {
                elementos[rec].FechaEmitida = new Date(elementos[rec].FechaEmitida).format("dd/MM/yyyy");
            }
            if (elementos[rec].FechaVencimiento != null) {
                   elementos[rec].FechaVencimiento = new Date(elementos[rec].FechaVencimiento).format("dd/MM/yyyy");
            }
            if (elementos[rec].FechaPago != null) {
                elementos[rec].FechaPago = new Date(elementos[rec].FechaPago).format("dd/MM/yyyy");
            }
            if (elementos[rec].Credito != null) {
                $scope.creditoTotal = $scope.creditoTotal + elementos[rec].Credito;
            }
            if (elementos[rec].Debito != null) {
                $scope.debitoTotal = $scope.debitoTotal + elementos[rec].Debito;
            }   
               
            elementos[rec].ObraSocialNombre = "";

            if(elementos[rec].ObraSocialId != null) {
                elementos[rec].ObraSocialNombre = _evento_obtener_OS(elementos[rec].ObraSocialId); 
               }
            if (elementos[rec].StockId.results.length != 0) {
                for (g = 0; g < elementos[rec].StockId.results.length; g++) {
                        elementos[rec].Stock.push(_evento_obtener_Stock(elementos[rec].StockId.results[g]));
                }
            }
                if(rta){
                    $scope.jSON.push(elementos[rec]);
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

    if (sp_controls.Numero.val() != "") {
        nodos.push('<Eq><FieldRef Name="Numero" /><Value Type="Number">' + sp_controls.Numero.val() + '</Value></Eq>');
    }
    if (sp_controls.Tipo.val() != "(Todos)") {
        nodos.push('<Contains><FieldRef Name="TipoFactura" /><Value Type="Text">' + sp_controls.Tipo.find("option:selected").text() + '</Value></Contains>');
    }
    if (sp_controls.OS.val() != "(Todos)") {
        nodos.push('<Eq><FieldRef Name="ObraSocial" LookupId="TRUE" /><Value Type="Lookup">' + sp_controls.OS.val() + '</Value></Eq>');
    }
    if (sp_controls.Stock.val() != "(Todos)") {
        nodos.push('<Eq><FieldRef Name="Stock" LookupId="TRUE" /><Value Type="Lookup">' + sp_controls.Stock.val() + '</Value></Eq>');
    }
    if (sp_controls.FechaEmitidaDesde.val() != "") {
        var desde = sp_controls.FechaEmitidaDesde.val().split('/');
        if (desde.length == 3) {
            desde = desde[2] + "-" + desde[1] + "-" + desde[0];
            nodos.push('<Geq><FieldRef Name="FechaEmitida" /><Value IncludeTimeValue="False" Type="DateTime">' + desde + 'T06:53:16Z</Value></Geq>');
        }
    }
    if (sp_controls.FechaEmitidaHasta.val() != "") {
        var desde = sp_controls.FechaEmitidaHasta.val().split('/');
        if (desde.length == 3) {
            desde = desde[2] + "-" + desde[1] + "-" + desde[0];
            nodos.push('<Leq><FieldRef Name="FechaEmitida" /><Value IncludeTimeValue="False" Type="DateTime">' + desde + 'T06:53:16Z</Value></Leq>');
        }
    }
    if (sp_controls.FechaVencimientoDesde.val() != "") {
        var desde = sp_controls.FechaVencimientoDesde.val().split('/');
        if (desde.length == 3) {
            desde = desde[2] + "-" + desde[1] + "-" + desde[0];
            nodos.push('<Geq><FieldRef Name="FechaVencimiento" /><Value IncludeTimeValue="False" Type="DateTime">' + desde + 'T06:53:16Z</Value></Geq>');
        }
    }
    if (sp_controls.FechaVencimientoHasta.val() != "") {
        var desde = sp_controls.FechaVencimientoHasta.val().split('/');
        if (desde.length == 3) {
            desde = desde[2] + "-" + desde[1] + "-" + desde[0];
            nodos.push('<Leq><FieldRef Name="FechaVencimiento" /><Value IncludeTimeValue="False" Type="DateTime">' + desde + 'T06:53:16Z</Value></Leq>');
        }
    }
    if (vencidas || aVencer) {
        nodos.push('<IsNull><FieldRef Name="FechaPago" /></IsNull>');
    }
    else {
        if (sp_controls.FechaCobradaDesde.val() != "") {
            var desde = sp_controls.FechaCobradaDesde.val().split('/');
            if (desde.length == 3) {
                desde = desde[2] + "-" + desde[1] + "-" + desde[0];
                nodos.push('<Geq><FieldRef Name="FechaPago" /><Value IncludeTimeValue="False" Type="DateTime">' + desde + 'T06:53:16Z</Value></Geq>');
            }
        }
        if (sp_controls.FechaCobradaHasta.val() != "") {
            var desde = sp_controls.FechaCobradaHasta.val().split('/');
            if (desde.length == 3) {
                desde = desde[2] + "-" + desde[1] + "-" + desde[0];
                nodos.push('<Leq><FieldRef Name="FechaPago" /><Value IncludeTimeValue="False" Type="DateTime">' + desde + 'T06:53:16Z</Value></Leq>');
            }
        }
    }
    vencidas = false;
    aVencer = false;

    return nodos;
}