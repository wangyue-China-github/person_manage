Page({
  data: {
    // 存款金额
    depositAmount: 0,
    // 自我反省评分
    reflection: {
      housework: 0,
      makingMoney: 0,
      relaxation: 0,
      happiness: 0
    },
    // 亟待解决的问题
    problems: [],
    // 新问题输入
    newProblem: '',
  },

  // 页面加载时从本地存储恢复数据
  onLoad() {
    this.loadData();
  },

  // 加载本地存储的数据
  loadData() {
    const deposit = wx.getStorageSync('deposit') || 0;
    const reflection = wx.getStorageSync('reflection') || {
      housework: 0,
      makingMoney: 0,
      relaxation: 0,
      happiness: 0
    };
    const problems = wx.getStorageSync('problems') || [];

    this.setData({
      depositAmount: deposit,
      reflection: reflection,
      problems: problems
    });
  },

  // 保存数据到本地存储
  saveData() {
    wx.setStorageSync('deposit', this.data.depositAmount);
    wx.setStorageSync('reflection', this.data.reflection);
    wx.setStorageSync('problems', this.data.problems);
  },

  // 存入存款
  addDeposit() {
    wx.showModal({
      title: '存入存款',
      content: '请输入存入金额',
      inputPlaceholder: '请输入金额',
      success: (res) => {
        if (res.confirm) {
          const amount = parseFloat(res.content);
          if (!isNaN(amount) && amount > 0) {
            this.setData({
              depositAmount: this.data.depositAmount + amount
            });
            this.saveData();
            wx.showToast({
              title: '存入成功',
              icon: 'success'
            });
          } else {
            wx.showToast({
              title: '请输入有效金额',
              icon: 'none'
            });
          }
        }
      }
    });
  },

  // 取出存款
  withdrawDeposit() {
    wx.showModal({
      title: '取出存款',
      content: '请输入取出金额',
      inputPlaceholder: '请输入金额',
      success: (res) => {
        if (res.confirm) {
          const amount = parseFloat(res.content);
          if (!isNaN(amount) && amount > 0 && amount <= this.data.depositAmount) {
            this.setData({
              depositAmount: this.data.depositAmount - amount
            });
            this.saveData();
            wx.showToast({
              title: '取出成功',
              icon: 'success'
            });
          } else if (amount > this.data.depositAmount) {
            wx.showToast({
              title: '余额不足',
              icon: 'none'
            });
          } else {
            wx.showToast({
              title: '请输入有效金额',
              icon: 'none'
            });
          }
        }
      }
    });
  },

  // 评分功能
  rateItem(e) {
    const { item, score } = e.currentTarget.dataset;
    const newReflection = { ...this.data.reflection };
    newReflection[item] = parseInt(score);
    
    this.setData({
      reflection: newReflection
    });
    this.saveData();
  },

  // 更新新问题输入
  updateNewProblem(e) {
    this.setData({
      newProblem: e.detail.value
    });
  },

  // 添加问题
  addProblem() {
    const problemText = this.data.newProblem.trim();
    if (problemText) {
      const newProblem = {
        id: Date.now(),
        text: problemText,
        completed: false,
        subtasks: [],
        subtaskInput: ''
      };

      const newProblems = [...this.data.problems, newProblem];
      this.setData({
        problems: newProblems,
        newProblem: ''
      });
      this.saveData();
    }
  },

  // 切换问题完成状态
  toggleProblem(e) {
    const id = e.currentTarget.dataset.id;
    const newProblems = this.data.problems.map(problem => {
      if (problem.id === id) {
        return { ...problem, completed: !problem.completed };
      }
      return problem;
    });

    this.setData({
      problems: newProblems
    });
    this.saveData();
  },

  // 删除问题
  deleteProblem(e) {
    const id = e.currentTarget.dataset.id;
    const newProblems = this.data.problems.filter(problem => problem.id !== id);

    this.setData({
      problems: newProblems
    });
    this.saveData();
  },

  // 更新子任务输入
  updateSubtaskInput(e) {
    const id = e.currentTarget.dataset.id;
    const value = e.detail.value;
    const newProblems = this.data.problems.map(problem => {
      if (problem.id === id) {
        return { ...problem, subtaskInput: value };
      }
      return problem;
    });

    this.setData({
      problems: newProblems
    });
  },

  // 添加子任务
  addSubtask(e) {
    const id = e.currentTarget.dataset.id;
    const problem = this.data.problems.find(p => p.id === id);
    const subtaskText = problem.subtaskInput.trim();

    if (subtaskText) {
      const newSubtask = {
        id: Date.now(),
        text: subtaskText,
        completed: false
      };

      const newProblems = this.data.problems.map(problem => {
        if (problem.id === id) {
          return {
            ...problem,
            subtasks: [...problem.subtasks, newSubtask],
            subtaskInput: ''
          };
        }
        return problem;
      });

      this.setData({
        problems: newProblems
      });
      this.saveData();
    }
  },

  // 切换子任务完成状态
  toggleSubtask(e) {
    const { problemId, subtaskId } = e.currentTarget.dataset;
    const newProblems = this.data.problems.map(problem => {
      if (problem.id === problemId) {
        const newSubtasks = problem.subtasks.map(subtask => {
          if (subtask.id === subtaskId) {
            return { ...subtask, completed: !subtask.completed };
          }
          return subtask;
        });
        return { ...problem, subtasks: newSubtasks };
      }
      return problem;
    });

    this.setData({
      problems: newProblems
    });
    this.saveData();
  },

  // 删除子任务
  deleteSubtask(e) {
    const { problemId, subtaskId } = e.currentTarget.dataset;
    const newProblems = this.data.problems.map(problem => {
      if (problem.id === problemId) {
        const newSubtasks = problem.subtasks.filter(subtask => subtask.id !== subtaskId);
        return { ...problem, subtasks: newSubtasks };
      }
      return problem;
    });

    this.setData({
      problems: newProblems
    });
    this.saveData();
  }
})