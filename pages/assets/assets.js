Page({
  data: {
    fixedDeposit: 150000,
    currentBalance: 24500,
    monthlyIncome: 5200,
    monthlyExpense: 3850.50
  },

  onLoad() {
    // 加载数据
  },

  goToWebView() {
    wx.navigateTo({
      url: '/pages/webview/webview'
    });
  }
})