$(document).ready(function() {

    //Global variables
    var calculateShopPrice = 0, calculatedAmount  = 0;

	// initialize
    $('select').material_select();

    loadLocationsList();

    $('#order-menu-button').sideNav({
      menuWidth: 300, 
      edge: 'left',
      closeOnClick: true, 
      draggable: true
    });

    $('.timepicker').pickatime({
        default: 'now', // Set default time: 'now', '1:30AM', '16:30'
        fromnow: 0,       // set default time to * milliseconds from now (using with default = 'now')
        twelvehour: true, // Use AM/PM or 24-hour format
        donetext: 'OK', // text for done-button
        cleartext: 'Clear', // text for clear-button
        canceltext: 'Cancel', // Text for cancel-button
        autoclose: false, // automatic close timepicker
        ampmclickable: true, // make AM PM clickable
        aftershow: function(){} //Function for after opening timepicker

    });

	// event handling
    $('#location-select').change(function(){
    	validateLocation();
    });

    $('#flavour-select, #quantity-select').change(function(){
    	validateOrder();
    });

    $("a").on('click', function(event) {
       if (this.hash !== "") {
            event.preventDefault();
            var hash = this.hash;
            $('html, body').animate({
               scrollTop: $(hash).offset().top}, 300, function(){window.location.hash = hash;
            });
        } 
    });

    $('#hat-check, #popper-check, #snow-check, #candle-check').click(function(){
        validateShop();
    });

    $('#hat-select, #snow-select, #popper-select').change(function(){
        calculateShop();
    });

    $('#confirm-button').click(function(){
        displaySummary();
    });

    $('#address-text').blur(function(){
        validateAddress();
        validateDeliveryTime();
    });

    $('#time-switch').click(function(){
        enableTime();
        validateDeliveryTime();
    });

    $('#time-picker').change(function(){
        validateDeliveryTime();
    });

});


// validateLocation method is used to enable/disable the location button.
function validateLocation(){
    var locationValue = $('#location-select')[0].value;
    if(locationValue != ""){
        $('#place-button').attr('disabled', false);
    }
}

// loadLocationsList method is to get the locationlist from the DB.
function loadLocationsList(){
    var data = {
        'token': window.localStorage.getItem('hc-token')
    };
    $.ajax({
        url: "http://localhost:8888/hc-comb/api.php/location",
        type: "GET",
        data:  data,
        dataType: 'json',
        success: function(result){
            populateLocationDropdown(result.resultData);
        },
        error: function(){
            alert('failure');
        }           
    });
}

// populateLocationDropdown is used to load the locationlist to the dropdown.
function populateLocationDropdown(locationArray){
    var optionsList = '';
    locationArray.forEach( function(location, index) {
     $('<option>').val(location.locationCode).text(location.locationName).appendTo('#location-select');
    });
    $('#location-select').material_select();
}

// validateOrder method is to enable/disable item order button.
function validateOrder(){
    var flavourValue = $('#flavour-select')[0].value;
    var quantityValue = $('#quantity-select')[0].value;
    if(flavourValue != "" && quantityValue !=""){
        $('#cake-button').attr('disabled', false);
        calculateOrder();
    }
}

// calculateOrder method is to calculate the price of item.
function calculateOrder(){
    calculatedAmount = parseInt($('#flavour-select')[0].value) * parseInt($('#quantity-select')[0].value);
    $('#order-price-text').text('Rs. ' + calculatedAmount);
}

// validateShop method is used to enable/disable the quantity dropdown with respect to the checkboxes of the same.
function validateShop(){
    if($('#hat-check')[0].checked){
        $('#hat-select')[0].disabled=false;
    }else{
        $('#hat-select')[0].disabled=true;
    }
    if($('#snow-check')[0].checked){
        $('#snow-select')[0].disabled=false;
    }else{
        $('#snow-select')[0].disabled=true;
    }
    if($('#popper-check')[0].checked){
        $('#popper-select')[0].disabled=false;
    }else{
        $('#popper-select')[0].disabled=true;
    }
    $('select').material_select();
    calculateShop();
}

// calculateShop method is used to calculate the price of the shop item from user input.
function calculateShop(){
    var hatPrice=0, snowPrice=0, popperPrice=0, candlePrice=0;
    if($('#hat-check')[0].checked){            
        hatPrice = 45 * parseInt($('#hat-select')[0].value);
    }
    if($('#snow-check')[0].checked){
        snowPrice = 55 * parseInt($('#snow-select')[0].value);
    }
    if($('#popper-check')[0].checked){
        popperPrice = 60 * parseInt($('#popper-select')[0].value);
    }
    if($('#candle-check')[0].checked){
        candlePrice= 90;
    }
    calculateShopPrice = hatPrice + snowPrice + popperPrice + candlePrice; 
    $('#shop-price-text').text('Rs. ' + calculateShopPrice);
}

// enableTime method is to enable/disable the delivery time input.
function enableTime(){
    var later = $('#time-switch')[0].checked;
    if(later){
        $('#time-picker')[0].disabled=false;
    }else{
        $('#time-picker')[0].disabled=true;
    }
}

// validateAddress is used to check the address text length to enable/disable the delivery address
function validateAddress(){
    var addressCheck = $('#address-text')[0].validity.valid;
    if(addressCheck){
        $('#confirm-button').attr('disabled', false);
    }else{
        $('#confirm-button').attr('disabled', true);
    }
}

// validateDeliveryTime method is to check delivery time need or not.
function validateDeliveryTime(){
    var switchCheck = $('#time-switch')[0].checked;
    var timeCheck = $('#time-picker')[0].value;
    if(switchCheck){
        if(timeCheck != ''){
            validateAddress();
        }else{
            $('#confirm-button').attr('disabled', true);
        }
    }else{
        validateAddress();
    }
}

// displaySummary is to fetch all the user input and display it to the summary page fields.
function displaySummary(){
    var flavourName = $('#flavour-select')[0].selectedOptions[0].innerText;
    var quantity = $('#quantity-select')[0].selectedOptions[0].innerText;
    var totalAmount = calculatedAmount + calculateShopPrice;

    var hatNo= $('#hat-select')[0].selectedOptions[0].innerText;
    var snowNo= $('#snow-select')[0].selectedOptions[0].innerText;
    var popperNo= $('#popper-select')[0].selectedOptions[0].innerText;
    var shopSummary = '';

    var addressText = $('#address-text')[0].value;
    var timeText;

    if($('#time-switch')[0].checked){
        timeText = $('#time-picker')[0].value;
    }else{
        var dateText = new Date($.now());
        var timeMeridian;
        var hoursText;

        if(dateText.getHours() > 12){
            hoursText = dateText.getHours() - 12;
            timeMeridian = "PM";
        }else{
            hoursText = dateText.getHours();
            timeMeridian = "AM";
        }
        timeText = hoursText + ":" + dateText.getMinutes() + " " +timeMeridian;
    }

    if($('#hat-check')[0].checked){            
        shopSummary = 'PartyHat ('+hatNo+')';
    }
    if($('#snow-check')[0].checked){
        shopSummary = shopSummary + '  Snowspray ('+snowNo+')';
    }
    if($('#popper-check')[0].checked){
        shopSummary = shopSummary + '  Poppers ('+popperNo+')';
    }
    if($('#candle-check')[0].checked){
        shopSummary = shopSummary + '  Fancy Candle';
    }

    $('#order-summary-text').text(flavourName + ' (' + quantity +')' + ' - Rs.' +calculatedAmount);
    $('#shop-summary-text').text(shopSummary + ' - Rs.' +calculateShopPrice);
    $('#total-text').text('Rs. '+ totalAmount);

    $('#address-summary-text').text(addressText);
    $('#time-summary-text').text(timeText);
}