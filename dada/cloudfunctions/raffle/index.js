// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: 'dada-8gjy4y9xf021dd0e'
})
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
    const type = event.type
    
    if (type == 'pay') {
        const res = await cloud.cloudPay.unifiedOrder({
            "body": "嗒哒|盲盒潮玩",
            "outTradeNo": event.outTradeNo,
            "spbillCreateIp": "127.0.0.1",
            "subMchId": "1611173226",
            "totalFee": (event.price - Math.floor(Math.random() * 10) / 100) * 100,
            "envId": "dada-8gjy4y9xf021dd0e",
            "functionName": "pay_cb",

            "attach": event.outTradeNo
        })
        return res
    } 
    // 抽奖
    else if (type == 'getReward') {
        console.log('开始执行')
        try{
            const result = await db.runTransaction(async transaction => {
                const buyNum = event.buyNum
                const belong = event.ipId
                const boxNum = event.currentBoxNo
                const price=event.price
                const name=event.name
                const allList = await db.collection('boxContent').aggregate().match({
                    belong: belong,
                    serial: boxNum,
                    type: _.nin(['FIRST', 'LAST']),
                    num: 1
                }).sample({
                    size: buyNum
                }).end()
                
                if (allList.list.length == buyNum) {
                    for(var i=0,idList=[];i<allList.list.length;i++){
                       idList.push(allList.list[i]._id)
                    }
                    await db.collection('boxContent').where({
                        _id:_.in(idList)
                    }).update({
                        data:{
                            num:0
                        }
                    })
                    //插入赏袋以及抽赏记录
                   const userlist =await db.collection('userList').where({
                     _openid:wxContext.OPENID
                   }).get()
                   const user=userlist.data[0]
                   const list=allList.list
                   for(var i=0,detailId=[];i<list.length;i++){
                    detailId.push(list[i]._id)
                    
                }
                 await  db.collection('recordList').add({
                       data: {
                           _openid:wxContext.OPENID,
                           avatarUrl: user.avatarUrl,
                           nickName: user.nickName,
                           goodsId: belong,
                           goodsName: name,
                           buyNum: buyNum,
                           detailId: detailId,
                           time: new Date(),
                           costMoney: price * buyNum,
                           currentBoxNo: boxNum,
                           rewardlist:allList.list
                       },
                       success: res => {
                           console.log(res)
                       },
                       fail: err => {
                           console.log(err)
                       }
                   })
                const rewardList=await   db.collection('rewardList').where({
                    goodsId: belong,
                    _openid:wxContext.OPENID
                   }).get()
                if(rewardList.data.length){
                    const id=rewardList.data[0]._id
                  await  db.collection('rewardList').doc(id).update({
                        data: {
                            rewardlist: _.push({
                                each: list,
                                position: 0,
                            }),
                            detailId: _.push({
                                each: detailId,
                                position: 0,
                            }),
                            
                            buyNum: _.inc(buyNum),
                            costMoney: _.inc(price * buyNum),
                        }
                    })
                }else{
                    await  db.collection('rewardList').add({
                        data: {
                          _openid:wxContext.OPENID,
                            avatarUrl: user.avatarUrl,
                            nickName: user.nickName,
                            goodsId: belong,
                            goodsName: name,
                            buyNum: buyNum,
                            detailId: detailId,
                            time: new Date(),
                            costMoney: price * buyNum,
                            currentBoxNo: boxNum,
                            rewardlist:allList.list
                        },
                        success: res => {
                            console.log(res)
                        },
                        fail: err => {
                            console.log(err)
                        }
                    })
                }
                    return {
                        code: 'OK',
                        allList,
                        
                    }
                }  else {
                     return {
                        code: 'NO',
                        allList
                    }
                  }
            })
            return result
        } catch(e){
            console.error(`transaction error`, e)
            return {
                success: e,
                code: 'err'
            }
        }
    }
    else if(type=='sendReward'){
        const getlist=await db.collection('boxContent').where({
            belong:event.ipId,
            serial:event.currentBoxNo,
           }).get()
           for(var j=0,firstlist=[],lastlist=[],cenlist=[];j<getlist.data.length;j++){
            if(getlist.data[j].type=='FIRST'){
              firstlist.push(getlist.data[j])
            }
            else if(getlist.data[j].type=='LAST'){
              lastlist.push(getlist.data[j])
            }
            else{
              cenlist.push(getlist.data[j])
            }
          }
          for(var i=0,totalNum=0,invenNum=0;i<cenlist.length;i++){
            totalNum+=1
            invenNum+=cenlist[i].num
          }
          for(var i=0,lastNum=0;i<lastlist.length;i++){
            lastNum+=lastlist[i].num
          }
          for(var i=0,firstNum=0;i<firstlist.length;i++){
            firstNum+=firstlist[i].num
          }
          const rewardList=await db.collection('recordList').where({
            currentBoxNo:event.currentBoxNo,
            goodsId:event.ipId
          }).get()
          for(var i=0,orderList=[];i<rewardList.data.length;i++){
             for(var j=0;j<rewardList.data[i].detailId.length;j++){
                 var t={
                     _id:rewardList.data[i]._id,
                     _openid:rewardList.data[i]._openid,
                     avatarUrl: rewardList.data[i].avatarUrl,
                     nickName: rewardList.data[i].nickName,
                     goodsId: rewardList.data[i].goodsId,
                     goodsName: rewardList.data[i].goodsName,
                     buyNum: 0,
                     detailId: [],
                     rewardList:[],
                     costMoney: 0,
                     currentBoxNo: rewardList.data[i].currentBoxNo
                 }
                 orderList.push(t)
             }
          }
       

          if(invenNum<=totalNum/2&&firstNum!=0){
            orderList.sort(function (a, b) {
              return Math.random() > 0.5 ? -1 : 1;
          })
            await db.collection('boxContent').where({
                belong:event.ipId,
                serial:event.currentBoxNo,
                type:'FIRST'
              }).update({
                data:{
                 num:0
                }
              })
              await  db.collection('recordList').doc(orderList[0]._id).update({
                    data:{
                        detailId:_.push(firstlist[0]._id),
                        rewardlist:_.push(firstlist[0])
                    }
                })
                console.log(orderList[0])
              const rewardObj= await db.collection('rewardList').where({
                goodsId:orderList[0].goodsId,
                _openid:orderList[0]._openid
              }).get()
              console.log(rewardObj)
              if(rewardObj.data.length){
                await db.collection('rewardList').doc(rewardObj.data[0]._id).update({
                  data:{
                    detailId:_.push(firstlist[0]._id),
                    rewardlist:_.push(firstlist[0]),
                    buyNum:_.inc(1)
                  }
                })
              }else{
                await db.collection('rewardList').add({
                  data:{
                    _openid:orderList[0]._openid,
                    avatarUrl:orderList[0].avatarUrl,
                    buyNum:1,
                    costMoney:0,
                    currentBoxNo:0,
                    goodsId:orderList[0].goodsId,
                    goodsName:orderList[0].goodsName,
                    nickName:orderList[0].nickName,
                    detailId:[firstlist[0]._id],
                    rewardlist:[firstlist[0]],
                    time:new Date()
                  }
                })
              }
               
          }
           if(invenNum==0&&lastNum!=0){
            orderList.sort(function (a, b) {
              return Math.random() > 0.5 ? -1 : 1;
          })
            await db.collection('boxContent').where({
                belong:event.ipId,
                serial:event.currentBoxNo,
                type:'LAST'
              }).update({
                data:{
                 num:0
                }
              })
               await db.collection('recordList').doc(orderList[0]._id).update({
                    data:{
                        detailId:_.push(lastlist[0]._id),
                        rewardlist:_.push(lastlist[0])
                    }
                })
                console.log(orderList[0])
                const rewardObj= await db.collection('rewardList').where({
                  goodsId:orderList[0].goodsId,
                  _openid:orderList[0]._openid
                  
                }).get()
                console.log(rewardObj)
                if(rewardObj.data.length){
                  await db.collection('rewardList').doc(rewardObj.data[0]._id).update({
                    data:{
                      detailId:_.push(lastlist[0]._id),
                      rewardlist:_.push(lastlist[0]),
                      buyNum:_.inc(1)
                    }
                  })
                }else{
                  await db.collection('rewardList').add({
                    data:{
                      _openid:orderList[0]._openid,
                      avatarUrl:orderList[0].avatarUrl,
                      buyNum:1,
                      costMoney:0,
                      currentBoxNo:0,
                      goodsId:orderList[0].goodsId,
                      goodsName:orderList[0].goodsName,
                      nickName:orderList[0].nickName,
                      detailId:[firstlist[0]._id],
                      rewardlist:[firstlist[0]],
                      time:new Date()
                    }
                  })
                }
          }

          return {
            invenNum,totalNum,firstNum,lastNum,
        }
       
    }else if(type=='getChose'){
      const list1=await db.collection('boxContent').where({
        serial: _.and(_.gte(event.min), _.lte(event.max)),
        belong:event.ipId
      }).get()
      const list2=await db.collection('boxContent').where({
        serial: _.and(_.gte(event.min), _.lte(event.max)),
        belong:event.ipId
      }).skip(100).get()
      var list=list1.data.concat(list2.data)
      list.sort(function(a,b){
        return a.serial-b.serial
      })
      return {
        data:list
      }
    }

}