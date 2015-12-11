/**
 * Created by wramirez on 25/03/2015.
 */
RRHH.service('ConstanteService', function () {
    var service = this;
    service.genders=[{ name: 'Masculino', code: 'M' },{ name: 'Femenino', code: 'F' }];
    service.maritalStatus = [{ label: 'Casad@', value: 'C' },{ label: 'Solter@', value: 'S' }];
    service.urlServerFiles='http://www.megapaca.gt/files/';
    service.urlServerUploadFiles='https://www.megapaca.gt/MPITRest';

    service.regExps = {
        msjRequired: 'DATO REQUERIDO.',
        //firstName: {exp: /^[a-zA-Z]{2,}(\s[a-zA-Z]{2,})?$/, message: 'Unicamente debe ingresar letras.'},
        firstName: {exp: /^[A-Za-záéíóúñÁÉÍÓÚÑ]{2,}([\s][A-Za-záéíóúñÁÉÍÓÚÑ]{2,})*$/, message: 'Unicamente debe ingresar letras.'},
        //middleName: {exp: /^([a-zA-Z]{2,})?([a-zA-Z]{1,}\s[a-zA-Z]{2,})*$/, message: 'Unicamente debe ingresar letras.'},
        middleName: {exp: /^[A-Za-záéíóúñÁÉÍÓÚÑ]{2,}([\s][A-Za-záéíóúñÁÉÍÓÚÑ]{2,})*$/, message: 'Unicamente debe ingresar letras.'},
        decimal: {exp: /^[1-9]+[0-9]*(.[0-9]+)?$/, message: 'El valor ingresado no coincide con 1234.56'},
        number: {exp: /^[1-9]+[0-9]*$/, message: 'El valor ingresado no coincide con 1234'},
        numberOnly: {exp: /^[0-9]+$/, message: 'El valor ingresado no coincide con 1234'},
        cui: {exp: /^[1-9]+[0-9]*([0-9]+)+$/, message: 'El valor ingresado no coincide con 1234'},
        phone: {exp: /^([0-9]+){8,}$/, message: 'El Numero debe tener mas de 7 digitos.'},
        date: {exp: /^(?:(?:0?[1-9]|1\d|2[0-8])(\/|-)(?:0?[1-9]|1[0-2]))(\/|-)(?:[1-9]\d\d\d|\d[1-9]\d\d|\d\d[1-9]\d|\d\d\d[1-9])$|^(?:(?:31(\/|-)(?:0?[13578]|1[02]))|(?:(?:29|30)(\/|-)(?:0?[1,3-9]|1[0-2])))(\/|-)(?:[1-9]\d\d\d|\d[1-9]\d\d|\d\d[1-9]\d|\d\d\d[1-9])$|^(29(\/|-)0?2)(\/|-)(?:(?:0[48]00|[13579][26]00|[2468][048]00)|(?:\d\d)?(?:0[48]|[2468][048]|[13579][26]))$/, message: 'El Numero debe tener mas de 7 digitos.'}
    };

    service.findAndRemove=function(array, property, value) {
        $.each(array, function(index, result) {
            if(result[property] && result[property] == value) {
                //Remove from array
                array.splice(index, 1);
            }
        });
    }

});