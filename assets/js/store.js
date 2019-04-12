// 生成uuid方法
function S4() {
  return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}

function guid() {
  return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}

// 存储，请求接口存储服务器
function saveInfo(name,info) {
  localStorage.setItem(name, JSON.stringify(info))
}

const store = new Vuex.Store({
  state: {
    listCard:[
    ],
    now:{},
    prepare:{},
    finish:{},
    cardSort: ["now", "prepare", "finish"]
  },
  mutations: {
    addNewSubTitle(state, payload) {
      let name = payload.name
      let title = payload.card_title
      let id = payload.id
      switch (name) {
        case "now":
          state.now.content.push({
            cardName:name,
            sub_card_title:title,
            id:id,
            desc:'',
            lists:[],
            status:[
              {
                name:'未开始',
                isCheck:true,
                type:'no_begin'
              },
              {
                name:'等待中',
                isCheck:false,
                type:'stay'
              },
              {
                name:'进行中',
                isCheck:false,
                type:'success'
              },
              {
                name:'有困难',
                isCheck:false,
                type:'difficult'
              }
            ]
          })
          saveInfo("now", state.now)
          break;
        case "prepare":
          state.prepare.content.push({
            cardName:name,
            sub_card_title:title,
            id: id,
            desc: '',
            lists: [],
            status: [
              {
                name: '未开始',
                isCheck: true,
                type: 'no_begin'
              },
              {
                name: '等待中',
                isCheck: false,
                type: 'stay'
              },
              {
                name: '进行中',
                isCheck: false,
                type: 'success'
              },
              {
                name: '有困难',
                isCheck: false,
                type: 'difficult'
              }
            ]
          })
          saveInfo("prepare", state.prepare)
          break;
        case "finish":
          state.finish.content.push({
            cardName:name,
            sub_card_title:title,
            id: id,
            desc: '',
            lists: [],
            status: [
              {
                name: '未开始',
                isCheck: true,
                type: 'no_begin'
              },
              {
                name: '等待中',
                isCheck: false,
                type: 'stay'
              },
              {
                name: '进行中',
                isCheck: false,
                type: 'success'
              },
              {
                name: '有困难',
                isCheck: false,
                type: 'difficult'
              }
            ]
          })
          saveInfo("finish", state.finish)
          break;
      }

    },
    finishCard(state,payload){
      let name = payload.name
      let index = payload.index
      let info;
      let id = state.finish.id
      switch (name) {
        case "now":
          info = state.now.content.splice(index, 1)[0]
          info.cardName = "finish"
          info.id = id
          info.lists.forEach(res => {
            res.cardName = "finish"
            res.plans.forEach(item => {
              item.cardName = "finish"
            })
          })
          state.finish.content.push(info)
          saveInfo("now", state.now)
          saveInfo("finish", state.finish)
          break;
        case "prepare":
          info = state.prepare.content.splice(index, 1)[0]
          info.cardName = "finish"
          info.id = id
          info.lists.forEach(res => {
            res.cardName = "finish"
            res.plans.forEach(item => {
              item.cardName = "finish"
            })
          })
          state.finish.content.push(info)
          saveInfo("prepare", state.prepare)
          saveInfo("finish", state.finish)
          break;
      }
    },
    // 卡片难度
    toggleStatus(state,payload){
      let name = payload.name
      let index = payload.index
      let num = payload.num
      switch (name) {
        case "now":
          state.now.content[num].status.forEach(item => {
            item.isCheck = false
          })
          state.now.content[num].status[index].isCheck = true
          saveInfo("now", state.now)
          break;
        case "prepare":
          state.prepare.content[num].status.forEach(item => {
            item.isCheck = false
          })
          state.prepare.content[num].status[index].isCheck = true
          saveInfo("prepare", state.prepare)
          break;
        case "finish":
          state.finish.content[num].status.forEach(item => {
            item.isCheck = false
          })
          state.finish.content[num].status[index].isCheck = true
          saveInfo("finish", state.finish)
          break;
      }
    },
    // 修改卡片副标题
    changeSubTitle(state, payload) {
      let name = payload.name
      let title = payload.sub_title
      let index = payload.index
      switch (name) {
        case "now":
          state.now.content[index].sub_card_title = title
          saveInfo("now", state.now)
          break;
        case "prepare":
          state.prepare.content[index].sub_card_title = title
          saveInfo("prepare", state.prepare)
          break;
        case "finish":
          state.finish.content[index].sub_card_title = title
          saveInfo("finish", state.finish)
          break;
      }
    },
    // 添加描述信息
    addSubDesc(state, payload) {
        let name = payload.name
        let desc = payload.desc
        let index = payload.index
        switch (name) {
          case "now":
            state.now.content[index].desc = desc
            saveInfo("now", state.now)
            break;
          case "prepare":
            state.prepare.content[index].desc = desc
            saveInfo("prepare", state.prepare)
            break;
          case "finish":
            state.finish.content[index].desc = desc
            saveInfo("finish", state.finish)
            break;
        }
    },
    // 添加清单
    addNewList(state, payload) {
      let name = payload.name
      let index = payload.index
      switch (name) {
        case "now":
          state.now.content[index].lists.push({
            cardName:"now",
            list_title:'此处为清单标题',
            plans:[]
          })
          saveInfo("now", state.now)
          break;
        case "prepare":
          state.prepare.content[index].lists.push({
            cardName: "prepare",
            list_title: '此处为清单标题',
            plans: []
          })
          saveInfo("prepare", state.prepare)
          break;
        case "finish":
          state.finish.content[index].lists.push({
            cardName: "finish",
            list_title: '此处为清单标题',
            plans: []
          })
          saveInfo("finish", state.finish)
          break;
      }
    },
    // 删除卡片
    deleteSmallList(state, payload) {
      let name = payload.name
      let index = payload.index
      switch (name) {
        case "now":
          state.now.content.splice(index,1)
          saveInfo("now", state.now)
          break;
        case "prepare":
          state.prepare.content.splice(index, 1)
          saveInfo("prepare", state.prepare)
          break;
        case "finish":
          state.finish.content.splice(index, 1)
          saveInfo("finish", state.finish)
          break;
      }
    },
    // 删除清单
    deleteList(state, payload) {
        let name = payload.name
        let index = payload.index
        let num = payload.num
        switch (name) {
          case "now":
            state.now.content[index].lists.splice(num, 1)
            saveInfo("now", state.now)
            break;
          case "prepare":
            state.prepare.content[index].lists.splice(num, 1)
            saveInfo("prepare", state.prepare)
            break;
          case "finish":
            state.finish.content[index].lists.splice(num, 1)
            saveInfo("finish", state.finish)
            break;
        }
    },
    // 改变清单的标题
    changelistTitle(state, payload) {
        let name = payload.name
        let parentIndex = payload.parentIndex
        let index = payload.index
        let title = payload.list_title
        switch (name) {
          case "now":
            state.now.content[parentIndex].lists[index].list_title = title
            saveInfo("now", state.now)
            break;
          case "prepare":
            state.prepare.content[parentIndex].lists[index].list_title = title
            saveInfo("prepare", state.prepare)
            break;
          case "finish":
            state.finish.content[parentIndex].lists[index].list_title = title
            saveInfo("finish", state.finish)
            break;
        }
    },
    // 新增清单计划
    addNewPlan(state, payload) {
        let name = payload.name
        let listIndex = payload.listIndex
        let num = payload.num
        let title = payload.title
        switch (name) {
          case "now":
            state.now.content[listIndex].lists[num].plans.unshift({
              cardName:'now',
              finish:false,
              plan_title:title
            })
            saveInfo("now", state.now)
            break;
          case "prepare":
            state.prepare.content[parentIndex].lists[index].plans.unshift({
              cardName:'prepare',
              finish: false,
              plan_title: title
            })
            saveInfo("prepare", state.prepare)
            break;
          case "finish":
            state.finish.content[parentIndex].lists[index].plans.unshift({
              cardName:'finish',
              finish: false,
              plan_title: title
            })
            saveInfo("finish", state.finish)
            break;
        }
    },
    // 改变清单完成状态
    changePlanStatus(state, payload) {
        let name = payload.name
        let status = payload.status
        let sonIndex = payload.sonIndex
        let parentIndex = payload.parentIndex
        let currentIndex = payload.currentIndex
        switch (name) {
          case "now":
            let before = state.now.content[parentIndex].lists[sonIndex].plans.splice(currentIndex, 1)[0]
            before.finish = status
            if (status) {
              state.now.content[parentIndex].lists[sonIndex].plans.push(before)
            } else {
              state.now.content[parentIndex].lists[sonIndex].plans.unshift(before)
            }
            saveInfo("now", state.now)
            break;
          case "prepare":
            let before2 = state.prepare.content[parentIndex].lists[sonIndex].plans.splice(currentIndex, 1)[0]
            before2.finish = status
            if (status) {
              state.prepare.content[parentIndex].lists[sonIndex].plans.push(before2)
            } else {
              state.prepare.content[parentIndex].lists[sonIndex].plans.unshift(before2)
            }
            saveInfo("prepare", state.prepare)
            break;
          case "finish":
            let before3 = state.finish.content[parentIndex].lists[sonIndex].plans.splice(currentIndex, 1)[0]
            before3.finish = status
            if (status) {
              state.finish.content[parentIndex].lists[sonIndex].plans.push(before3)
            } else {
              state.finish.content[parentIndex].lists[sonIndex].plans.unshift(before3)
            }
            saveInfo("finish", state.finish)
            break;
        }
    },
    // 删除清单目标
    deletePlan(state, payload) {
        let name = payload.name
        let sonIndex = payload.sonIndex
        let parentIndex = payload.parentIndex
        let currentIndex = payload.currentIndex
        switch (name) {
          case "now":
            state.now.content[parentIndex].lists[sonIndex].plans.splice(currentIndex, 1)
            saveInfo("now", state.now)
            break;
          case "prepare":
            state.prepare.content[parentIndex].lists[sonIndex].plans.splice(currentIndex, 1)
            saveInfo("prepare", state.prepare)
            break;
          case "finish":
            state.finish.content[parentIndex].lists[sonIndex].plans.splice(currentIndex, 1)
            saveInfo("finish", state.finish)
            break;
        }
    },
    // 改变清单的说明
    changePlanDesc(state, payload) {
      let name = payload.name
      let parentIndex = payload.parentIndex
      let sonIndex = payload.parentIndex
      let currentIndex = payload.currentIndex
      let title = payload.title
      switch (name) {
        case "now":
          state.now.content[parentIndex].lists[sonIndex].plans[currentIndex].plan_title = title
          saveInfo("now", state.now)
          break;
        case "prepare":
          state.prepare.content[parentIndex].lists[sonIndex].plans[currentIndex].plan_title = title
          saveInfo("prepare", state.prepare)
          break;
        case "finish":
          state.finish.content[parentIndex].lists[sonIndex].plans[currentIndex].plan_title = title
          saveInfo("finish", state.finish)
          break;
      }
    },
    // 拖拽排序
    sortListById(state,payload){
      let name = payload.id
      let newIndex = payload.newIndex
      let oldIndex = payload.oldIndex
      switch (name) {
        case "now":
          let before = state.now.content.splice(oldIndex, 1)
          state.now.content.splice(newIndex, 0, before[0])
          saveInfo("now", state.now)
          break;
        case "prepare":
          let before2 = state.prepare.content.splice(oldIndex, 1)
          state.prepare.content.splice(newIndex, 0, before2[0])
          saveInfo("prepare", state.prepare)
          break;
        case "finish":
          let before3 = state.finish.content.splice(oldIndex, 1)
          state.finish.content.splice(newIndex, 0, before3[0])
          saveInfo("finish", state.finish)
          break;
      }



      state.listCard.forEach(info => {
        if (info.id == id) {
          let before = info.content.splice(oldIndex, 1)
          info.content.splice(newIndex, 0, before[0])
        }
      })
      saveInfo(state.listCard)
    },
    // 拖拽排序---清单计划
    sortPlanById(state, payload) {
      let name = payload.name
      let newIndex = payload.newIndex
      let oldIndex = payload.oldIndex
      let parentIndex = payload.parentIndex
      let num = payload.num

      switch (name) {
        case "now":
          let before = state.now.content[parentIndex].lists[num].plans.splice(oldIndex, 1)
          state.now.content[parentIndex].lists[num].plans.splice(newIndex, 0, before[0])
          saveInfo("now", state.now)
          break;
        case "prepare":
          let before2 = state.prepare.content[parentIndex].lists[num].plans.splice(oldIndex, 1)
          state.prepare.content[parentIndex].lists[num].plans.splice(newIndex, 0, before2[0])
          saveInfo("prepare", state.prepare)
          break;
        case "finish":
          let before3 = state.finish.content[parentIndex].lists[num].plans.splice(oldIndex, 1)
          state.finish.content[parentIndex].lists[num].plans.splice(newIndex, 0, before3[0])
          saveInfo("finish", state.finish)
          break;
      }
    },
    // 拖拽计划切换状态
    togglePlanStatus(state,payload){
      let currentName = payload.currentName
      let targetName = payload.targetName
      let currentIndex = payload.currentIndex
      let targetIndex = payload.targetIndex
      let that = payload.that
      let info;
      // 从对应的地方取移动的对象
      
      try {
          if (currentName == "now") {
            info = state.now.content.splice(currentIndex, 1)[0]
            saveInfo("now", state.now)
          } else if (currentName == "prepare") {
            info = state.prepare.content.splice(currentIndex, 1)[0]
            saveInfo("prepare", state.prepare)
          } else if (currentName == "finish") {
            info = state.finish.content.splice(currentIndex, 1)[0]
            saveInfo("finish", state.finish)
          }
          // 将目标对象的特殊值赋值
          if (targetName == "now") {
            let nowId = state.now.id
            info.cardName = "now"
            info.id = nowId
            info.lists.forEach(res => {
              res.cardName = "now"
              res.plans.forEach(item => {
                item.cardName = "now"
              })
            })
            state.now.content.splice(targetIndex,0,info)
            saveInfo("now", state.now)
          } else if (targetName == "prepare") {
            let prepareId = state.prepare.id
            info.cardName = "prepare"
            info.id = prepareId
            info.lists.forEach(res => {
              res.cardName = "prepare"
              res.plans.forEach(item => {
                item.cardName = "prepare"
              })
            })
            state.prepare.content.splice(targetIndex, 0, info)
            saveInfo("prepare", state.prepare)
          } else if (targetName == "finish") {
            let finishId = state.finish.id
            info.cardName = "finish"
            info.id = finishId
            info.lists.forEach(res => {
              res.cardName = "finish"
              res.plans.forEach(item => {
                item.cardName = "finish"
              })
            })
            state.finish.content.splice(targetIndex, 0, info)
            saveInfo("finish", state.finish)
          }
      } catch(err) {
        that.$message.warning("拖动失败，请刷新页面后再次尝试！")
      }
    }
  },
  actions: {
    // 获取创建的元素信息,请求接口获取数据
    getCreatedCardsInfos({state}){
      let now = 
        {
          cardName: 'now',
          id: guid(),
          title: "正在做",
          content: []
        }
      
      let prepare = 
        {
          cardName: 'prepare',
          id: guid(),
          title: "准备做",
          content: []
        }
      
      let finish = 
        {
          cardName: 'finish',
          id: guid(),
          title: "已完成",
          content: []
        }
      
      
      // let listCard = [
      //     {
      //       cardName:'now',
      //       id: guid(),
      //       title: "正在做",
      //       content: []
      //     }, {
      //       cardName:'prepare',
      //       id: guid(),
      //       title: "准备做",
      //       content: []
      //     }, {
      //       cardName:'finish',
      //       id: guid(),
      //       title: "已完成",
      //       content: []
      //     },
      // ];
      // if (localStorage.getItem("listCard")) {
      //   state.listCard = JSON.parse(localStorage.getItem("listCard"))
      // } else {
      //   localStorage.setItem("listCard", JSON.stringify(listCard));
      //   state.listCard = listCard
      // }

      // 正在做
      if (localStorage.getItem("now")) {
        state.now = JSON.parse(localStorage.getItem("now"))
      } else {
        localStorage.setItem("now", JSON.stringify(now));
        state.now = now
      }
      // 准备做
      if (localStorage.getItem("prepare")) {
        state.prepare = JSON.parse(localStorage.getItem("prepare"))
      } else {
        localStorage.setItem("prepare", JSON.stringify(prepare));
        state.prepare = prepare
      }
      // 已完成
      if (localStorage.getItem("finish")) {
        state.finish = JSON.parse(localStorage.getItem("finish"))
      } else {
        localStorage.setItem("finish", JSON.stringify(finish));
        state.finish = finish
      }
    }
  }
})