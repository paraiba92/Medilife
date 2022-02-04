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

        $scope.resetFilters = function () {
            $scope.sr_Title = "";
        };

        $scope.sort = function (keyname) {
            $scope.sortKey = keyname;
            $scope.reverse = !$scope.reverse;
            $scope.currentPage = 1;
        };
        $scope.ejecutarWS = function () {
            $scope.showLoading = true;
            $timeout(function () {

                var elementos = SPD_GetListItems(_spPageContextInfo.webAbsoluteUrl, MD_TIPOFACTURA).results
                procesarJSON(elementos);
                $scope.showLoading = false;

                var element = document.getElementById("customers");

                element.scrollIntoView();

            })
        }
        function procesarJSON(elementos) {

           var filterNombre = $('#SR_Nombre').val();

           $scope.sr_Title = "";

           $scope.jSON = [];

           for(rec=0; rec < elementos.length; rec++) {
                var rta = true;
                if(filterNombre != "") {
                    if (elementos[rec].Title.toUpperCase().indexOf(filterNombre.toUpperCase()) == -1){
                           rta = false;
                    }
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
function ConvertISOToDate(stringIso, hours) {
    if (stringIso != "") {
        var date = new Date(stringIso);
        if(hours)
            return date.format("dd/MM/yyyy HH:mm");
        else
            return date.format("dd/MM/yyyy");
    }
    return "";
}