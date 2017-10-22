$(document).ready(function() {

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

	//method declaration
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
});