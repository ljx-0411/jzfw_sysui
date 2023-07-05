<!--
 * @Description: 基础配置页面
 * @Author: Ronda
 * @Date: 2021-05-12 17:23:55
 * @LastEditors: Ronda
 * @LastEditTime: 2021-05-27 12:42:59
-->
<template>
  <div class>
    <!-- 按钮 -->
    <el-button type="primary" size="small" @click="toAdd">新增</el-button>
    <!-- 表格 -->
    <el-table v-loading="loading" :data="currentData" size="mini">
      <el-table-column type="index" :index="1" label="序号" width="55" align="center" />
      <el-table-column prop="name" label="名称" align="center" />
      <el-table-column prop="val" label="值" align="center">
        <template slot-scope="scope">
          <el-image
            v-if="judgeHandler(scope.row.val)"
            style="height:60px"
            :src="scope.row.val"
            fit="contain"
          />
          <span v-else>{{ scope.row.val }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="introduce" label="介绍" align="center" />
      <el-table-column fixed="right" label="操作" align="center" width="120">
        <template slot-scope="scope">
          <a class="green_info" type="text" size="small" @click.prevent="toEdit(scope.row)">编辑</a>
          <a class="red_info" type="text" size="small" @click.prevent="toDelete(scope.row.id)">删除</a>
        </template>
      </el-table-column>
    </el-table>
    <!-- 模态框 -->
    <el-dialog :title="title" :visible.sync="visible">
      <el-form ref="baseConfig_form" :model="form" :rules="rules">
        <el-form-item label="名称" label-width="100px" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="介绍" label-width="100px" prop="introduce">
          <el-input v-model="form.introduce" />
        </el-form-item>
        <el-form-item label="类型" label-width="100px">
          <el-select v-model="type" placeholder="请选择">
            <el-option label="文字" value="文字" />
            <el-option label="图片" value="图片" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="type === '文字'" label="值" label-width="100px" prop="val">
          <el-input v-model="form.val" />
        </el-form-item>
        <el-form-item v-else label="图片上传" label-width="100px" prop="val">
          <el-upload
            class="avatar-uploader"
            :action="uploadFileURL"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
          >
            <img v-if="form.val" :src="form.val" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="visible = false">取 消</el-button>
        <el-button type="primary" size="small" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { findAll, deleteById, saveOrUpdate } from "@/api/baseConfig";
import { uploadFileURL, showFileURL } from "@/utils/config";
export default {
  // 组件名称
  name: "Demo",
  // 组件参数 接收来自父组件的数据
  props: {},
  // 组件状态值
  data() {
    return {
      uploadFileURL,
      currentData: [],
      loading: false,
      title: "",
      rules: {
        name: [{ required: true, message: "请输轮播图名称", trigger: "blur" }],
        introduce: [
          { required: true, message: "请输入轮播图介绍信息", trigger: "blur" },
        ],
        url: [{ required: true, message: "请上传轮播图", trigger: "change" }],
      },
      visible: false,
      form: {},
      type: "文字",
    };
  },
  // 计算属性
  computed: {},
  // 侦听器
  watch: {},
  // 以下是生命周期钩子
  /**
   * 组件实例创建完成，属性已绑定，但DOM还未生成，$ el属性还不存在
   */
  created() {
    this.queryData();
  },
  /**
   * el 被新创建的 vm.$ el 替换，并挂载到实例上去之后调用该钩子。
   * 如果 root 实例挂载了一个文档内元素，当 mounted 被调用时 vm.$ el 也在文档内。
   */
  mounted() {},
  // 组件方法
  methods: {
    /**
     * @description: 查询所有基础配置信息
     * @param {*}
     * @return {*}
     */
    async queryData() {
      this.loading = true;
      let res = await findAll();
      this.currentData = res.data;
      this.loading = false;
    },
    /**
     * @description: 新增按钮
     * @param {*}
     * @return {*}
     */
    toAdd() {
      this.form = {};
      this.title = "新增基础配置";
      this.visible = true;
    },
    /**
     * @description:  编辑按钮
     * @param {*} row
     * @return {*}
     */
    toEdit(row) {
      var sub = row.val.substring(row.val.lastIndexOf(".") + 1, row.val.length);
      if (sub === "jpg" || sub === "jpeg" || sub === "png") {
        this.type = "图片";
      } else {
        this.type = "文字";
      }
      this.form = { ...row };
      this.visible = true;
    },
    /**
     * @description: 删除按钮
     * @param {*} id
     * @return {*}
     */
    toDelete(id) {
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        let res = await deleteById({ id });
        this.$message({ type: "success", message: res.message });
        this.queryData(); // 重载数据
      });
    },
    /**
     * @description: 图片成功上传回调
     * @param {*} res
     * @param {*} file
     * @return {*}
     */
    handleAvatarSuccess(res, file) {
      if (res.status === 200) {
        this.$set(this.form, "val", res.data.url);
      } else {
        this.$message({ type: "error", message: "附件服务器异常！" });
      }
    },
    /**
     * @description: 表单提交按钮
     * @param {*}
     * @return {*}
     */
    submitForm() {
      this.$refs["baseConfig_form"].validate(async (valid) => {
        if (valid) {
          let res = await saveOrUpdate(this.form);
          this.$message.success(res.message); // 提示成功信息
          this.queryData(); // 重载数据
          this.visible = false; // 关闭模态框
        } else {
          return false;
        }
      });
    },
    // 判断val值
    judgeHandler(val) {
      var bool;
      var sub = val.substring(val.lastIndexOf(".") + 1, val.length);
      if (sub === "jpg" || sub === "jpeg" || sub === "png") {
        bool = true;
      } else {
        bool = false;
      }
      return bool;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<!--使用了scoped属性之后，父组件的style样式将不会渗透到子组件中，-->
<!--然而子组件的根节点元素会同时被设置了scoped的父css样式和设置了scoped的子css样式影响，-->
<!--这么设计的目的是父组件可以对子组件根元素进行布局。-->
<style >
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
