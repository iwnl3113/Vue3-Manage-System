<template>
  <div class="about">
    <v-header />
    <v-sidebar />
    <div class="content-box" :class="{ 'content-collapse': sidebar.collapse }">
      <v-tags></v-tags>
      <div class="content">
        <router-view v-slot="{ Component }">
          <transition name="move" mode="out-in">
            <!-- 
                在Vue3中使用<keep-alive></keep-alive>做页面缓存后，检查每个页面是否有根标签，在Vue3中可以不写跟标签，但做缓存的时候要加上。
                报错信息:Component inside ＜Transition＞ renders non-element root node that cannot be animated.
                出现Bug 路由加载不出页面只有二次刷新才行
                
             -->
            <div>
              <keep-alive :include="tags.nameList">
                <component :is="Component" />
              </keep-alive>
            </div>
          </transition>
        </router-view>
        <!-- <el-backtop target=".content"></el-backtop> -->
      </div>
    </div>
  </div>
</template>
<script>
import { useSidebarStore } from '../store/sidebar'
import { useTagsStore } from '../store/tags'
import vHeader from "../components/Header.vue";
import vSidebar from "../components/Sidebar.vue";
import vTags from "../components/Tags.vue";
export default {
  components: {
    vHeader,
    vSidebar,
    vTags,
  },
  setup() {
    const sidebar = useSidebarStore();
    const tags = useTagsStore();
    return {
      tags,
      sidebar,
    };
  },
};
</script>
