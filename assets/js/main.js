Vue.prototype.$axios = axios
new Vue({
    el:'#app',
    store,
    data:{

    },
    components: {
        Card
    },
    computed: {
        cardLists(){
            return [this.$store.state.now, this.$store.state.prepare, this.$store.state.finish]
        },
    },
    created() {
        this.$store.dispatch("getCreatedCardsInfos")
    },
    mounted() {
        
        let that = this
        // 标签卡的移动
        let $card = this.$el.querySelectorAll(".card_content");
        $card.forEach(el => {
            new Sortable(el, {
                group: {
                    name: '.card_content',
                    pull: true,
                    put: ['.card_content'],
                    swapThreshold: 1,
                    scroll: true,
                },
                animation: 150,
                onUpdate(event) {
                    let newIndex = event.newIndex
                    let oldIndex = event.oldIndex
                    let parentId = event.item.dataset.id
                    $li = el.children[newIndex],
                    $oldLi = el.children[oldIndex]
                    el.removeChild($li)
                    if (newIndex > oldIndex) {
                        el.insertBefore($li, $oldLi)
                    } else {
                        el.insertBefore($li, $oldLi.nextSibling)
                    }
                    that.$store.commit("sortListById", {
                        id: parentId,
                        newIndex,
                        oldIndex
                    })
                },
                onAdd(event){
                    console.log(event);
                    
                    let current = event.item.dataset.id
                    let target = event.target.dataset.id
                    let currentIndex = event.oldIndex
                    let targetIndex = event.newIndex
                    that.$store.commit("togglePlanStatus", {
                        currentName: current,
                        targetName: target,
                        currentIndex,
                        targetIndex,
                        that
                    })
                    
                }
            })
        })
        // 标签容器的移动
        let $box = this.$el.querySelectorAll(".wrap")
        $box.forEach(el => {
            new Sortable(el, {
                group: {
                    name: '.card_list_box',
                    pull: true,
                    swapThreshold: 1,
                    scroll:true,
                    put: ['.wrap']
                },
                animation: 150
            })
        })
    },
    directives: {
        focus:{
            inserted(el){
                el.focus()
            }
        }
    }
})