$(document).ready(function() {
	 // initialize
	 $('#fair-rb')[0].checked=true;

	$('#feedback-menu-button').sideNav({
      menuWidth: 300, 
      edge: 'left',
      closeOnClick: true, 
      draggable: true
     });

	 //event handling
	 $('#send-feedback-button').click(function(){
	 	sendFeedback();
	 });
});

// sendFeedback method is to get feedback about the order from the user.
function sendFeedback(){
	var feedbackValue;
	var review;
	if($('#bad-rb')[0].checked){
	 feedbackValue = 1;
	}else if($('#fair-rb')[0].checked){
	 feedbackValue = 2;
	}else{
	 feedbackValue = 3;
	}
	review = $('#feedback-text')[0].value;
	Materialize.toast('Feedback sent successfully !', 3000);
	 $('#feedback-text')[0].value='';
}