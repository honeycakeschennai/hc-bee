/**
* gActiveToken holds the currently active token. It will be null if there's no value available for the key.
*/
var gActiveToken = window.localStorage.getItem('token');

/**
* URLs
*/
var baseUrl = 'http://localhost:8888/hc-comb/api.php/';

/**
* logoutUser method logs out the user and clears the token from the client side.
*/
function logoutUser(){
	window.location = '../index.html';
	cleanLocalStorage();
}

/**
* cleanLocalStorage method cleans the local storage data.
*/
function cleanLocalStorage(){
	window.localStorage.removeItem('token');
	window.localStorage.removeItem('userId');
    window.localStorage.removeItem('emailStatus');
    window.localStorage.removeItem('mobileStatus');
    window.localStorage.removeItem('username');
    window.localStorage.removeItem('userEmail');
    window.localStorage.removeItem('userMobile');
    window.localStorage.removeItem('lastOrderNumber');
}