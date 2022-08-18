<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 基础表格
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-select v-model="query.address" placeholder="地址" class="handle-select mr10">
          <el-option key="1" label="浙江省" value="浙江省"></el-option>
          <el-option key="2" label="广东省" value="广东省"></el-option>
          <el-option key="3" label="湖南省" value="湖南省"></el-option>
          <el-option key="4" label="云南省" value="云南省"></el-option>
          <el-option key="5" label="上海市" value="上海市"></el-option>
        </el-select>
        <el-input v-model="query.name" placeholder="用户名" class="handle-input mr10"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
        <el-button type="success" @click="addUserInfo">添加用户</el-button>
      </div>
      <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
        <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
        <el-table-column prop="name" label="用户名"></el-table-column>
        <el-table-column label="账户余额">
          <template #default="scope">￥{{ scope.row.money }}</template>
        </el-table-column>
        <!-- 查看大图  el-image 有内置属性
             preview-src-list	开启图片预览功能
             initial-index	    初始预览图像索引，小于 url-list 的长度
        -->
        <el-table-column label="头像(查看大图)" align="center">
          <template #default="scope">
            <el-image class="table-td-thumb" :src="scope.row.thumb" :preview-src-list="[scope.row.thumb]">
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="地址"></el-table-column>
        <el-table-column label="状态" align="center">
          <template #default="scope">
            <el-tag :type="
                                scope.row.state === '成功'
                                    ? 'success'
                                    : scope.row.state === '失败'
                                    ? 'danger'
                                    : ''
                            ">{{ scope.row.state }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="date" label="注册时间"></el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template #default="scope">
            <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑
            </el-button>
            <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination background layout="total, prev, pager, next" :current-page="query.pageIndex" :page-size="query.pageSize" :total="pageTotal" @current-change="handlePageChange"></el-pagination>
      </div>
    </div>

    <!-- 编辑弹出框 -->
    <el-dialog title="编辑" v-model="editVisible" width="30%">
      <el-form label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="form.address"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveEdit">确 定</el-button>
        </span>
      </template>
    </el-dialog>

    <div>
      <!-- 添加用户弹出框 -->
      <el-dialog title="添加用户" v-model="addVisible" width="60%">
        <el-form label-width="70px">
          <el-form-item label="用户名">
            <el-input v-model="postFormData.name" maxlength="10" show-word-limit></el-input>
          </el-form-item>
          <el-form-item label="地址">
            <el-input v-model="postFormData.address" maxlength="10" show-word-limit></el-input>
          </el-form-item>
          <el-form-item label="账户余额">
            <el-input v-model="postFormData.money" maxlength="10" show-word-limit></el-input>
          </el-form-item>
          <el-form-item label="头像">

            <el-upload class="upload-demo" action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15" :show-file-list="false" :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload">
              <img v-if="imageUrl" :src="imageUrl" class="avatar" />
              <div>
                <i class="el-icon-upload"></i>
              </div>
              <em>点击此处上传图片</em>
            </el-upload>

          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="opValue" placeholder="请选择状态">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="注册时间">
            <el-input v-model="nowDate"></el-input>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="closeAdd">取 消</el-button>
            <el-button type="primary" @click="addUserInfo">确 定</el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { ref, reactive, toRaw } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { fetchData, postTableData } from "../api/index";

export default {
  name: "basetable",
  setup() {


    //时间格式
    const formatDate = (fmt) => {
      let date = new Date()
      let o = {
        'Y+': date.getFullYear(),
        'M+': date.getMonth() + 1, // 月
        'D+': date.getDate(), // 日
        'h+': date.getHours(), // 时
        'm+': date.getMinutes(), // 分
        's+': date.getSeconds(), // 秒
        W: date.getDay() // 周
      }
      for (let k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
          fmt = fmt.replace(RegExp.$1, () => {
            if (k === 'W') {
              // 星期几
              const week = ['日', '一', '二', '三', '四', '五', '六']
              return week[o[k]]
            } else if (k === 'Y+' || RegExp.$1.length === 1) {
              // 年份 or 小于10不加0
              return o[k]
            } else {
              return ('00' + o[k]).substr(('' + o[k]).length) // 小于10补位0
            }
          })
        }
      }
      return fmt
    }

    const query = reactive({
      address: "",
      name: "",
      pageIndex: 1,
      pageSize: 10,
    });
    const tableData = ref([]);
    const pageTotal = ref(0);
    // 获取表格数据
    const getData = () => {
      fetchData(query).then((res) => {
        tableData.value = res.list;
        pageTotal.value = res.pageTotal || 50;
      });
    };
    getData();

    // 查询操作
    const handleSearch = () => {
      query.pageIndex = 1;
      getData();
    };
    // 分页导航
    const handlePageChange = (val) => {
      query.pageIndex = val;
      getData();
    };

    // 删除操作
    const handleDelete = (index) => {
      // 二次确认删除
      ElMessageBox.confirm("确定要删除吗？", "提示", {
        type: "warning",
      })
        .then(() => {
          ElMessage.success("删除成功");
          tableData.value.splice(index, 1);
        })
        .catch(() => { });
    };

    // 表格编辑时弹窗和保存
    const editVisible = ref(false);
    let form = reactive({
      name: "",
      address: "",
    });
    let idx = -1;
    const handleEdit = (index, row) => {
      idx = index;
      Object.keys(form).forEach((item) => {
        form[item] = row[item];
      });
      editVisible.value = true;
    };
    const saveEdit = () => {
      editVisible.value = false;
      ElMessage.success(`修改第 ${idx + 1} 行成功`);
      Object.keys(form).forEach((item) => {
        tableData.value[idx][item] = form[item];
      });
    };

    // 状态选择
    const opValue = ref('')
    const options = [
      {
        value: '成功',
        label: '成功',
      },
      {
        value: '失败',
        label: '失败',
      }]


    // 添加用户当前时间
    const nowDate = ref(formatDate('YY-MM-DD'))

    // 用户头像上传
    const imageUrl = ref('')
    const handleAvatarSuccess = (
      response,
      uploadFile
    ) => {
      imageUrl.value = URL.createObjectURL(uploadFile)
    }
    const beforeAvatarUpload = (rawFile) => {
      if (rawFile.type !== 'image/jpeg') {
        ElMessage.error('图片必须是jpeg格式!')
        return false
      } else if (rawFile.size / 1024 / 1024 > 2) {
        ElMessage.error('图片大小不能超过2MB!')
        return false
      }
      return true
    }

    /* const getData = () => {
      fetchData(query).then((res) => {
        tableData.value = res.list;
        pageTotal.value = res.pageTotal || 50;
      });
    }; */
    // 用户id
    const uid = ref(5)

    // 新增用户信息按钮
    const postFormData = reactive({
      id: uid.value++,
      name: '',
      money: '',
      address:'',
      state:'',
      date: formatDate('YY-MM-DD'),
      thumb:"https://lin-xin.gitee.io/images/post/node3.png"
    });

    // 添加用户
    const addVisible = ref(false)
    const addUserInfo = () => {
      addVisible.value = true;
      postTableData(postFormData).then((res) => {
        console.log(res);
        res.list.push(toRaw(postFormData));
      })
      addVisible.value = false;
      getData();
    }
    // 关闭新增窗口
    const closeAdd = () => {
      addVisible.value = false;
    }

    return {
      query,
      tableData,
      pageTotal,
      editVisible,
      form,
      handleSearch,
      handlePageChange,
      handleDelete,
      handleEdit,
      saveEdit,
      addVisible,
      addUserInfo,
      opValue,
      options,
      nowDate,
      imageUrl,
      handleAvatarSuccess,
      beforeAvatarUpload,
      formatDate,
      closeAdd,
      postFormData,
      uid
    };
  },
};
</script>

<style scoped>
.handle-box {
  margin-bottom: 20px;
}

.handle-select {
  width: 120px;
}

.handle-input {
  width: 300px;
  display: inline-block;
}
.table {
  width: 100%;
  font-size: 14px;
}
.red {
  color: #ff0000;
}
.mr10 {
  margin-right: 10px;
}
.table-td-thumb {
  display: block;
  margin: auto;
  width: 40px;
  height: 40px;
}
</style>
