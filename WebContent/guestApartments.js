var currentUser = 'none';
var currentApartment = 'none';
var enabledDates = [];
var reservations = [];
var currentId = 'none';

$(document).ready(function(){
	enabledDates.push(new Date());
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
    url : "rest/getApartmentClicked",
    contentType : "application/json",
    async:false,
    success : function(response){
        currentApartment = response;
        currentId = Number(response.id);
        $('#apartmentInfo').empty();
            addApartment(response);
        }   
    });

    $('#formAddComment').submit(function(event){
        event.preventDefault();
        var comment = $('#inputComment').val();
        var grade = $('#inputGrade').val();
        var inputedData = {
            comment : comment,
            grade : grade,
            apartment : currentId
        };
        $.ajax({
			type : 'get',
			url : 'rest/giveComment',
			data : inputedData,
			contentType : 'application/json',
			success : function() {
				$('#giveFeedbackModal').modal('toggle');
				alert('Komentar uspešno ostavljen');
			},
			error : function(message) {
				$('#errorCom').text(message.responseText);
				$('#errorCom').show();
				$('#errorCom').delay(4000).fadeOut('slow');
			}
        });
       
    });

    $.ajax({
        type : "get",
        contentType : "application/json",
        url : "rest/reservationsByApartmentGuest",
        data : {id : currentId},
        success : function(response){
            for(res of response){
                reservations.push(res);
            }
            console.log(response);
            if(reservations.length == 0){
                $('#buttonFeedback').prop("disabled",true);
            }
         },
        error : function(message) {
            alert(message.responseText);
        }
        });

    $('#formAddReservation').submit(function(event){
        event.preventDefault();
        var date = $('#inputDatePicker').datepicker('getDate');
        var dateMiliseconds = date.getTime();
        var inputedData ={
            startDate : dateMiliseconds,
            nightsNumber : $('#inputDuration').val(),
            reservationMessage : $('#inputMessage').val()
        };
        $.ajax({
			type : 'POST',
			url : 'rest/createReservation',
			data : JSON.stringify(inputedData),
			contentType : 'application/json',
			success : function() {
				$('#addReservationModal').modal('toggle');
				alert('Rezervacija uspešno kreirana');
				location.reload();
			},
			error : function(message) {
				$('#errorRes').text(message.responseText);
				$('#errorRes').show();
				$('#errorRes').delay(4000).fadeOut('slow');
			}
		});
    });

    $("#addReservationModal").on('show.bs.modal', function(){

        if(Array.isArray(currentApartment.rentDates)){
            for(date of currentApartment.rentDates){
                if(date.available){
                    enabledDates.push(new Date(Number(date.date)));
                }
            }
        }
        
        $('#inputDatePicker').datepicker({
            beforeShowDay: function(date){
                for(edate of enabledDates){
                    var diffTime = Math.abs(date - edate);
                    var diffDays = (diffTime / (1000 * 60 * 60 * 24));
                    var date1 = date.getDate();
                    var date2 = edate.getDate();
                    if ((diffDays < 1) && (date1 == date2))
                  return {
                    enabled: true
                  }
                else
                  return {
                    enabled: false
                  }
                }
            }
        });

    });
    $.ajax({
        type : "get",
        url : "rest/comments",
        contentType : "application/json",
        success : function(response){
            $('#tableComments tbody').empty();
            console.log(response);
            for(var comment of response){
                if(comment.apartment.id == currentApartment.id && comment.visible){
                addComment(comment);
                }
         }
     }
    });

    $('#homepageApartments').click(function(event){
        event.preventDefault();
        window.location.href = "guest.html";
      
	}); 

    function addComment(comment){
		
		var tr = $('<tr class="tableRow"></tr>');	
		var guest = $('<td class="tableData">'+comment.guest.firstname+ '<br>' + comment.guest.lastname + '</td>');
		var apartment = $('<td class="tableData">'+comment.apartment.name+'</td>');
		var content = $('<td class="tableData">'+comment.commentText +'</td>');     
		var grade = $('<td class="tableData">'+comment.grade+'</td>');  	
		 tr.append(guest).append(apartment).append(content).append(grade);
		 $('#tableShowComments tbody').append(tr);
	
}

    function addApartment(apartment){
        var div = $('<div class="flex-container" style="margin-left: 20px;"></div>');
        var divName = $('<div style="margin-left:10px; margin-right:10px;"></div>');
        var nameHeader = $('<h3><span class="label label-default">Naziv apartmana:</span></h3>');
        var name = $('<p>'+ apartment.name +'</p>');
        var divRoomNumber = $('<div style="margin-left:10px; margin-right:10px;"></div>');
        var roomNumberHeader = $('<h3><span class="label label-default">Broj soba:</span></h3>');
        var roomNumber = $('<p>'+apartment.roomNumber+'</p>');
        var divGuestNumber = $('<div style="margin-left:10px; margin-right:10px;"></div>');
        var guestNumberHeader = $('<h3><span class="label label-default">Broj gostiju:</span></h3>');
        var guestNumber = $('<p>'+apartment.guestNumber+'</p>');
        var divLocation =$('<div style="margin-left:10px; margin-right:10px;"></div>');
        var locationHeader = $('<h3><span class="label label-default">Lokacija: </span></h3>');
        var locationApp = $('<p>'+apartment.location.address.street +'<br>'+
        apartment.location.address.city+ '<br>'+
        apartment.location.address.zipCode+ '<br>'+
        apartment.location.latitude	 + '<br>'+
        apartment.location.longitude +'</p>');
        var divType =$('<div style="margin-left:10px; margin-right:10px;"></div>');
        var typeHeader = $('<h3><span class="label label-default">Tip apartmana: </span></h3>');
        var type = $('<p>'+apartment.apartmentType+'</p>');
        var divPrice = $('<div style="margin-left:10px; margin-right:10px;"></div>');
        var priceHeader = $('<h3><span class="label label-default">Cena: </span></h3>');
        var price = $('<p>'+apartment.priceByNight+'</p>');
        var divHost = $('<div style="margin-left:10px; margin-right:10px;"></div>');
        var hostHeader = $('<h3><span class="label label-default">Domaćin: </span></h3>');
        var host = $('<p>'+apartment.host.firstname + ' ' + apartment.host.lastname +'</p>');
		divName.append(nameHeader).append(name);
		divRoomNumber.append(roomNumberHeader).append(roomNumber);
		divGuestNumber.append(guestNumberHeader).append(guestNumber);
		divLocation.append(locationHeader).append(locationApp);
		divType.append(typeHeader).append(type);
		divPrice.append(priceHeader).append(price);
		divHost.append(hostHeader).append(host);
        div.append(divName).append(divRoomNumber).append(divGuestNumber).append(divLocation).append(divType).append(divPrice).append(divHost);
        var titleInfo = $('<h2><span class="label label-default">Informacije</span></h2>');
        $('#apartmentInfo').append(titleInfo);
         $('#apartmentInfo').append(div);
         addAmenitiesInfo(apartment.amenities);
         addImage(apartment.imagePaths);
    }
    
    function addAmenitiesInfo(amenitiesList){
        $('#apartmentAmenities').empty();
        var div = $('<div class="flex-container"></div>');
        if(Array.isArray(amenitiesList)){
            for(amenities of amenitiesList){
                var divOne = $('<div></div>');
                var divName = $('<div style="margin-left:10px; margin-right:10px;"></div>');
                var nameHeader = $('<h3><span class="label label-default">Naziv:</span></h3>');
                var name = $('<p>'+ amenities.name +'</p>');
                var divDescription = $('<div style="margin-left:10px; margin-right:10px;"></div>');
                var descriptionHeader = $('<h3><span class="label label-default">Opis:</span></h3>');
                var description = $('<p>'+amenities.description+'</p>');
                divName.append(nameHeader).append(name);
                divDescription.append(descriptionHeader).append(description);
                divOne.append(divName).append(divDescription);
                div.append(divOne);
            }
            var am = $('<h2><span class="label label-default">Pogodnosti</span></h2>');
            $('#apartmentAmenities').append(am);
            $('#apartmentAmenities').append(div);
        }
    }

    function addImage(images){
        if(Array.isArray(images)){
            for(var i=0 ; i< images.length ; i++) {
                $('<div class="item"><img src="'+images[i]+'"><div class="carousel-caption"></div>   </div>').appendTo('.carousel-inner');
                $('<li data-target="#carousel-example-generic" data-slide-to="'+i+'"></li>').appendTo('.carousel-indicators')
            
              }
              $('.item').first().addClass('active');
              $('.carousel-indicators > li').first().addClass('active');
              $('#carousel-example-generic').carousel();
        }
    }
        

});