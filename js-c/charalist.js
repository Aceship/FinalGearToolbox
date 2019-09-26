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
    machineArmorData    :"json/gamedata/MachineArmorData.json",
    equipLegData        :"json/gamedata/EquipLegData.json",
    itemData            :"json/gamedata/ItemData.json",
    skillArrayData      :"json/gamedata/SkillArrayData.json",
    trunkSkillData      :"json/gamedata/TrunkSkillData.json",
    skillEffectData     :"json/gamedata/SkillEffectData.json",

    translation         :"json/tl/Common.json",
    tlSkill             :"json/tl/tl-skill.json"
};

var db = {}
LoadAllJsonObjects(jsonList).then(function(result) {
    db = result
    $.holdReady(false);
});

$(document).ready(function(){
    console.log(db)
    $('#PilotBrowse').on('shown.bs.modal', function () {
        $('#pilotname').focus();
    })  
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
    SelectPilot(1)
});


function CreatePilotList(input='',isenter=false){
    var hmtlList = []
    var currgirlList = db.girlData.sort((a,b)=>b.GirlQualityType - a.GirlQualityType||(b.EnglishName > a.EnglishName?-1:b.EnglishName<a.EnglishName?+1:0))
    currgirlList= currgirlList.filter(search=>search.ID <7000)
    if(input.value){
        currgirlList = currgirlList.filter(search=> (search.Name + " " + search.EnglishName).toLowerCase().includes(input.value.toLowerCase()))
    }else if(input !=""){
        // console.log(input)
        // console.log(input.value)
        if(input.value!="")currgirlList = currgirlList.filter(search=> (search.Name + " " + search.EnglishName).toLowerCase().includes(input.toLowerCase()))
        
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
    var suit = db.suitData.find(search=> search.ID == currgirl.SuitID )
    var armorData = suit?db.machineArmorData.find(search=>search.ID == suit.MachineArmorID):undefined
    var currSuitData = suit?db.equipLegData.find(search=>search.ID ==currskin.MachineArmorModel1[1]):undefined
    var skillcontent = []

    var currskill = []
    var skillnum = 0
    currskin.SkillArray.forEach(eachskill => {
        var currskilljson = []
        var skillRankReq = eachskill[1]
        var currSkillContent =  db.skillArrayData.filter(search=> search.ArrayID == eachskill[0])
        // console.log(currSkillContent.length)
        console.log(currSkillContent)
        currSkillContent.forEach(skillLevel => {
            var currLevelSkillContent = db.trunkSkillData.find(search=>search.ID == skillLevel.SkillID)
            console.log(currLevelSkillContent)
            if(currLevelSkillContent){
                var currLevelSkillDetail = db.skillEffectData.find(search=>search.ID == currLevelSkillContent.SkillActionEffect)
                // console.log(`${currLevelSkillContent.TrunkSkillName} - ${skillLevel.SkillLevel}`)
                // console.log(currLevelSkillContent.PowerNeed)
                // console.log(currLevelSkillContent.TrunkSkillDesc)

                currskilljson.push({skill:currLevelSkillContent,effect:currLevelSkillDetail})
            }
        });
        currskilljson.unlock = eachskill[1]
        skillnum++
        currskill.push(currskilljson)
    });

    // console.log(currskill)
    PilotHtml({
        girl:currgirl,
        skin:currskin,
        skill: currskill,
        suit : {info:suit,details:armorData,data:currSuitData}
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


    if(json.suit.info&&json.suit.details){
        $(`#charadetail-mech`).html(`
        <img id='charadetail-class-image'class='' style="width:256px;padding:2px" src="./img/equippartsicon/preview/leg/${json.suit.data.preview1}.png" title='${json.suit.info.SuitName}'>
        `)
    }else $(`#charadetail-mech`).html(``)
    var skillhtml=[]
    var skillnum = 0
    json.skill.forEach(skill => {
        // console.log(skill)
        var currskillhtml =[]

        var skillname = skill[0].skill.TrunkSkillName
        if(db.tlSkill[skill[0].skill.ID]){
            var currtl = db.tlSkill[skill[0].skill.ID]
            if(currtl.isUp=="True"&& currtl.name&&currtl.oname==skillname){
                skillname = currtl.name
            }else if (currtl.gname&&currtl.oname==skillname)skillname = currtl.gname
        }

       

        currskillhtml.push(`
        <div class='fg-charadetail-skill-container fg-corner fg-bluefill'>
            <div class='fg-charadetail-skill-icon fg-border'><img id='charadetail-class-image'class='fg-blackfill' style="height:100px;padding:2px" src="./img/equippartsicon/skill/${skill[0].skill.TrunkSkillIcon}.png" title='none'></div>
            <div class='fg-charadetail-skill-name'>${skillname}</div>
            <div class='fg-charadetail-skill-unlock'>Unlock at Rank : ${skill.unlock}</div>
            <div class='fg-charadetail-skill-description' style='margin:4px'>
                <ul class="nav nav-tabs fg-border" style='margin-bottom:5px'id="myTab" role="tablist" >
                    <li class="nav-item">
                        <a class="nav-link active" id="skill-${skillnum}-tab-1" data-toggle="tab" href="#skill-${skillnum}-1" role="tab" aria-controls="home" aria-selected="true">Level 1</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link " id="skill-${skillnum}-tab-2" data-toggle="tab" href="#skill-${skillnum}-2" role="tab" aria-controls="home" aria-selected="true">Level 2</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link " id="skill-${skillnum}-tab-3" data-toggle="tab" href="#skill-${skillnum}-3" role="tab" aria-controls="home" aria-selected="true">Level 3</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link " id="skill-${skillnum}-tab-4" data-toggle="tab" href="#skill-${skillnum}-4" role="tab" aria-controls="home" aria-selected="true">Level 4</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link " id="skill-${skillnum}-tab-5" data-toggle="tab" href="#skill-${skillnum}-5" role="tab" aria-controls="home" aria-selected="true">Level 5</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link " id="skill-${skillnum}-tab-list" data-toggle="tab" href="#skill-${skillnum}-list" role="tab" aria-controls="home" aria-selected="true">List All</a>
                    </li>
                </ul>
                <div class="tab-content fg-border" style="padding:4px" id="Content">
       `)
        var levelcount=1
        var skillList = []
        skill.forEach(eachlevel => {
            // console.log(eachlevel.s)
            var skilldesc = eachlevel.skill.TrunkSkillDesc
            if(db.tlSkill[eachlevel.skill.ID]){
                var currtl = db.tlSkill[eachlevel.skill.ID]
                if(currtl.isUp=="True"&& currtl.desc&&currtl.odesc==skilldesc){
                    skilldesc = currtl.desc
                }else if(currtl.gdesc&&currtl.odesc==skilldesc) skilldesc = currtl.gdesc
            }
            currskillhtml.push(`
                <div class="tab-pane fade show ${levelcount==1?"active":""}" id="skill-${skillnum}-${levelcount}" role="tabpanel" aria-labelledby="skill-${skillnum}-tab-${levelcount}">${skilldesc}</div>
            `)
            skillList.push(`Level ${levelcount} - ${skilldesc}<br>`)
            levelcount++
        });
        currskillhtml.push(`
                <div class="tab-pane fade show" id="skill-${skillnum}-list" role="tabpanel" aria-labelledby="skill-${skillnum}-tab-list">${skillList.join('')}</div>
            `)
        currskillhtml.push('</div></div></div>')
        // console.log(currskillhtml)
        skillhtml.push(currskillhtml.join(''))
        skillnum++
    });

    
    $('#charadetail-skillcontent').html(skillhtml.join('<Br><br>'))
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