var e={
 async getRecoveryPrice(a){
  var totalPrice=0
  return await new Promise((resolve,reject)=>{
    console.log('111')
    
    console.log(a.retrieveList)
    const list=a.retrieveList
    console
    for(var i=0;i<list.length;i++){
  
      totalPrice+=list[i].reprice *list[i].number
      if(i==list.length-1){
        
        resolve(totalPrice)
      }
    }
  })
 }
}
module.exports=e