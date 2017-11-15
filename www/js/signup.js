/**
* saveUserInformation method collects the signup form data
*/
function saveUserInformation(){
	var $signupform = $("#signup-form");
	var signupData = getFormData($signupform);
	$.ajax({
        url: baseUrl + 'user',
        type: "POST",
        data:  JSON.stringify(signupData),
        dataType: 'json',
        contentType: "application/json;charset=utf-8",
        success: function(result){
        	if(result.status === 'success'){
        		window.localStorage.setItem('userId', result.userId);
	        	window.location = 'signup.html#mobile-verification-page';
        	} else {
        		alert(result.message);
        	}
        },
        error: function(result){
            alert('failure');
        }           
    });
}

/**
* verifyOtp method collects the signup form data and 
*/
function verifyOtp(){
	var userOtp = $('#user-otp').val();
	var userId = window.localStorage.getItem('userId');
	var data = {
		'userId': userId,
		'userOtp': userOtp,
		'otpFor': 'mobile' 
	};
	$.ajax({
        url: baseUrl + 'verifyOtp',
        type: "POST",
        data:  JSON.stringify(data),
        dataType: 'json',
        contentType: "application/json;charset=utf-8",
        success: function(result){
        	if(result.status === 'success'){
        		alert(result.message);
        		window.location = '../index.html';
        	} else {
        		alert(result.message);
        	}
        },
        error: function(result){
            alert('failure');
        }           
    });
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