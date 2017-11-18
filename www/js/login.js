$(document).ready(function(){
  loginUser();
});

/**
* loginUser method is called when the index.html loads. It checks if the token is not null.
* If not null, validateToken method is called. validateToken is present in the common-methods.js 
*/
function loginUser(){
	if(gActiveToken != null){
		validateToken();
	}
}

/**
* validateToken makes an API call to check if the token is valid. If not valid, it indicates the
* user to login again by displaying an alert message. If valid, it redirects to the app page.
*/
function validateToken(){
	var data = {
        'token': gActiveToken
    };
    $.ajax({
        url: baseUrl + 'validateToken',
        type: "GET",
        data:  data,
        dataType: 'json',
        success: function(result){
        	if(result.status === 'valid'){
        		window.location = 'html/order.html';
        	} else {
        		alert(result.message);
        	}
        },
        error: function(){
            alert('failure');
        }           
    });
}

/**
* authenticateUser method authenticates the user with their email and password.
* On successful authentication, a token is return which is then stored in the client side. 
*/
function authenticateUser(){
	var email = $('#user-email').val();
	var password = $('#user-password').val();
	var data = {
        'email': email,
        'password': password 
    };
    $.ajax({
        url: baseUrl + 'login',
        type: "POST",
        data:  JSON.stringify(data),
        dataType: 'json',
        contentType: "application/json;charset=utf-8",
        success: function(result){
        	if(result.status === 'success'){
        		window.localStorage.setItem('token', result.token);
	        	window.location = 'html/order.html';
        	} else {
        		alert(result.message);
        	}
        },
        error: function(result){
            alert('failure');
        }           
    });
}