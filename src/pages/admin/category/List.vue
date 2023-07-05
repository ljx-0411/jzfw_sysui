<!--
 * @Description:产品栏目管理
 * @Author: Ronda
 * @Date: 2021-05-11 16:56:38
 * @LastEditors: Ronda
 * @LastEditTime: 2021-05-26 15:05:06
-->
<template>
  <div>
    <!-- 按钮 -->
    <el-button type="primary" size="mini" @click="toAdd">添加</el-button>
    <!-- 表格 -->
    <el-table v-loading="loading" size="mini" :data="currentData">
      <el-table-column type="index" :index="1" label="序号" />
      <el-table-column prop="id" label="栏目编号" />
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="url" label="图标" align="center">
        <template slot-scope="scope">
          <el-popover placement="right" trigger="hover">
            <el-image style="height:200px;width:200px" :src="scope.row.icon" fit="contain" />
            <el-image
              slot="reference"
              style="height:30px;width:30px"
              :src="scope.row.icon"
              fit="contain"
            />
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="num" label="排序号" align="center" />
      <el-table-column fixed="right" label="操作" align="center" width="100">
        <template slot-scope="scope">
          <a class="green_info" type="text" size="small" @click.prevent="toEdit(scope.row)">编辑</a>
          <a class="red_info" type="text" size="small" @click.prevent="toDelete(scope.row.id)">删除</a>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="pagination-div">
      <el-pagination
        :current-page="params.page"
        :page-sizes="[2,5,10, 15, 20]"
        :page-size="params.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <!-- 模态框 -->
    <el-dialog :title="title" :visible.sync="visible" @close="toClose">
      <el-form ref="category_form" :model="form" :rules="rules">
        <el-form-item label="栏目名称" label-width="80px" prop="name">
          <el-input v-model="form.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="序号" label-width="80px">
          <el-input v-model="form.num" autocomplete="off" />
        </el-form-item>
        <el-form-item label="图标" label-width="80px" prop="icon">
          <el-upload
            class="avatar-uploader"
            :action="uploadFileURL"
            :show-file-list="false"
            :on-success="uploadSuccess"
            :before-upload="beforeUpload"
          >
            <img v-if="imageUrl" :src="form.icon" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="toClose">取 消</el-button>
        <el-button type="primary" size="small" @click="toSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { deleteById, pageQuery, saveOrUpdate } from "@/api/proCategory";
import { uploadFileURL, showFileURL } from "@/utils/config";
export default {
  // 数据
  data() {
    return {
      uploadFileURL,
      // 上传的图片地址
      imageUrl: "",
      // 分页查询的栏目数据
      currentData: [],
      // 分页总数
      total: 0,
      // 加载中
      loading: false,
      // 模态框可见性
      visible: false,
      // 模态框标题
      title: "添加栏目信息",
      // 模态框表单数据
      form: {
        icon: "",
      },
      // 给后台的分页的参数
      params: {
        page: 1,
        pageSize: 10,
      },
      // 表单验证规则
      rules: {
        name: [{ required: true, message: "请输入栏目名称", trigger: "blur" }],
        icon: [
          { required: true, message: "请上传栏目图标", trigger: "change" },
        ],
      },
    };
  },
  computed: {},
  // 侦听器
  watch: {
    params: {
      handler() {
        this.queryData();
      },
      deep: true,
    },
  },
  // 生命周期
  created() {
    this.queryData();
  },
  // 方法
  methods: {
    uploadSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
      this.form.icon = res.data.url;
    },
    beforeUpload(file) {
      const isLt3M = file.size / 1024 / 1024 < 3;
      if (!isLt3M) {
        this.$message.error("上传头像图片大小不能超过 3MB!");
      }
      return isLt3M;
    },
    /**
     * @description: 分页每页条数发生变化的回调
     * @param {*} val  当前条数值
     * @return {*}
     */
    handleSizeChange(val) {
      this.params.pageSize = val;
      this.params.page = 1;
    },
    /**
     * @description: 页码发生变化的回调
     * @param {*} val  当前条数值
     * @return {*}
     */
    handleCurrentChange(val) {
      this.params.page = val;
    },
    /**
     * @description: 分页查找栏目数据
     * @param {*}
     * @return {*}
     */
    async queryData() {
      for (const key in this.params) {
        if (!this.params[key]) {
          delete this.params[key];
        }
      }
      this.loading = true;
      const res = await pageQuery(this.params);
      this.currentData = res.data.list || [];
      this.total = res.data.total || 0;
      this.loading = false;
    },
    /**
     * @description: 添加按钮事件
     * @param {*}
     * @return {*}
     */
    async toAdd() {
      this.title = "添加栏目信息";
      this.form = {};
      this.imageUrl = "";
      this.visible = true;
    },
    /**
     * @description: 编辑按钮事件
     * @param {*} row 要修改的栏目对象
     * @return {*}
     */
    async toEdit(row) {
      this.title = "编辑栏目信息";
      // 将要编辑的数据绑定表单中
      this.form = { ...row };
      this.imageUrl = this.form.icon;
      this.visible = true;
    },
    /**
     * @description: 批量删除按钮事件
     * @param {*}
     * @return {*}
     */
    batchDelete() {
      this.$confirm("此操作将永久批量删除数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        const res = await batchDelete({ ids: this.ids.toString() });
        this.$message({ type: "success", message: res.message });
        // 重载数据
        this.queryData();
      });
    },
    /**
     * @description: 删除按钮事件
     * @param {*} id
     * @return {*}
     */
    toDelete(id) {
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        const res = await deleteById({ id });
        this.$message({ type: "success", message: res.message });
        // 重载数据
        this.queryData();
      });
    },
    /**
     * @description: 提交表单
     * @param {*}
     * @return {*}
     */
    toSubmit() {
      this.$refs["category_form"].validate(async (valid) => {
        if (valid) {
          if (!this.form.num) {
            this.form.num = 0;
          }
          // 交互
          const res = await saveOrUpdate(this.form);
          // 提示成功
          this.$message({ message: res.message, type: "success" });
          // 关闭模态
          this.toClose();
          // 重载数据
          this.queryData();
        } else {
          return false;
        }
      });
    },
    /**
     * @description: 重置表单校验
     * @param {*}
     * @return {*}
     */
    toClose() {
      this.$refs["category_form"].resetFields();
      setTimeout(() => {
        this.visible = false;
      }, 100);
    },
  },
};
</script>

