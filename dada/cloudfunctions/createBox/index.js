// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env:'dada-8gjy4y9xf021dd0e'
})
const db=cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const aBoxNum=event.payload.aBoxNum
const addid=event.actionFilter._id
const list=await db.collection('modelBox').where({
  belong:addid
}).get()
var addlist=list.data
if(aBoxNum>0){
  if(addlist.length){
    for(var i=0,newlist=[];i<addlist.length;i++){
      var t={
        belong:addid,
        serial:aBoxNum,
        num:addlist[i].num,
        price:addlist[i].price,
        img:addlist[i].img,
        name:addlist[i].name,
        type:addlist[i].type
      }
     
      newlist.push(t)
    }
    const havalist=await db.collection('boxContent').where({
      belong:addid,
      serial:aBoxNum
    }).get()
    const hava=havalist.data
    if(hava.length){
      for(var i=0;i<newlist.length;i++){
        await db.collection('boxContent').doc(hava[i]._id).update({
          data:newlist[i]
        })
      }
    }else{
      for(var i=0;i<newlist.length;i++){
        await db.collection('boxContent').add({
          data:newlist[i]
        })
      }
    }
   
  }
}


 return event
}
