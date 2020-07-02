$(document).ready(function () {
	$('form#formRegisterUser').submit(function (event) {
	event.preventDefault();
	let username = $('input#inputUserNameReg').val();
	let firstname = $('input#inputFirstNameReg').val();
	let lastname = $('input#inputLastNameReg').val();
	let gender = $('select#genderReg').val();
	let inputedPassword = $('input#inputPasswordReg').val();
	let confirmPassword = $('input#confirmPasswordReg').val();
	if(inputedPassword != confirmPassword)
	{
		alert('Unete lozinke se ne poklapaju');
		return;
	}
	 var inputedData = {
			"username":username,
			"firstname":firstname,
			"lastname":lastname,
			"gender":gender,
			"password" : inputedPassword
		}
		
	$.ajax({
			type: 'POST',
			url: 'rest/register',
			data: JSON.stringify(inputedData),
			contentType: 'application/json',
			success: function () {
				
				alert('Uspesno ste se registrovali.');
				$('#registerModal').modal('toggle');
			}, 
			error: function (message) {
				$('#errorReg').text(message.responseText);
				$('#errorReg').show();
				$('#errorReg').delay(5000).fadeOut('slow');
			}
		});
	})
});