$(document).ready(function() {

	//initialize
	$('#history-menu-button').sideNav({
      menuWidth: 270, 
      edge: 'left',
      closeOnClick: true, 
      draggable: true
     });


    $('#cancel-button').click(function(){
        $('#cancel-dialog').modal('open');
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
     
});