var currentUser = 'none';
$(document).ready(function(){ 
	 $.ajax({
	        type : "get",
	        url : "rest/currentUser",
	        contentType : "application/json",
	        success : function(response){
	            alert(response.username); 
	     	}
	  });
});
