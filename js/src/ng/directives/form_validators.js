define(['app'], function(app)
{
    app.directive('formValidator', ['$timeout',
        function($timeout) {
      return {
        restrict: 'A',
        link: function(scope, element, attrs) {

            scope[attrs.name].$highlightFields = function(){
                var formFields = angular.toJson(scope[attrs.name]);
                    formFields = angular.fromJson(formFields);

                    for(i in formFields){
                        $(element).find('.ng-invalid').addClass('error');
                    }
            }
            
        }
      };
    }]);

    app.directive('fieldValidator', ['$timeout',
        function($timeout) {
      return {
        restrict: 'A',
        scope: {
            messages: '=errorMsg'
        },
        require: 'ngModel',
        link: function(scope, element, attrs, ctrl) {

            //VALIDATOR FUNCTIONS
            function TratarMensagem(msg){
                return {msg: msg, type: "error"};
            }
            function NM_ReqVal(theField, theMessage) {
                //console.log(theField, theMessage);
                if (theField === "" || !theField) {
                    return TratarMensagem(theMessage);
                } else {
                    return {};
                }
            }
            function NM_Phone(theField, theMessage) {
                var value = theField;
                var reg = /[0-9]{9}/;

                if (value == "" || !value) return TratarMensagem(theMessage);

                if (value.length != 9) return TratarMensagem(theMessage);//v2.20

                if (reg.test(value) == false) {
                    return TratarMensagem(theMessage);
                } else {
                    return {};
                }
            }
            function NM_EmailVal(theField, theMessage) {
                var value = theField;
                //var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
                var reg = /^([A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-Za-z0-9!#$%&'*'+/=?^_`{|}~-]+)*@(?:[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?\.)+[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?)$/;

                if (value == "") return {};

                if (reg.test(value) == false) {
                    return TratarMensagem(theMessage);
                } else {
                    return {};
                }
            }

            function NM_Date(theField, theMessage) {
                var value = theField;
                if (!value) value=""; //if value is undefined, then value=""

                if (value == "") return {};

                if (!AUX_ValidDate(value, 'dd-mm-aaaa')) {
                    return TratarMensagem(theMessage);
                } else {
                    return {};
                }
            }

            // validar data entre uma data de inicio e uma data de fim (se dateStart ou dateEnd forem "", assume data de hoje)
            function NM_DateInterval(theField, theMessage, dateStart, dateEnd) {
                var value = theField;
                if (!value) value=""; //if value is undefined, then value=""

                //ignore empty field
                if (value == "") return "";

                if (!AUX_ValidDate(value)) {
                    //ignore date in wrong format
                    return {};
                } else {

                    var date_value = AUX_ConvertToDate(value);
                    var date_start = AUX_ConvertToDate(dateStart);
                    var date_end = AUX_ConvertToDate(dateEnd);
                    
                    if ((date_value >= date_start) && (date_value <= date_end)){
                        return {};
                    } else {
                        return TratarMensagem(theMessage);
                    }

                }
            }

            function AUX_ValidDate(theDate, theMask) {
                var theFormat = theMask;
                
                //if (theMask == undefined) theFormat = DATE_FORMAT; //global variable set in "validators3-core.js"
                if (theFormat == undefined) theFormat = 'dd-mm-aaaa';

                var ano = '', mes = '', dia = '', dtOK = 0;
                var totalOK;
                
                if ((theDate.length == 8) && (theFormat.length == 8)) { totalOK = 3 } else { totalOK = 5 };
                
                for (i = 0; i < (theDate.length); i++) {
                    if (theDate.charAt(i) == theFormat.charAt(i)) { dtOK++ }
                    if (theFormat.charAt(i) == 'd') { dia += theDate.charAt(i) }
                    if (theFormat.charAt(i) == 'm') { mes += theDate.charAt(i) }
                    if (theFormat.charAt(i) == 'a') { ano += theDate.charAt(i) }
                }

                if (dia.charAt(0) == '0') { diaZero = '0' } else { diaZero = '' }
                if (mes.charAt(0) == '0') { mesZero = '0' } else { mesZero = '' }

                if (dia != diaZero + parseInt(dia, 10)) { return false } else { dia = eval(dia) };
                if (mes != mesZero + parseInt(mes, 10)) { return false } else { mes = eval(mes) };
                if (ano != '' + parseInt(ano, 10)) { return false } else { ano = eval(ano) };

                switch (mes) {
                    case 2: if (ano % 4 == 0) { diasmes = 29 } else { diasmes = 28 }; break;
                    case 4: diasmes = 30; break;
                    case 6: diasmes = 30; break;
                    case 9: diasmes = 30; break;
                    case 11: diasmes = 30; break;
                    default: diasmes = 31; break;
                };

                if ((dia > 0) && (dia <= diasmes)) { dtOK++ }
                if ((mes > 0) && (mes < 13)) { dtOK++ }
                if ((ano > 1800) && (ano < 9999)) { dtOK++ }

                if (dtOK == totalOK) 
                    return true 
                else 
                    return false;
            }

            function AUX_ConvertToDate(theDate) {
                // "theDate" must be in the format: dd-mm-yyyy 
                var retval = new Date();
                if (theDate != "") { retval.setFullYear(theDate.substring(6, 10), theDate.substring(3, 5) - 1, theDate.substring(0, 2)); }
                return retval;
            }

            var validator = {};
            
            validator.required = function(value, results){
                results.push(NM_ReqVal(value, 'Obrigatório'));
            }

            validator.email = function(value, results){
                results.push(NM_EmailVal(value, 'Formato inválido'));
            }

            validator.telefone = function(value, results){
                results.push(NM_Phone(value, 'Formato inválido'));
            }

            var steps = String(attrs.fieldValidator).split(',');

            function runValidators(setClass, viewValue){
              var matchName = attrs.validateMatch;

              var results = new Array();
              var messages = new Array();

              //Run each validator described in directive field-validator='value'
              for(i in steps){
                //console.log(ctrl);
                validator[steps[i]](viewValue, results);
                var i = results.length - 1;
                //set validity
                if(results[i].type == 'error'){
                    messages.push(element.parent().text()+' '+results[i].msg);
                    ctrl.$setValidity(steps[i], false);
                    if(setClass) element.addClass("error");
                }else{
                    ctrl.$setValidity(steps[i], true);
                    element.removeClass("error");
                }
              }

              //Matches this field with a given field name usefull to check password and repeat password
              if(attrs.fieldMatch){
                if($('[name="'+attrs.fieldMatch+'"]').val() != viewValue){
                    ctrl.$setValidity('match-'+attrs.fieldMatch, false);
                    if(setClass) element.addClass("error");
                }else{
                    ctrl.$setValidity('match-'+attrs.fieldMatch, true);
                    element.removeClass("error");
                }
              }

              //Init the var scope.messages if not created
              scope.messages = (scope.messages)? scope.messages : {};
              //Set a scope erros var if we want to list the errors
              scope.messages[ctrl.$name] = messages;

              return viewValue;
            }

            //After directive rendering we run our validators to invalidate ngModel
            //but we dont give visual evidence to the user, because the form is not dirty
            setTimeout(function(){
                runValidators(false, ctrl.$viewValue);
            }, 50);

            //Add's Validation to fields on blur event
            $(element).blur(function(){
                runValidators(true, ctrl.$viewValue);
            });

            /*WARNING ENTERING MAGIC KINGDOM =)*/
            ctrl.$parsers.unshift(function (viewValue) {
              
              runValidators(true, viewValue);
              return (scope.messages[ctrl.$name].length > 0)? undefined : viewValue;

              /*
              console.log(results);
              console.log(messages);
              */
              
              /*
              if(messages.length == 0){
                    ctrl.$setValidity('match', true);
                    return viewValue;
                }else{
                    ctrl.$setValidity('match', false);
                    // if invalid, return undefined
                    // (no model update happens)
                    return undefined;
                }
                */
            });
            
        }
      };
    }]);

    return app;

});