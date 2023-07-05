<!--
 * @Description: 用户管理
 * @Author: Ronda
 * @Date: 2021-05-12 17:23:55
 * @LastEditors: Ronda
 * @LastEditTime: 2021-05-26 17:10:58
-->
<template>
  <div>
    <el-form :inline="true" size="mini">
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
        <el-select v-model="searchForm.roleId" placeholder="请选择角色" clearable>
          <el-option v-for="r in roles" :key="r.id" :label="r.name" :value="r.id" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="toSearch">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="loading" :data="tableData" size="small">
      <el-table-column type="index" :index="1" label="序号" />
      <el-table-column prop="username" label="用户名" />
      <el-table-column prop="realname" label="姓名" />
      <el-table-column label="角色">
        <template slot-scope="scope">{{ scope.row.roles[0].name }}</template>
      </el-table-column>
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
      <el-table-column prop="telephone" label="手机号" />
      <el-table-column label="操作" align="center" width="160">
        <template slot-scope="scope">
          <a type="text" size="small" @click.prevent="toSetRole(scope.row)">设置</a>
          <a class="red_info" type="text" size="small" @click.prevent="toDelete(scope.row.id)">删除</a>
          <a class="green_info" type="text" size="small" @click.prevent="toEdit(scope.row)">编辑</a>
          <a class="blue_info" type="text" size="small" @click.prevent="toDetails(scope.row.id)">详情</a>
        </template>
      </el-table-column>
    </el-table>
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
      <el-form ref="user_form" :model="form" :rules="rules">
        <el-form-item label="用户名" label-width="80px" prop="username">
          <el-input v-model="form.username" autocomplete="off" />
        </el-form-item>
        <el-form-item label="姓名" label-width="80px" prop="realname">
          <el-input v-model="form.realname" autocomplete="off" />
        </el-form-item>
        <el-form-item label="密码" label-width="80px" prop="password">
          <el-input v-model="form.password" autocomplete="off" />
        </el-form-item>
        <el-form-item label="性别" label-width="80px" prop="gender">
          <el-radio-group v-model="form.gender">
            <el-radio label="male">男</el-radio>
            <el-radio label="female">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="title.indexOf('添加')>=0" label="角色" label-width="80px" prop="roleId">
          <el-radio-group v-model="form.roleId">
            <el-radio v-for="item in roles" :key="item.id" :label="item.id">{{ item.name }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="手机号" label-width="80px">
          <el-input v-model="form.telephone" autocomplete="off" />
        </el-form-item>
        <el-form-item label="出生日期" label-width="80px">
          <el-date-picker
            v-model="form.birth"
            value-format="timestamp"
            type="date"
            placeholder="选择日期"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="toClose">取 消</el-button>
        <el-button type="primary" size="small" @click="toSubmit">确 定</el-button>
      </div>
    </el-dialog>
    <!-- /模态框 -->
    <!-- 角色模态框 -->
    <el-dialog title="设置角色" :visible.sync="role_visible">
      <el-form :model="user">
        <el-form-item label="用户名" label-width="80px">{{ user.realname }}</el-form-item>
        <el-form-item label="角色" label-width="80px">
          <el-select v-model="user.roleId" placeholder="请选择角色">
            <el-option v-for="item in roles" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="role_visible = false">取 消</el-button>
        <el-button type="primary" size="small" @click="setRolesHandler">确 定</el-button>
      </div>
    </el-dialog>
    <!-- /模态框 -->
  </div>
</template>
<script>
import {
  pageQuery,
  addUserWidthRole,
  saveOrUpdate,
  setRoles,
  deleteById,
} from "@/api/user";
import { findAll as findAllRoles } from "@/api/role";
export default {
  data() {
    return {
      // 搜索表单
      searchForm: {},
      // 表格数据
      tableData: [],
      // 表格总数据
      total: 0,
      // 表格加载
      loading: false,
      // 基本信息表单
      form: {},
      // 表单可见性
      visible: false,
      // 模态框标题
      title: "添加用户信息",
      // 设置角色的用户
      user: {},
      // 设置角色模态框可见性
      role_visible: false,
      // 角色总信息
      roles: [],
      // 分页数据
      params: {
        page: 1,
        pageSize: 10,
      },
      // 表单校验规则
      rules: {
        roleId: [{ required: true, message: "请选择角色", trigger: "change" }],
        username: [
          { required: true, message: "请输入用户名", trigger: "change" },
        ],
        realname: [
          { required: true, message: "请输入姓名", trigger: "change" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "change" },
        ],
        gender: [{ required: true, message: "请选择性别", trigger: "change" }],
      },
    };
  },
  watch: {
    params: {
      handler() {
        this.queryData();
      },
      deep: true,
    },
  },
  created() {
    this.queryData();
    this.queryRoles();
  },
  methods: {
    /**
     * @description: 查询数据
     * @param {*}
     * @return {*}
     */
    toSearch() {
      this.params.page = 1;
      this.queryData();
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
     * @description: 获取所有的角色信息
     * @param {*}
     * @return {*}
     */
    async queryRoles() {
      const res = await findAllRoles();
      this.roles = res.data;
    },
    /**
     * @description: 保存用户
     * @param {*}
     * @return {*}
     */
    toSubmit() {
      this.$refs["user_form"].validate(async (valid) => {
        if (valid) {
          let res = {};
          if (this.title.indexOf("添加") >= 0) {
            res = await addUserWidthRole(this.form);
          } else {
            res = await saveOrUpdate(this.form);
          }
          this.toClose();
          this.$message({ message: res.message, type: "success" });
          this.queryData();
        } else {
          return false;
        }
      });
    },
    /**
     * @description: 添加用户信息
     * @param {*}
     * @return {*}
     */
    toAdd() {
      this.form = {};
      this.title = "添加用户信息";
      this.visible = true;
    },
    /**
     * @description: 分页获取用户数据
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
      // 合并搜索的数据和分页的数据
      const res = await pageQuery({ ...this.params, ...this.searchForm });
      this.tableData = res.data.list;
      this.total = res.data.total;
      this.loading = false;
    },
    /**
     * @description: 单个删除
     * @param {*} id
     * @return {*}
     */
    toDelete(id) {
      this.$confirm("此操作将永久删除该信息, 是否继续?", "提示", {
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
     * @description: 编辑用户信息
     * @param {*} row
     * @return {*}
     */
    toEdit(row) {
      this.form = { ...row };
      this.title = "编辑用户信息";
      this.visible = true;
    },

    /**
     * @description: 查看详情
     * @param {*} id
     * @return {*}
     */
    toDetails(id) {
      this.$router.push({
        path: "/admin/sys/user/Details",
        query: { id },
      });
    },
    /**
     * @description: 设置角色功能
     * @param {*} record
     * @return {*}
     */
    toSetRole(record) {
      // 初始化角色
      // record.roles = [];
      this.user = { ...record, roleId: record.roles[0].id };
      this.role_visible = true;
    },
    /**
     * @description: 保存用户角色
     * @param {*}
     * @return {*}
     */
    async setRolesHandler() {
      const res = await setRoles({
        id: this.user.id,
        roles: this.user.roleId,
      });
      this.role_visible = false;
      this.$message({ message: res.message, type: "success" });
      this.queryData();
    },
    /**
     * @description: 重置表单校验
     * @param {*}
     * @return {*}
     */
    toClose() {
      this.$refs["user_form"].resetFields();
      setTimeout(() => {
        this.visible = false;
      }, 100);
    },
  },
};
</script>
