$.holdReady(true);
var db = {};
var d0 = $.getJSON("json/excel/building_data.json",function(data){
        db["manufactformulas"] = data.manufactFormulas;
    });
$.when(d0).then(function(){
    $.holdReady(false);
});

    $(document).ready(function(){
        
    });

    function getJSONdata(type, callback){
        var x = 0;
        var req = $.getJSON("json/tl-"+type+".json");
        req.done(function(response){
            callback(response);
        });
        req.fail(function(response){
            console.log("type: "+type+" fail: ");
            console.log(response);
        });
    }

    function getUrlVars() {
        var vars = {};
        var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
            vars[key] = value;
        });
        return vars;
    }