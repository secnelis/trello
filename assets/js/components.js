// 卡片容器
const Card = {
    template:`<div class="card_list_box">
        <div class="card_box list-group">


            <div class="card_head">
                <div class="title_textarea" v-text="info.title"></div>
                <a href="javascript:;" class="operate_btn">
                    <a-icon type="drag" />
                </a>
            </div>

            <div class="card_content" id="cardBox" :data-id="info.cardName">
                <plan v-for="(other,index) in info.content" :sub="other" :key="index" :index="index" @handleEvent="handleEvent"></plan>
            </div>

            <div class="card_footer">
                <div class="add_new_card_btn" @click="startAdd" v-show="!isAdding">
                    <a-icon type="plus" />
                    <span>添加计划</span>
                </div>

                <div class="editor_box" v-show="isAdding">
                    <div class="input_box">
                        <input placeholder="为这张卡片输入标题" class="title_input" v-model.trim="createCardTitle" ref="card_input" @keyup.enter="addNewCard" @blur="exit" />
                    </div>
                    <div class="operate_box">
                        <a-button size="small" icon="edit" type="primary" class="add_btn special_btn_color" @click="addNewCard">添加卡片</a-button>
                        <a-icon type="close" @click="exitEdit" />
                    </div>
                </div>
            </div>

        </div>

    </div>`,
    methods: {
        addNewCard() {
            if (this.createCardTitle) {
                this.$store.commit("addNewSubTitle", {
                    name: this.info.cardName,
                    card_title: this.createCardTitle,
                    id:this.info.id
                })
                this.createCardTitle = ""
                this.$refs.card_input.focus()
            }
        },
        exit() {
            if (this.createCardTitle) {
                this.addNewCard()
            } else {
                this.exitEdit()
            }
        },
        exitEdit(){
            this.createCardTitle = ""
            this.isAdding = false
        },
        startAdd(){
            this.isAdding = true
            this.$nextTick(() => {
                this.$refs.card_input.focus()
            })
        },
        isBlur(e) {
            if (e.target.innerText) {
                this.info.title = e.target.innerText.replace(/^\s+|\s+$|\s+/gm, '')
                this.$store.commit("changeTitle", {
                    title: this.info.title,
                    name: this.info.cardName
                })
            }
        },
        leaveBlur(e){
            e.preventDefault();
            e.target.blur();
        },
        // 子元素事件回调
        handleEvent(payload){
            switch (payload.type) {
                // 改变卡片标题
                case "changeSubTitle":
                    this.changeSubTitle(payload)
                    break;
                // 改变卡片描述
                case "addSubDesc":
                    this.addSubDesc(payload)
                    break;
                case "addNewList":
                    this.addNewList(payload)
                    break;
                case "deleteOneCard":
                    this.deleteOneCard(payload)
                    break;
                case "deleteList":
                    this.deleteList(payload)
                    break;
                case "changelistTitle":
                    this.changelistTitle(payload)
                    break;
                case "handleEvent":
                    this.addNewPlan(payload)
                    break;
                case "toggleStatus":
                    this.toggleStatus(payload)
                case "finishCard":
                    this.finishCard(payload);
                    break;
                default:
                    break;
            }
        },
        // 改变卡片标题
        changeSubTitle(payload){
            this.$store.commit("changeSubTitle",{
                name:this.info.cardName,
                index: payload.index,
                sub_title: payload.sub_title
            })
        },
        // 修改卡片描述
        addSubDesc(payload){
            this.$store.commit("addSubDesc", {
                name: this.info.cardName,
                index: payload.index,
                desc: payload.desc
            })
        },
        // 添加清单
        addNewList(payload){
            this.$store.commit("addNewList",{
                name:this.info.cardName,
                index:payload.index
            })
        },
        // 删除此卡片
        deleteOneCard(payload) {
            this.$store.commit("deleteSmallList", {
                name: this.info.cardName,
                index: payload.index
            })
        },
        // 删除清单
        deleteList(payload){
            this.$store.commit("deleteList",{
                name:this.info.cardName,
                index:payload.index,
                num:payload.num
            })
        },
        // 改变清单的标题
        changelistTitle(payload){
            this.$store.commit("changelistTitle",{
                name:this.info.cardName,
                parentIndex: payload.listIndex,
                index:payload.num,
                list_title: payload.list_title
            })
        },
        // 添加计划
        addNewPlan(payload){
            this.$store.commit("addNewPlan",{
                name:this.info.cardName,
                listIndex: payload.listIndex,
                num: payload.num,
                title: payload.title
            })
        },
        // 改变任务难度
        toggleStatus(payload){
            this.$store.commit("toggleStatus",{
                name:this.info.cardName,
                index:payload.index,
                num:payload.num
            })
        },
        // 已完成
        finishCard(payload){
            this.$store.commit("finishCard",{
                name:payload.name,
                index:payload.index
            })
        }

    },
    props: {
        info:{
            required:true,
            type:Object
        }
    },
    data(){
        return {
            isAdding:false,
            createCardTitle:'',
        }
    },
    components: {
        "plan": {
            template: `<div class="plan_container list-group-item" :data-id="sub.cardName">
                        <div class="plan_box" :class="computedClass" @click.exact="showInfo" @mouseenter="showIcon" @mouseleave="hideIcon">
                            {{sub.sub_card_title}}
                            <a-icon type="edit" class="icon_edit" v-if="iconFlag" />     
                        </div>                   
                            <template v-if="hasFinishPlan">    
                                <div class="top_box">
                                    <div class="icon_ideas"  :class="computedClass">
                                        <a-icon type="file-protect" />
                                        {{hasFinishPlan}}
                                    </div> 
                                </div>
                            </template>

                    <a-modal v-model="showPlanDetail" class="plan_details_modal" width="768px" :footer="null" centered>
                        <div class="plan_detail_content">

                            <!-- 标题 -->
                            <div class="title_top">
                                <div class="suggest_icon">
                                    <a-icon type="book" />
                                </div>
                                <div class="details_box" contenteditable v-text="sub.sub_card_title" @blur="changeVal"  @keydown.enter="leaveBlur">
                                </div>
                            </div>

                            <div class="content_bottom">
                                <!-- 左侧 -->
                                <aside class="left_details_box">
                                
                                    <!-- 描述-->
                                    <div class="plan_item">
                                        <div class="suggest_icon">
                                            <div class="icon">
                                                <a-icon type="file-unknown" />
                                            </div>
                                            <span>描述</span>
                                        </div>
                                        <div class="details_box" placeholder="添加详细描述..." contenteditable v-text="sub.desc"   @keydown.enter="leaveBlur" @blur="addDesc"></div>
                                    </div>
                                
                                    <!-- 清单-->
                                    <div class="plan_item">
                                        <lists v-for="(item,num) in sub.lists" @handleEventBySon="handleEventBySon" :plans="item" :parentIndex="index" :num="num" :key="num"></lists>
                                    </div>
                                
                                </aside>

                                <!-- 右侧 -->
                                <aside class="operate_board">
                                    <div class="operate_menu_title">添加至卡片</div>
                                    <div class="menu" @click="addMenu">
                                        <a-icon type="ordered-list" />
                                        <span>清单</span>
                                    </div>
                                    <div class="menu">
                                        <a-icon type="paper-clip" />
                                        <span>附件</span>
                                    </div>
                                    <div class="menu" @click="deleteOneCard">
                                        <a-icon type="delete" />
                                        <span>删除</span>
                                    </div>
                                    <template v-if="sub.cardName != 'finish'">
                                        <div class="menu special" @click="finishCard">
                                            <a-icon type="check" />
                                            <span>已完成</span>
                                        </div>
                                    </template>
                                        <div class="operate_status_title">状态</div>
                                        <div class="color_status" v-for="(status,index) in sub.status" :key="index" @click="toggleStatus(index)">
                                            <div class="color_tag" :class="[{'checked':status.isCheck},status.type]">

                                            </div>
                                            <span>{{status.name}}</span>
                                        </div>

                                </aside>
                            
                            </div>

                        </div>
                    </a-modal>
            </div>`,
            props: {
                sub:{
                    required:true,
                    type:Object
                },
                index:{
                    required:true,
                    type:Number
                }
            },
            methods: {
                leaveBlur(e) {
                    e.preventDefault();
                    e.target.blur();
                },
                showIcon(){
                    this.iconFlag = true;
                },
                hideIcon(){
                    this.iconFlag = false
                },
                showInfo(){
                    this.showPlanDetail = true
                },

                showInput() {
                    this.inputVisible = true
                    this.$nextTick(function () {
                        this.$refs.input.focus();
                    })
                },

                handleInputChange(e) {
                    this.inputValue = e.target.value
                },
                closeModel(){
                    this.showPlanDetail = false
                },
                saveModel(){
                    this.showPlanDetail = false
                },
                changeVal(e) {
                    if (e.target.innerText) {
                        this.sub.sub_card_title = e.target.innerText.replace(/^\s+|\s+$/gm, '')
                        this.$emit("handleEvent",{
                            type:'changeSubTitle',
                            index:this.index,
                            sub_title: this.sub.sub_card_title
                        })
                    }
                },
                addDesc(e){
                    if (e.target.innerText) {
                        this.sub.desc = e.target.innerText.replace(/^\s+|\s+$/gm, '')
                        this.$emit("handleEvent", {
                            type: 'addSubDesc',
                            index: this.index,
                            desc: this.sub.desc
                        })
                    }
                },
                addMenu() {
                    this.$emit("handleEvent", {
                        type: 'addNewList',
                        index: this.index
                    })
                },
                toggleStatus(index){
                    this.$emit("handleEvent",{
                        type:'toggleStatus',
                        index,
                        num:this.index
                    })
                },
                deleteOneCard() {
                    this.$emit("handleEvent", {
                        type: 'deleteOneCard',
                        index: this.index
                    })
                    this.showPlanDetail = false
                },
                finishCard(){
                    this.$emit("handleEvent", {
                        type: 'finishCard',
                        index:this.index,
                        name:this.sub.cardName
                    })
                },
                // 清单的事件
                handleEventBySon(payload){
                    switch (payload.type) {
                        case "deleteList":
                            this.$emit("handleEvent",{
                                type: 'deleteList',
                                index:payload.index,
                                num:payload.num
                            })
                            break;
                        case "changeListTitle":
                            this.$emit("handleEvent",{
                                type: 'changelistTitle',
                                listIndex: payload.listIndex,
                                num: payload.num,
                                list_title: payload.list_title
                            })
                            break;
                        case "addNewPlan":
                            this.$emit("handleEvent",{
                                type: 'handleEvent',
                                listIndex: payload.listIndex,
                                num: payload.num,
                                title: payload.title
                            })
                            break;
                        default:
                            break;
                    }
                }
            },
            data() {
                return {
                    showPlanDetail:false,
                    inputVisible: false,
                    inputValue: '',
                    iconFlag:false
                }
            },
            components: {
                "lists":{
                    template:`<div class="lists_box">
                            <!-- 标题 -->
                            <div class="title_top">
                                <div class="suggest_icon">
                                    <a-icon type="bars" />
                                </div>
                                <div class="lists_title" ref="current_title" contenteditable   @keydown.enter="leaveBlur" v-text="plans.list_title" @blur="changeVal">
                                </div>
                                <div class="delete_icon">
                                    <a-icon type="delete" @click="deletePlanList" />
                                </div>
                            </div>
                            <!-- 进度条 -->
                            <div class="progress_box" v-if="this.plans.plans.length > 0">
                                <a-progress :percent="percent" />
                            </div>

                            <div class="idea_box">
                                <idea v-for="(res,ind) in plans.plans" :ideaInfo="res" :key="ind" :sonIndex="num" :currentIndex="ind" :parentIndex="parentIndex"></idea>
                            </div>

                            <!-- 添加计划操作模块 -->
                            <div class="show_add" v-show="!isCreating" @click="startEdit">添加项目</div>
                            <div class="editor_box" v-show="isCreating">
                                <div class="input_box">
                                    <input placeholder="添加项目" class="title_input" @blur="exitEdit" v-model.trim="createPlanTitle" ref="title_input2" @keyup.enter="addPlan" />
                                </div>
                                <div class="operate_box">
                                    <a-button size="small" icon="edit" type="primary" class="add_btn special_btn_color" @click="addPlan">添加项目</a-button>
                                    <a-icon type="close" @click="exitEdit" />
                                </div>
                            </div>
                    </div>`,
                    data(){
                        return {
                            isCreating:false,
                            createPlanTitle:'',
                        }
                    },
                    props:{
                        plans:{
                            type:Object,
                            required:true
                        },
                        num:{
                            type:Number,
                            required:true
                        },
                        parentIndex:{
                            type:Number,
                            required:true
                        }
                    },
                    methods: {
                        leaveBlur(e) {
                            e.preventDefault();
                            e.target.blur();
                        },
                        changeVal(e) {
                            if (e.target.innerText) {
                                this.plans.list_title = e.target.innerText.replace(/^\s+|\s+$/gm, '')
                                this.$emit("handleEventBySon",{
                                    type:'changeListTitle',
                                    listIndex:this.parentIndex,
                                    num:this.num,
                                    list_title: this.plans.list_title
                                })
                                // let id = this.plans.parentId
                                // this.$store.commit("changelistTitle", {
                                //     id,
                                //     parentIndex: this.parentIndex,
                                //     index: this.num,
                                //     list_title: this.plans.list_title
                                // })
                            }
                        },
                        addPlan() {
                                if (this.createPlanTitle) {
                                    this.$emit("handleEventBySon", {
                                        type: 'addNewPlan',
                                        listIndex: this.parentIndex,
                                        num: this.num,
                                        title: this.createPlanTitle
                                    })
                                    this.$refs.title_input2.focus()
                                    this.createPlanTitle = ""
                                    // let id = this.plans.parentId
                                    // this.$store.commit("addNewPlan", {
                                    //     id,
                                    //     parentIndex:this.parentIndex,
                                    //     sonIndex:this.num,
                                    //     title: this.createPlanTitle
                                    // })
                                    // this.createPlanTitle = ""
                                    // this.$refs.title_input2.focus()
                                }
                        },
                        exitEdit(){
                            if (this.createPlanTitle) {
                                this.addPlan()
                            } else {
                                this.createPlanTitle = ""
                                this.isCreating = false
                            }
                        },
                        startEdit(){
                            this.isCreating = true
                            this.$nextTick(() => {
                                this.$refs.title_input2.focus()
                            })
                        },
                        // 删除清单
                        deletePlanList(){
                            this.$emit("handleEventBySon",{
                                type: 'deleteList',
                                index:this.parentIndex,
                                num:this.num
                            })
                        }
                    },
                    computed: {
                        percent(){
                            let total = this.plans.plans
                            let finishNum = 0
                            total.filter(num => {
                                if (num.finish) {
                                    finishNum ++
                                }
                            })
                            return Math.round(finishNum/total.length * 100)
                        }
                    },
                    components: {
                        "idea":{
                            template: `<!-- 模块 -->
                            <div class="plan_self" @mouseenter="showDele" @mouseleave="hideDele">
                                <div class="check_item">
                                    <a-checkbox :checked="ideaInfo.finish" @change="onChange"></a-checkbox>
                                </div>
                                <div class="plan_title" :class="{finish:ideaInfo.finish}" contenteditable   @keydown.enter="leaveBlur" v-text="ideaInfo.plan_title" @blur="changePlanVal"></div>
                                <div class="icon_box" v-if="isShow" @click="deleteIdea">
                                    <a-icon type="delete" />
                                </div>
                            </div>`,
                            props:{
                                ideaInfo:{
                                    required:true,
                                    type:Object
                                },
                                sonIndex:{
                                    required:true,
                                    type:Number
                                },
                                parentIndex:{
                                    reruired:true,
                                    type:Number
                                },
                                currentIndex:{
                                    required:true,
                                    type:Number
                                }
                            },
                            methods: {
                                showDele() {
                                        this.isShow = true
                                },
                                leaveBlur(e) {
                                    e.preventDefault();
                                    e.target.blur();
                                },
                                hideDele() {
                                    this.isShow = false
                                },
                                onChange(e) {
                                    this.$store.commit("changePlanStatus", {
                                        name: this.ideaInfo.cardName,
                                        parentIndex:this.parentIndex,
                                        sonIndex:this.sonIndex,
                                        currentIndex:this.currentIndex,
                                        status: e.target.checked
                                    })
                                },
                                changePlanVal(e) {
                                    if (e.target.innerText) {
                                        this.ideaInfo.plan_title = e.target.innerText.replace(/^\s+|\s+$/gm, '')
                                        this.$store.commit("changePlanDesc", {
                                            name: this.ideaInfo.cardName,
                                            parentIndex: this.parentIndex,
                                            sonIndex: this.sonIndex,
                                            currentIndex: this.currentIndex,
                                            title: this.ideaInfo.plan_title
                                        })
                                    }
                                },
                                deleteIdea(){
                                    this.$store.commit("deletePlan",{
                                        name: this.ideaInfo.cardName,
                                        parentIndex: this.parentIndex,
                                        sonIndex: this.sonIndex,
                                        currentIndex: this.currentIndex
                                    })
                                }
                            },
                            data(){
                                return {
                                    isShow: false
                                }
                            }
                        }
                    },
                    mounted() {
                        if (window.getSelection) { //ie11 10 9 ff safari
                            this.$refs.current_title.focus(); //解决ff不获取焦点无法定位问题
                            var range = window.getSelection(); //创建range
                            range.selectAllChildren(this.$refs.current_title); //range 选择obj下所有子内容
                            range.collapseToEnd(); //光标移至最后
                        } else if (document.selection) { //ie10 9 8 7 6 5
                            var range = document.selection.createRange(); //创建选择对象
                            //var range = document.body.createTextRange();
                            range.moveToElementText(this.$refs.current_title); //range定位到obj
                            range.collapse(false); //光标移至最后
                            range.select();
                        }
                            
                            let that = this
                            // 清单列表的移动
                            let $ideaBox = this.$el.querySelectorAll(".idea_box")
                            $ideaBox.forEach(el => {
                                new Sortable(el, {
                                    group: {
                                        name: '.idea_box',
                                        pull: true,
                                        put: ['.idea_box'],
                                        swapThreshold: 1,
                                        scroll: true,
                                    },
                                    animation: 150,
                                    onUpdate(event) {
                                        let newIndex = event.newIndex
                                        let oldIndex = event.oldIndex
                                        let cardName = that.plans.cardName
                                        $li = el.children[newIndex]
                                        $oldLi = el.children[oldIndex]
                                        
                                        el.removeChild($li)
                                        if (newIndex > oldIndex) {
                                            el.insertBefore($li, $oldLi)
                                        } else {
                                            el.insertBefore($li, $oldLi.nextSibling)
                                        }
                                        
                                        that.$store.commit("sortPlanById", {
                                            name: cardName,
                                            parentIndex: that.parentIndex,
                                            num: that.num,
                                            newIndex,
                                            oldIndex
                                        })

                                    }
                                })
                            })
                    },
                }
            },
            computed: {
                hasFinishPlan() {
                    let total = 0;
                    let finish = 0;
                    if (this.sub.lists.length > 0) {
                        this.sub.lists.forEach(info => {
                            if (info.plans.length > 0) {
                                info.plans.forEach(plan => {
                                    if (plan.finish == true) {
                                        finish ++;
                                    }
                                    total++;
                                })
                            }
                        })
                    }
                    if (total != 0) {
                        return `${finish}/${total}`
                    } else {
                        return false
                    }
                },
                computedClass() {
                    let className = this.sub.status.find(res => {
                        return res.isCheck == true
                    }).type
                    if (className) {
                        return className
                    } else {
                        return 'no_begin'
                    }
                }
            }
        }
    },
    created () {

        
    }
}
