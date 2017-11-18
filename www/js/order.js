if(gActiveToken == null){
    window.location = '../index.html';
}

/**
* gItemData holds item data that includes all items irrespective of thier status and categories
* gItemData holds an array of JSONs
*/
var gItemData = [];

/**
* gIsLocationModified is used to track if the location has been changed by the user. If user 
* selects a particular location and selects a flavour and then the user changes the location by 
* going back, then gIsLocationModified value will be set to true. If so, the falvour drop down  
* will be reset.
*/
var gIsLocationModified = false;

/**
* gItemsPriceList holds prices of all the items available with the vendor irrespective of the 
* category and status.
*
* itemCode : itemPrice 
*/
var gItemsPriceList = {};

/**
* gCakePrice is used to cake price.
*/
var gCakePrice = 0;

/**
* gPartyPacksPrice is used to hold the total price of party packs.
*/
var gPartyPacksPrice = 0;

/**
* gTotalPrice is used to hold the total order price - cake + party packs.
*/
var gTotalPrice = 0;

/**
* gAddressData is used to hold the address data.
*/
var gAddressData = {};

$(document).ready(function() {
	// initialize
    $('select').material_select();

    //load the locations drop down
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
    	validateCake();
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
        validatePartyPacks();
    });

    $('#hat-select, #snow-select, #popper-select').change(function(){
        computePartyPacksPrice();
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


    //initialize
    $('#status-menu-button').sideNav({
        menuWidth: 300, 
        edge: 'left',
        closeOnClick: true, 
        draggable: true
    });

    $('.modal').modal({
        dismissible: true,
        opacity: .5,
        inDuration: 300,
        outDuration: 200,
        startingTop: '4%',
        endingTop: '10%',
        ready: function(modal, trigger) {},
        complete: function() {}
    });

    //event handling
    updateStatus(0);

    $('#cancel-button').click(function(){
        $('#cancel-dialog').modal('open');
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
        'token': gActiveToken
    };
    $.ajax({
        url: baseUrl + 'location',
        type: "GET",
        data:  data,
        dataType: 'json',
        success: function(result){
            populateLocationDropdown(result.resultData);
            bindLocationEvents();
        },
        error: function(){
            alert('Please login again!');
        }           
    });
}

// populateLocationDropdown is used to load the locationlist to the dropdown.
function populateLocationDropdown(locationArray){
    locationArray.forEach( function(location, index) {
     $('<option>').val(location.locationCode).text(location.locationName).appendTo('#location-select');
    });
    $('#location-select').material_select();
}

function bindLocationEvents(){
    $('#location-select').change(function(){
        gIsLocationModified = true;
    });
}

function getItems(){
    var data = {
        'token': gActiveToken,
        'lnCode': $('#location-select').val()
    };
    if(gIsLocationModified){
        $.ajax({
            url: baseUrl + 'items',
            type: "GET",
            data:  data,
            dataType: 'json',
            success: function(result){
                gItemData = result.resultData;
                populateFlavourDropdown(result.resultData);
                enablePartyPacksIfAvailable(result.resultData);
                //resetting the gIsLocationModified value to false
                gIsLocationModified = false;
            },
            error: function(){
                alert('Please login again!');
            }           
        });
    }
}

function populateFlavourDropdown(itemsArray){
    $('#flavour-select').empty();
    $('<option>').val('').text('Flavour').prop('disabled', true).prop('selected', true).appendTo('#flavour-select');
    itemsArray.forEach( function(item, index) {
        //add the price to price list array irrespective of the category and status
        gItemsPriceList[item.itemCode] = item.itemPrice;
        if(item.itemCategory === '1' && item.status === '1'){
            $('<option>').val(item.itemCode).text(item.itemName).appendTo('#flavour-select');
        }
    });
    $('#flavour-select').material_select();
}

function enablePartyPacksIfAvailable(itemsArray){
    $('#hat-check').attr('disabled', true);
    $('#snow-check').attr('disabled', true);
    $('#popper-check').attr('disabled', true);
    $('#candle-check').attr('disabled', true);
    gItemData.forEach( function(item, index) {
        if(item.itemCategory === '2' && item.status === '1'){
            switch(item.itemCode){
                case "PARTY01":
                    $('#hat-check').attr('disabled', false);
                    break;
                case "PARTY02":
                    $('#snow-check').attr('disabled', false);
                    break;
                case "PARTY03":
                    $('#popper-check').attr('disabled', false);
                    break;
                case "PARTY04":
                    $('#candle-check').attr('disabled', false);
                    break;
            }
        }
    });
}

// validateCake method is to enable/disable item order button.
function validateCake(){
    var flavourValue = $('#flavour-select')[0].value;
    var quantityValue = $('#quantity-select')[0].value;
    if(flavourValue != "" && quantityValue != ""){
        $('#cake-button').attr('disabled', false);
        computeCakePrice();
    }
}

/**
*   computeCakePrice method is to calculate the price of item.
*/
function computeCakePrice(){
    var itemCode = $('#flavour-select')[0].value;
    var itemPrice = gItemsPriceList[itemCode];
    gCakePrice = parseInt(itemPrice) * parseInt($('#quantity-select')[0].value);
    setTotalPriceText();
}

// validatePartyPacks method is used to enable/disable the quantity dropdown with respect to the checkboxes of the same.
function validatePartyPacks(){
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
    computePartyPacksPrice();
}

// computePartyPacksPrice method is used to calculate the price of the shop item from user input.
function computePartyPacksPrice(){
    var hatPrice=0, snowPrice=0, popperPrice=0, candlePrice=0;
    if($('#hat-check')[0].checked){            
        hatPrice = parseInt(gItemsPriceList["PARTY01"]) * parseInt($('#hat-select')[0].value);
    }
    if($('#snow-check')[0].checked){
        snowPrice = parseInt(gItemsPriceList["PARTY02"]) * parseInt($('#snow-select')[0].value);
    }
    if($('#popper-check')[0].checked){
        popperPrice = parseInt(gItemsPriceList["PARTY03"]) * parseInt($('#popper-select')[0].value);
    }
    if($('#candle-check')[0].checked){
        candlePrice= parseInt(gItemsPriceList["PARTY04"]);
    }
    gPartyPacksPrice = hatPrice + snowPrice + popperPrice + candlePrice; 
    setTotalPriceText();
}

function setTotalPriceText(){
    gTotalPrice = gCakePrice + gPartyPacksPrice;
    $('.total-price-text').text('Rs. ' + gTotalPrice);
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

function getAddress(){
    var data = {
        'token': gActiveToken
    };
    $.ajax({
        url: baseUrl + 'address',
        type: "GET",
        data:  data,
        dataType: 'json',
        success: function(result){
            if(result.rowCount === 1){
                gAddressData = (result.resultData)[0];
                loadAddressData();
                bindAdressTypeEvents();
            }
        },
        error: function(){
            alert('Please login again!');
        }           
    });
}

function loadAddressData(){
    var addressType = $('#address-select')[0].value;
    $('#address-text').val(gAddressData[addressType]);
    validateAddress();
}

function bindAdressTypeEvents(){
    $('#address-select').change(function(){
        loadAddressData();
    });
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

    var hatNo= $('#hat-select')[0].selectedOptions[0].innerText;
    var snowNo= $('#snow-select')[0].selectedOptions[0].innerText;
    var popperNo= $('#popper-select')[0].selectedOptions[0].innerText;
    var partyPacksSummary = '';

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
        partyPacksSummary = 'PartyHat ('+hatNo+')';
    }
    if($('#snow-check')[0].checked){
        partyPacksSummary = partyPacksSummary + '  Snowspray ('+ snowNo +')';
    }
    if($('#popper-check')[0].checked){
        partyPacksSummary = partyPacksSummary + '  Poppers ('+ popperNo +')';
    }
    if($('#candle-check')[0].checked){
        partyPacksSummary = partyPacksSummary + '  Fancy Candle';
    }

    $('#cake-summary-text').text(flavourName + ' (' + quantity +')' + ' - Rs.' + gCakePrice);
    $('#party-summary-text').text(partyPacksSummary + ' - Rs.' + gPartyPacksPrice);
    $('#total-text').text('Rs. '+ gTotalPrice);

    $('#address-summary-text').text(addressText);
    $('#time-summary-text').text(timeText);
}

// updateStatus method is to update the status of the order to the user.
function updateStatus(order){
    switch(order){
        case 0:
            $('#confirmed-icon')[0].classList.add('medium');
            $('#confirmed-icon')[0].classList.add('brown-text');
            $('#shipped-icon')[0].classList.remove('medium');
            $('#shipped-icon')[0].classList.remove('brown-text');
            $('#delivered-icon')[0].classList.remove('medium');
            $('#delivered-icon')[0].classList.remove('brown-text');
            $('#status-text').text('Confirmed');
            break;
        case 1:
            $('#confirmed-icon')[0].classList.remove('medium');
            $('#confirmed-icon')[0].classList.remove('brown-text');
            $('#shipped-icon')[0].classList.add('medium');
            $('#shipped-icon')[0].classList.add('brown-text');
            $('#delivered-icon')[0].classList.remove('medium');
            $('#delivered-icon')[0].classList.remove('brown-text');
            $('#status-text').text('Shipped');
            $('#cancel-button').attr('disabled','true');
            break;
        case 2:
            $('#confirmed-icon')[0].classList.remove('medium');
            $('#confirmed-icon')[0].classList.remove('brown-text');
            $('#shipped-icon')[0].classList.remove('medium');
            $('#shipped-icon')[0].classList.remove('brown-text');
            $('#delivered-icon')[0].classList.add('medium');
            $('#delivered-icon')[0].classList.add('brown-text');
            $('#status-text').text('Delivered');
            $('#cancel-button').attr('disabled','true');
            break;
    }
}