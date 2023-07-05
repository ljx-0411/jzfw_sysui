<!--
 * @Description: 角色管理
 * @Author: Ronda
 * @Date: 2021-05-12 17:23:55
 * @LastEditors: Ronda
 * @LastEditTime: 2021-05-26 14:46:29
-->
<template>
  <!-- 角色管理 -->
  <div class="role_list">
    <div class="btns">
      <!-- <el-button size="mini" type="primary" @click="toAdd">添加</el-button> -->
    </div>
    <el-table v-loading="loading" :data="roles" size="small">
      <el-table-column type="index" :index="1" label="序号" />
      <el-table-column prop="name" label="角色名称" />
      <el-table-column label="操作" align="center" width="180">
        <template slot-scope="scope">
          <!-- <a class="red_info" @click.prevent="toDelete(scope.row.id)">删除</a> -->
          <a class="green_info" @click.prevent="toEdit(scope.row)">编辑</a>
          <a class="blue_info" @click.prevent="toAuthorization(scope.row)">授权</a>
        </template>
      </el-table-column>
    </el-table>
    <!-- 模态框 -->
    <el-dialog :title="title" :visible.sync="visible">
      <el-form ref="role_form" :model="form" :rules="rules">
        <el-form-item label="角色名称" label-width="80px" prop="name">
          <el-input v-model="form.name" autocomplete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="visible = false">取 消</el-button>
        <el-button type="primary" size="small" @click="toSaveRole">确 定</el-button>
      </div>
    </el-dialog>
    <!-- /模态框 -->
    <!-- 授权模态框 -->
    <el-dialog title="授权" :visible.sync="authorization_visible" width="80%">
      <el-form :model="role">
        <el-form-item label="角色名称" label-width="80px">{{ role.name }}</el-form-item>
        <el-form-item label="权限" label-width="80px">
          <el-cascader-panel v-model="role.privileges" :options="options" :props="props" clearable />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="authorization_visible = false">取 消</el-button>
        <el-button type="primary" size="small" @click="authorizationHandler">确 定</el-button>
      </div>
    </el-dialog>
    <!-- /模态框 -->
  </div>
</template>
<script>
import {
  saveOrUpdate,
  deleteById,
  authorization,
  cascadePrivilegeFindAll,
} from "@/api/role";
import { findPrivilegeTree } from "@/api/privilege";
export default {
  data() {
    return {
      form: {},
      loading: false,
      visible: false,
      authorization_visible: false,
      title: "添加角色信息",
      role: {}, // 当前角色
      roles: [], // 角色列表
      props: {
        multiple: true,
        value: "id",
        label: "name",
        emitPath: false,
        checkStrictly: true,
      },
      options: [],
      rules: {
        name: [
          { required: true, message: "请输入角色名称", trigger: "change" },
        ],
      },
    };
  },
  created() {
    // 加载角色
    this.queryData();
    // 加载权限
    this.loadPrivileges();
  },
  methods: {
    /**
     * @description:  编辑
     * @param {*} row
     * @return {*}
     */
    toEdit(row) {
      this.form = { ...row };
      this.title = "编辑角色信息";
      this.visible = true;
    },
    /**
     * @description: 保存角色的权限信息
     * @param {*}
     * @return {*}
     */
    async authorizationHandler() {
      if (this.role.privileges.length == 0) {
        this.role.privileges = "";
      }
      const res = await authorization(this.role);
      this.authorization_visible = false;
      this.$message({ message: res.message, type: "success" });
      this.queryData();
    },
    /**
     * @description: 保存角色信息
     * @param {*}
     * @return {*}
     */
    toSaveRole() {
      this.$refs["role_form"].validate(async (valid) => {
        if (valid) {
          const res = await saveOrUpdate(this.form);
          this.visible = false;
          this.$message({ message: res.message, type: "success" });
          this.queryData();
        } else {
          return false;
        }
      });
    },
    /**
     * @description: 获取权限树
     * @param {*}
     * @return {*}
     */
    async loadPrivileges() {
      this.loading = true;
      const res = await findPrivilegeTree();
      this.foo(res.data);
      this.options = res.data;
      this.loading = false;
    },
    /**
     * @description:  递归去除权限中的空children
     * @param {*} privileges
     * @return {*}
     */
    foo(privileges) {
      for (const p of privileges) {
        if (p.children && p.children.length === 0) {
          delete p.children;
        } else {
          this.foo(p.children);
        }
      }
    },
    /**
     * @description: 去添加
     * @param {*}
     * @return {*}
     */
    toAdd() {
      this.title = "添加角色信息";
      this.form = {};
      this.visible = true;
    },
    /**
     * @description: 获取数据
     * @param {*}
     * @return {*}
     */
    async queryData() {
      const res = await cascadePrivilegeFindAll();
      // 将权限转换为id的数组
      res.data.forEach((item) => {
        item.privileges = item.privileges.map((p) => {
          return p.id;
        });
      });
      this.roles = res.data;
    },
    /**
     * @description: 去删除
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
        this.queryData();
      });
    },
    /**
     * @description: 去授权
     * @param {*} record
     * @return {*}
     */
    toAuthorization(record) {
      this.role = record;
      this.authorization_visible = true;
    },
  },
};
</script>
