var currentUser = 'none';
$(document).ready(function(){
	
	 $.ajax({
	        type : "get",
	        url : "rest/currentUser",
	        contentType : "application/json",
	        success : function(response){
	           currentUser = response;
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
	            $('#tableApartments tbody').empty();
	            console.log(response);
	            for(var apartment of response){
					if(apartment.apartmentStatus == 'ACTIVE'){
	            	addApartment(apartment);
	            }   
	     	}
	     }
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
		 $('#tableApartments tbody').append(tr);
	}
});
