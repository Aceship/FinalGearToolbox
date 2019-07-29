$.holdReady(true);
const jsonList = {
    recruitData         :"json/gamedata/RecruitData.json",
    recruitLibraryData  :"json/gamedata/RecruitLibraryData.json",
    tenRecruitData      :"json/gamedata/TenRecruitData.json",
    girlData            :"json/gamedata/GirlData.json",
    girlSkinData        :"json/gamedata/GirlSkinData.json",
    widgetData          :"json/gamedata/WidgetData.json",
    suitData            :"json/gamedata/SuitData.json",
    equipLegData        :"json/gamedata/EquipLegData.json",
    itemData            :"json/gamedata/ItemData.json"
};

var db = {}
LoadAllJsonObjects(jsonList).then(function(result) {
    db = result
    $.holdReady(false);
});

$(document).ready(function(){
    console.log(db)
    ListBanner()
});

function ListBanner() {
    var htmlcontent =[]
    var tenBanner=[]
    for(i=0;i<db.tenRecruitData.length;i++){
        var currRec= db.tenRecruitData[i]
        var girlListArray = []
        var filterRandomTen = db.recruitLibraryData.filter(search=> search.StuffType==0 && search.RandomLibraryID==currRec.TenRandomLibraryID)
        var filterRandomNormal = db.recruitLibraryData.filter(search=> search.StuffType==0 && search.RandomLibraryID==currRec.RandomLibraryID)
        // console.log(filterRandomTen)
        console.log(currRec.TenRecruitID)
        if(!tenBanner[currRec.TenRecruitID]){
            tenBanner[currRec.TenRecruitID]={}
            tenBanner[currRec.TenRecruitID].list=[]
            tenBanner[currRec.TenRecruitID].detail=[]
            tenBanner[currRec.TenRecruitID].total = 0
        }

        tenBanner[currRec.TenRecruitID].list.push(filterRandomTen)
        tenBanner[currRec.TenRecruitID].detail.push(currRec)
        tenBanner[currRec.TenRecruitID].total++
    }
    // console.log(tenBanner)

    tenBanner.forEach(recruitData => {
        htmlcontent.push(`
        <div>
             </br>
            Limited Pilot Recruit</br>
            </br>
            10x Pull: </br>
        `)
        
        console.log(recruitData)
        htmlcontent.push(`<div style='display:inline-block;padding:2px'>`)
        for(i=0;i<recruitData.total;i++){
            
            var currItem = db.itemData.find(search=>search.ID == recruitData.detail[i].TenRecruitNeed[0])
            
            htmlcontent.push(`<div class='tenpull-container shadow-thin'>
            <div>Pull <div class="tenpull-number">${recruitData.total==i+1?(i+1)+"+":i+1}</div></div>
            <img style="height:40px;padding:1px" src="./img/equippartsicon/item/${currItem.Icon}.png" title='${currItem.Name}'>
            x${recruitData.detail[i].TenRecruitNeed[1]} `)
            if(recruitData.detail[i].Award){
                var awardSplit = recruitData.detail[i].Award.split(",")
                var currReward = db.itemData.find(search=>search.ID == awardSplit[0])
                htmlcontent.push(`<br>
                Reward<br>
                <img style="height:40px;padding:1px" src="./img/equippartsicon/item/${currReward.Icon}.png" title='${currReward.Name}'>
                x${awardSplit[1]}
                `)
            }
            htmlcontent.push('</div> ')
        }
        htmlcontent.push(`</div><br>`)
        htmlcontent.push(`Rate Per Rarity :<br>`)
        var probability = recruitData.detail[0].ProbabilityPrew.split(";")
        probability.forEach(element => {
            var raritydrop = element.replace('机师','').split(',')
            htmlcontent.push(`<img style="height:30px;padding:1px" src="./img/extra/rarity/${raritydrop[0]}.png"> ${raritydrop[1]}<br>`)
        });
        if(recruitData.detail[0].UpGirl){
            var upGirlList = []
            var currUpGirlList = recruitData.detail[0].UpGirl.split(";")
            htmlcontent.push(`</br>Rate Up : </br>`)
            currUpGirlList.forEach(UpGirl => {
                var currgirl = db.girlData.find(search=>search.ID == UpGirl.split(",")[0])
                var currskin = db.girlSkinData.find(search=>search.ID == currgirl.BasicSkin)
                upGirlList.push({girl:currgirl,skin:currskin,rate:UpGirl.split(",")[1]})
            });

            upGirlList.forEach(element => {
                htmlcontent.push(`
                <div class='rarity-${element.girl.GirlQualityType}' style='display:inline-block;text-align:center'>
                ${element.girl.Name}<br>
                ${element.girl.EnglishName}<br>
                
                    <img style="height:180px;padding:1px" src="./img/equippartsicon/pilot/squarehead/${element.skin.HeadIcon_square}.png" title='${element.girl.Name} ${element.girl.EnglishName}'><br>
                    <div class='rarity-back-${element.girl.GirlQualityType}'>${element.rate}</div>
                </div>
                `)
            });

            // <hr class='rarity-back-${element.girl.GirlQualityType}' style="height:10px;margin-bottom:2px;margin-top:2px">
            htmlcontent.push(`</br>`)
        }   
        htmlcontent.push(`</br>Random List </br>`)
        var girlListArray = []
        recruitData.list[0].forEach(element => {
            var currgirl = db.girlData.find(search=>search.ItemID == element.StuffID)
            if(currgirl){
                var currskin = db.girlSkinData.find(search=>search.ID == currgirl.BasicSkin)
                if(currgirl.ID<1000){
                    girlListArray.push({girl:currgirl,skin:currskin})
                }
            }
        });
        girlListArray.sort((a,b)=>{
            return b.girl.GirlQualityType - a.girl.GirlQualityType
        })
        
        girlListArray.forEach(element => {
            
            htmlcontent.push(`<img class='rarity-${element.girl.GirlQualityType}' style="height:40px;padding:1px" src="./img/equippartsicon/pilot/head/${element.skin.HeadIcon}.png" title='${element.girl.Name} ${element.girl.EnglishName}'> `)
        });
        
        htmlcontent.push(`</div><hr style="height:10px;background:#555555">`)
    });
    
    for(i=0;i<db.recruitData.length;i++){
        console.log(db.recruitData[i])
        var currRec= db.recruitData[i]
        
        htmlcontent.push(`
        <div>
            ${currRec.RecruitName} </br>
            ${currRec.RecruitType==0?"Pilot Recruit":"Mech Parts Develop"}</br>
            </br>
            Item Required : </br>
        `)
        currRec.RecruitNeed.forEach(element => {
            var currItem = db.itemData.find(search=>search.ID == element[0])
            // console.log(currItem)
            htmlcontent.push(`<div>
            <img style="height:40px;padding:1px" src="./img/equippartsicon/item/${currItem.Icon}.png" title='${currItem.Name}' >
            x${element[1]}
            </div> `)
        });
        htmlcontent.push(`</div>`)
        switch (currRec.RecruitType) {
            case 0:
                var girlListNumber = currRec.GirlList.split(",")
                // console.log(girlListNumber)
                var girlListArray = []
                var filterRandomFull = db.recruitLibraryData.filter(search=> search.StuffType==0 && search.RandomLibraryID==currRec.FullValueRandom)
                var filterRandomNormal = db.recruitLibraryData.filter(search=> search.StuffType==0 && search.RandomLibraryID==currRec.NormalRandom)

                console.log(filterRandomNormal)
                console.log(filterRandomFull)
                htmlcontent.push(`Rate Per Rarity :<br>`)
                var probability = currRec.ProbabilityPrew.split(";")
                probability.forEach(element => {
                    var raritydrop = element.replace('机师','').split(',')
                    htmlcontent.push(`<img style="height:30px;padding:1px" src="./img/extra/rarity/${raritydrop[0]}.png"> ${raritydrop[1]}<br>`)
                });
                if(currRec.UpGirl){
                    var upGirlList = []
                    var currUpGirlList = currRec.UpGirl.split(";")
                    htmlcontent.push(`</br>Rate Up : </br>`)
                    currUpGirlList.forEach(UpGirl => {
                        var currgirl = db.girlData.find(search=>search.ID == UpGirl.split(",")[0])
                        var currskin = db.girlSkinData.find(search=>search.ID == currgirl.BasicSkin)
                        upGirlList.push({girl:currgirl,skin:currskin,rate:UpGirl.split(",")[1]})
                    });

                    upGirlList.forEach(element => {
                        htmlcontent.push(`
                        <div class='rarity-${element.girl.GirlQualityType}' style='display:inline-block;text-align:center'>
                        ${element.girl.Name}<br>
                        ${element.girl.EnglishName}<br>
                        
                            <img style="height:180px;padding:1px" src="./img/equippartsicon/pilot/squarehead/${element.skin.HeadIcon_square}.png" title='${element.girl.Name} ${element.girl.EnglishName}'><br>
                            <div class='rarity-back-${element.girl.GirlQualityType}'>${element.rate}</div>
                        </div>
                        `)
                    });

                    htmlcontent.push(`</br>`)
                }
                htmlcontent.push(`</br>Random Normal </br>`)
                // girlListNumber.forEach(element => {
                //     var currgirl = db.girlData.find(search=>search.ID == element)
                //     var currskin = db.girlSkinData.find(search=>search.ID == currgirl.BasicSkin)
                //     girlListArray.push({girl:currgirl,skin:currskin})
                // });

                filterRandomNormal.forEach(element => {
                    var currgirl = db.girlData.find(search=>search.ItemID == element.StuffID)
                    if(currgirl){
                        var currskin = db.girlSkinData.find(search=>search.ID == currgirl.BasicSkin)
                        if(currgirl.ID<1000){
                            girlListArray.push({girl:currgirl,skin:currskin})
                        }
                    }
                });
                girlListArray.sort((a,b)=>{
                    return b.girl.GirlQualityType - a.girl.GirlQualityType
                })
                
                girlListArray.forEach(element => {
                    
                    htmlcontent.push(`<img class='rarity-${element.girl.GirlQualityType}' style="height:40px;padding:1px" src="./img/equippartsicon/pilot/head/${element.skin.HeadIcon}.png" title='${element.girl.Name} ${element.girl.EnglishName}'> `)
                });

                if(filterRandomFull.length>0){
                    girlListArray = []
                    htmlcontent.push(`</br>Random Full Bar </br>`)
                    filterRandomFull.forEach(element => {
                        var currgirl = db.girlData.find(search=>search.ItemID == element.StuffID)
                        if(currgirl){
                            var currskin = db.girlSkinData.find(search=>search.ID == currgirl.BasicSkin)
                            if(currgirl.ID<1000){
                                girlListArray.push({girl:currgirl,skin:currskin})
                            }
                        }
                    });
                    girlListArray.sort((a,b)=>{
                        return b.girl.GirlQualityType - a.girl.GirlQualityType
                    })
                    
                    girlListArray.forEach(element => {
                        
                        htmlcontent.push(`<img class='rarity-${element.girl.GirlQualityType}' style="height:40px;padding:1px" src="./img/equippartsicon/pilot/head/${element.skin.HeadIcon}.png" title='${element.girl.Name} ${element.girl.EnglishName}'> `)
                    });
                    
                }
                
                break;
            case 1:
                var filterRandomFull = db.recruitLibraryData.filter(search=> search.StuffType==1 && search.RandomLibraryID==currRec.FullValueRandom)
                var filterRandomNormal = db.recruitLibraryData.filter(search=> search.StuffType==1 && search.RandomLibraryID==currRec.NormalRandom)

                // console.log(filterRandomNormal)
                // console.log(filterRandomFull)
                htmlcontent.push(`Rate Per Rarity :<br>`)
                var probability = currRec.ProbabilityPrew.split(";")
                probability.forEach(element => {
                    var raritydrop = element.replace(/\n/g, "<br />");
                    raritydrop=raritydrop.replace(/,/g,"<br>").replace("111111","<br>").replace("1111111率率率","<br>")
                    console.log(raritydrop)
                    htmlcontent.push(`${raritydrop}<br>`)
                });
                if(currRec.GirlList){
                    var suitList = currRec.GirlList.split(",")
                    suitList.forEach(element => {
                        var currgirl = db.girlData.find(search=>search.SuitID == element)
                        var currskin = db.girlSkinData.find(search=>search.ID == currgirl.BasicSkin)
                        // console.log(currgirl.EnglishName)
                        // console.log(currskin.MachineArmorModel1)
                        if(currskin&&currskin.MachineArmorModel1[1]){
                            var currSuitData = db.equipLegData.find(search=>search.ID ==currskin.MachineArmorModel1[1])
                            var currSuit = db.suitData.find(search=>search.ID ==currgirl.SuitID)
                            console.log(currSuit)
                            console.log(currSuitData.preview1)
                            htmlcontent.push(`<img style="height:120px;padding:1px" src="./img/equippartsicon/preview/leg/${currSuitData.preview1}.png" title='${currSuit.SuitName}'>`)
                        }
                    });
                }
                htmlcontent.push(`</br>Random Normal </br>`)
                filterRandomNormal.forEach(element => {
                    var currwidget = db.widgetData.find(search=> search.ID==element.StuffID )

                    htmlcontent.push(`<img style="height:40px;padding:1px" src="./img/equippartsicon/${EquipType(currwidget.EquipType)}/${currwidget.Icon}.png" title='${currwidget.Name}'> `)
                });
                // console.log(filterRandomFull)
                if(filterRandomFull.length>0){
                    htmlcontent.push(`</br></br>Random Full Bar </br>`)
                    filterRandomFull.forEach(element => {
                        var currwidget = db.widgetData.find(search=> search.ID==element.StuffID )

                        htmlcontent.push(`<img style="height:40px;padding:1px" src="./img/equippartsicon/${EquipType(currwidget.EquipType)}/${currwidget.Icon}.png" title='${currwidget.Name}'> `)
                    });
                }

                break;
            default:
                break;
        }
        htmlcontent.push(`</div><hr style="height:10px;background:#555555">`)
    }

    $("#bannerlist-content").html(htmlcontent.join(""))
}
function EquipType(n){
    switch(n){
        case 0 : return "arm"
        case 1 : return "body"
        case 2 : return "leg"
        case 3 : return "bag"
        case 4 : return "chip"
        default: return n 
    }
}

// function RarityImg(n){
//     switch(n){
//         case 0 :
//         case "N" : return `<img style="height:40px;padding:1px" src="./img/equippartsicon/${EquipType(currwidget.EquipType)}/${currwidget.Icon}.png"> `
//     }
// }

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

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}