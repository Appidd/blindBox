
var z = {
  async getboxall(a) {
    console.log(this)
    const ipId = a.ipId,
      max = a.max,
      min = a.min;
    const one=await new Promise((resolve, reject) => {
      wx.cloud.callFunction({
        name: 'chosebox',
        data: {
          ipId,
          max,
          min,
          page: 0
        },
        success: res => {
          console.log(res)
          resolve( res.result.data)
        }
      })
    })
   
return Promise.resolve(one)
  }
}
module.exports = z