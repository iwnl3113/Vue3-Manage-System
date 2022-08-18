import { defineStore } from 'pinia'


// 1.定义并且导出容器
// 参数一:容器的id必须唯一pinia会把索引的容器挂载到根容器
export const useTagsStore = defineStore('tags', {
    // 类似data，存储全局状态
    // data拿到的数据不是响应式的，Pinia其实就是把state数据做了 reactive处理
    /* 
    // 例子 通过解构出来的 const { count,foo } = mainStore count和foo 他们不具备响应式
        解决办法：使用pinia提供的api storeToRefs(mainStore)
            把解构出来的数据做ref 响应式代理
            const { count,foo } = storeToRefs(mainStore)

            如果需要修改多个数据，使用$patch进行批量更新
            mainStore.$patch(state=>{
                count:mainStore.count + 1,
                foo:'hello'
                arr:[...mainStore.arr, newValue ]
            })
    */
    state: () => {
        return {
            list: []
        }
    },

    getters: {
        /* 
            类似组件的computed,用来封装计算属性,有缓存功能
            如果在getters中使用了 this 则必须手动返回指定的类型，否则类型推导不出来
        */
        show: (state) => {
            return state.list.length > 0;
        },
        nameList: (state) => {
            return state.list.map(item => item.name);
        }
    },
    actions: {
        // 删除单个tagsItem
        delTagsItem(index) {
            this.list.splice(index, 1);
        },
        setTagsItem(data) {
            this.list.push(data)
        },
        clearTags() {
            this.list = []
        },
        closeTagsOther(data) {
            this.list = data;
        },
        closeCurrentTag(data) {
            console.log(data)
            for (let i = 0, len = this.list.length; i < len; i++) {
                const item = this.list[i];
                // $route.fullPath 路由完整地址
                if (item.path === data.$route.fullPath) {
                    if (i < len - 1) {
                        data.$router.push(this.list[i + 1].path);
                    } else if (i > 0) {
                        data.$router.push(this.list[i - 1].path);
                    } else {
                        data.$router.push("/");
                    }
                    this.list.splice(i, 1);
                    break;
                }
            }
        },
    }
})