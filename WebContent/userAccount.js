var latinPattern = new RegExp("^[A-Za-zČĆčćĐđŠšŽž]+$");
var usernamePattern =new RegExp("^[A-Za-zČĆčćĐđŠšŽž0-9-_]+$");
$(document).ready(function() {

	$('#inputUserNameReg').on('input', function() { 
	    validateUsername();
	});

	function validateUsername(){
		let username = $('#inputUserNameReg').val();
		
		if(username.length == 0){
			$('#errorUserNameReg').text('Morate uneti korisničko ime');
			$('#errorUserNameReg').show();
			return false;
		}
		
		if(username.length < 6 || username.length > 20){
			$('#errorUserNameReg').text('Korisničko ime mora sadržati od 6 do 20 karaktera');
			$('#errorUserNameReg').show();
			return false;
		}
		
		if(!usernamePattern.test(username)){
			$('#errorUserNameReg').text('Korisničko ime sme da sadrži slova, brojeve i znakove: -,_');
			$('#errorUserNameReg').show();
			return false;
		}
		
		$('#errorUserNameReg').text('');
		$('#errorUserNameReg').hide();
		return true;
	}
	
	$('#inputFirstNameReg').on('input', function() { 
	    validateFirstname();
	});

	function validateFirstname(){
		let firstname = $('#inputFirstNameReg').val();
		
		if(firstname.length == 0){
			$('#errorFirstNameReg').text('Morate uneti ime korisnika');
			$('#errorFirstNameReg').show();
			return false;
		}
		
		if(!latinPattern.test(firstname)){
			$('#errorFirstNameReg').text('Ime sme da sadrži samo slova');
			$('#errorFirstNameReg').show();
			return false;
		}
		
		$('#errorFirstNameReg').text('');
		$('#errorFirstNameReg').hide();
		return true;
			
	}
	
	$('#inputLastNameReg').on('input', function() { 
	    validateLastname();
	});

	function validateLastname(){
		let lastname = $('#inputLastNameReg').val();
		
		if(lastname.length == 0){
			$('#errorLastNameReg').text('Morate uneti prezime korisnika');
			$('#errorLastNameReg').show();
			return false;
		}
		
		if(!latinPattern.test(lastname)){
			$('#errorLastNameReg').text('Prezime sme da sadrži samo slova');
			$('#errorLastNameReg').show();
			return false;
		}
		
		$('#errorLastNameReg').text('');
		$('#errorLastNameReg').hide();
		return true;
			
	}
	
	$('#inputPasswordReg').on('input', function() { 
		validatePassword();
	});

	function validatePassword(){
		let password = $('#inputPasswordReg').val();
		
		if(password.length == 0){
			$('#errorPasswordReg').text('Morate uneti lozinku');
			$('#errorPasswordReg').show();
			return false;
		}
		
		if(password.length < 6 || password.length > 20){
			$('#errorPasswordReg').text('Lozinka mora sadržati od 6 do 20 karaktera');
			$('#errorPasswordReg').show();
			return false;
		}
		
		if(!usernamePattern.test(password)){
			$('#errorPasswordReg').text('Lozinka sme da sadrži slova, brojeve i znakove: -,_');
			$('#errorPasswordReg').show();
			return false;
		}
		
		$('#errorPasswordReg').text('');
		$('#errorPasswordReg').hide();
		return true;
	}
	
	$('#confirmPasswordReg').on('input', function() { 
		validateConfirmPassword();
	});

	function validateConfirmPassword(){
		let confirmPassword = $('#confirmPasswordReg').val();
		let password = $('#inputPasswordReg').val();
		if(password != confirmPassword){
			$('#errorConfirmPassword').text('Unete lozinke se ne poklapaju');
			$('#errorConfirmPassword').show();
			return false;
		}
		
		$('#errorConfirmPassword').text('');
		$('#errorConfirmPassword').hide();
		return true;
	}
	
	function validateRegInputs(){
		return validateUsername() && validateFirstname() && validateLastname() && validatePassword() && validateConfirmPassword();
	}
	
	$('form#formRegisterUser').submit(function(event) {
		event.preventDefault();
		let username = $('input#inputUserNameReg').val();
		let firstname = $('input#inputFirstNameReg').val();
		let lastname = $('input#inputLastNameReg').val();
		let gender = $('select#genderReg').val();
		let inputedPassword = $('input#inputPasswordReg').val();

		if(!validateRegInputs()){
			alert('Molimo proverite unete podatke');
			return;
		}
		
		var inputedData = {
			"username" : username,
			"firstname" : firstname,
			"lastname" : lastname,
			"gender" : gender,
			"password" : inputedPassword
		}

		$.ajax({
			type : 'POST',
			url : 'rest/register',
			data : JSON.stringify(inputedData),
			contentType : 'application/json',
			success : function(data) {
				$('#registerModal').modal('toggle');
				var forLogin = {
						"username": data.username,
						"password": data.password
				};
				$.post({
					url : 'rest/login',
					data : JSON.stringify(forLogin),
					contentType : 'application/json',
					success : function(user) {
						if(user.accountType == 'GUEST')
							window.location.href="/WebProg/guest.html";
					},
					error : function(message) {
						alert(message.responseText);
					}
				});
			},
			error : function(message) {
				$('#errorReg').text(message.responseText);
				$('#errorReg').show();
				$('#errorReg').delay(4000).fadeOut('slow');
			}
		});

		});

		$('#inputUserName').on('input', function() { 
			validateUsernameLogin();
		});

		function validateUsernameLogin(){
			let username = $('#inputUserName').val();
			
			if(username.length == 0){
				$('#errorUserNameLogin').text('Morate uneti korisničko ime');
				$('#errorUserNameLogin').show();
				return false;
			}
			
			if(username.length < 6 || username.length > 20){
				$('#errorUserNameLogin').text('Korisničko ime mora sadržati od 6 do 20 karaktera');
				$('#errorUserNameLogin').show();
				return false;
			}
			
			if(!usernamePattern.test(username)){
				$('#errorUserNameLogin').text('Korisničko ime sme da sadrži slova, brojeve i znakove: -,_');
				$('#errorUserNameLogin').show();
				return false;
			}
			
			$('#errorUserNameLogin').text('');
			$('#errorUserNameLogin').hide();
			return true;
		}
		
		$('#inputPassword').on('input', function() { 
			validatePasswordLogin();
		});

		function validatePasswordLogin(){
			let password = $('#inputPassword').val();
			
			if(password.length == 0){
				$('#errorPasswordLogin').text('Morate uneti lozinku');
				$('#errorPasswordLogin').show();
				return false;
			}
			
			if(password.length < 6 || password.length > 20){
				$('#errorPasswordLogin').text('Lozinka mora sadržati od 6 do 20 karaktera');
				$('#errorPasswordLogin').show();
				return false;
			}
			
			if(!usernamePattern.test(password)){
				$('#errorPasswordLogin').text('Lozinka sme da sadrži slova, brojeve i znakove: -,_');
				$('#errorPasswordLogin').show();
				return false;
			}
			
			$('#errorPasswordLogin').text('');
			$('#errorPasswordLogin').hide();
			return true;
		}
		
		function validateLoginInputs(){
			return validateUsernameLogin() && validatePasswordLogin();
		}
		
		$('form#formLoginUser').submit(function(event) {
			event.preventDefault();
			$('#errorLogin').text('');
			let username = $('#inputUserName').val();
			let user_password = $('#inputPassword').val();
			var loginInput = {
				"username" : username,
				"password" : user_password
			}
			if(!validateLoginInputs()){
				alert('Molimo proverite unete podatke');
				return;
			}
			
			$.post({
				url : 'rest/login',
				data : JSON.stringify(loginInput),
				contentType : 'application/json',
				success : function(user) {
					$('#loginModal').modal('toggle');
					if(user.accountType == 'GUEST'){
						window.location.href="/WebProg/guest.html";
					}
					if(user.accountType == 'ADMINISTRATOR'){
						window.location.href="/WebProg/administrator.html";
					}
					if(user.accountType == 'HOST'){
						window.location.href="/WebProg/host.html";
					}
				},
				error : function(message) {
					$('#errorLogin').text(message.responseText);
					$('#errorLogin').show();
					$('#errorLogin').delay(4000).fadeOut('slow');
				}
			});
		});
});