<!--
 * @Description: 用户列表组件
 * @Author: Ronda
 * @Date: 2021-05-10 15:40:08
 * @LastEditors: Ronda
 * @LastEditTime: 2021-05-26 14:55:39
-->
<template>
  <div class="user-list">
    <!-- 按钮 -->
    <el-form size="mini" :inline="true">
      <el-form-item>
        <el-button type="primary" @click="toAdd">添加</el-button>
      </el-form-item>
      <el-form-item>
        <el-input v-model="searchForm.username" placeholder="请输入用户名" clearable />
      </el-form-item>
      <el-form-item>
        <el-select v-model="searchForm.status" clearable placeholder="请选择状态">
          <el-option label="禁用" value="禁用" />
          <el-option label="正常" value="正常" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="toSearch">查询</el-button>
      </el-form-item>
    </el-form>
    <!-- 按钮 -->
    <!-- 表格 -->
    <el-table v-loading="loading" size="mini" :data="tableData" stripe style="width: 100%">
      <el-table-column align="center" prop="id" label="编号" width="80px" />
      <el-table-column align="center" prop="username" label="用户名" />
      <el-table-column align="center" prop="realname" label="姓名" />
      <el-table-column align="center" prop="telephone" label="手机号" />
      <el-table-column prop="gender" label="性别">
        <template slot-scope="scope">
          <div v-if="scope.row.gender">
            <i v-if="scope.row.gender==='male'" class="el-icon-male green_info" />
            <i v-else class="el-icon-female red_info" />
          </div>
          <div v-else>暂无</div>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          <el-tag
            size="mini"
            :type="scope.row.status=='正常'?'success':'danger'"
          >{{ scope.row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" fixed="right" label="操作" width="150">
        <template slot-scope="scope">
          <a class="green_info" type="text" size="small" @click.prevent="toEdit(scope.row)">编辑</a>
          <a class="red_info" type="text" size="small" @click.prevent="toDelete(scope.row.id)">删除</a>
          <a class="blue_info" type="text" size="small" @click.prevent="toDetails(scope.row.id)">详情</a>
        </template>
      </el-table-column>
    </el-table>
    <!-- 表格 -->
    <!-- 分页 -->
    <div class="pagination-div">
      <el-pagination
        size="mini"
        :current-page="params.page"
        :page-sizes="[2,5,10, 15, 20]"
        :page-size="params.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <!-- 分页 -->
    <!-- 模态框 -->
    <el-dialog :title="title" :visible.sync="visible" @close="toClose">
      <el-form ref="user_form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" clearable placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="姓名" prop="realname">
          <el-input v-model="form.realname" clearable placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="手机号" prop="telephone">
          <el-input v-model="form.telephone" clearable placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" type="password" clearable placeholder="请输入密码" />
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-radio-group v-model="form.gender">
            <el-radio label="male">男</el-radio>
            <el-radio label="female">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="this.title.indexOf('编辑')>=0" label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio label="禁用">禁用</el-radio>
            <el-radio label="正常">正常</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="toClose">取 消</el-button>
        <el-button type="primary" @click="toSubmit">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 模态框 -->
  </div>
</template>
<script>
import { mapState, mapActions } from "vuex";
import { roles } from "../../utils/config";
export default {
  props: ["type", "roleId"],
  data() {
    return {
      loading: false,
      searchForm: {},
      params: {
        page: 1,
        pageSize: 10,
        roleId: this.roleId,
      },
      title: "添加信息",
      form: {},
      total: 0,
      tableData: [],
      visible: false,
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        realname: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        telephone: [
          { required: true, message: "请输入手机号", trigger: "blur" },
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        status: [{ required: true, message: "请选择状态", trigger: "change" }],
      },
    };
  },
  created() {
    this.queryData();
  },
  computed: {
    ...mapState("custome", ["customes", "customeTotal"]),
    ...mapState("waiter", ["waiters", "waiterTotal"]),
  },
  watch: {
    params: {
      handler() {
        this.queryData();
      },
      deep: true,
    },
  },
  methods: {
    ...mapActions("custome", ["pageQueryCustome"]),
    ...mapActions("waiter", ["pageQueryWaiter"]),
    ...mapActions("user", ["deleteById", "saveOrUpdate", "addUserWidthRole"]),
    /**
     * @description: 添加按钮功能
     * @param {*}
     * @return {*}
     */
    toAdd() {
      this.title = `添加${this.type}信息`;
      this.form = {};
      this.visible = true;
    },
    /**
     * @description: 编辑信息
     * @param {*} row
     * @return {*}
     */
    toEdit(row) {
      this.title = `编辑${this.type}信息`;
      this.form = { ...row };
      this.visible = true;
    },
    /**
     * @description: 关闭模态框
     * @param {*} form
     * @return {*}
     */
    toClose() {
      this.$refs["user_form"].resetFields();
      setTimeout(() => {
        this.visible = false;
      }, 100);
    },
    /**
     * @description: 提交保存
     * @param {*} form 提交的数据
     * @return {*}
     */
    toSubmit() {
      this.$refs["user_form"].validate(async (valid) => {
        if (valid) {
          if (this.title.indexOf("添加") >= 0) {
            if (this.type == "顾客") {
              this.form.roleId = roles.customer;
            } else if (this.type == "员工") {
              this.form.roleId = roles.waiter;
            }
            await this.addUserWidthRole(this.form);
          } else {
            await this.saveOrUpdate(this.form);
          }
          this.toClose();
          this.queryData();
          this.$message({
            showClose: true,
            message: "更新成功",
            type: "success",
          });
        } else {
          return false;
        }
      });
    },
    /**
     * @description: 删除信息
     * @param {*} id  要删除的id
     * @return {*}
     */
    toDelete(id) {
      this.$confirm("此操作将永久删除这条数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          await this.deleteById({ id });
          this.queryData();
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    /**
     * @description:详情页面
     * @param {*} id
     * @return {*}
     */
    toDetails(id) {
      if (this.type == "顾客") {
        this.$router.push({
          path: "/admin/custome/Details",
          query: { id },
        });
        return;
      }
      if (this.type == "员工") {
        this.$router.push({
          path: "/admin/waiter/Details",
          query: { id },
        });
        return;
      }
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
     * @description: 查询数据
     * @param {*}
     * @return {*}
     */
    async queryData() {
      this.loading = true;
      for (const key in this.searchForm) {
        if (!this.searchForm[key]) {
          delete this.searchForm[key];
        }
      }
      if (this.type == "顾客") {
        await this.pageQueryCustome({ ...this.params, ...this.searchForm });
        this.tableData = this.customes;
        this.total = this.customeTotal;
      }
      if (this.type == "员工") {
        await this.pageQueryWaiter({ ...this.params, ...this.searchForm });
        this.tableData = this.waiters;
        this.total = this.waiterTotal;
      }
      this.loading = false;
    },
    /**
     * @description: 查询数据
     * @param {*}
     * @return {*}
     */
    toSearch() {
      this.params.page = 1;
      this.queryData();
    },
  },
};
</script>
