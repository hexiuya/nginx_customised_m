function generateUUID(){
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x7|0x8)).toString(16);
    });
    return uuid;
}

function urlPrefix(){
	return "crm-m/"
}

function getManagerId(){
    var managerid = sessionStorage.managerid;
    return managerid ;
}

function getLonginName(){
    var loginname = sessionStorage.loginname;
    return loginname ;
}

function clearStorage(){
	sessionStorage.managerid = null;
	sessionStorage.loginname = null;
}