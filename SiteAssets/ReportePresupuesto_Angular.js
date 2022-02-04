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

                var elementos = SPD_GetListItems_CamlQuery(_spPageContextInfo.webAbsoluteUrl, MD_Presupuestos, viewXml).results;

                procesarJSON(elementos);
                $scope.showLoading = false;

                var element = document.getElementById("customers");

                element.scrollIntoView();

            })
        }
        function procesarJSON(elementos) {

           $scope.jSON = [];

           for(rec=0; rec < elementos.length; rec++) {
                var rta = true;

            elementos[rec].ObraSocialNombre = "";

            if(elementos[rec].ObraSocialId != null) {
                elementos[rec].ObraSocialNombre = _evento_obtener_OS(elementos[rec].ObraSocialId); 
            }

            elementos[rec].InstitucionNombre = "";

            if(elementos[rec].InstitucionId != null) {
                elementos[rec].InstitucionNombre = _evento_obtener_Institucion(elementos[rec].InstitucionId); 
            }
            
               elementos[rec].EmpresaDescripcion = "";

            if(elementos[rec].EmpleadoId != null) {
                elementos[rec].EmpresaDescripcion = _evento_obtener_Empresa(elementos[rec].EmpleadoId); 
            }

            if(elementos[rec].FechaE != null){
                elementos[rec].FechaE =  new Date(elementos[rec].FechaE).format("dd/MM/yyyy");
            }
                if(rta){
                    $scope.jSON.push(elementos[rec]);
                }
           }
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

    if(sp_controls.Institucion.val() != "(Todos)"){
        nodos.push('<Eq><FieldRef Name="Institucion" LookupId="TRUE" /><Value Type="Lookup">' + sp_controls.Institucion.val() + '</Value></Eq>');
    }
    if(sp_controls.OS.val() != "(Todos)"){
        nodos.push('<Eq><FieldRef Name="ObraSocial" LookupId="TRUE" /><Value Type="Lookup">' + sp_controls.OS.val() + '</Value></Eq>');
    }
    if(sp_controls.Doctor.val() != ""){
        nodos.push('<Contains><FieldRef Name="Doctor" /><Value Type="Text">' + sp_controls.Doctor.val() + '</Value></Contains>');
    }
    if(sp_controls.Paciente.val() != ""){
        nodos.push('<Contains><FieldRef Name="Paciente" /><Value Type="Text">' + sp_controls.Paciente.val() + '</Value></Contains>');
    }
    if(sp_controls.Numero.val() != ""){
        nodos.push('<Eq><FieldRef Name="Numero" /><Value Type="Number">' + sp_controls.Numero.val() + '</Value></Eq>');
    }
    if (sp_controls.EmitidoDesde.val() != "") {
        var desde = sp_controls.EmitidoDesde.val().split('/');
        if (desde.length == 3) {
            desde = desde[2] + "-" + desde[1] + "-" + desde[0];
            nodos.push('<Geq><FieldRef Name="FechaE" /><Value IncludeTimeValue="False" Type="DateTime">' + desde + 'T06:53:16Z</Value></Geq>');
        }
    }
    if (sp_controls.EmitidoDesde.val() != "") {
        var desde = sp_controls.EmitidoHasta.val().split('/');
        if (desde.length == 3) {
            desde = desde[2] + "-" + desde[1] + "-" + desde[0];
            nodos.push('<Leq><FieldRef Name="FechaE" /><Value IncludeTimeValue="False" Type="DateTime">' + desde + 'T06:53:16Z</Value></Leq>');
        }
    }
   /* 
    if (param.PeriodoEvaluacion != "(Todos)")
        nodos.push('<Eq><FieldRef Name="PeriodoEvaluacion" /><Value Type="Lookup">' + param.PeriodoEvaluacion + '</Value></Eq>');
   */
    return nodos;
}