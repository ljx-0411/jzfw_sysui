<!--
 * @Description: 资讯分类
 * @Author: Ronda
 * @Date: 2021-05-12 17:23:55
 * @LastEditors: Ronda
 * @LastEditTime: 2021-05-26 14:59:36
-->
<template>
  <div>
    <!-- 按钮 -->
    <el-button type="primary" size="mini" @click="toAdd">新增</el-button>
    <!-- /按钮 -->
    <!-- 表格 -->
    <el-table v-loading="loading" :data="tableData" size="mini">
      <el-table-column type="index" :index="1" label="序号" width="55" />
      <el-table-column prop="name" label="名称" width="100" />
      <el-table-column prop="no" label="排序号" width="85" align="center" />
      <el-table-column prop="description" label="描述" />
      <el-table-column fixed="right" label="操作" align="center" width="100">
        <template slot-scope="scope">
          <a class="green_info" type="text" size="small" @click.prevent="toEdit(scope.row)">编辑</a>
          <a class="red_info" type="text" size="small" @click.prevent="toDelete(scope.row.id)">删除</a>
        </template>
      </el-table-column>
    </el-table>
    <!-- /表格 -->
    <!-- 模态框 -->
    <el-dialog :title="title" :visible.sync="visible" @close="toClose">
      <el-form ref="info_category_form" :model="form" :rules="rules">
        <el-form-item label="栏目名称" label-width="80px" prop="name">
          <el-input v-model="form.name" autocomplete="off" />
        </el-form-item>
        <!-- <el-form-item label="父栏目" label-width="80px">
          <el-select v-model="form.parentId" clearable placeholder="请选择父栏目">
            <el-option v-for="c in tableData" :key="c.id" :label="c.name" :value="c.id" />
          </el-select>
        </el-form-item>-->
        <el-form-item label="序号" label-width="80px">
          <el-input v-model="form.no" autocomplete="off" />
        </el-form-item>
        <el-form-item label="栏目介绍" label-width="80px">
          <el-input v-model="form.description" type="textarea" autocomplete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="toClose">取 消</el-button>
        <el-button type="primary" size="small" @click="toSubmit">确 定</el-button>
      </div>
    </el-dialog>
    <!-- /模态框 -->
  </div>
</template>
<script>
import { findAll, saveOrUpdate, deleteById } from "@/api/infoCategory";
export default {
  // 数据
  data() {
    return {
      visible: false,
      loading: false,
      form: {},
      title: "新增栏目信息",
      tableData: [],
      ids: [],
      rules: {
        name: [
          { required: true, message: "请输入栏目名称", trigger: "change" },
        ],
      },
    };
  },
  // 生命周期
  created() {
    this.queryData();
  },
  // 方法
  methods: {
    handleSelectionChange(val) {
      this.ids = val.map((item) => item.id);
    },
    /**
     * @description: 获取数据
     * @param {*}
     * @return {*}
     */
    async queryData() {
      this.loading = true;
      const res = await findAll();
      this.tableData = res.data;
      this.loading = false;
    },
    toAdd() {
      this.form = {};
      this.title = "新增栏目信息";
      this.visible = true;
    },
    toEdit(row) {
      // 将要编辑的数据绑定表单中
      this.form = { ...row };
      this.title = "编辑栏目信息";
      this.visible = true;
    },
    toDelete(id) {
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        const res = await deleteById({ id });
        this.$message({
          type: "success",
          message: res.message,
        });
        // 重载数据
        this.queryData();
      });
    },
    toSubmit() {
      this.$refs["info_category_form"].validate(async (valid) => {
        if (valid) {
          const res = await saveOrUpdate(this.form);
          // 提示成功
          this.$message({
            message: res.message,
            type: "success",
          });
          // 关闭模态
          this.toClose();
          // 重载数据
          this.queryData();
        } else {
          return false;
        }
      });
    },
    toClose() {
      this.$refs["info_category_form"].resetFields();
      setTimeout(() => {
        this.visible = false;
      }, 100);
    },
  },
};
</script>
