$(document).ready(function() {
    $('#showUsers').hide();
    $('#showApartments').show();
    $('#showReservations').hide();
    $('#showComments').hide();
    
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