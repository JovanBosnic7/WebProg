var currentUser = 'none';
var allAmenities = 'none';
var latinPatternws = new RegExp("^[A-Za-zČĆčćĐđŠšŽž0-9 ]+$");
var latinPatterncity = new RegExp("^[A-Za-zČĆčćĐđŠšŽž ]+$");
var latinPatternzip = new RegExp("^[0-9]+$");
var latinPatternlonglat = new RegExp("^[0-9.]+$");
var status = 'none';
var apartments = [];
var guests = [];
var images = [];
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
	$('form#formSearchUser').submit(function(event){
		event.preventDefault();
		var genderOfUser =$('#inputGenderSearch').val();
		var usernameSearch =  $('#inputUsernameSearch').val();
		$.ajax ({
			type : "get",
			url : "rest/searchUsers",
			data : {
				gender : genderOfUser,
				username : usernameSearch,
				hostid : currentUser.id
			},
			contentType : 'application/json',
			success : function(response) {
				$('#tableUsers tbody').empty();
				for(var user of response) {
					
					addUser(user);
				}
			}
		});

	});	
	$('form#formSearchReservations').submit(function(event){
		event.preventDefault();
		
		var usernameSearch =  $('#inputUsernameSearchGuest').val();
		$.ajax ({
			type : "get",
			url : "rest/searchReservations",
			data : {
				
				username : usernameSearch
				
			},
			contentType : 'application/json',
			success : function(response) {
				$('#tableReservations tbody').empty();
				for(var reservation of response) {
					if(reservation.apartment.host.username == currentUser.username){
						addReservation(reservation);
					}	
					
				}
			}
		});

	});	
	
	$('form#filterApartments').submit(function(event){
		event.preventDefault();
	  var startDate = new Date($('#inputcheckInDate').val());
	  var endDate = new Date($('#inputcheckOutDate').val());
	  //var filteredApartments = apartments;
	  if(!isNaN(startDate) && !isNaN(endDate)){
		  if(startDate > endDate){
		  alert('Datum odlaska ne može biti pre datuma dolaska! Molimo proverite Vaš unos.');
		  return;
		  }
		  //filteredApartments = searchByDate(filteredApartments);
		  startDate = startDate.getTime();
		  endDate = endDate.getTime();	
	  }
	  
	  var location = $('#inputLocation').val();
	  /*if(location.length > 0){
		  filteredApartments = searchByLocation(filteredApartments);
	  }*/
	  
	  var startPrice = $('#inputpriceByNightFrom').val();
	  var endPrice = $('#inputpriceByNightTill').val();
	  startPrice = parseFloat(startPrice);
	  endPrice = parseFloat(endPrice);
	  if(!isNaN(startPrice) && !isNaN(endPrice)){
		  if(startPrice > endPrice){
			  alert('Neispravno unet cenovni rang');
			  return;
		  }

		  //filteredApartments = searchByPrice(filteredApartments);
	  }
	  
	  var roomNumberFrom = $('#inputroomNumberFrom').val();
	  var roomNumberTill = $('#inputroomNumberTill').val();
	  roomNumberFrom = parseInt(roomNumberFrom);
	  roomNumberTill = parseInt(roomNumberTill);
	  if(!isNaN(roomNumberFrom) && !isNaN(roomNumberTill)){
		  if(roomNumberFrom > roomNumberTill){
			  alert('Neispravno unet broj soba');
			  return;
		  }
		  //filteredApartments = searchByRoomNumber(filteredApartments);
	  }
	  
	  var guestNumber = $('#inputguestNumber').val();
	  if(guestNumber == '6plus'){
		  guestNumber = 7;
	  }
	  else{
		  guestNumber = parseInt(guestNumber);
	  }
	  /*if(guestNumber.length > 0){
		  filteredApartments = searchByGuestNumber(filteredApartments);
	  }*/

	  var searchParams = {
		  startDate : startDate,
		  endDate : endDate,
		  location : location,
		  startPrice : startPrice,
		  endPrice : endPrice,
		  roomNumberFrom : roomNumberFrom,
		  roomNumberTill : roomNumberTill,
		  guestNumber : guestNumber
	  };
	  
	  $.ajax({
		  type : "POST",
		  url : "rest/searchActiveApartments",
		  contentType : "application/json",
		  data : JSON.stringify(searchParams),
		  success : function(response){
			  $('#tableApartments tbody').empty();
			  $('#tableApartmentsInactive tbody').empty();
			  for(var apartment of response){
				  if(apartment.apartmentStatus == 'ACTIVE'){
				  addApartment(apartment);
				  }
			  }
			$('#searchModal').modal('toggle');
			$('#showUsers').hide();
			$('#showApartmentsInactive').hide();
       		$('#showApartments').show();
       	 	$('#showReservations').hide();
			$('#showComments').hide();
		   },
		   error: function(message){
			  $('#tableApartments tbody').empty();
			  $('#tableApartmentsInactive tbody').empty();
			  $('#searchModal').modal('toggle');
			  $('#showUsers').hide();
			  $('#showApartmentsInactive').hide();
			  $('#showApartments').show();
			  $('#showReservations').hide();
			  $('#showComments').hide();
			  alert(message.responseText);
		   }
	   });
  });
			
			
	  
	  function searchByGuestNumber(apartmentList){
		  return apartmentList.filter(function (a) {
			  	var guestNumber = $('#inputguestNumber').val();
			  	if(guestNumber == '6plus'){
					guestNumber = 7;
				}
				else{
					guestNumber = parseInt(guestNumber);
				}
			  		
				var apGuestNumber = parseInt(a.guestNumber);
			  return  apGuestNumber >= guestNumber;
		  });
	  }
	  
	  function searchByRoomNumber(apartmentList){
		  return apartmentList.filter(function (a) {
			  	var roomNumberFrom = $('#inputroomNumberFrom').val();
				var roomNumberTill = $('#inputroomNumberTill').val();
				roomNumberFrom = parseInt(roomNumberFrom);
				roomNumberTill = parseInt(roomNumberTill);
				var roomNumber = parseInt(a.roomNumber);
			  return roomNumber >= roomNumberFrom && roomNumber <= roomNumberTill;
		  });
	  }
	  
	  function searchByPrice(apartmentList){
		  return apartmentList.filter(function (a) {
			  	var startPrice = $('#inputpriceByNightFrom').val();
				var endPrice = $('#inputpriceByNightTill').val();
				startPrice = parseFloat(startPrice);
				endPrice = parseFloat(endPrice);
				var priceByNight = parseFloat(a.priceByNight);
			  return  priceByNight >= startPrice && priceByNight <= endPrice;
		  });
	  }
	  
	  function searchByLocation(apartmentList){
		  return apartmentList.filter(function (a) {
			  var location = $('#inputLocation').val().toUpperCase();
			  var flagStreet = a.location.address.street.toUpperCase().indexOf(location) > -1;
			  var flagCity = a.location.address.city.toUpperCase().indexOf(location) > -1;
			  var flagZipCode = a.location.address.zipCode.toString().toUpperCase().indexOf(location) > -1;
			  return flagStreet || flagCity || flagZipCode;
		  });
	  }
	  
	  function searchByDate(apartmentList){
		  var startDate = new Date($('#inputcheckInDate').val());
		  var endDate = new Date($('#inputcheckOutDate').val());
		  return apartmentList.filter(function (a) {
            var rentDates = a.rentDates || [];
            var dateList = [];
            for(rentDate of rentDates){
            	let dateNumber = Number(rentDate.date);
            	let checkDate = new Date(dateNumber);
            	if(checkDate >= startDate && checkDate <= endDate && rentDate.available)
            		dateList.push(checkDate);
            }
            return dateList.length > 0;
	  });
	  }

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
		var statusEdit = $('#apartmentStatusEditInput').val();
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
		
		var f = $('#formImageEdit');
		var fileNames=[];
		var inputedFiles = f[0].files;
		for(var i=0; i<inputedFiles.length; i++){
			uploadImage(f[0].files[i]);
			fileNames.push(inputedFiles[i].name);
		}
		
		var paths = fileNames;
		console.log(images);
		for(img of images){
			paths.push(img);
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
			"host" : currentUser,
			"priceByNight" : priceedit,
			"apartmentStatus" : statusEdit,
			"amenities" : amenitiesList,
			"deleted" : 'false',
			"imagePaths" : paths
		 }
		 
		 $.ajax({
			type : 'POST',
			url : 'rest/updateApartmentHost',
			data : JSON.stringify(apartmentedit),
			contentType : 'application/json',
			success : function(response) {
				$('#tableApartments tbody').empty();
				$('#tableApartmentsInactive tbody').empty();
				apartments.length = 0;
				for(var a of response) {
					if(a.host.username == currentUser.username){
						apartments.push(a);
						addApartment(a);
					}
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

	$("#addApartmentModal").on('show.bs.modal', function(){
		$.ajax({
		type : "get",
		url : "rest/amenities",
		contentType : "application/json",
		success : function(response){
			$('#amenitiesInput').empty();
		   allAmenities = response;
		   for(var amenities of response){
			   addAmenities(amenities);
		   }
		 },
		error : function(message) {
			alert(message.responseText);
		}
		});
  });

  function uploadImage(file) {
	$.ajax({
		url : 'rest/imageUpload?name='+file.name,
		type : "POST",
		contentType : "multipart/form-data",
		data : file,
		processData : false
	});
}

	$('form#formAddApratment').submit(function(event){
		event.preventDefault();

		if(!validateAddApartmentInputs()){
			alert('Proverite unesene podatke');
			return;
		}

		var f = $('#formImage');
		var fileNames=[];
		var inputedFiles = f[0].files;
		for(var i=0; i<inputedFiles.length; i++){
			uploadImage(f[0].files[i]);
			fileNames.push(inputedFiles[i].name);
		}
		let id = $('input#inputId').val();
		let name = $('#inputName').val();
		let type = $('#apartmentTypeInput').val();
		let rooms = $('#roomNumberInput').val();
		let guests = $('#guestNumberInput').val();
		let city = $('#inputCity').val();
		let street = $('#inputStreet').val();
		let zip = $('#inputZipCode').val();
		let latitude = $('#inputLatitude').val();
		let longitude = $('#inputLongitude').val();
		let price = $('#inputPriceByNight').val();
		
		var amenitiesIDs = $("#amenitiesInput input:checkbox:checked").map(function(){
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

		var address = {
			"street" : street,
			"city" : city,
			"zipCode": zip
		}
		var location= {
			"latitude":latitude,
			"longitude":longitude,
			"address" : address
		}
		
		console.log(fileNames);
		
		var apartment = {
			"id": id,
			"name": name,
			"apartmentType": type,
			"roomNumber" : rooms,
			"guestNumber": guests,
			"location" : location,
			"host" : currentUser,
			"priceByNight" : price,
			"apartmentStatus" : 'INACTIVE',
			"amenities" : amenitiesList,
			"deleted" : 'false',
			"imagePaths" : fileNames
		 }
		 $.ajax({
			type : 'POST',
			url : 'rest/addApartment',
			data : JSON.stringify(apartment),
			contentType : 'application/json',
			success : function(response) {
				$('#tableApartments tbody').empty();
				apartments.length = 0;
				for(var a of response) {
					if(apartment.host.username == currentUser.username){
					apartments.push(a);
					addApartment(a);
					}
				}
				$('#addApartmentModal').modal('toggle');
				alert('Uspešno ste dodali apartman');
			},
			error : function(message) {
				$('#errorReg').text(message.responseText);
				$('#errorReg').show();
				$('#errorReg').delay(4000).fadeOut('slow');
			}
		});


});


$('#inputId').on('input', function() { 
	if(!validateAddId()){
		$('#buttonRegConf').prop('disabled', true);

	} else {
		$('#buttonRegConf').prop('disabled', false);
	}
});
$('#inputName').on('input', function() { 
	if(!validateAddName()){
		$('#buttonRegConf').prop('disabled', true);

	} else {
		$('#buttonRegConf').prop('disabled', false);
	}
});
$('#inputCity').on('input', function() { 
	if(!validateAddCity()){
		$('#buttonRegConf').prop('disabled', true);

	} else {
		$('#buttonRegConf').prop('disabled', false);
	}
});
$('#inputStreet').on('input', function() { 
	if(!validateAddStreet()){
		$('#buttonRegConf').prop('disabled', true);

	} else {
		$('#buttonRegConf').prop('disabled', false);
	}
});
$('#inputZipCode').on('input', function() { 
	if(!validateAddZipcode()){
		$('#buttonRegConf').prop('disabled', true);

	} else {
		$('#buttonRegConf').prop('disabled', false);
	}
});
$('#inputLatitude').on('input', function() { 
	if(!validateAddLatitude()){
		$('#buttonRegConf').prop('disabled', true);

	} else {
		$('#buttonRegConf').prop('disabled', false);
	}
});
$('#inputLongitude').on('input', function() { 
	if(!validateAddLongitude()){
		$('#buttonRegConf').prop('disabled', true);

	} else {
		$('#buttonRegConf').prop('disabled', false);
	}
});
$('#inputPriceByNight').on('input', function() { 
	if(!validateAddPrice()){
		$('#buttonRegConf').prop('disabled', true);

	} else {
		$('#buttonRegConf').prop('disabled', false);
	}
});
function validateAddId(){
	let editId = $('#inputId').val();
	
	if(editId.length == 0){
		$('#errorInputId').text('Morate uneti id');
		$('#errorInputId').show();
		return false;
	}
	
	if(!latinPatternzip.test(editId)){
		$('#errorInputId').text('Id sme da sadrži samo brojeve');
		$('#errorInputId').show();
		return false;
	}
	
	$('#errorInputId').text('');
	$('#errorInputId').hide();
	return true;
		
}

function validateAddPrice(){
	let editId = $('#inputPriceByNight').val();
	
	if(editId.length == 0){
		$('#errorInputPrice').text('Morate uneti cenu');
		$('#errorInputPrice').show();
		return false;
	}
	
	if(!latinPatternzip.test(editId)){
		$('#errorInputPrice').text('Cena sme da sadrži samo brojeve');
		$('#errorInputPrice').show();
		return false;
	}
	
	$('#errorInputPrice').text('');
	$('#errorInputPrice').hide();
	return true;
		
}
function validateAddLongitude(){
	let editId = $('#inputLongitude').val();
	
	if(editId.length == 0){
		$('#errorInputLongitude').text('Morate uneti geografsku dužinu');
		$('#errorInputLongitude').show();
		return false;
	}
	
	if(!latinPatternlonglat.test(editId)){
		$('#errorInputLongitude').text('Geografska dužina sme da sadrži samo brojeve i .');
		$('#errorInputLongitude').show();
		return false;
	}
	
	$('#errorInputLongitude').text('');
	$('#errorInputLongitude').hide();
	return true;
		
}
function validateAddLatitude(){
	let editId = $('#inputLatitude').val();
	
	if(editId.length == 0){
		$('#errorInputLatitude').text('Morate uneti geografsku širinu');
		$('#errorInputLatitude').show();
		return false;
	}
	
	if(!latinPatternlonglat.test(editId)){
		$('#errorInputLatitude').text('Geografska širina sme da sadrži samo brojeve i .');
		$('#errorInputLatitude').show();
		return false;
	}
	
	$('#errorInputLatitude').text('');
	$('#errorInputLatitude').hide();
	return true;
		
}
function validateAddZipcode(){
	let editId = $('#inputZipCode').val();
	
	if(editId.length == 0){
		$('#errorInputZip').text('Morate uneti poštanski broj');
		$('#errorInputZip').show();
		return false;
	}
	
	if(!latinPatternzip.test(editId)){
		$('#errorInputZip').text('Poštanski broj sme da sadrži samo brojeve');
		$('#errorInputZip').show();
		return false;
	}
	
	$('#errorInputZip').text('');
	$('#errorInputZip').hide();
	return true;
		
}
function validateAddStreet(){
	let editId = $('#inputStreet').val();
	
	if(editId.length == 0){
		$('#errorInputStreet').text('Morate uneti ulicu');
		$('#errorInputStreet').show();
		return false;
	}
	
	if(!latinPatternws.test(editId)){
		$('#errorInputStreet').text('Ulica sme da sadrži samo slova i brojeve');
		$('#errorInputStreet').show();
		return false;
	}
	
	$('#errorInputStreet').text('');
	$('#errorInputStreet').hide();
	return true;
		
}
function validateAddCity(){
	let editId = $('#inputCity').val();
	
	if(editId.length == 0){
		$('#errorInputCity').text('Morate uneti grad');
		$('#errorInputCity').show();
		return false;
	}
	
	if(!latinPatterncity.test(editId)){
		$('#errorInputCity').text('Grad sme da sadrži samo slova');
		$('#errorInputCity').show();
		return false;
	}
	
	$('#errorInputCity').text('');
	$('#errorinputEditCity').hide();
	return true;
		
}
function validateAddName(){
	let editId = $('#inputName').val();
	
	if(editId.length == 0){
		$('#errorInputName').text('Morate uneti naziv apartmana');
		$('#errorInputName').show();
		return false;
	}
	
	if(!latinPatternws.test(editId)){
		$('#errorInputName').text('Naziv sme da sadrži samo slova i brojeve');
		$('#errorInputName').show();
		return false;
	}
	
	$('#errorInputName').text('');
	$('#errorInputName').hide();
	return true;
		
}
function validateAddApartmentInputs(){
	return validateAddId() &&  validateAddName() && validateAddCity() && validateAddStreet() + validateAddZipcode() && validateAddLatitude() && validateAddLongitude() && validateAddPrice();
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
			success : function() {
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
	$('#showApartmentsInactive').hide();
    $('#showApartments').show();
    $('#showReservations').hide();
    $('#showComments').hide();
    
    $.ajax({
        type : "get",
        url : "rest/apartmentsByHost",
        contentType : "application/json",
        success : function(response){
			$('#tableApartments tbody').empty();
			$('#tableApartmentsInactive tbody').empty();
			apartments.length = 0;
            for(var apartment of response){
                if(apartment.host.username == currentUser.username){			
                	apartments.push(apartment); 
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
				if(reservation.apartment.host.username == currentUser.username){
					addReservation(reservation);
				}
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
			if(comment.apartment.host.username == currentUser.username){
            addComment(comment);      
	  }
	}
 }
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
			$('#tableApartmentsInactive tbody').empty();
			for(var a of response) {
				if(a.host.username == currentUser.username){
					apartments.push(a);
					addApartment(a);
			}
		}			
		}
	});
	});
	$(document).on("click", "a.setVisibilityFalse", function(){
		event.preventDefault();
		let id = $(this).attr('id');	
		$.ajax({
			type : "post",
			url : "rest/removeComment",
			data : JSON.stringify ({
				"id" :id
			}),
			contentType : 'application/json',
			success : function(response) {
				alert("Komentar sa id: " + id + " je uklonjen iz prikaza apartmana!");
					$('#tableComments tbody').empty();
					console.log(response);
					for(var comment of response){
						if(comment.apartment.host.username == currentUser.username){
						addComment(comment); 
				}
			}			
			}
		});
		});
		$(document).on("click", "a.setVisibilityTrue", function(){
			event.preventDefault();
			let id = $(this).attr('id');	
			$.ajax({
				type : "post",
				url : "rest/addComment",
				data : JSON.stringify ({
					"id" :id
				}),
				contentType : 'application/json',
				success : function(response) {
					alert("Komentar sa id: " + id + " je dodat u prikaz apartmana!");
					$('#tableComments tbody').empty();
					console.log(response);
					for(var comment of response){
						if(comment.apartment.host.username == currentUser.username){
						addComment(comment);      
				  }
				}
				}
			});
			});
	$(document).on("click", "a.declineReservationLink", function(){
		event.preventDefault();
		let id = $(this).attr('id');	
		$.ajax({
			type : "post",
			url : "rest/declineReservation",
			data : JSON.stringify ({
				"id" :id
			}),
			contentType : 'application/json',
			success : function(response) {
				alert("Rezervacija sa id: " + id + " je odbijena!");
				$('#tableReservations tbody').empty();
				for(var reservation of response) {
					if(reservation.apartment.host.username == currentUser.username){
					addReservation(reservation);
				}			
			}
		}
	});
});	
$(document).on("click", "a.acceptReservationLink", function(){
	event.preventDefault();
	let id = $(this).attr('id');	
	$.ajax({
		type : "post",
		url : "rest/acceptReservation",
		data : JSON.stringify ({
			"id" :id
		}),
		contentType : 'application/json',
		success : function(response) {
			alert("Rezervacija sa id: " + id + " je prihvaćena!");
			$('#tableReservations tbody').empty();
			for(var reservation of response) {
				if(reservation.apartment.host.username == currentUser.username){
				addReservation(reservation);
			}			
		}
	}
});
});
 //EDIT APARTMENT *******************************************************
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
			
			if(Array.isArray(response.imagePaths)){
				for(im of response.imagePaths){
					images.push(im);
				}
			}	

			var	editApartment= response;
			var amenitiesListApartment = editApartment.amenities;
			
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
			$('#apartmentStatusEditInput').val(editApartment.apartmentStatus);

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

	
	
	
 
    $('#openUsers').click(function(){
    $('#showUsers').show();
	$('#showApartments').hide();
	$('#showApartmentsInactive').hide();
    $('#showReservations').hide();
	$('#showComments').hide();
	$('#inputGenderSearch').val("MALE");
	$('#inputUsernameSearch').val("");
	$.ajax({
		type : "get",
		url : "rest/addUsersHost",
		data : {
			hostid : currentUser.id
		},
		contentType : "application/json",
		success : function(response){
			$('#tableUsers tbody').empty();
			console.log(response);
			for(var user of response){
				addUser(user);      
		}
	 }
	});

});
    
    $('#openApratments').click(function(){
        $('#showUsers').hide();
        $('#showApartments').show();
		$('#showReservations').hide();
		$('#showApartmentsInactive').hide();
		$('#showComments').hide();
		$.ajax({
			type : "get",
			url : "rest/apartmentsByHost",
			contentType : "application/json",
			success : function(response){
				$('#tableApartments tbody').empty();
				$('#tableApartmentsInactive tbody').empty();
				apartments.length = 0;
				for(var apartment of response){
					if(apartment.host.username == currentUser.username){			
						apartments.push(apartment); 
						addApartment(apartment);
					}   
				}	
		 }
	  });

	  $('#openApratmentsInactive').click(function(){
        $('#showUsers').hide();
		$('#showApartments').hide();
		$('#showApartmentsInactive').show();
        $('#showReservations').hide();
		$('#showComments').hide();
		$.ajax({
			type : "get",
			url : "rest/apartmentsByHost",
			contentType : "application/json",
			success : function(response){
				$('#tableApartments tbody').empty();
				$('#tableApartmentsInactive tbody').empty();
				apartments.length = 0;
				for(var apartment of response){
					if(apartment.host.username == currentUser.username){			
						apartments.push(apartment); 
						addApartment(apartment);
					}   
				}	
		 }
	  });
       
        }); 
    $('#homePage').click(function(){
        $('#showUsers').hide();
		$('#showApartments').show();
		$('#showApartmentsInactive').hide();
        $('#showReservations').hide();
		$('#showComments').hide();
		$.ajax({
			type : "get",
			url : "rest/apartmentsByHost",
			contentType : "application/json",
			success : function(response){
				$('#tableApartments tbody').empty();
				$('#tableApartmentsInactive tbody').empty();
				apartments.length = 0;
				for(var apartment of response){
					if(apartment.host.username == currentUser.username){			
						apartments.push(apartment); 
						addApartment(apartment);
					}   
				}	
		 }
	  });
    });
    $('#openReservations').click(function(){
        $('#showUsers').hide();
		$('#showApartments').hide();
		$('#showApartmentsInactive').hide();
        $('#showReservations').show();
		$('#showComments').hide();
		$('#inputUsernameSearchGuest').val("");
		$.ajax({
			type : "get",
			url : "rest/reservations",
			contentType : "application/json",
			success : function(response){
				$('#tableReservations tbody').empty();
				console.log(response);
				for(var reservation of response){
						if(reservation.apartment.host.username == currentUser.username){
							addReservation(reservation);
						}
					}    
			 }
		});
	});
	$('#sortApartments').click(function(event) {
			
		sortTable();

	});
	$('#sortApartmentsDescending').click(function(event) {
		
		sortTableDescending();

	});
	$('#sortReservations').click(function(event) {
			
		sortReservations();

	});
	$('#sortReservationsDescending').click(function(event) {
		
		sortReservationsDescending();

	});
	$('#statusInput').change(function(event) {
			
		filterReservations();

	});
	$('#cancelFilter').click(function(event) {
			
		$.ajax({
			type : "get",
			url : "rest/reservations",
			contentType : "application/json",
			success : function(response){
				$('#tableReservations tbody').empty();
				console.log(response);
				for(var reservation of response){
						if(reservation.apartment.host.username == currentUser.username){
							addReservation(reservation);
						}
					}    
			 }
		});
	});
	$('#apartmentTypeFilter').change(function(event) {
			
		filterAparments();

	});
	$('#apartmentStatusFilter').change(function(event) {
			
		filterAparmentsStatus();

	});

	$.ajax({
		type : "get",
		url : "rest/amenities",
		contentType : "application/json",
		success : function(response){
			$('#amenitiesInputFilter').empty();
		   allAmenities = response;
		   for(var amenities of response){
			   addAmenitiesFilter(amenities);
		   }
		 },
		error : function(message) {
			alert(message.responseText);
		}
		});

	$('#cancelFilterApartment').click(function(event) {
			
		$.ajax({
			type : "get",
			url : "rest/apartments",
			contentType : "application/json",
			success : function(response){
				$('#tableApartments tbody').empty();
				console.log(response);
				for(var apartment of response){
					
					addApartment(apartment);
					 
				 }
			 }
		  });

		});
    $('#openComments').click(function(){
        $('#showUsers').hide();
		$('#showApartments').hide();
		$('#showApartmentsInactive').hide();
        $('#showReservations').hide();
		$('#showComments').show();
		$.ajax({
			type : "get",
			url : "rest/comments",
			contentType : "application/json",
			success : function(response){
				$('#tableComments tbody').empty();
				console.log(response);
				for(var comment of response){
					if(comment.apartment.host.username == currentUser.username){
					addComment(comment);      
			  }
			}
		 }
		});
    });


 });
 });
 

function filterReservations() {
	// Declare variables
	var input, filter, table, tr, td, i, txtValue;
	input = document.getElementById("statusInput");
	filter = input.value.toUpperCase();
	table = document.getElementById("tableReservations");
	tr = table.getElementsByTagName("tr");
  
	// Loop through all table rows, and hide those who don't match the search query
	for (i = 0; i < tr.length; i++) {
	  td = tr[i].getElementsByTagName("td")[6];
	  if (td) {
		txtValue = td.textContent || td.innerText;
		if (txtValue.toUpperCase().indexOf(filter) > -1) {
		  tr[i].style.display = "";
		} else {
		  tr[i].style.display = "none";
		}
	  }
	}
  }
  function filterAparments() {
	// Declare variables
	var input, filter, table, tr, td, i, txtValue;
	input = document.getElementById("apartmentTypeFilter");
	filter = input.value.toUpperCase();
	table = document.getElementById("tableApartments");
	tr = table.getElementsByTagName("tr");
  
	// Loop through all table rows, and hide those who don't match the search query
	for (i = 0; i < tr.length; i++) {
	  td = tr[i].getElementsByTagName("td")[5];
	  if (td) {
		txtValue = td.textContent || td.innerText;
		if (txtValue.toUpperCase().indexOf(filter) > -1) {
		  tr[i].style.display = "";
		} else {
		  tr[i].style.display = "none";
		}
	  }
	}
  }
  function filterAparmentsStatus() {
	// Declare variables
	var input, filter, table, tr, td, i, txtValue;
	input = document.getElementById("apartmentStatusFilter");
	filter = input.value.toUpperCase();
	table = document.getElementById("tableApartments");
	tr = table.getElementsByTagName("tr");
  
	// Loop through all table rows, and hide those who don't match the search query
	for (i = 0; i < tr.length; i++) {
	  td = tr[i].getElementsByTagName("td")[7];
	  if (td) {
		txtValue = td.textContent || td.innerText;
		if (txtValue.toUpperCase().indexOf(filter) > -1) {
		  tr[i].style.display = "";
		} else {
		  tr[i].style.display = "none";
		}
	  }
	}
  }


function addAmenities(amenities){
	var labela =  $('<label></label>');
	var inputAmenities = $('<input type="checkbox" value="'+amenities.id+'"/>');
	   labela.append(inputAmenities);
	   labela.append(amenities.name);
	 $('#amenitiesInput').append(labela);
}
function addAmenitiesFilter(amenities){
	var labela =  $('<label></label>');
	var inputAmenities = $('<input type="checkbox" value="'+amenities.id+'"/>');
	   labela.append(inputAmenities);
	   labela.append(amenities.name);
	 $('#amenitiesInputFilter').append(labela);
}
function addAmenitiesEdit(amenities){
	var labela =  $('<label></label>');
	var inputAmenities = $('<input type="checkbox" value="'+amenities.id+'"/>');
	   labela.append(inputAmenities);
	   labela.append(amenities.name);
	 $('#amenitiesInputEdit').append(labela);
}

function addComment(comment){
	if(comment.visible) {
	var tr = $('<tr class="tableRow"></tr>');	
	var id = $('<td class="tableData">'+comment.id+'</td>');
	var guest = $('<td class="tableData">'+comment.guest.firstname+ '<br>' + comment.guest.lastname + '</td>');
	var apartment = $('<td class="tableData">'+comment.apartment.name+'</td>');
	var content = $('<td class="tableData">'+comment.commentText +'</td>');     
	var grade = $('<td class="tableData">'+comment.grade+'</td>');  
	var visibility = $('<td class="tableData"><a class="setVisibilityFalse" id="' + comment.id + '" href="#" style="color: white;"><span class="glyphicon glyphicon-remove"></span>Ukloni komentar</a></td> ');
	 tr.append(id).append(guest).append(apartment).append(content).append(grade).append(visibility);
	 $('#tableComments tbody').append(tr);
}else if(!comment.visible){
		var tr = $('<tr class="tableRow"></tr>');	
		var id = $('<td class="tableData">'+comment.id+'</td>');
		var guest = $('<td class="tableData">'+comment.guest.firstname+ '<br>' + comment.guest.lastname + '</td>');
		var apartment = $('<td class="tableData">'+comment.apartment.name+'</td>');
		var content = $('<td class="tableData">'+comment.commentText +'</td>');     
		var grade = $('<td class="tableData">'+comment.grade+'</td>');  
		var visibility = $('<td class="tableData"><a class="setVisibilityTrue" id="' + comment.id + '" href="#" style="color: white;"><span class="glyphicon glyphicon-plus"></span>Prikaži komentar</a></td> ');
		 tr.append(id).append(guest).append(apartment).append(content).append(grade).append(visibility);
		 $('#tableComments tbody').append(tr);
}

}
function addReservation(reservation){
	if(reservation.status == 'CREATED'){
    var tr = $('<tr class="tableRow"></tr>');	
    var id = $('<td class="tableData">'+reservation.id+'</td>');
    var apartment = $('<td class="tableData">'+reservation.apartment.name+'</td>');
    var startDate = $('<td class="tableData">'+reservation.startDate+'</td>');
    var nightsNumber = $('<td class="tableData">'+reservation.nightsNumber +'</td>');     
    var totalPrice = $('<td class="tableData">'+reservation.totalPrice+'</td>');
    var guest = $('<td class="tableData">'+reservation.guest.firstname + '<br>' + reservation.guest.lastname +'</td>');
	var status = $('<td class="tableData">'+reservation.status +'</td>');
	var prihvati = $('<td class="tableData"><a class="acceptReservationLink" id="' + reservation.id + '" href="#" style="color: white;"><span class="glyphicon glyphicon-ok"></span>Prihvati</a></td> ');
	var odbij = $('<td class="tableData"><a class="declineReservationLink" id="' + reservation.id + '" href="#" style="color: white;"><span class="glyphicon glyphicon-remove"></span>Odbij</a></td> ');	
	tr.append(id).append(apartment).append(startDate).append(nightsNumber).append(totalPrice).append(guest).append(status).append(prihvati).append(odbij);
	 $('#tableReservations tbody').append(tr);
	}
	else if(reservation.status == 'ACCEPTED' ){
		var tr = $('<tr class="tableRow"></tr>');	
		var id = $('<td class="tableData">'+reservation.id+'</td>');
		var apartment = $('<td class="tableData">'+reservation.apartment.name+'</td>');
		var startDate = $('<td class="tableData">'+reservation.startDate+'</td>');
		var nightsNumber = $('<td class="tableData">'+reservation.nightsNumber +'</td>');     
		var totalPrice = $('<td class="tableData">'+reservation.totalPrice+'</td>');
		var guest = $('<td class="tableData">'+reservation.guest.firstname + '<br>' + reservation.guest.lastname +'</td>');
		var status = $('<td class="tableData">'+reservation.status +'</td>');
		var prihvati = $('<td class="tableData">'+" "+'</td>');		
		var odbij = $('<td class="tableData"><a class="declineReservationLink" id="' + reservation.id + '" href="#" style="color: white;"><span class="glyphicon glyphicon-remove"></span>Odbij</a></td> ');	
		 tr.append(id).append(apartment).append(startDate).append(nightsNumber).append(totalPrice).append(guest).append(status).append(prihvati).append(odbij);
		 $('#tableReservations tbody').append(tr);
	}else {
		var tr = $('<tr class="tableRow"></tr>');	
		var id = $('<td class="tableData">'+reservation.id+'</td>');
		var apartment = $('<td class="tableData">'+reservation.apartment.name+'</td>');
		var startDate = $('<td class="tableData">'+reservation.startDate+'</td>');
		var nightsNumber = $('<td class="tableData">'+reservation.nightsNumber +'</td>');     
		var totalPrice = $('<td class="tableData">'+reservation.totalPrice+'</td>');
		var guest = $('<td class="tableData">'+reservation.guest.firstname + '<br>' + reservation.guest.lastname +'</td>');
		var status = $('<td class="tableData">'+reservation.status +'</td>');
		var prihvati = $('<td class="tableData">'+" "+'</td>');		
		var odbij = $('<td class="tableData">' + " " + '</td> ');	
		 tr.append(id).append(apartment).append(startDate).append(nightsNumber).append(totalPrice).append(guest).append(status).append(prihvati).append(odbij);
		 $('#tableReservations tbody').append(tr);
	}


}
function addUser(user){
	
	var tr = $('<tr class="tableRow"></tr>');	
    var id = $('<td class="tableData">'+user.id+'</td>');
    var username = $('<td class="tableData">'+user.username+'</td>');
    var firstname = $('<td class="tableData">'+user.firstname +'</td>');     
    var lastname = $('<td class="tableData">'+user.lastname+'</td>');
    var gender = $('<td class="tableData">'+user.gender+'</td>');
    var typeOfAccount = $('<td class="tableData">'+user.accountType +'</td>');
    tr.append(id).append(username).append(firstname).append(lastname).append(gender).append(typeOfAccount);
     $('#tableUsers tbody').append(tr);	
	}
    

function addApartment(apartment){
    var tr = $('<tr class="tableRow"></tr>');
    var imgPath ="placeholder-img.jpg";
	if(apartment.imagePaths.length > 0){
		imgPath=apartment.imagePaths[0];
	}
	var image = $('<td><img class="img-fluid img-thumbnail" alt="Slika" src="'+imgPath+'"</img></td>');
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
	var status = $('<td class="tableData">'+apartment.apartmentStatus+'</td>');
    var host = $('<td class="tableData">'+apartment.host.firstname + '<br>' + apartment.host.lastname +'</td>');
    var brisanje = $('<td class="tableData"><a class="deleteApartmentLink" id="' + apartment.id + '" style="color: white; cursor:pointer;"><span class="glyphicon glyphicon-trash"></span>Brisanje</a></td> ');
    var izmena = $('<td class="tableData"><a  class="editApartmentLink" data-target="#editApartmentModal" data-toggle="modal" style="color: white;" id="' + apartment.id + '"><span class="glyphicon glyphicon-edit"></span>Izmena</a></td> ');
    tr.append(image).append(name).append(roomNumber).append(guestNumber).append(location).append(apartmentType).append(price).append(status).append(host).append(brisanje).append(izmena);
	if(apartment.apartmentStatus == 'ACTIVE'){
		$('#tableApartments tbody').append(tr);
	}
	else{
		$('#tableApartmentsInactive tbody').append(tr);
	}
}
function sortTable() {
	var table, rows, switching, i, x, y, shouldSwitch;
	table = document.getElementById("tableApartments");
	switching = true;
	/*Make a loop that will continue until
	no switching has been done:*/
	while (switching) {
	  //start by saying: no switching is done:
	  switching = false;
	  rows = table.rows;
	  /*Loop through all table rows (except the
	  first, which contains table headers):*/
	  for (i = 1; i < (rows.length - 1); i++) {
		//start by saying there should be no switching:
		shouldSwitch = false;
		/*Get the two elements you want to compare,
		one from current row and one from the next:*/
		x = rows[i].getElementsByTagName("td")[6];
		y = rows[i + 1].getElementsByTagName("td")[6];
		//check if the two rows should switch place:
		if (Number(x.innerHTML) > Number(y.innerHTML)) {
		  //if so, mark as a switch and break the loop:
		  shouldSwitch = true;
		  break;
		}
	  }
	  if (shouldSwitch) {
		/*If a switch has been marked, make the switch
		and mark that a switch has been done:*/
		rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
		switching = true;
	  }
	}
  }
  function sortTableDescending() {
	var table, rows, switching, i, x, y, shouldSwitch;
	table = document.getElementById("tableApartments");
	switching = true;
	/*Make a loop that will continue until
	no switching has been done:*/
	while (switching) {
	  //start by saying: no switching is done:
	  switching = false;
	  rows = table.rows;
	  /*Loop through all table rows (except the
	  first, which contains table headers):*/
	  for (i = 1; i < (rows.length - 1); i++) {
		//start by saying there should be no switching:
		shouldSwitch = false;
		/*Get the two elements you want to compare,
		one from current row and one from the next:*/
		x = rows[i].getElementsByTagName("td")[6];
		y = rows[i + 1].getElementsByTagName("td")[6];
		//check if the two rows should switch place:
		if (Number(x.innerHTML) < Number(y.innerHTML)) {
		  //if so, mark as a switch and break the loop:
		  shouldSwitch = true;
		  break;
		}
	  }
	  if (shouldSwitch) {
		/*If a switch has been marked, make the switch
		and mark that a switch has been done:*/
		rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
		switching = true;
	  }
	}
  }
  function sortReservations() {
	var table, rows, switching, i, x, y, shouldSwitch;
	table = document.getElementById("tableReservations");
	switching = true;
	/*Make a loop that will continue until
	no switching has been done:*/
	while (switching) {
	  //start by saying: no switching is done:
	  switching = false;
	  rows = table.rows;
	  /*Loop through all table rows (except the
	  first, which contains table headers):*/
	  for (i = 1; i < (rows.length - 1); i++) {
		//start by saying there should be no switching:
		shouldSwitch = false;
		/*Get the two elements you want to compare,
		one from current row and one from the next:*/
		x = rows[i].getElementsByTagName("td")[4];
		y = rows[i + 1].getElementsByTagName("td")[4];
		//check if the two rows should switch place:
		if (Number(x.innerHTML) > Number(y.innerHTML)) {
		  //if so, mark as a switch and break the loop:
		  shouldSwitch = true;
		  break;
		}
	  }
	  if (shouldSwitch) {
		/*If a switch has been marked, make the switch
		and mark that a switch has been done:*/
		rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
		switching = true;
	  }
	}
  }
  
  function sortReservationsDescending() {
	var table, rows, switching, i, x, y, shouldSwitch;
	table = document.getElementById("tableReservations");
	switching = true;
	/*Make a loop that will continue until
	no switching has been done:*/
	while (switching) {
	  //start by saying: no switching is done:
	  switching = false;
	  rows = table.rows;
	  /*Loop through all table rows (except the
	  first, which contains table headers):*/
	  for (i = 1; i < (rows.length - 1); i++) {
		//start by saying there should be no switching:
		shouldSwitch = false;
		/*Get the two elements you want to compare,
		one from current row and one from the next:*/
		x = rows[i].getElementsByTagName("td")[4];
		y = rows[i + 1].getElementsByTagName("td")[4];
		//check if the two rows should switch place:
		if (Number(x.innerHTML) < Number(y.innerHTML)) {
		  //if so, mark as a switch and break the loop:
		  shouldSwitch = true;
		  break;
		}
	  }
	  if (shouldSwitch) {
		/*If a switch has been marked, make the switch
		and mark that a switch has been done:*/
		rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
		switching = true;
	  }
	}
  } 

