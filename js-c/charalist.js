$.holdReady(true);
const jsonList = {
    recruitData         :"json/gamedata/RecruitData.json",
    recruitLibraryData  :"json/gamedata/RecruitLibraryData.json",
    tenRecruitData      :"json/gamedata/TenRecruitData.json",
    tenRecruitTimeData  :"json/gamedata/TenRecruitTimeData.json",
    girlData            :"json/gamedata/GirlData.json",
    girlSkinData        :"json/gamedata/GirlSkinData.json",
    widgetData          :"json/gamedata/WidgetData.json",
    suitData            :"json/gamedata/SuitData.json",
    equipLegData        :"json/gamedata/EquipLegData.json",
    itemData            :"json/gamedata/ItemData.json",
};

var db = {}
LoadAllJsonObjects(jsonList).then(function(result) {
    db = result
    $.holdReady(false);
});

$(document).ready(function(){
    console.log(db)
    CreatePilotList()
});
function CreatePilotList(){
    var hmtlList = []
    var currgirlList = db.girlData.sort((a,b)=>b.GirlQualityType - a.GirlQualityType||(b.EnglishName > a.EnglishName?-1:b.EnglishName<a.EnglishName?+1:0))
    db.girlData.forEach(girl => {
        if(girl.ID<7000){
            var currgirl = girl
            if(currgirl){
                var currskin = db.girlSkinData.find(search=>search.ID == currgirl.BasicSkin)
                // if(currgirl.ID<1000){
                //     girlListArray.push({girl:currgirl,skin:currskin})
                // }
                // <img class='fg-blackfill' style="position:absolute;height:20px;left:20px" src="./img/equippartsicon/pilot/head/${currskin.HeadIcon}.png" title='${girl.Name} ${girl.EnglishName}'> 
                hmtlList.push(`
                <div class='fg-border fg-inline rarity-back-${girl.GirlQualityType}' style="padding:0px;margin:3px;text-align:center">
                <div style='height:80px;width:80px'>
                    <img class='fg-blackfill' style="height:80px" src="./img/equippartsicon/pilot/head/${currskin.HeadIcon}.png" title='${girl.Name} ${girl.EnglishName}'> 
                    
                </div>
                <div style=''>${girl.Name}</div>
                <div style='text-align:center'>${girl.EnglishName}</div>
                </div>
                `)
            }
        }
    });
    $("#PilotList").html(hmtlList.join(''))
}
function LoadAllJsonObjects(obj) {
    var result = {}
    
    var promises = Object.entries(obj).map(function(url){
        return $.getJSON(url[1]).then(function(res){
            result[url[0]]=res
        })
    })

    return Promise.all(promises).then(function(){
        return result
    })
}

function formatDate(date) {
    var monthNames = [
      "January", "February", "March",
      "April", "May", "June", "July",
      "August", "September", "October",
      "November", "December"
    ];
  
    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();
  
    return day + ' ' + monthNames[monthIndex] + ' ' + year;
  }

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}