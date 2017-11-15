/**
* saveUserInformation method collects the signup form data and 
*/
function saveUserInformation(){
	var $signupform = $("#signup-form");
	var signupData = getFormData($signupform);
}

/**
* getFormData method is used to collect all the field values and convert them as JSON
*/
function getFormData($form){
    var unindexedArray = $form.serializeArray();
    var indexedArray = {};

    $.map(unindexedArray, function(n, i){
        indexedArray[n['name']] = n['value'];
    });
    return indexedArray;
}