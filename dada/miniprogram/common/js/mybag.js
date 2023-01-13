const db=wx.cloud.database()

var m={
 getMyIpList(openid){
 return   db.collection('rewardlist').where({
   uni:openid
 }).orderBy('time','desc').get()
  },
async getMyAwardList(n){
const goodsId=n.goodsId
const a= await db.collection('rewardlist').doc(goodsId).get()
console.log()
const list=[]
const b=a.data.detail


for (var j = 0, aflist = []; j < b.length; j++) {
  if (b.indexOf(b[j]) == j) {
      aflist.push(b[j])
  }
}
console.log(b)
console.log(aflist)
for (var i = 0, tolist = []; i < aflist.length; i++) {
  const num = 0
  for (j = 0; j < b.length; j++) {
      if (b[j] == aflist[i]) {
          num++
      }
      if (j == b.length - 1) {
          tolist.push({
              "id": aflist[i],
              "num": num
          })
      }
  }
}
console.log(tolist)

await Promise.all(tolist.map(function (i) {
  return new Promise((resolve,reject)=>{
       db.collection('reward').doc(i.id).get({
           success: res => {
              
               resolve(res.data)
           },
           fail: err => {

           }
       })
   }).then(res=>{
     for(var j=0;j<i.num;j++){
      list.push(res)
     }
       
   })
  
})).then(value=>{
   console.log(list)
   
})
return list
},
updaterelist(list){
 return new Promise((resolve,reject)=>{
    for(var i=0;i<list.length;i++){
      if(list[i].detail.length>0){
        db.collection('rewardlist').doc(list[i].bag).update({
          data:{
            detail:list[i].detail,
            number:list[i].detail.length
          }
        })
      }else{
        db.collection('rewardlist').doc(list[i].bag).remove()
      }
      if(i==list.length-1){
        resolve('success')
      }
    }
  })

}



}
module.exports=m