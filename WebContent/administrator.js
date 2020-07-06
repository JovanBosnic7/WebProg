var currentUser = 'none';
var latinPatternWS = new RegExp("^[A-Za-zČĆčćĐđŠšŽž ]+$");
var amenitiesToEdit;
var allAmenities = 'none';
var latinPatternws = new RegExp("^[A-Za-zČĆčćĐđŠšŽž0-9 ]+$");
var latinPatterncity = new RegExp("^[A-Za-zČĆčćĐđŠšŽž ]+$");
var latinPatternzip = new RegExp("^[0-9]+$");
var latinPatternlonglat = new RegExp("^[0-9.]+$");
var apartments = [];
var status = 'none';
var host = 'none';
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
	$(document).on("click", "a.deleteApartmentLink", function(){
		event.preventDefault();
		let id = $(this).attr('id');	
		$.ajax({
			type : "post",
			url : "rest/deleteApartment",
			data : JSON.stringify ({
				"id" :id
			}),
			contentType : 'application/json',
			success : function(response) {
				alert("Aparmtan sa id: " + id + " je obrisan!");
				$('#tableApartments tbody').empty();
				for(var a of response) {
					addApartment(a);
				}			
			}
		});
		});

$(document).on("click", "a.editApartmentLink", function(){
			event.preventDefault();	
			let id = $(this).attr('id');
			
				$.ajax({
				type : "get",
				url : "rest/amenities",
				contentType : "application/json",
				success : function(response){
					$('#amenitiesInputEdit').empty();
				   allAmenities = response;
				   for(var amenities of response){
					   addAmenitiesEdit(amenities);
				   }
				 },
				error : function(message) {
					alert(message.responseText);
				}
				});
	
			$.ajax({
				type : "post",
				url : "rest/editApartment",
				data : JSON.stringify ({
					"id" :id
				}),
				contentType : 'application/json',
				success : function(response) {				
				var	editApartment= response;
				var amenitiesListApartment = editApartment.amenities;
				status = editApartment.apartmentStatus;
				host = editApartment.host;
				$('#inputEditId').val(editApartment.id);
				$('#inputEditName').val(editApartment.name);
				$('#apartmentTypeEditInput').val(editApartment.apartmentType);
				$('#roomNumberEditInput').val(editApartment.roomNumber);
				$('#guestNumberEditInput').val(editApartment.guestNumber);
				$('#inputEditCity').val(editApartment.location.address.city);
				$('#inputEditStreet').val(editApartment.location.address.street);		
				$('#inputEditZipCode').val(editApartment.location.address.zipCode);
				$('#inputEditLatitude').val(editApartment.location.latitude);	
				$('#inputEditLongitude').val(editApartment.location.longitude);
				$('#inputEditPriceByNight').val(editApartment.priceByNight);
	
	
				if(Array.isArray(amenitiesListApartment)){
					for(var am of amenitiesListApartment){
						var id = am.id;
						for(amen of $("#amenitiesInputEdit input:checkbox")){
							var tmp = $(amen).val();
							if (tmp == id){
								$(amen).prop("checked", true);
							}
						}
					}
				}
				
				}
			});
		});
		$('form#formEditApratment').submit(function(event){
			event.preventDefault();
			
			
			let idedit = $('input#inputEditId').val();
			let nameedit = $('#inputEditName').val();
			let typeedit = $('#apartmentTypeEditInput').val();
			let roomsedit = $('#roomNumberEditInput').val();
			let guestsedit = $('#guestNumberEditInput').val();
			let cityedit = $('#inputEditCity').val();
			let streetedit = $('#inputEditStreet').val();
			let zipedit = $('#inputEditZipCode').val();
			let latitudeedit = $('#inputEditLatitude').val();
			let longitudeedit = $('#inputEditLongitude').val();
			let priceedit = $('#inputEditPriceByNight').val();
			
			var amenitiesIDs = $("#amenitiesInputEdit input:checkbox:checked").map(function(){
				return $(this).val();
			  }).get();
			  console.log(amenitiesIDs);
	
			var amenitiesList = [];
	
			for(amenId of amenitiesIDs){
				for(amen of allAmenities){
					if(amenId == amen.id){
						amenitiesList.push(amen);
					}
				}
			}
	
			
			var addressedit = {
				"street" : streetedit,
				"city" : cityedit,
				"zipCode": zipedit
			}
			var locationedit= {
				"latitude":latitudeedit,
				"longitude":longitudeedit,
				"address" : addressedit
			}
			
			var apartmentedit = {
				"id": idedit,
				"name": nameedit,
				"apartmentType": typeedit,
				"roomNumber" : roomsedit,
				"guestNumber": guestsedit,
				"location" : locationedit,
				"priceByNight" : priceedit,
				"host" : host,
				"apartmentStatus" : status,
				"amenities" : amenitiesList,
				"deleted" : 'false'
			 }
			 
			 $.ajax({
				type : 'POST',
				url : 'rest/updateApartment',
				data : JSON.stringify(apartmentedit),
				contentType : 'application/json',
				success : function(response) {
					$('#tableApartments tbody').empty();
					apartments.length = 0;
					for(var a of response) { 
							apartments.push(a);
							addApartment(a);
						
					}
					$('#editApartmentModal').modal('toggle');
					alert('Uspešno ste izmenili apartman');
					location.reload();
				},
				error : function(message) {
					$('#errorReg').text(message.responseText);
					$('#errorReg').show();
					$('#errorReg').delay(4000).fadeOut('slow');
				}
			});
		});
		$('#inputEditName').on('input', function() { 
			if(!validateEditName()){
				$('#buttonEditApartment').prop('disabled', true);
	
			} else {
				$('#buttonEditApartment').prop('disabled', false);
			}
		});
		$('#inputEditCity').on('input', function() { 
			if(!validateEditCity()){
				$('#buttonEditApartment').prop('disabled', true);
	
			} else {
				$('#buttonEditApartment').prop('disabled', false);
			}
		});
		$('#inputEditStreet').on('input', function() { 
			if(!validateEditStreet()){
				$('#buttonEditApartment').prop('disabled', true);
	
			} else {
				$('#buttonEditApartment').prop('disabled', false);
			}
		});
		$('#inputEditZipCode').on('input', function() { 
			if(!validateEditZipcode()){
				$('#buttonEditApartment').prop('disabled', true);
	
			} else {
				$('#buttonEditApartment').prop('disabled', false);
			}
		});
		$('#inputEditLatitude').on('input', function() { 
			if(!validateEditLatitude()){
				$('#buttonEditApartment').prop('disabled', true);
	
			} else {
				$('#buttonEditApartment').prop('disabled', false);
			}
		});
		$('#inputEditLongitude').on('input', function() { 
			if(!validateEditLongitude()){
				$('#buttonEditApartment').prop('disabled', true);
	
			} else {
				$('#buttonEditApartment').prop('disabled', false);
			}
		});
		$('#inputEditPriceByNight').on('input', function() { 
			if(!validateEditPrice()){
				$('#buttonEditApartment').prop('disabled', true);
	
			} else {
				$('#buttonEditApartment').prop('disabled', false);
			}
		});
	
		function validateEditPrice(){
			let editId = $('#inputEditPriceByNight').val();
			
			if(editId.length == 0){
				$('#errorinputEditPrice').text('Morate uneti cenu');
				$('#errorinputEditPrice').show();
				return false;
			}
			
			if(!latinPatternzip.test(editId)){
				$('#errorinputEditPrice').text('Cena sme da sadrži samo brojeve');
				$('#errorinputEditPrice').show();
				return false;
			}
			
			$('#errorinputEditPrice').text('');
			$('#errorinputEditPrice').hide();
			return true;
				
		}
		function validateEditLongitude(){
			let editId = $('#inputEditLongitude').val();
			
			if(editId.length == 0){
				$('#errorinputEditLongitude').text('Morate uneti geografsku dužinu');
				$('#errorinputEditLongitude').show();
				return false;
			}
			
			if(!latinPatternlonglat.test(editId)){
				$('#errorinputEditLongitude').text('Geografska dužina sme da sadrži samo brojeve i .');
				$('#errorinputEditLongitude').show();
				return false;
			}
			
			$('#errorinputEditLongitude').text('');
			$('#errorinputEditLongitude').hide();
			return true;
				
		}
		function validateEditLatitude(){
			let editId = $('#inputEditLatitude').val();
			
			if(editId.length == 0){
				$('#errorinputEditLatitude').text('Morate uneti geografsku širinu');
				$('#errorinputEditLatitude').show();
				return false;
			}
			
			if(!latinPatternlonglat.test(editId)){
				$('#errorinputEditLatitude').text('Geografska širina sme da sadrži samo brojeve i .');
				$('#errorinputEditLatitude').show();
				return false;
			}
			
			$('#errorinputEditLatitude').text('');
			$('#errorinputEditLatitude').hide();
			return true;
				
		}
		function validateEditZipcode(){
			let editId = $('#inputEditZipCode').val();
			
			if(editId.length == 0){
				$('#errorinputEditZipCode').text('Morate uneti poštanski broj');
				$('#errorinputEditZipCode').show();
				return false;
			}
			
			if(!latinPatternzip.test(editId)){
				$('#errorinputEditZipCode').text('Poštanski broj sme da sadrži samo brojeve');
				$('#errorinputEditZipCode').show();
				return false;
			}
			
			$('#errorinputEditZipCode').text('');
			$('#errorinputEditZipCode').hide();
			return true;
				
		}
		function validateEditStreet(){
			let editId = $('#inputEditStreet').val();
			
			if(editId.length == 0){
				$('#errorinputEditStreet').text('Morate uneti ulicu');
				$('#errorinputEditStreet').show();
				return false;
			}
			
			if(!latinPatternws.test(editId)){
				$('#errorinputEditStreet').text('Ulica sme da sadrži samo slova i brojeve');
				$('#errorinputEditStreet').show();
				return false;
			}
			
			$('#errorinputEditCity').text('');
			$('#errorinputEditCity').hide();
			return true;
				
		}
		function validateEditCity(){
			let editId = $('#inputEditCity').val();
			
			if(editId.length == 0){
				$('#errorinputEditCity').text('Morate uneti grad');
				$('#errorinputEditCity').show();
				return false;
			}
			
			if(!latinPatterncity.test(editId)){
				$('#errorinputEditCity').text('Grad sme da sadrži samo slova');
				$('#errorinputEditCity').show();
				return false;
			}
			
			$('#errorinputEditCity').text('');
			$('#errorinputEditCity').hide();
			return true;
				
		}
		function validateEditName(){
			let editId = $('#inputEditName').val();
			
			if(editId.length == 0){
				$('#errorinputEditName').text('Morate uneti naziv apartmana');
				$('#errorinputEditName').show();
				return false;
			}
			
			if(!latinPatternws.test(editId)){
				$('#errorinputEditName').text('Naziv sme da sadrži samo slova i brojeve');
				$('#errorinputEditName').show();
				return false;
			}
			
			$('#errorinputEditName').text('');
			$('#errorinputEditName').hide();
			return true;
				
		}
		function validateEditApartmentInputs(){
			return validateEditName() && validateEditCity() && validateEditStreet() + validateEditZipcode() && validateEditLatitude() && validateEditLongitude() && validateEditPrice();
		}
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
		
		$('form#formRegisterHost').submit(function(event) {
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
				"password" : inputedPassword,
			}
	
			$.ajax({
				type : 'POST',
				url : 'rest/registerHost',
				data : JSON.stringify(inputedData),
				contentType : 'application/json',
				success : function(data) {
					$('#addHostModal').modal('toggle');
					$('#showUsers').show();
					$('#showApartments').hide();
					$('#showReservations').hide();
					$('#showComments').hide();
					$('#showAmenities').hide();
					addUser(data);
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


function addAmenitiesEdit(amenities){
	var labela =  $('<label></label>');
	var inputAmenities = $('<input type="checkbox" value="'+amenities.id+'"/>');
	   labela.append(inputAmenities);
	   labela.append(amenities.name);
	 $('#amenitiesInputEdit').append(labela);
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
    tr.append(id).append(username).append(password).append(firstname).append(lastname).append(gender).append(typeOfAccount);
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
	var brisanje = $('<td class="tableData"><a class="deleteApartmentLink" id="' + apartment.id + '" style="color: white; cursor:pointer;"><span class="glyphicon glyphicon-trash"></span>Brisanje</a></td> ');
    var izmena = $('<td class="tableData"><a  class="editApartmentLink" data-target="#editApartmentModal" data-toggle="modal" style="color: white;" id="' + apartment.id + '"><span class="glyphicon glyphicon-edit"></span>Izmena</a></td> ');
    tr.append(image).append(name).append(roomNumber).append(guestNumber).append(location).append(apartmentType).append(price).append(host).append(brisanje).append(izmena);
     $('#tableApartments tbody').append(tr);
}

