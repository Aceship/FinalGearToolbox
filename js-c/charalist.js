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
    skillArrayData      :"json/gamedata/SkillArrayData.json",
    trunkSkillData      :"json/gamedata/TrunkSkillData.json",
    skillEffectData     :"json/gamedata/SkillEffectData.json",

    translation         :"json/tl/Common.json"
};

var db = {}
LoadAllJsonObjects(jsonList).then(function(result) {
    db = result
    $.holdReady(false);
});

$(document).ready(function(){
    console.log(db)
    $('#pilotname').bind("enterKey",function(e){
        // console.log()
        CreatePilotList($('#pilotname').val(),true)
        $('#PilotBrowse').modal('hide')
     });
     $('#pilotname').keyup(function(e){
         if(e.keyCode == 13)
         {
             $(this).trigger("enterKey");
         }
     });
    CreatePilotList()
});


function CreatePilotList(input='',isenter=false){
    var hmtlList = []
    var currgirlList = db.girlData.sort((a,b)=>b.GirlQualityType - a.GirlQualityType||(b.EnglishName > a.EnglishName?-1:b.EnglishName<a.EnglishName?+1:0))
    currgirlList= currgirlList.filter(search=>search.ID <7000)
    if(input.value){
        currgirlList = currgirlList.filter(search=> (search.Name + " " + search.EnglishName).toLowerCase().includes(input.value.toLowerCase()))
    }else if(input !=""){
        console.log(input)
        currgirlList = currgirlList.filter(search=> (search.Name + " " + search.EnglishName).toLowerCase().includes(input.toLowerCase()))
        if(currgirlList[0]&&isenter){
            SelectPilot(currgirlList[0].ID)
        }
    }
    currgirlList.forEach(girl => {
            var currgirl = girl
            if(currgirl){
                var currskin = db.girlSkinData.find(search=>search.ID == currgirl.BasicSkin)
                
                hmtlList.push(`
                <button class='fg-clearbutton' style=' display:inline-block;' data-dismiss="modal" onclick="SelectPilot('${girl.ID}')">
                    <div class='fg-chara-lg-container fg-darkfill  fg-thinborder'>
                        <div class='fg-chara-lg-rarity rarity-back-${girl.GirlQualityType}'></div>
                        <div class='fg-chara-lg-potrait fg-bluefill fg-thinborder'>
                            <img class='' style="height:80px" src="./img/equippartsicon/pilot/stagehead/${currskin.StageHeadIcon}.png" title='${girl.Name} ${girl.EnglishName}'> 
                        </div>
                        <div class='fg-chara-lg-class fg-darkfill '>
                            <img class='fg-blackfill' style="height:30px" src="./img/class/${db.translation.class[girl.ProfessionType]}.png" title='${db.translation.class[girl.ProfessionType]}'>  
                        </div>
                        <div class='fg-chara-lg-name'>${girl.Name}</div>
                        <div class='fg-chara-lg-englishname fg-thinborder'>${girl.EnglishName}</div>
                    </div>
                </button>`)
            }

    });
    $("#PilotList").html(hmtlList.join(''))
}

function SelectPilot(ID){
    var currgirl = db.girlData.find(search=> search.ID == ID)
    var currskin = db.girlSkinData.find(search=>search.ID == currgirl.BasicSkin)
    var skillcontent = []

    var currskill = []
    var skillnum = 0
    currskin.SkillArray.forEach(eachskill => {
        var currskilljson = []
        var skillRankReq = eachskill[1]
        var currSkillContent =  db.skillArrayData.filter(search=> search.ArrayID == eachskill[0])
        // console.log(currSkillContent.length)
        currSkillContent.forEach(skillLevel => {
            var currLevelSkillContent = db.trunkSkillData.find(search=>search.ID == skillLevel.SkillID)
            var currLevelSkillDetail = db.skillEffectData.find(search=>search.ID == currLevelSkillContent.SkillActionEffect)
            // console.log(`${currLevelSkillContent.TrunkSkillName} - ${skillLevel.SkillLevel}`)
            // console.log(currLevelSkillContent.PowerNeed)
            // console.log(currLevelSkillContent.TrunkSkillDesc)

            currskilljson.push({skill:currLevelSkillContent,effect:currLevelSkillDetail})
        });
        currskilljson.unlock = eachskill[1]
        skillnum++
        currskill.push(currskilljson)
    });

    console.log(currskill)
    PilotHtml({
        girl:currgirl,
        skin:currskin,
        skill: currskill
    })
    console.log(currgirl)
}


function PilotHtml(json){
    $('#charadetail-portrait').attr("src",`./img/equippartsicon/pilot/squarehead/${json.skin.HeadIcon_square}.png`)
    $('#charadetail-portrait').attr("title",`${json.girl.Name} ${json.girl.EnglishName}`)

    $('#charadetail-name').html(`${json.girl.Name}<br>${json.girl.EnglishName}`)

    $('#charadetail-class-image').attr('src',`./img/class/${db.translation.class[json.girl.ProfessionType]}.png`)
    $('#charadetail-class-image').attr('title',`${db.translation.class[json.girl.ProfessionType]}`)
    $('#charadetail-class-name').html(`${db.translation.class[json.girl.ProfessionType]}`)

    $('#charadetail-rarity-image').attr('src',`./img/extra/rarity/${db.translation.rarity[json.girl.GirlQualityType]}.png`)
    $('#charadetail-rank').html((`<i class='fa fa-star'></i>`).repeat(json.girl.BasicStarLevel)+(`<i class='fa fa-star rank-blank'></i>`).repeat(6-json.girl.BasicStarLevel))

    $('#charadetail-speciality').html(`
    ${db.translation.speciality[json.girl.WeaponRecommend]}<br>
    ${db.translation.speciality[json.girl.ChestRecommend]}<br>
    ${db.translation.speciality[json.girl.LegRecommend]}<br>
    ${db.translation.speciality[json.girl.BagRecommend]}
                `)

    var skillhtml=[]
    json.skill.forEach(skill => {
        console.log(skill)
        var currskillhtml =[]

        currskillhtml.push(`
        Name : ${skill[0].skill.TrunkSkillName}<br>
        Desc :
        `)
        skill.forEach(eachlevel => {
            currskillhtml.push(`${eachlevel.skill.TrunkSkillDesc}`)
        });
        skillhtml.push(currskillhtml.join('<br>'))
    });
    $('#charadetail-skillcontent').html(skillhtml.join('<Br><br><br>'))
    // $("#PilotInfo").html(`
    // <div class='fg-charadetail-container'>
    //     <div class='fg-charadetail-portrait fg-darkfill fg-border'>
    //         <img class='' style="height:300px" src="./img/equippartsicon/pilot/squarehead/${json.skin.HeadIcon_square}.png" title='${json.girl.Name} ${json.girl.EnglishName}'> 
    //     </div>
    //     <div class='fg-charadetail-name'>${json.girl.Name}<br>${json.girl.EnglishName}</div>
    //     <div class='fg-charadetail-class'>
    //         <img class='fg-blackfill' style="height:60px;padding:2px" src="./img/class/${db.translation.class[json.girl.ProfessionType]}.png" title='${db.translation.class[json.girl.ProfessionType]}'>  
    //         <br><div style='border-radius:5px;background:#333;display:inline-block;padding:2px;min-width:90px'>${db.translation.class[json.girl.ProfessionType]}</div>
    //     </div>
    //     <div class='fg-charadetail-rarity'><img class='fg-raritysubbox'style="height:30px;padding:1px" src="./img/extra/rarity/${db.translation.rarity[json.girl.GirlQualityType]}.png"> </div>
    //     <div class='fg-charadetail-speciality'>
    //     <div style='display:inline-block;background:#333;width:170px;border-radius:5px'>
    //         Speciality
    //     </div><br>
    //     <div style='display:inline-block;background:#444;width:160px;border-radius:0px 0px 2px 2px'>
    //         ${db.translation.speciality[json.girl.WeaponRecommend]}<br>
    //         ${db.translation.speciality[json.girl.ChestRecommend]}<br>
    //         ${db.translation.speciality[json.girl.LegRecommend]}<br>
    //         ${db.translation.speciality[json.girl.BagRecommend]}
    //     </div>
    //     </div>
        
    // </div>
    // `)
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