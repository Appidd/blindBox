const db=wx.cloud.database()
var get={
  getMycouPonList(r){
    console.log(r)
    console.log(r.pageSize)
    return db.collection('tickets').where({
      uni:r.userinfo.openid,
      open:r.couponEnum
    }).skip(r.pageSize).get()
  },
  openCoupon(info,userinfo){
    const _=db.command
    console.log(info)
    console.log(userinfo)
    const max=info.max,min=info.min;
    const getcoin=Math.floor(Math.random()*(max-min+1)+min);
    
    return new Promise((resolve,reject)=>{
      db.collection('userInfo').where({
        uni:userinfo.openid,
      }).update({
        data:{
          coin:_.inc(getcoin)
        }
      }).then(()=>{
        db.collection('coin').add({
          data:{
            uni:userinfo.openid,
            avatarUrl:userinfo.avatarUrl,
            nickname:userinfo.nickname,
            time:new Date(),
            coin:getcoin,
            type:"get",
            costname:'开券获得'
          },success:res=>{
           db.collection('tickets').doc(info.id).remove()
            resolve(getcoin)
          }
        })
      })
    })
  },
 async awardCoupon(id){
    const _=db.command
console.log(id.userinfo,111)
return  new Promise((resolve,reject)=>{
  db.collection('tickets').doc(id.receiveRecordId).get({
    success:res=>{
      console.log(res)
      const result=res.data
      if(result.uni==id.userinfo.openid){
        resolve({
          code:'COUPON_RECORD_NOT_SELF_RECEIVE'
        })
      }else if(result.open){
        resolve({
          code:'COUPON_RECORD_ALREADY_RECEIVE'
        })
      }else if(result.length==0){
        resolve({
          code:'COUPON_RECORD_NOT_EXIST'
        })
      }else{
       
        db.collection('tickets').where({
          uni:id.userinfo.openid,
          couponName:result.couponName
        }).get({
          success:res=>{
            db.collection('tickets').doc(id.receiveRecordId).update({
              data:{
                open:true
              },success:res=>{
                console.log(res,666)
               
              }
              
            })
            if(res.data.length){
              db.collection('tickets').where({
                uni:id.userinfo.openid,
                couponName:result.couponName
              }).update({
                data:{
                  number:_.inc(1)
                  // open:true
                },
                success:res=>{
                  resolve({
                    code:'SUCCESS'
                  })
                }
              })
            }else{
              db.collection('tickets').add({
                data:{
                  avatarUrl:id.userinfo.avatarUrl,
                  nickname:id.userinfo.nickname,
                  couponName:result.couponName,
                  maxCoin:result.maxCoin,
                  minCoin:result.minCoin,
                  number:1,
                  open:true,
                  uni:id.userinfo.openid
                },
                success:res=>{
                  resolve({
                    code:'SUCCESS'
                  })
                }
              })
            }
          }
        })
    
      }
      
    }
  })
})

  },
}
module.exports=get