$(function(){
	$("#submit").click(function(){
		var loginname = $("#loginname").val();
		var password = $("#password").val();
		var params = {
			messageid:"8001",
	    	requestid:generateUUID(),
			loginname:loginname,
			password:password
		};


		$.ajax({
			url : urlPrefix() + "login",
			type : "post",
			data : params,
			dataType : "json",
			success : function(data){
				console.log(data);
				if (data.status == "SUCCESS"){
					sessionStorage.managerid = data.managerid;
					sessionStorage.loginname = data.loginname;

					window.location.href = "index.html";
				}
			}
		});
	});
});
