var currentUser = 'none';
var currentApartment = 'none';

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
    url : "rest/getApartmentClicked",
    contentType : "application/json",
    success : function(response){
        currentApartment = response;
        $('#apartmentInfo').empty();
            addApartment(response);
        }   
    });

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