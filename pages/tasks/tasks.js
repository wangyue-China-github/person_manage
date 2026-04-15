Page({
  data: {
    problems: [
      {
        id: 1,
        title: '学习投资理财知识',
        expanded: true,
        newSubtask: '',
        subtasks: [
          { id: 101, text: '读完《穷爸爸富爸爸》', completed: true },
          { id: 102, text: '了解定投指数基金原理', completed: false },
          { id: 103, text: '开设证券账户', completed: false }
        ]
      },
      {
        id: 2,
        title: '优化生活作息',
        expanded: false,
        newSubtask: '',
        subtasks: [
          { id: 201, text: '每天晚上11点前睡觉', completed: false },
          { id: 202, text: '早上7点起床锻炼', completed: false }
        ]
      }
    ]
  },

  onLoad() {
    this.loadProblems();
  },

  goToWebView() {
    wx.navigateTo({
      url: '/pages/webview/webview'
    });
  },

  loadProblems() {
    const savedProblems = wx.getStorageSync('problems');
    if (savedProblems) {
      this.setData({
        problems: savedProblems
      });
    }
  },

  saveProblems() {
    wx.setStorageSync('problems', this.data.problems);
  },

  getCompletedCount(problem) {
    if (!problem.subtasks) return 0;
    return problem.subtasks.filter(st => st.completed).length;
  },

  toggleProblem(e) {
    const id = e.currentTarget.dataset.id;
    const newProblems = this.data.problems.map(p => {
      if (p.id === id) {
        return { ...p, expanded: !p.expanded };
      }
      return p;
    });
    this.setData({
      problems: newProblems
    });
    this.saveProblems();
  },

  toggleSubtask(e) {
    const { problemId, subtaskId } = e.currentTarget.dataset;
    const newProblems = this.data.problems.map(p => {
      if (p.id === problemId) {
        const newSubtasks = p.subtasks.map(st => {
          if (st.id === subtaskId) {
            return { ...st, completed: !st.completed };
          }
          return st;
        });
        return { ...p, subtasks: newSubtasks };
      }
      return p;
    });
    this.setData({
      problems: newProblems
    });
    this.saveProblems();
  },

  updateNewSubtask(e) {
    const problemId = e.currentTarget.dataset.problemId;
    const value = e.detail.value;
    const newProblems = this.data.problems.map(p => {
      if (p.id === problemId) {
        return { ...p, newSubtask: value };
      }
      return p;
    });
    this.setData({
      problems: newProblems
    });
  },

  addSubtask(e) {
    const problemId = e.currentTarget.dataset.problemId;
    const problem = this.data.problems.find(p => p.id === problemId);
    const text = problem.newSubtask.trim();
    
    if (!text) return;

    const newSubtask = {
      id: Date.now(),
      text: text,
      completed: false
    };

    const newProblems = this.data.problems.map(p => {
      if (p.id === problemId) {
        return {
          ...p,
          subtasks: [...(p.subtasks || []), newSubtask],
          newSubtask: ''
        };
      }
      return p;
    });

    this.setData({
      problems: newProblems
    });
    this.saveProblems();
  },

  showAddProblem() {
    wx.showModal({
      title: '添加待解决问题',
      editable: true,
      placeholderText: '请输入问题标题',
      success: (res) => {
        if (res.confirm && res.content.trim()) {
          const newProblem = {
            id: Date.now(),
            title: res.content.trim(),
            expanded: true,
            newSubtask: '',
            subtasks: []
          };
          this.setData({
            problems: [...this.data.problems, newProblem]
          });
          this.saveProblems();
        }
      }
    });
  }
})