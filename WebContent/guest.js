var currentUser = 'none';
var latinPattern = new RegExp("^[A-Za-zČĆčćĐđŠšŽž]+$");
var usernamePattern =new RegExp("^[A-Za-zČĆčćĐđŠšŽž0-9-_]+$");
$(document).ready(function(){
	
	 $.ajax({
	        type : "get",
	        url : "rest/currentUser",
	        contentType : "application/json",
	        success : function(response){
	           currentUser = response;
	           $('span#usersName').text(currentUser.firstname);
	     	},
			error : function(message) {
				alert(message.responseText);
			}
	  });
	  
	  $.ajax({
	        type : "get",
	        url : "rest/apartments",
	        contentType : "application/json",
	        success : function(response){
	            $('#tableApartmentsGuest tbody').empty();
	            console.log(response);
	            for(var apartment of response){
					if(apartment.apartmentStatus == 'ACTIVE'){
	            	addApartment(apartment);
	            }   
	     	}
	     }
	  });
	 $("#editUserModal").on('show.bs.modal', function(){
			$.ajax({
	        type : "get",
	        url : "rest/currentUser",
	        contentType : "application/json",
	        success : function(response){
	           currentUser = response;
	           $('#inputFirstNameEdit').val(currentUser.firstname);
	           $('#inputLastNameEdit').val(currentUser.lastname);
	           $('#inputUserNameEdit').val(currentUser.username);
	           $('#inputPasswordEdit').val(currentUser.password);
			   $('#genderEdit').val(currentUser.gender);
	           $('#confirmPasswordEdit').val(currentUser.password);
	     	},
			error : function(message) {
				alert(message.responseText);
			}
			});
	  });

	  $('#inputUserNameEdit').on('input', function() { 
	    validateUsername();
	});

	function validateUsername(){
		let username = $('#inputUserNameEdit').val();
		
		if(username.length == 0){
			$('#errorUserNameEdit').text('Morate uneti korisničko ime');
			$('#errorUserNameEdit').show();
			return false;
		}
		
		if(username.length < 6 || username.length > 20){
			$('#errorUserNameEdit').text('Korisničko ime mora sadržati od 6 do 20 karaktera');
			$('#errorUserNameEdit').show();
			return false;
		}
		
		if(!usernamePattern.test(username)){
			$('#errorUserNameEdit').text('Korisničko ime sme da sadrži slova, brojeve i znakove: -,_');
			$('#errorUserNameEdit').show();
			return false;
		}
		
		$('#errorUserNameEdit').text('');
		$('#errorUserNameEdit').hide();
		return true;
	}
	
	$('#inputFirstNameEdit').on('input', function() { 
	    validateFirstname();
	});

	function validateFirstname(){
		let firstname = $('#inputFirstNameEdit').val();
		
		if(firstname.length == 0){
			$('#errorFirstNameEdit').text('Morate uneti ime korisnika');
			$('#errorFirstNameEdit').show();
			return false;
		}
		
		if(!latinPattern.test(firstname)){
			$('#errorFirstNameEdit').text('Ime sme da sadrži samo slova');
			$('#errorFirstNameEdit').show();
			return false;
		}
		
		$('#errorFirstNameEdit').text('');
		$('#errorFirstNameEdit').hide();
		return true;
			
	}
	
	$('#inputLastNameEdit').on('input', function() { 
	    validateLastname();
	});

	function validateLastname(){
		let lastname = $('#inputLastNameEdit').val();
		
		if(lastname.length == 0){
			$('#errorLastNameEdit').text('Morate uneti prezime korisnika');
			$('#errorLastNameEdit').show();
			return false;
		}
		
		if(!latinPattern.test(lastname)){
			$('#errorLastNameEdit').text('Prezime sme da sadrži samo slova');
			$('#errorLastNameEdit').show();
			return false;
		}
		
		$('#errorLastNameEdit').text('');
		$('#errorLastNameEdit').hide();
		return true;
			
	}
	
	$('#inputPasswordEdit').on('input', function() { 
		validatePassword();
	});

	function validatePassword(){
		let password = $('#inputPasswordEdit').val();
		
		if(password.length == 0){
			$('#errorPasswordEdit').text('Morate uneti lozinku');
			$('#errorPasswordEdit').show();
			return false;
		}
		
		if(password.length < 6 || password.length > 20){
			$('#errorPasswordEdit').text('Lozinka mora sadržati od 6 do 20 karaktera');
			$('#errorPasswordEdit').show();
			return false;
		}
		
		if(!usernamePattern.test(password)){
			$('#errorPasswordEdit').text('Lozinka sme da sadrži slova, brojeve i znakove: -,_');
			$('#errorPasswordEdit').show();
			return false;
		}
		
		$('#errorPasswordEdit').text('');
		$('#errorPasswordEdit').hide();
		return true;
	}
	
	$('#confirmPasswordEdit').on('input', function() { 
		validateConfirmPassword();
	});

	function validateConfirmPassword(){
		let confirmPassword = $('#confirmPasswordEdit').val();
		let password = $('#inputPasswordEdit').val();
		if(password != confirmPassword){
			$('#errorConfirmPasswordEdit').text('Unete lozinke se ne poklapaju');
			$('#errorConfirmPasswordEdit').show();
			return false;
		}
		
		$('#errorConfirmPasswordEdit').text('');
		$('#errorConfirmPasswordEdit').hide();
		return true;
	}
	
	function validateEditInputs(){
		return validateUsername() && validateFirstname() && validateLastname() && validatePassword() && validateConfirmPassword();
	}
	
	$('form#formEditUser').submit(function(event) {
		event.preventDefault();
		let username = $('input#inputUserNameEdit').val();
		let firstname = $('input#inputFirstNameEdit').val();
		let lastname = $('input#inputLastNameEdit').val();
		let gender = $('select#genderEdit').val();
		let inputedPassword = $('input#inputPasswordEdit').val();

		if(!validateEditInputs()){
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
			type : 'PUT',
			url : 'rest/editUser',
			data : JSON.stringify(inputedData),
			contentType : 'application/json',
			success : function(data) {
				$('#editUserModal').modal('toggle');
				alert('Podaci uspešno ažurirani');
				location.reload();
			},
			error : function(message) {
				$('#errorReg').text(message.responseText);
				$('#errorReg').show();
				$('#errorReg').delay(4000).fadeOut('slow');
			}
		});

		});
		
		$('a#logout').click(function(event) {
			event.preventDefault();
			$.ajax({
	        type : "POST",
	        url : "rest/logout",
	        contentType : "application/json",
	        success : function(){
	            currentUser = 'none';
				window.location.href="/WebProg/index.html";
	            },
			error : function(message) {
				alert(message.responseText);
			}
			});
	  });
	  
	  function addApartment(apartment){
		var tr = $('<tr class="tableRow"></tr>');	
		var image = $('<td><img class="img-fluid img-thumbnail" alt="Slika" src="'+apartment.imagePaths[0]+'"</img></td>');
		var name = $('<td class="tableData">'+apartment.name+'</td>');
		var roomNumber = $('<td class="tableData">'+apartment.roomNumber+'</td>');
		var guestNumber = $('<td class="tableData">'+apartment.guestNumber+'</td>');
		var location = $('<td class="tableData">'+apartment.location.address.street +'<br>'+
			apartment.location.address.city+ '<br>'+
			apartment.location.address.zipCode+ '<br>'+
			apartment.location.latitude	 + '<br>'+
			apartment.location.longitude +'</td>');
			
		var apartmentType = $('<td class="tableData">'+apartment.apartmentType+'</td>');
		var price = $('<td class="tableData">'+apartment.priceByNight+'</td>');
		var host = $('<td class="tableData">'+apartment.host.firstname + '<br>' + apartment.host.lastname +'</td>');
		tr.append(image).append(name).append(roomNumber).append(guestNumber).append(location).append(apartmentType).append(price).append(host);
		 $('#tableApartmentsGuest tbody').append(tr);
	}
});
