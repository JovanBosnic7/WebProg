var currentUser = 'none';
var apartments = [];
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

	$('form#filterApartments').submit(function(event){
		  	event.preventDefault();
			var startDate = new Date($('#inputcheckInDate').val());
			var endDate = new Date($('#inputcheckOutDate').val());
			var filteredApartments = apartments;
			if(!isNaN(startDate) && !isNaN(endDate)){
				if(startDate > endDate){
				alert('Datum odlaska ne može biti pre datuma dolaska! Molimo proverite Vaš unos.');
				return;
				}
				filteredApartments = searchByDate(filteredApartments);
			}
			var location = $('#inputLocation').val();
			if(location.length > 0){
				filteredApartments = searchByLocation(filteredApartments);
			}
			
			var startPrice = $('#inputpriceByNightFrom').val();
			var endPrice = $('#inputpriceByNightTill').val();
			startPrice = parseFloat(startPrice);
			endPrice = parseFloat(endPrice);
			if(!isNaN(startPrice) && !isNaN(endPrice)){
				if(startPrice > endPrice){
					alert('Neispravno unet cenovni rang');
					return;
				}
				filteredApartments = searchByPrice(filteredApartments);
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
				filteredApartments = searchByRoomNumber(filteredApartments);
			}
			
			var guestNumber = $('#inputguestNumber').val();
			
			if(guestNumber.length > 0){
				filteredApartments = searchByGuestNumber(filteredApartments);
			}
			
			$('#tableApartments tbody').empty();
			for(var filteredA of filteredApartments){
            	addApartment(filteredA);
            }
			
			$('#searchModal').modal('toggle');
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
	$('form#formAddApratment').submit(function(event){
		event.preventDefault();
		let id = $('input#inputId').val();
		let name = $('#inputName').val();
		let type = $('#apartmentTypeInput').val();
		let rooms = $('#roomNumberInput').val();
		let guests = $('#guestNumberInput').val();
		let city = $('#inputCity').val();
		let street = $('#inputStreet').val();
		let zip = $('#inputZipCode').val();
		let latitude = $('#inputLattitude').val();
		let longitude = $('#inputLongitude').val();
		let price = $('#inputPriceByNight').val();
		var wifi = $('#wifiInput:checked').val();
		var ac = $('#acInput:checked').val();
		var cable = $('#cableInput:checked').val();
		var tv = $('#tvInput:checked').val();
		var heating = $('#heatingInput:checked').val();
		var kitchen = $('#kitchenInput:checked').val();
		var washer = $('#washerInput:checked').val();
		var parking = $('#paringInput:checked').val();
		var elevator = $('#elevatorInput:checked').val();
		var bathroom = $('#bathroomInput:checked').val();
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
			
			"deleted" : 'false'
		 }
		 $.ajax({
			type : 'POST',
			url : 'rest/addApartment',
			data : JSON.stringify(apartment),
			contentType : 'application/json',
			success : function(response) {
				$('#tableApartments tbody').empty();
				for(var a of response) {
					alert(a.name);
					addApartment(a);
				}
				$('#addApartmentModal').modal('toggle');
				alert('Uspešno ste dodali apartman');
				location.reload();
			},
			error : function(message) {
				$('#errorReg').text(message.responseText);
				$('#errorReg').show();
				$('#errorReg').delay(4000).fadeOut('slow');
			}
		});


});
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
    $('#showApartments').show();
    $('#showReservations').hide();
    $('#showComments').hide();
    
    $.ajax({
        type : "get",
        url : "rest/apartments",
        contentType : "application/json",
        success : function(response){
            $('#tableApartments tbody').empty();
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
			addUser(reservation.guest);
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
 
    $('#openUsers').click(function(){
    $('#showUsers').show();
    $('#showApartments').hide();
    $('#showReservations').hide();
    $('#showComments').hide();
});
    
    $('#openApratments').click(function(){
        $('#showUsers').hide();
        $('#showApartments').show();
        $('#showReservations').hide();
        $('#showComments').hide();
       
        }); 
    $('#homePage').click(function(){
        $('#showUsers').hide();
        $('#showApartments').show();
        $('#showReservations').hide();
        $('#showComments').hide();
    });
    $('#openReservations').click(function(){
        $('#showUsers').hide();
        $('#showApartments').hide();
        $('#showReservations').show();
        $('#showComments').hide();
    });
    $('#openComments').click(function(){
        $('#showUsers').hide();
        $('#showApartments').hide();
        $('#showReservations').hide();
        $('#showComments').show();
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
	if(reservation.status == 'CREATED'){
    var tr = $('<tr class="tableRow"></tr>');	
    var id = $('<td class="tableData">'+reservation.id+'</td>');
    var apartment = $('<td class="tableData">'+reservation.apartment.name+'</td>');
    var startDate = $('<td class="tableData">'+reservation.startDate+'</td>');
    var nightsNumber = $('<td class="tableData">'+reservation.nightsNumber +'</td>');     
    var totalPrice = $('<td class="tableData">'+reservation.totalPrice+'</td>');
    var guest = $('<td class="tableData">'+reservation.guest.firstname + '<br>' + reservation.guest.lastname +'</td>');
	var status = $('<td class="tableData">'+reservation.status +'</td>');
	var prihvati = $('<td class="tableData"><a href="#" style="color: white;"><span class="glyphicon glyphicon-ok"></span>Prihvati</a></td> ');
	var odbij = $('<td class="tableData"><a href="#" style="color: white;"><span class="glyphicon glyphicon-remove"></span>Odbij</a></td> ');	
     tr.append(id).append(apartment).append(startDate).append(nightsNumber).append(totalPrice).append(guest).append(status).append(prihvati).append(odbij);
	 $('#tableReservations tbody').append(tr);
	}
	if(reservation.status == 'ACCEPTED' ){
		var tr = $('<tr class="tableRow"></tr>');	
		var id = $('<td class="tableData">'+reservation.id+'</td>');
		var apartment = $('<td class="tableData">'+reservation.apartment.name+'</td>');
		var startDate = $('<td class="tableData">'+reservation.startDate+'</td>');
		var nightsNumber = $('<td class="tableData">'+reservation.nightsNumber +'</td>');     
		var totalPrice = $('<td class="tableData">'+reservation.totalPrice+'</td>');
		var guest = $('<td class="tableData">'+reservation.guest.firstname + '<br>' + reservation.guest.lastname +'</td>');
		var status = $('<td class="tableData">'+reservation.status +'</td>');
		var prihvati = $('<td class="tableData">'+" "+'</td>');		
		var odbij = $('<td class="tableData"><a href="#" style="color: white;"><span class="glyphicon glyphicon-remove"></span>Odbij</a></td> ');	
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

