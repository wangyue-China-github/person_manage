Page({
  onLoad() {
    // 3秒后自动跳转到资产页面
    setTimeout(() => {
      wx.switchTab({
        url: '/pages/reflection/reflection'
      });
    }, 3000);
  }
})