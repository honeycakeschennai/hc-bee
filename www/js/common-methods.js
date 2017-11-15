/**
* gActiveToken holds the currently active token. It will be null if there's no value available for the key.
*/
var gActiveToken = window.localStorage.getItem('hc-token');

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

function cleanLocalStorage(){
	window.localStorage.removeItem('hc-token');
	window.localStorage.removeItem('userId');
}