const db=wx.cloud.database()
var get={
  getCoinRecord(t){
    console.log(t)
return new Promise((resolve,reject)=>{
 if(t.tradeType=='all'){
 db.collection('coin').orderBy('time','desc').skip(t.pageSize).get({
   success:res=>{
     resolve(res.data)
   }
 })
 }else if(t.tradeType=='get'){
  db.collection('coin').where({
    type:'get'
  }).orderBy('time','desc').skip(t.pageSize).get({
    success:res=>{
      resolve(res.data)
    }
  })
 }else{
  db.collection('coin').where({
    type:'cost'
  }).orderBy('time','desc').skip(t.pageSize).get({
    success:res=>{
      resolve(res.data)
    }
  })
 }
}) 
  }
}
module.exports=get