var apartments = [];
$(document).ready(function(){ 
	 $.ajax({
	        type : "get",
	        url : "rest/apartments",
	        contentType : "application/json",
	        success : function(response){
	            $('#tableApartments tbody').empty();
	            console.log(response);
	            for(var apartment of response){
					if(apartment.apartmentStatus == 'ACTIVE'){
					apartments.push(apartment);
	            	addApartment(apartment);
	            }   
	     	}
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
		 $('#tableApartments tbody').append(tr);
}
		
 