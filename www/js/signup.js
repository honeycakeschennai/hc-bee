/**
* checkPasswordStrength method checks the strength of the password
*
*/function checkPasswordStrength() {
    var number = /([0-9])/;
    var alphabets = /([a-zA-Z])/;
    var special_characters = /([~,!,@,#,$,%,^,&,*,-,_,+,=,?,>,<])/;
    
    if($('#user-password').val().length<6) {
        $('#password-strength-status').removeClass();
        $('#password-strength-status').addClass('weak-password');
        $('#password-strength-status').html("Weak (should be atleast 6 characters.)");
    } else {    
        if($('#user-password').val().match(number) && $('#user-password').val().match(alphabets) && $('#password').val().match(special_characters)) {            
            $('#password-strength-status').removeClass();
            $('#password-strength-status').addClass('strong-password');
            $('#password-strength-status').html("Strong");
        } else {
            $('#password-strength-status').removeClass();
            $('#password-strength-status').addClass('medium-password');
            $('#password-strength-status').html("Medium (should include alphabets, numbers and special characters.)");
        } 
    }
}

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
                var errorDetails = result.errorDetails;
                if(errorDetails.indexOf('mobile') !== -1){
                    alert('Entered mobile number already exists.');
                } else {
                    alert('Entered email already exists.');
                }
            }
        },
        error: function(result){
            alert('failure');
        }           
    });
}

function comparePasswordsAndMoveToNext(){
    var password = $('#user-password').val();
    var rePassword = $('#user-re-password').val();
    if(password === rePassword){
        window.location = '#mobile-number-page';
    } else {
        alert('Entered Passwords does not match!');
    }
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