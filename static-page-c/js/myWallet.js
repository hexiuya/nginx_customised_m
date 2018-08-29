
var url = "jsonTest/publisher.json?adc=1&cde=1&333";

var messageid = "5001";
var requestid = generateUUID();
var clientid = getCustomerId();

$(document).ready(function() {
	createData();
} );

function resetTable(){
	$('#example').DataTable().ajax.reload();
}

function createData(){
	var table = $('#example').DataTable( {
			    	"bPaginate": true, //??页
			        "processing": true,
			        "serverSide": true,
			        "bFilter": false, //????
			        "bLengthChange": false, //选????页??
			        "iDisplayLength" : 10,// 每页??示????   
			        "bSort": false, //????
			        "bInfo": true,//展示页????息
			        //"ordering": false,
			        
			        "ajax": {

			            "url": urlSubscriberPrefix() + "ownacc",
			            "contentType" : 'application/json',
			            "data": function ( d ) {
			            	  
			            	  d.messageid = messageid;
			            	  d.requestid = requestid;
			            	  d.clientid = clientid;
			            	  console.log(d);
						      return JSON.stringify( d );
						  },
			            
			            "type": "post"
			        },
			        
			        /*
			        "ajax": {
			        	"url": "jsonTest/publisher.json?" + new Date(),
						//"url": url,
						"type": "get"
			        },
                    */
			        "columns": [
			            { "data": "pnsgid" , "class": "center" },
			            { "data": "pnsid" , "class": "center" },
			            { "data": "margin" , "class": "center" },
			            { "data": "freemargin" , "class": "center" },
			            { "data": "equity" , "class": "center" , "render": function(data, type, row) {
				                var equity = row.margin + row.freemargin;
				                return equity;

				            }
				        },
			            { "data": "operate" , "class": "center" , "render": function(data, type, row) {
			            	    var operate = '<a href="javascript:void(0);" onclick="deposit(this)" style="cursor:pointer">deposit</a>' ;
			            	    operate += '/' ;
			            	    operate += '<a href="javascript:void(0);" onclick="withdraw(this)" style="cursor:pointer">withdraw</a>' ;
				                return   operate;
				            }
				        }
			        ],
			        language: {
			        	"sInfoFiltered": ""
			        },
			        /*
			        language: {
				        "sProcessing": "??????...",
				        "sLengthMenu": "??示 _MENU_ ??????",
				        "sZeroRecords": "没??匹??????",
				        "sInfo": "??示?? _START_ ?? _END_ ?????????? _TOTAL_ ??",
				        "sInfoEmpty": "??示?? 0 ?? 0 ?????????? 0 ??",
				        "sInfoFiltered": "(?? _MAX_ ??????????)",
				        "sInfoPostFix": "",
				        "sSearch": "????:",
				        "sUrl": "",
				        "sEmptyTable": "????????为??",
				        "sLoadingRecords": "??????...",
				        "sInfoThousands": ",",
				        "oPaginate": {
				            "sFirst": "??页",
				            "sPrevious": "??页",
				            "sNext": "??页",
				            "sLast": "末页"
				        },
				        "oAria": {
				            "sSortAscending": ": ?????????写???",
				            "sSortDescending": ": ?越??????写???"
				        }
				    }, */

				    "pagingType": "full_numbers_no_ellipses"
			    } );
				//var table = $('#example').DataTable(); 

				/*$('#example tbody').on('click', 'tr', function () { 
					
					var data = table.row(this).data(); //??取???械?????

				} ); */

        return table;
}

var apiMethod ;
var apiMessageId = "";
var apiDeposit = "cDeposit";
var apiDepositMsgId = "0x0017";
var apiWithdraw = "cWithdraw";
var apiWithdrawMsgId = "0x0019";
function deposit(object){
	apiMethod = apiDeposit;
	apiMessageId = apiDepositMsgId;
	openDailog(object);

}

function withdraw(object){
	apiMethod = apiWithdraw;
	apiMessageId = apiWithdrawMsgId;
	openDailog(object);
}

function openDailog(object){
	console.log(object);
	var td = $(object).parent();
	console.log(td);
	var tr = td.parent();
	console.log(tr);
	var table = $('#example').DataTable();
		var data = table.row(tr).data(); //??取???械?????
		console.log(data);

		var pnsid = $("<input type='hidden' name='pnsid' value=" + data.pnsid +"></input>");

		var pnsgid = $("<input type='hidden' name='pnsgid' value=" + data.pnsgid +"></input>");

		var form = $("#form");

		form.append(pnsid,pnsgid);

		$('#myModal').modal({
			backdrop: 'static',//点击遮罩层不关闭模态框
			keyboard: true//按esc键，退出模态框
		})
	}


	$("#submit").on("click",function(){

		var pnsid = $("input[name='pnsid']").val();

		var pnsgid = $("input[name='pnsgid']").val();

		var quantity = $("input[name='quantity']").val();

		var clientid = getCustomerId();

		var username = getUserName();

		var params = {
			messageid:apiMessageId,
	    	requestid:generateUUID(),
			pnsid:pnsid,
			pnsgid:pnsgid,
			quantity:quantity,
			clientid:clientid
		};

		$.ajax({
			url:urlPrefix() + apiMethod,
			xhrFields: {

				withCredentials: true

			},
			data:JSON.stringify( params ),
			contentType : 'application/json',
			type: 'POST',
			success:function(data){
				console.log(data);

				BootstrapDialog.show({  
					closable: true, 
					message: data.status,
					buttons: [{
						label: 'Close the dialog',
						action: function(dialogRef){
							dialogRef.close();   //总是能关闭弹出框
							if("SUCCESS" == data.status){
								closeModal();

								resetTable();

							}
						}
					}]
				});
			},
			error : function(xhr,textStatus,errorThrown){
				　　if (xhr.status == 401) {
						BootstrapDialog.show({  
							closable: true, 
							message: "please login",
							buttons: [{
								label: 'Close the dialog',
								action: function(dialogRef){
									dialogRef.close();   //总是能关闭弹出框
									window.location.href = "login.html";
								}
							}]
					});
			} else{
					// 调用外部的error
					error && error(xhr,textStatus,errorThrown);
			}
		}
	});

});

function closeModal(){
	$('#myModal').modal('hide');//????模态??
	//???毡???
	$("#myModal :input").not(":button, :submit, :reset, :hidden, :checkbox, :radio").val(""); 
	$("#myModal :input").removeAttr("checked").remove("selected");  
}



function createNewWallet(){
	$('#walletModal').modal({
		backdrop: 'static',//点击遮罩层不关闭模态框
		keyboard: true//按esc键，退出模态框
	})
}

$("#submitNewWallet").on("click",function(){

	var pnsid = $("#wallet_pnsid").val();

	var pnsgid = $("#wallet_pnsgid").val();		

	var clientid = getCustomerId();

	var username = getUserName();

	var params = {
		messageid:"0x0021",
		requestid:generateUUID(),
		pnsid:pnsid,
		pnsgid:pnsgid,
		clientid:clientid
	};

	$.ajax({
		url:urlPrefix() + "cSaveCacc",
		xhrFields: {

			withCredentials: true

		},
		data:JSON.stringify( params ),
		type: 'POST',
		contentType : 'application/json',
		success:function(data){
			console.log(data);

			BootstrapDialog.show({  
				closable: true, 
				message: data.status,
				buttons: [{
					label: 'Close the dialog',
					action: function(dialogRef){
						dialogRef.close();   //总是能关闭弹出框
						if("SUCCESS" == data.status){
							
							closeWalletModal();

							resetTable();
						}
					}
				}]
			});
		},
		error : function(xhr,textStatus,errorThrown){
			if (xhr.status == 401) {
				BootstrapDialog.show({  
					closable: true, 
					message: "please login",
					buttons: [{
						label: 'Close the dialog',
						action: function(dialogRef){
							dialogRef.close();   //总是能关闭弹出框
							window.location.href = "login.html";
						}
					}]
				});
			} else{
			    // 调用外部的error
			    error && error(xhr,textStatus,errorThrown);
			}
		}
	});


});

function closeWalletModal(){
	$('#walletModal').modal('hide');//????模态??
	//???毡???
	$("#walletModal :input").not(":button, :submit, :reset, :hidden, :checkbox, :radio").val(""); 
	$("#walletModal :input").removeAttr("checked").remove("selected");  
}