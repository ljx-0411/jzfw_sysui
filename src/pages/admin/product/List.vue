<!--
 * @Description: 产品管理
 * @Author: Ronda
 * @Date: 2021-05-12 10:00:15
 * @LastEditors: Ronda
 * @LastEditTime: 2021-05-27 17:29:17
-->
<template>
  <div>
    <!-- 按钮 -->
    <el-form size="mini" :inline="true">
      <el-form-item>
        <el-button type="primary" @click="toAdd">添加</el-button>
      </el-form-item>
      <el-form-item>
        <el-input v-model="searchForm.name" clearable placeholder="请输入名称" autocomplete="off" />
      </el-form-item>
      <el-form-item>
        <el-select v-model="searchForm.status" clearable placeholder="请选择状态">
          <el-option label="正常" value="正常" />
          <el-option label="下架" value="下架" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="searchForm.productCategoryId" clearable placeholder="请选择栏目">
          <el-option
            v-for="c in currentCategoryAll.filter(item=>!item.categoryParentId)"
            :key="c.id"
            :label="c.name"
            :value="c.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="toSearch">查询</el-button>
      </el-form-item>
    </el-form>
    <!-- /按钮 -->
    <!-- 表格-->
    <el-table v-loading="loading" size="mini" :data="currentData">
      <el-table-column type="index" :index="1" label="序号" />
      <el-table-column prop="id" label="产品编号" />
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="photo" label="图片" align="center">
        <template slot-scope="scope">
          <el-popover placement="right" trigger="hover">
            <el-image style="height:200px;width:200px" :src="scope.row.photo" fit="contain" />
            <el-image
              slot="reference"
              style="height:30px;width:30px"
              :src="scope.row.photo"
              fit="contain"
            />
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="price" label="价格" align="center" />
      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          <el-tag
            size="mini"
            :type="scope.row.status=='正常'?'success':'danger'"
          >{{ scope.row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="productCategoryId" label="所属栏目">
        <template slot-scope="scope">{{ scope.row.category.name }}</template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" align="center" width="120">
        <template slot-scope="scope">
          <a class="green_info" type="text" size="small" @click.prevent="toEdit(scope.row)">编辑</a>
          <a
            v-if="scope.row.status=='下架'"
            class="blue_info"
            type="text"
            size="small"
            @click.prevent="toChangeStatus(scope.row.id,'上架')"
          >上架</a>
          <a
            v-else
            class="red_info"
            type="text"
            size="small"
            @click.prevent="toChangeStatus(scope.row.id,'下架')"
          >下架</a>
          <!-- <a class="red_info" type="text" size="small" @click.prevent="toDelete(scope.row.id)">删除</a> -->
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
    <!-- /表格 -->
    <!-- 模态框 -->
    <el-dialog :title="title" :visible.sync="visible" @close="toClose">
      <el-form ref="pro_form" :model="form" :rules="rules">
        <el-form-item label="产品名称" label-width="80px" prop="name">
          <el-input v-model="form.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="所属栏目" label-width="80px" prop="productCategoryId">
          <el-select v-model="form.productCategoryId" clearable placeholder="请选择所属栏目">
            <el-option
              v-for="c in currentCategoryAll.filter(item=>!item.categoryParentId)"
              :key="c.id"
              :label="c.name"
              :value="c.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="价格" label-width="80px" prop="price">
          <el-input v-model.number="form.price" autocomplete="off" />
        </el-form-item>
        <el-form-item label="封面" label-width="80px" prop="photo">
          <el-upload
            class="avatar-uploader"
            :action="uploadFileURL"
            :show-file-list="false"
            :on-success="uploadSuccess"
            :before-upload="beforeUpload"
          >
            <!-- <img v-if="imageUrl" :src="imageUrl" class="avatar" /> -->
            <img v-if="imageUrl" :src="form.photo" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
          <!-- 图标地址：
          <el-input disabled :value="form.photo" readonly />-->
        </el-form-item>
        <el-form-item label="产品描述" label-width="80px">
          <el-input v-model="form.description" type="textarea" autocomplete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="toClose">取 消</el-button>
        <el-button type="primary" size="small" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>
    <!-- /模态框 -->
  </div>
</template>
<script>
// deleteById
import { online, offline, pageQuery, saveOrUpdate } from "@/api/product";
import { pageQuery as pageQueryAllCategory } from "@/api/proCategory";
import { uploadFileURL, showFileURL } from "@/utils/config";
export default {
  // 数据
  data() {
    return {
      searchForm: {},
      uploadFileURL,
      // 上传的图片地址
      imageUrl: "",
      // 分页查询的栏目数据
      currentData: [],
      currentCategoryAll: [],
      // 分页总数
      total: 0,
      // 加载中
      loading: false,
      // 模态框可见性
      visible: false,
      // 模态框标题
      title: "添加产品",
      // 模态框表单数据
      form: {
        photo: "",
      },
      // 给后台的分页的参数
      params: {
        page: 1,
        pageSize: 10,
      },
      // 批量删除的id组成的数组
      ids: [],
      // 表单验证规则
      rules: {
        name: [{ required: true, message: "请输入产品名称", trigger: "blur" }],
        productCategoryId: [
          { required: true, message: "请选择所属栏目", trigger: "change" },
        ],
        photo: [
          { required: true, message: "请上传产品封面", trigger: "change" },
        ],
        price: [
          { required: true, message: "价格不能为空" },
          { type: "number", message: "价格必须为数字值" },
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
      this.form.photo = res.data.url;
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
     * @description: 查询按钮
     * @param {*}
     * @return {*}
     */
    toSearch() {
      this.params.page = 1;
      this.queryData();
    },
    /**
     * @description: 分页查找产品数据
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
      const res = await pageQuery({ ...this.params, ...this.searchForm });
      this.currentData = res.data.list || [];
      this.total = res.data.total || 0;
      this.loading = false;
      this.pageQueryAll();
    },
    /**
     * @description: 添加按钮事件
     * @param {*}
     * @return {*}
     */
    async toAdd() {
      this.pageQueryAll();
      this.title = "添加产品信息";
      this.form = {};
      this.imageUrl = "";
      this.visible = true;
    },
    /**
     * @description: 编辑按钮事件
     * @param {*} row 要修改的产品对象
     * @return {*}
     */
    async toEdit(row) {
      this.pageQueryAll();
      this.title = "编辑产品信息";
      // 将要编辑的数据绑定表单中
      this.form = { ...row };
      this.imageUrl = this.form.photo;
      this.visible = true;
    },
    /**
     * @description: 上架-下架产品
     * @param {*} id 要操作的产品
     * @param {*} type 上架或者下架
     * @return {*}
     */
    async toChangeStatus(id, type) {
      let res = {};
      if (type === "上架") {
        res = await online({ id });
      } else {
        res = await offline({ id });
        console.log("下架");
      }
      this.$message({ type: "success", message: res.message });
      // 重载数据
      this.queryData();
    },
    /**
     * @description: 提交表单
     * @param {*}
     * @return {*}
     */
    submitForm() {
      this.$refs["pro_form"].validate(async (valid) => {
        if (valid) {
          if (!this.form.num) {
            this.form.num = 0;
          }
          // 交互
          const res = await saveOrUpdate(this.form);
          // 提示成功
          this.$message({ message: res.message, type: "success" });
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
      this.$refs["pro_form"].resetFields();
      setTimeout(() => {
        this.visible = false;
      }, 100);
    },
    /**
     * @description: 查询所有栏目
     * @param {*}
     * @return {*}
     */
    async pageQueryAll() {
      const res = await pageQueryAllCategory({ page: 1, pageSize: 100 });
      this.currentCategoryAll = res.data.list;
    },
  },
};
</script>

