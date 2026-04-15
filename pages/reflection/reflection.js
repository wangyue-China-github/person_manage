Page({
  data: {
    scores: {
      housework: 80,
      makingMoney: 65,
      relaxation: 90,
      happiness: 100
    }
  },

  onLoad() {
    this.loadScores();
  },

  goToWebView() {
    wx.navigateTo({
      url: '/pages/webview/webview'
    });
  },

  loadScores() {
    const savedScores = wx.getStorageSync('reflectionScores');
    if (savedScores) {
      this.setData({
        scores: savedScores
      });
    }
  },

  onHouseworkChange(e) {
    this.setData({
      'scores.housework': e.detail.value
    });
  },

  onMakingMoneyChange(e) {
    this.setData({
      'scores.makingMoney': e.detail.value
    });
  },

  onRelaxationChange(e) {
    this.setData({
      'scores.relaxation': e.detail.value
    });
  },

  onHappinessChange(e) {
    this.setData({
      'scores.happiness': e.detail.value
    });
  },

  saveReflection() {
    wx.setStorageSync('reflectionScores', this.data.scores);
    wx.showToast({
      title: '保存成功',
      icon: 'success'
    });
  }
})