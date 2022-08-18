<template>
  <div>
    <!-- 
        Layout 布局# 通过基础的 24 分栏，迅速简便地创建布局。:span来进行分割
        支持列间距,行提供 gutter 属性来指定列之间的间距，其默认值为0。
    
    -->
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card shadow="hover" class="mgb20" style="height:252px;">
          <div class="user-info">
            <img src="../assets/img/img.jpg" class="user-avator" alt />
            <div class="user-info-cont">
              <div class="user-info-name">{{ name }}</div>
              <div>{{ role }}</div>
            </div>
          </div>
          <div class="user-info-list">
            上次登录时间：
            <span>2022-08-17</span>
          </div>
          <div class="user-info-list">
            上次登录地点：
            <span>浙江</span>
          </div>
        </el-card>

        <!-- <el-row> <el-col>标签是属于element的Layout布局控件，并且分成24分栏。 -->
        <!-- 语言卡片 -->
        <el-card shadow="hover" style="height:252px;">
          <template #header>
            <div class="clearfix">
              <span>语言详情</span>
            </div>
          </template>
          <p>Vue</p>
          <!-- ogress 组件可通过 stroke-width 属性更改进度条的高度，并可通过 text-inside 属性来改变进度条内部的文字。 -->
          <el-progress :percentage="70.3" color="#42b983" :stroke-width="16" :text-inside="true"></el-progress>
          <p>JavaScript</p>
          <el-progress :percentage="25.2" color="#f1e05a" :stroke-width="16" :text-inside="true"></el-progress>
          <p>CSS</p>
          <el-progress :percentage="23.7" :stroke-width="16" :text-inside="true"></el-progress>
          <p>HTML</p>
          <el-progress :percentage="15.9" color="#f56c6c" :stroke-width="16" :text-inside="true"></el-progress>
        </el-card>
      </el-col>

      <!-- 访问栏 -->
      <el-col :span="16">
        <el-row :gutter="20" class="mgb20">
          <el-col :span="8">
            <el-card shadow="hover" :body-style="{ padding: '0px' }">
              <div class="grid-content grid-con-1">
                <i class="el-icon-user-solid grid-con-icon"></i>
                <div class="grid-cont-right">
                  <div class="grid-num">1234</div>
                  <div>用户访问量</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="hover" :body-style="{ padding: '0px' }">
              <div class="grid-content grid-con-2">
                <i class="el-icon-message-solid grid-con-icon"></i>
                <div class="grid-cont-right">
                  <div class="grid-num">321</div>
                  <div>系统消息</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="hover" :body-style="{ padding: '0px' }">
              <div class="grid-content grid-con-3">
                <i class="el-icon-s-goods grid-con-icon"></i>
                <div class="grid-cont-right">
                  <div class="grid-num">5000</div>
                  <div>数量</div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>

        <!-- 代办事项 -->
        <el-card shadow="hover" style="height:403px;">
          <template #header>
            <div class="clearfix">
              <span>待办事项</span>
              <el-button style="margin-right:25px; float: right; padding: 3px 0" type="text" @click="dialogVisible = true ">添加</el-button>
            </div>
          </template>

          <el-table :show-header="false" :data="todoList" style="width:100%;" max-height="300">
            <el-table-column width="40">
              <template #default="scope">
                <el-checkbox v-model="scope.row.status"></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column label="待办详情">
              <template #default="scope">
                <div class="todo-item" :class="{'todo-item-del': scope.row.status,}">
                  {{ scope.row.title }}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="80">
              <el-button type="danger" size="small" plain @click="delTodo()">删除</el-button>
            </el-table-column>

          </el-table>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card shadow="hover">
          <schart ref="bar" class="schart" canvasId="bar" :options="options"></schart>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="hover">
          <schart ref="line" class="schart" canvasId="line" :options="options2"></schart>
        </el-card>
      </el-col>
    </el-row>
  </div>
  <div>
    <!-- 添加代办事项提示框 -->
    <el-dialog v-model="dialogVisible" title="添加待办事项" width="40%">
      <el-form>
        <el-form-item label="待办详情:" label-width="20">
          <el-input size="small" show-word-limit v-model="newTodoText" maxlength="20" placeholder="Please input" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="addTodo">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import Schart from "vue-schart";
import { reactive, ref } from "vue";
import { ElMessage } from 'element-plus';
export default {
  name: "dashboard",
  components: { Schart },
  setup() {

    //   Uncaught TypeError: Assignment to constant variable. --- const不能改变
    const name = localStorage.getItem("ms_username");
    const role = name === "admin" ? "超级管理员" : "普通用户";
    const data = reactive([
      {
        name: "2018/09/04",
        value: 1083,
      },
      {
        name: "2018/09/05",
        value: 941,
      },
      {
        name: "2018/09/06",
        value: 1139,
      },
      {
        name: "2018/09/07",
        value: 816,
      },
      {
        name: "2018/09/08",
        value: 327,
      },
      {
        name: "2018/09/09",
        value: 228,
      },
      {
        name: "2018/09/10",
        value: 1065,
      },
    ]);
    const options = {
      type: "bar",
      title: {
        text: "示例图表一",
      },
      grid: {
        show: true,
        left: "0%",
        top: "0%",
        right: "0%",
        bottom: "0%",
      },

      xRorate: 25,
      labels: ["周一", "周二", "周三", "周四", "周五"],
      datasets: [
        {
          label: "家电",
          data: [234, 278, 270, 190, 280],
        },
        {
          label: "百货",
          data: [164, 178, 190, 135, 160],
        },
        {
          label: "食品",
          data: [144, 198, 150, 235, 120],
        },
      ],
    };
    const options2 = {
      type: "line",
      title: {
        text: "示例图表二",
      },
      grid: {
        show: true,
        left: "0%",
        top: "0%",
        right: "0%",
        bottom: "0%",
        containLabel: true
      },
      labels: ["6月", "7月", "8月", "9月", "10月"],
      datasets: [
        {
          label: "家电",
          data: [234, 278, 270, 190, 230],
        },
        {
          label: "百货",
          data: [164, 178, 150, 135, 160],
        },
        {
          label: "食品",
          data: [74, 118, 200, 235, 90],
        },
      ],
    };
    const todoList = reactive([
      {
        id: 1,
        title: "今天要写100行代码加几个bug吧",
        status: false,
      },
      {
        id: 2,
        title: "今天要修复100个bug",
        status: false,
      },
      {
        id: 3,
        title: "今天要修复100个bug",
        status: true,
      },
      {
        id: 4,
        title: "今天要写100行代码加几个bug吧",
        status: true,
      },
    ]);
    const newTodoText = ref('')
    const nextTodoId = ref(5)

    // 弹窗
    let dialogVisible = ref(false)

    const addTodo = () => {
      if (newTodoText.value == '') {
        ElMessage.error('不可以添加空的待办事项！')
      } else if (todoList.length >= 10) {
        ElMessage.error('待办列表已经添加满！')
      } else {
        todoList.unshift({
          id: nextTodoId.value++,
          title: newTodoText.value,
          status: false,
        });
        newTodoText.value = '';
        dialogVisible.value = false;
      }
    };

    const delTodo = (index) => {
      todoList.splice(index, 1)
    }

    return {
      name,
      data,
      options,
      options2,
      todoList,
      role,
      dialogVisible,
      nextTodoId,
      newTodoText,
      addTodo,
      delTodo
    };
  },
};
</script>

<style  lang="less" scoped>
/deep/ .el-table__body-wrapper::-webkit-scrollbar {
  width: 8px; /*滚动条宽度*/
  height: 8px; /*滚动条高度*/
}
/deep/ .el-table__body-wrapper::-webkit-scrollbar-track {
  border-radius: 0px; /*滚动条的背景区域的圆角*/
  background-color: rgb(245, 245, 245); /*滚动条的背景颜色*/
}
/deep/ .el-table__body-wrapper::-webkit-scrollbar-corner {
  background-color: rgb(254, 254, 255);
}
/deep/ .el-table__body-wrapper::-webkit-scrollbar-thumb {
  border-radius: 2px; /*滚动条的圆角*/
  background-color: rgb(52, 188, 252); /*滚动条的背景颜色*/
}
.el-row {
  margin-bottom: 20px;
}
.todoBtn {
  position: absolute;
  right: -10%;
  top: 32%;
  float: right;
  color: rgb(194, 85, 85);
}
.grid-content {
  display: flex;
  align-items: center;
  height: 100px;
}

.grid-cont-right {
  flex: 1;
  text-align: center;
  font-size: 14px;
  color: #999;
}

.grid-num {
  font-size: 30px;
  font-weight: bold;
}

.grid-con-icon {
  font-size: 50px;
  width: 100px;
  height: 100px;
  text-align: center;
  line-height: 100px;
  color: #fff;
}

.grid-con-1 .grid-con-icon {
  background: rgb(45, 140, 240);
}

.grid-con-1 .grid-num {
  color: rgb(45, 140, 240);
}

.grid-con-2 .grid-con-icon {
  background: rgb(100, 213, 114);
}

.grid-con-2 .grid-num {
  color: rgb(45, 140, 240);
}

.grid-con-3 .grid-con-icon {
  background: rgb(242, 94, 67);
}

.grid-con-3 .grid-num {
  color: rgb(242, 94, 67);
}

.user-info {
  display: flex;
  align-items: center;
  padding-bottom: 20px;
  border-bottom: 2px solid #ccc;
  margin-bottom: 20px;
}

.user-avator {
  width: 120px;
  height: 120px;
  border-radius: 50%;
}

.user-info-cont {
  padding-left: 50px;
  flex: 1;
  font-size: 14px;
  color: #999;
}

.user-info-cont div:first-child {
  font-size: 30px;
  color: #222;
}

.user-info-list {
  font-size: 14px;
  color: #999;
  line-height: 25px;
}

.user-info-list span {
  margin-left: 70px;
}

.mgb20 {
  margin-bottom: 20px;
}

.todo-item {
  font-size: 14px;
}

.todo-item-del {
  text-decoration: line-through;
  color: #999;
}

.schart {
  width: 100%;
  height: 300px;
}
</style>
