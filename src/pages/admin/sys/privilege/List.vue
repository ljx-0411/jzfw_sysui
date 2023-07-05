<!--
 * @Description: 权限管理页面
 * @Author: Ronda
 * @Date: 2021-05-12 17:23:55
 * @LastEditors: Ronda
 * @LastEditTime: 2021-05-26 14:46:20
-->
<template>
  <!-- 权限管理 -->
  <div class="privilege_list">
    <div class="btns">
      <el-button type="primary" size="mini" @click="toAdd">添加</el-button>
    </div>
    <el-table
      v-loading="loading"
      :data="privileges"
      size="small"
      row-key="id"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column prop="name" label="名称" width="150" />
      <el-table-column prop="route" label="路径" />
      <el-table-column prop="type" label="类型" width="80" />
      <el-table-column prop="num" label="序号" width="80" />
      <el-table-column prop="icon" label="图标" width="100" />
      <el-table-column prop="hidden" label="状态" align="center" width="100">
        <template v-slot="scope">
          <el-tag v-if="scope.row.hidden==0" type="success" size="mini">显示</el-tag>
          <el-tag v-else type="info" size="mini">隐藏</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="150">
        <template slot-scope="scope">
          <a class="red_info" @click.prevent="toDelete(scope.row.id)">删除</a>
          <a class="green_info" @click.prevent="toEdit(scope.row)">编辑</a>
        </template>
      </el-table-column>
    </el-table>
    <!-- 模态框 -->
    <el-dialog :title="title" :visible.sync="visible" @closed="toClose">
      <!-- {{form}} -->
      <el-form ref="privilege_form" :model="form" :rules="rules">
        <el-form-item label="名称" label-width="80px" prop="name">
          <el-input v-model="form.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="路径" label-width="80px" prop="route">
          <el-input v-model="form.route" autocomplete="off" />
        </el-form-item>
        <el-form-item label="类型" label-width="80px" prop="type">
          <el-select v-model="form.type" clearable placeholder="请选择">
            <el-option label="菜单" value="menu" />
            <el-option label="方法" value="method" />
          </el-select>
          <el-popover
            placement="top-start"
            title="提示"
            width="300"
            trigger="hover"
            content="菜单控制着用户登录后可以动态显示的菜单树；方法为具体的权限，控制着是否可以调用某些接口"
          >
            <el-button slot="reference" type="text">
              <i class="el-icon-location-information" />
            </el-button>
          </el-popover>
        </el-form-item>

        <el-form-item label="父权限" label-width="80px">
          <el-cascader
            v-model="form.parentId"
            clearable
            :options="privileges"
            :props="{ expandTrigger: 'hover', value: 'id', label: 'name' ,checkStrictly:true}"
          />
        </el-form-item>
        <el-form-item v-if="form.type === 'menu'" label="图标" label-width="80px" prop="icon">
          <el-input v-model="form.icon" autocomplete="off" />
        </el-form-item>
        <el-form-item label="序号" label-width="80px" prop="num">
          <el-input v-model="form.num" autocomplete="off" />
        </el-form-item>
        <el-form-item v-if="form.type === 'menu'" label="状态" label-width="80px" prop="hidden">
          <el-switch
            v-model="form.hidden"
            active-text="隐藏"
            inactive-text="显示"
            :active-value="1"
            :inactive-value="0"
          />
        </el-form-item>
        <el-form-item label="描述" label-width="80px">
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
import {
  deleteById,
  findAll,
  findByParentId,
  findPrivilegeTree,
  saveOrUpdate,
} from "../../../../api/privilege";
import _ from "lodash";
export default {
  data() {
    return {
      form: {},
      visible: false,
      title: "添加权限",
      privileges: [],
      rules: {
        name: [
          { required: true, message: "请输入权限名称", trigger: "change" },
        ],
        route: [
          { required: true, message: "请输入权限路径", trigger: "change" },
        ],
        type: [
          { required: true, message: "请选择权限类型", trigger: "change" },
        ],
      },
    };
  },
  created() {
    this.queryData();
  },
  methods: {
    toSubmit() {
      this.$refs["privilege_form"].validate(async (valid) => {
        if (valid) {
          const res = await saveOrUpdate(this.form);
          this.toClose();
          this.$message({ message: res.message, type: "success" });
          this.queryData();
        } else {
          return false;
        }
      });
    },
    /**
     * @description: 获取数据
     * @param {*}
     * @return {*}
     */
    async queryData() {
      this.loading = true;
      const res = await findPrivilegeTree();
      this.foo(res.data);
      this.privileges = res.data;
      this.loading = false;
    },
    /**
     * @description: 处理权限
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
     * @description: 添加权限
     * @param {*}
     * @return {*}
     */
    toAdd() {
      this.form = {};
      this.visible = true;
    },
    /**
     * @description: 删除
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
    toEdit(record) {
      this.form = _.clone(record);
      this.visible = true;
    },
    /**
     * @description: 模态框关闭
     * @param {*}
     * @return {*}
     */
    toClose() {
      this.$refs["privilege_form"].resetFields();
      setTimeout(() => {
        this.visible = false;
      }, 100);
    },
  },
};
</script>
