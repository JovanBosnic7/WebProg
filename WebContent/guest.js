var currentUser = 'none';
var latinPattern = new RegExp("^[A-Za-zČĆčćĐđŠšŽž]+$");
var usernamePattern =new RegExp("^[A-Za-zČĆčćĐđŠšŽž0-9-_]+$");
var apartments = [];
$(document).ready(function(){
	$('#showApartments').show();
	$('#showReservations').hide();
	$('#showComments').hide();


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
	            for(var apartment of response){
					if(apartment.apartmentStatus == 'ACTIVE'){
					apartments.push(apartment);
	            	addApartment(apartment);
	            }   
	     	}
	     }
	  });
	  $.ajax({
		type : "get",
		url : "rest/commentsByUser",
		contentType : "application/json",
		success : function(response){
			$('#tableComments tbody').empty();
			console.log(response);
			for(var comment of response){
				if(comment.guest.username == currentUser.username){
				addComment(comment);      
		  }
		}
	 }
	});
	  $.ajax({
		type : "get",
		url : "rest/reservationsGuest",
		contentType : "application/json",
		success : function(response){
			$('#tableReservations tbody').empty();
			console.log(response);
			for(var reservation of response){
				
				if(reservation.guest.username == currentUser.username){
				addReservation(reservation);
			   }
		 }
	 }
	});
	   $('#homePage').click(function(){
        $('#showApartments').show();
		$('#showReservations').hide();
		$('#showComments').hide();
		$.ajax({
	        type : "get",
	        url : "rest/apartmentsActive",
	        contentType : "application/json",
	        success : function(response){
	            $('#tableApartmentsGuest tbody').empty();
	            for(var apartment of response){
					if(apartment.apartmentStatus == 'ACTIVE'){
					apartments.push(apartment);
	            	addApartment(apartment);
	            }   
	     	}
	     }
	  });

      
	}); 
	$('#openReservations').click(function(){
		$.ajax({
			type : "get",
			url : "rest/reservationsGuest",
			contentType : "application/json",
			success : function(response){
				$('#tableReservations tbody').empty();
				console.log(response);
				for(var reservation of response){
					
					if(reservation.guest.username == currentUser.username){
					addReservation(reservation);
				   }
			 }
		 }
		});
        $('#showApartments').hide();
		$('#showReservations').show();
		$('#showComments').hide();
	});
	$('#openComments').click(function(){
        $.ajax({
			type : "get",
			url : "rest/reservationsGuest",
			contentType : "application/json",
			success : function(response){
				$('#tableReservations tbody').empty();
				console.log(response);
				for(var reservation of response){
					
					if(reservation.guest.username == currentUser.username){
					addReservation(reservation);
				   }
			 }
		 }
		});
        $('#showApartments').hide();
        $('#showReservations').hide();
        $('#showComments').show();
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
			  $('#tableApartmentsGuest tbody').empty();
			  for(var apartment of response){
				  if(apartment.apartmentStatus == 'ACTIVE'){
				  addApartment(apartment);
				  }
			  }
			  $('#searchModal').modal('toggle');
		   },
		   error: function(message){
			  $('#tableApartmentsGuest tbody').empty();
			  $('#searchModal').modal('toggle');
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
	$(document).on("click", "a.cancelReservationLink", function(){
		event.preventDefault();
		
		let id = $(this).attr('id');	
		
		$.ajax({
			type : "post",
			url : "rest/cancelReservation",
			data : JSON.stringify ({
				"id" :id
			}),
			contentType : 'application/json',
			success : function(response) {
				alert("Rezervacija sa id: " + id + " je otkazana!");
				$('#tableReservations tbody').empty();
				for(var reservation of response) {
					if(reservation.guest.username == currentUser.username){
					addReservation(reservation);
				}			
			}
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

		$(document).on("click", "a.apartmentClick" , function(event) {
			event.preventDefault();
			var str = $(this).attr('id');
			id_clicked = (str.split("_").pop());
			console.log(id_clicked);
			$.ajax({
			type : "POST",
			contentType : "application/json",
			url : "rest/setApartmentClicked",
			data : JSON.stringify({id : id_clicked}),
			success : function(){
				window.location.href = "apartmentShowGuest.html";
			 },
			error : function(message) {
				alert(message.responseText);
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
		$('#apartmentTypeInput').change(function(event) {
			
			filterAparments();

		});
		$('#cancelFilter').click(function(event) {

			$.ajax({
				type : "get",
				url : "rest/apartments",
				contentType : "application/json",
				success : function(response){
					$('#tableApartmentsGuest tbody').empty();
					for(var apartment of response){
						if(apartment.apartmentStatus == 'ACTIVE'){
						apartments.push(apartment);
						addApartment(apartment);
					}   
				 }
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
function addAmenities(amenities){
	var labela =  $('<label></label>');
	var inputAmenities = $('<input type="checkbox" value="'+amenities.id+'"/>');
	   labela.append(inputAmenities);
	   labela.append(amenities.name);
	 $('#amenitiesInput').append(labela);
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
		var otkazivanje = $('<td class="tableData"><a class="cancelReservationLink" id="' + reservation.id + '" href="#" style="color: white;"><span class="glyphicon glyphicon-remove"></span>Otkazivanje</a></td> ');
		tr.append(id).append(apartment).append(startDate).append(nightsNumber).append(totalPrice).append(guest).append(status).append(otkazivanje);
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
			var otkazivanje = $('<td class="tableData"><a class="cancelReservationLink" id="' + reservation.id + '" href="#" style="color: white;"><span class="glyphicon glyphicon-remove"></span>Otkazivanje</a></td> ');
			tr.append(id).append(apartment).append(startDate).append(nightsNumber).append(totalPrice).append(guest).append(status).append(otkazivanje);
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
			var otkazivanje = $('<td class="tableData">' + " " + '</td> ');
		 tr.append(id).append(apartment).append(startDate).append(nightsNumber).append(totalPrice).append(guest).append(status).append(otkazivanje);
			 $('#tableReservations tbody').append(tr);
		}
	
	
	}
	  function addApartment(apartment){
		var tr = $('<tr class="tableRow"></tr>');
		var imgPath ="placeholder-img.jpg";
		if(apartment.imagePaths.length > 0){
			imgPath=apartment.imagePaths[0];
		}
		var image = $('<td><a href="#" class="apartmentClick" id="apartmentClicked_'+apartment.id+'"><img class="img-fluid img-thumbnail" alt="Slika" src="'+imgPath+'"</img></a></td>');
		var name = $('<td class="tableData">'+apartment.name+'</td>');
		var roomNumber = $('<td class="tableData">'+apartment.roomNumber+'</td>');
		var guestNumber = $('<td class="tableData">'+apartment.guestNumber+'</td>');
		var location = $('<td class="tableData">'+apartment.location.address.street +'<br>'+
			apartment.location.address.city+ '<br>'+
			apartment.location.address.zipCode+ '<br>'+
			apartment.location.latitude	 + '<br>'+
			apartment.location.longitude +'</td>');
			
		var apartmentType = $('<td class="tableData">'+apartment.apartmentType+'</td>');
		var price = $('<td class="tableData" id ="pricebyNightApartment">'+apartment.priceByNight+'</td>');
		var host = $('<td class="tableData">'+apartment.host.firstname + '<br>' + apartment.host.lastname +'</td>');
		tr.append(image).append(name).append(roomNumber).append(guestNumber).append(location).append(apartmentType).append(price).append(host);
		 $('#tableApartmentsGuest tbody').append(tr);
	}
	function sortTable() {
		var table, rows, switching, i, x, y, shouldSwitch;
		table = document.getElementById("tableApartmentsGuest");
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
		table = document.getElementById("tableApartmentsGuest");
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

	  function filterAparments() {
		// Declare variables
		var input, filter, table, tr, td, i, txtValue;
		input = document.getElementById("apartmentTypeInput");
		filter = input.value.toUpperCase();
		table = document.getElementById("tableApartmentsGuest");
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
});
