/**
* gActiveToken holds the currently active token. It will be null if there's no value available for the key.
*/
var gActiveToken = window.localStorage.getItem('hc-token');

/**
* URLs
*/
var baseUrl = 'http://localhost:8888/hc-comb/api.php/';

function loginUser(){
	if(gActiveToken != null){
		validateToken();
	}
}

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
        		//redirct to order or home page
        		window.location = 'html/order.html';
        	} else {
        		//ask user to login again
        		alert(result.message);
        	}
        },
        error: function(){
            alert('failure');
        }           
    });
}

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
        		window.localStorage.setItem('hc-token', result.token);
        		console.log(result.token);
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