
var pmsg = function(cmd,subcmd,userid,ck,obj){
    this.cmd    = cmd;
    this.subcmd =subcmd;
    //this.err = 0 ;
    //this.errmsg = '';
	this.userid = userid;
    //this.passwd = '';
    this.ck= ck ;
    this.val=obj;
};
function isEmpObj(obj){
    if(obj == null) return 0;
    for(var n in obj){return 1}
    return 0;
}
var obj2str = function(_obj){
    if(isEmpObj(_obj) == 0)
        return "{}";
    return JSON.stringify(_obj);
};

var debugalert = function (_msg)
{
	//alert(_msg); 
};
var Send = function(serveradd, msg, cb){
    var str = JSON.stringify(msg);
    $.ajax({
        type:"post",
        url:serveradd,
        dataType:'json',
        // contentType:'application/json;charset=utf-8',
        data:{"input":str},
        // jsonp:'callback',
    
        success:function(data){
            // input:str;
            console.log(data);
	      console.log("success");
            if(cb==undefined)return;
	      cb(0, data);
        },
        error:function(data){
	      console.log("error" + obj2str(data));
            if(cb==undefined)return;
	      cb(1, null);
        }
    })

};


