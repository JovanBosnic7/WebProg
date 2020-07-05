var currentUser = 'none';
var latinPatternWS = new RegExp("^[A-Za-zČĆčćĐđŠšŽž ]+$");
var amenitiesToEdit;
$(document).ready(function() {
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

    $('#showUsers').hide();
    $('#showApartments').show();
    $('#showReservations').hide();
	$('#showComments').hide();
	$('#showAmenities').hide();
    
    $.ajax({
        type : "get",
        url : "rest/users",
        contentType : "application/json",
        success : function(response){
            $('#tableUsers tbody').empty();
            console.log(response);
            for(var user of response){
               
                addUser(user);
              
         }
     }
    }); 
    $.ajax({
        type : "get",
        url : "rest/apartments",
        contentType : "application/json",
        success : function(response){
            $('#tableApartments tbody').empty();
            console.log(response);
            for(var apartment of response){
                if(apartment.apartmentStatus == 'ACTIVE'){
                addApartment(apartment);
            	}   
         	}
     	}
 	 });

  $.ajax({
    type : "get",
    url : "rest/reservations",
    contentType : "application/json",
    success : function(response){
        $('#tableReservations tbody').empty();
        console.log(response);
        for(var reservation of response){
            addReservation(reservation);
           
     }
 }
});

$.ajax({
    type : "get",
    url : "rest/comments",
    contentType : "application/json",
    success : function(response){
        $('#tableComments tbody').empty();
        console.log(response);
        for(var comment of response){
            
            addComment(comment);
           
     }
 }
});

loadAmenities();

function loadAmenities(){
	$.ajax({
		type : "get",
		url : "rest/amenities",
		contentType : "application/json",
		success : function(response){
			$('#tableAmenities tbody').empty();
			for(var amenities of response){
				addAmenities(amenities);
		 }
	 }
	});
}

    $('#openUsers').click(function(event){
    $('#showUsers').show();
    $('#showApartments').hide();
    $('#showReservations').hide();
	$('#showComments').hide();
	$('#showAmenities').hide();
});

$(document).on("click", "a.editAmenitiesClick" , function(event) {
	event.preventDefault();
	$('#editAmenitiesModal').modal('show');
	var str = $(this).attr('id');
	id_edit = (str.split("_").pop());
	$.ajax({
	type : "get",
	contentType : "application/json",
	url : "rest/amenitiesById",
	data : {id : id_edit},
	success : function(response){
		amenitiesToEdit = response;
	   $('#categoryEdit').val(response.category);
	   $('#amenitiesNameEdit').val(response.name);
	   $('#amenitiesDescriptionEdit').val(response.description);
	 },
	error : function(message) {
		alert(message.responseText);
	}
	});
});

function validateAmenitiesInputsEdit(){
	return validateAmenitiesNameEdit() && validateAmenitiesDescriptionEdit();
}

$('#amenitiesNameEdit').on('input', function() { 
	validateAmenitiesNameEdit();
});

function validateAmenitiesNameEdit(){
	let name = $('#amenitiesNameEdit').val();
	
	if(name.length == 0){
		$('#errorAmenitiesNameEdit').text('Morate uneti naziv stavke');
		$('#errorAmenitiesNameEdit').show();
		return false;
	}
	if(!latinPatternWS.test(name)){
		$('#errorAmenitiesNameEdit').text('Naziv sme da sadrži samo slova');
		$('#errorAmenitiesNameEdit').show();
		return false;
	}
	$('#errorAmenitiesNameEdit').text('');
	$('#errorAmenitiesNameEdit').hide();
	return true;
}

$('#amenitiesDescriptionEdit').on('input', function() { 
	validateAmenitiesDescriptionEdit();
});

function validateAmenitiesDescriptionEdit(){
	let name = $('#amenitiesDescriptionEdit').val();
	
	if(name.length == 0){
		$('#errorAmenitiesDescriptionEdit').text('Morate uneti opis stavke');
		$('#errorAmenitiesDescriptionEdit').show();
		return false;
	}

	$('#errorAmenitiesDescriptionEdit').text('');
	$('#errorAmenitiesDescriptionEdit').hide();
	return true;
}

$('#formEditAmenities').submit(function(event){
	event.preventDefault();
	let category = $('#categoryEdit').val();
	let name = $('#amenitiesNameEdit').val();
	let description = $('#amenitiesDescriptionEdit').val();

	if(!validateAmenitiesInputsEdit()){
		alert('Molimo proverite unete podatke');
		return;
	}
	
	var inputedData = {
		"id" : amenitiesToEdit.id,
		"category" : category,
		"name" : name,
		"description" : description
	}

	$.ajax({
		type : "PUT",
		url : "rest/editAmenities",
		data : JSON.stringify(inputedData),
		contentType : "application/json",
		success : function(){
			alert('Sadržaj apartmana uspešno izmenjen');
			$('#editAmenitiesModal').modal('toggle');
			loadAmenities();
		 },
		 error : function(message) {
			$('#errorEditAmenities').text(message.responseText);
			$('#errorEditAmenities').show();
			$('#errorEditAmenities').delay(4000).fadeOut('slow');
		}
	 });
	});

$(document).on("click", "a.deleteAmenitiesClick" , function(event) {
	event.preventDefault();
	var str = $(this).attr('id');
	id = (str.split("_").pop());
	var amenities = {"id" : id};
	$.ajax({
		type : "DELETE",
		url : "rest/deleteAmenities",
		data : JSON.stringify(amenities),
		contentType : "application/json",
		success : function(){
			alert('Sadržaj apartmana uspešno izbrisan');
			loadAmenities();
		 },
		 error : function(message){
			 alert(message);
		 }
	 });

});

	function validateAmenitiesInputs(){
		return validateAmenitiesName() && validateAmenitiesDescription();
	}

	$('#amenitiesName').on('input', function() { 
	    validateAmenitiesName();
	});

	function validateAmenitiesName(){
		let name = $('#amenitiesName').val();
		
		if(name.length == 0){
			$('#errorAmenitiesName').text('Morate uneti naziv stavke');
			$('#errorAmenitiesName').show();
			return false;
		}
		if(!latinPatternWS.test(name)){
			$('#errorAmenitiesName').text('Naziv sme da sadrži samo slova');
			$('#errorAmenitiesName').show();
			return false;
		}
		$('#errorAmenitiesName').text('');
		$('#errorAmenitiesName').hide();
		return true;
	}

	$('#amenitiesDescription').on('input', function() { 
	    validateAmenitiesDescription();
	});

	function validateAmenitiesDescription(){
		let name = $('#amenitiesDescription').val();
		
		if(name.length == 0){
			$('#errorAmenitieDescription').text('Morate uneti opis stavke');
			$('#errorAmenitieDescription').show();
			return false;
		}
		if(!latinPatternWS.test(name)){
			$('#errorAmenitieDescription').text('Opis sme da sadrži samo slova');
			$('#errorAmenitieDescription').show();
			return false;
		}
		$('#errorAmenitieDescription').text('');
		$('#errorAmenitieDescription').hide();
		return true;
	}

	$('#formAddAmenities').submit(function(event){
		event.preventDefault();
		let category = $('#categoryAdd').val();
		let name = $('#amenitiesName').val();
		let description = $('#amenitiesDescription').val();

		if(!validateAmenitiesInputs()){
			alert('Molimo proverite unete podatke');
			return;
		}
		
		var inputedData = {
			"id" : -1,
			"category" : category,
			"name" : name,
			"description" : description
		}

		$.ajax({
			type : 'POST',
			url : 'rest/addAmenities',
			data : JSON.stringify(inputedData),
			contentType : 'application/json',
			success : function(data) {
				$('#addAmenitiesModal').modal('toggle');
				alert('Stavka apartmana uspešno dodata');
				loadAmenities();
			},
			error : function(message) {
				$('#errorAddAmenities').text(message.responseText);
				$('#errorAddAmenities').show();
				$('#errorAddAmenities').delay(4000).fadeOut('slow');
			}
		});
	});
    
    $('#openApratments').click(function(event){
		event.preventDefault();
        $('#showUsers').hide();
        $('#showApartments').show();
        $('#showReservations').hide();
        $('#showComments').hide();
		$('#showAmenities').hide();
        }); 
    $('#homePage').click(function(event){
		event.preventDefault();
        $('#showUsers').hide();
        $('#showApartments').show();
        $('#showReservations').hide();
		$('#showComments').hide();
		$('#showAmenities').hide();
    });
    $('#openReservations').click(function(event){
		event.preventDefault();
        $('#showUsers').hide();
        $('#showApartments').hide();
        $('#showReservations').show();
		$('#showComments').hide();
		$('#showAmenities').hide();
    });
    $('#openComments').click(function(event){
		event.preventDefault();
        $('#showUsers').hide();
        $('#showApartments').hide();
        $('#showReservations').hide();
		$('#showComments').show();
		$('#showAmenities').hide();
	});
	$('#openAmenities').click(function(event){
		event.preventDefault();
		$('#showAmenities').show();
        $('#showUsers').hide();
        $('#showApartments').hide();
        $('#showReservations').hide();
        $('#showComments').hide();
    });
});

function addComment(comment){
    var tr = $('<tr class="tableRow"></tr>');	
    var id = $('<td class="tableData">'+comment.id+'</td>');
    var guest = $('<td class="tableData">'+comment.guest.firstname+ '<br>' + comment.guest.lastname + '</td>');
    var apartment = $('<td class="tableData">'+comment.apartment.name+'</td>');
    var content = $('<td class="tableData">'+comment.commentText +'</td>');     
    var grade = $('<td class="tableData">'+comment.grade+'</td>');  
     tr.append(id).append(guest).append(apartment).append(content).append(grade);
     $('#tableComments tbody').append(tr);
}
function addReservation(reservation){
    var tr = $('<tr class="tableRow"></tr>');	
    var id = $('<td class="tableData">'+reservation.id+'</td>');
    var apartment = $('<td class="tableData">'+reservation.apartment.name+'</td>');
    var startDate = $('<td class="tableData">'+reservation.startDate+'</td>');
    var nightsNumber = $('<td class="tableData">'+reservation.nightsNumber +'</td>');     
    var totalPrice = $('<td class="tableData">'+reservation.totalPrice+'</td>');
    var guest = $('<td class="tableData">'+reservation.guest.firstname + '<br>' + reservation.guest.lastname +'</td>');
    var status = $('<td class="tableData">'+reservation.status +'</td>');
     tr.append(id).append(apartment).append(startDate).append(nightsNumber).append(totalPrice).append(guest).append(status);
     $('#tableReservations tbody').append(tr);
}

function addAmenities(amenities){
    var tr = $('<tr class="tableRow"></tr>');	
    var category = $('<td class="tableData">'+amenities.category+'</td>');
    var name = $('<td class="tableData">'+amenities.name+'</td>');
    var description = $('<td class="tableData">'+amenities.description+'</td>');
    var deleting = $('<td class="tableData"><a href="#" class="deleteAmenitiesClick" id="amenitiesDelete_'+amenities.id+'" style="color: white;"><span class="glyphicon glyphicon-trash"></span>Brisanje</a></td> ');
    var editing = $('<td class="tableData"><a href="#" class="editAmenitiesClick" id="amenitiesEdit_'+amenities.id+'" style="color: white;"><span class="glyphicon glyphicon-edit"></span>Izmena</a></td> ');
     tr.append(category).append(name).append(description).append(deleting).append(editing);
     $('#tableAmenities tbody').append(tr);
}

function addUser(user){
    var tr = $('<tr class="tableRow"></tr>');	
    var id = $('<td class="tableData">'+user.id+'</td>');
    var username = $('<td class="tableData">'+user.username+'</td>');
    var password = $('<td class="tableData">'+user.password+'</td>');
    var firstname = $('<td class="tableData">'+user.firstname +'</td>');     
    var lastname = $('<td class="tableData">'+user.lastname+'</td>');
    var gender = $('<td class="tableData">'+user.gender+'</td>');
    var typeOfAccount = $('<td class="tableData">'+user.accountType +'</td>');
    var brisanje = $('<td class="tableData"><a href="#" style="color: white;"><span class="glyphicon glyphicon-trash"></span>Brisanje</a></td> ');
    var izmena = $('<td class="tableData"><a href="#" style="color: white;"><span class="glyphicon glyphicon-edit"></span>Izmena</a></td> ');
    tr.append(id).append(username).append(password).append(firstname).append(lastname).append(gender).append(typeOfAccount).append(brisanje).append(izmena);
     $('#tableUsers tbody').append(tr);
}

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
    var brisanje = $('<td class="tableData"><a href="#" style="color: white;"><span class="glyphicon glyphicon-trash"></span>Brisanje</a></td> ');
    var izmena = $('<td class="tableData"><a href="#" style="color: white;"><span class="glyphicon glyphicon-edit"></span>Izmena</a></td> ');
    tr.append(image).append(name).append(roomNumber).append(guestNumber).append(location).append(apartmentType).append(price).append(host).append(brisanje).append(izmena);
     $('#tableApartments tbody').append(tr);
}

