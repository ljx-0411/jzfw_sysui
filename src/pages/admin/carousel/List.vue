<!--
 * @Description: 轮播配置页面
 * @Author: Ronda
 * @Date: 2021-04-06 09:58:38
 * @LastEditors: Ronda
 * @LastEditTime: 2021-05-26 12:26:29
-->
<template>
  <div>
    <!-- 按钮 -->
    <el-button type="primary" size="mini" @click="toAdd">新增</el-button>
    <el-button type="primary" size="mini" @click="toPreview">预览</el-button>
    <!-- /按钮 -->
    <!-- 表格 -->
    <el-table v-loading="loading" :data="currentData" size="mini">
      <el-table-column type="index" :index="1" label="序号" width="55" align="center" />
      <el-table-column prop="name" label="轮播图名称" align="center" />
      <el-table-column prop="introduce" label="轮播图描述" align="center" />
      <el-table-column prop="url" label="轮播图图片" align="center">
        <template slot-scope="scope">
          <el-popover placement="right" trigger="hover">
            <el-image style="height:200px;width:200px" :src="scope.row.url" fit="contain" />
            <el-image
              slot="reference"
              style="height:30px;width:30px"
              :src="scope.row.url"
              fit="contain"
            />
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" align="center">
        <template slot-scope="scope">
          <!-- 正常  禁用 -->
          <el-tag
            size="mini"
            :type="scope.row.status==='正常'?'success':'danger'"
          >{{ scope.row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" align="center" width="120">
        <template slot-scope="scope">
          <a class="green_info" type="text" size="small" @click.prevent="toEdit(scope.row)">编辑</a>
          <a class="red_info" type="text" size="small" @click.prevent="toDelete(scope.row.id)">删除</a>
          <a
            v-if="scope.row.status==='正常'"
            class="blue_info"
            type="text"
            size="small"
            @click.prevent="toChangeStatus(scope.row,'停用')"
          >停用</a>
          <a
            v-else
            class="blue_info"
            type="text"
            size="small"
            @click.prevent="toChangeStatus(scope.row,'正常')"
          >启用</a>
        </template>
      </el-table-column>
    </el-table>
    <!-- /表格 -->
    <!-- 模态框 -->
    <el-dialog :title="title" :visible.sync="visible" @close="toClose">
      <el-form ref="carousel_form" :model="form" :rules="rules">
        <el-form-item label="名称" label-width="100px" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="轮播图片" label-width="100px" prop="url">
          <el-upload
            class="avatar-uploader"
            :action="uploadFileURL"
            :show-file-list="false"
            :on-success="uploadSuccess"
            :before-upload="beforeUpload"
          >
            <!-- <img v-if="imageUrl" :src="imageUrl" class="avatar" /> -->
            <img v-if="imageUrl" :src="form.url" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
          <!-- 图片地址：
          <el-input disabled :value="form.url" readonly />-->
        </el-form-item>
        <el-form-item label="描述" label-width="100px" prop="introduce">
          <el-input v-model="form.introduce" type="textarea" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="toClose">取 消</el-button>
        <el-button type="primary" size="small" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>
    <!-- /模态框 -->
    <!-- 预览模态框 -->
    <el-dialog title="大屏预览" :visible.sync="visibleYes" width="80%">
      <el-carousel :interval="5000" arrow="always">
        <el-carousel-item
          v-for="item in currentData.filter(item=>item.status==='正常')"
          :key="item.id"
        >
          <el-image style="width:100%;height:100%;" :src="item.url" />
        </el-carousel-item>
      </el-carousel>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="visibleYes = false">关 闭</el-button>
      </div>
    </el-dialog>
    <!-- /预览模态框 -->
  </div>
</template>

<script>
import { deleteById, saveOrUpdate, findAll } from "@/api/carousel";
import { uploadFileURL, showFileURL } from "@/utils/config";
export default {
  // 组件名称
  name: "Carousel",
  // 组件参数 接收来自父组件的数据
  props: {},
  // 组件状态值
  data() {
    return {
      uploadFileURL,
      imageUrl: "",
      currentData: [],
      // carousel: [],
      loading: false,
      title: "",
      rules: {
        name: [
          { required: true, message: "请输入轮播图名称", trigger: "blur" },
        ],
        url: [{ required: true, message: "请上传轮播图", trigger: "change" }],
      },
      visible: false,
      visibleYes: false,
      form: {
        url: "",
      },
    };
  },
  computed: {},
  /**
   * 组件实例创建完成，属性已绑定，但DOM还未生成，$ el属性还不存在
   */
  created() {
    // 查询所有轮播图
    this.queryData();
  },
  methods: {
    /**
     * @description: 图片上传成功
     * @param {*} res
     * @param {*} file
     * @return {*}
     */
    uploadSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
      this.form.url = res.data.url;
    },
    /**
     * @description: 图片上传之前
     * @param {*} file
     * @return {*}
     */
    beforeUpload(file) {
      const isLt3M = file.size / 1024 / 1024 < 3;
      if (!isLt3M) {
        this.$message.error("上传头像图片大小不能超过 3MB!");
      }
      return isLt3M;
    },
    /**
     * @description: 修改状态
     * @param {*} id
     * @param {*} status
     * @return {*}
     */
    async toChangeStatus(row, status) {
      const temp = {
        ...row,
        status,
      };
      const res = await saveOrUpdate(temp);
      this.$message({ type: "success", message: res.message });
      // 重载数据
      this.queryData();
    },
    /**
     * @description: 查询所有轮播图
     * @param {*}
     * @return {*}
     */
    async queryData() {
      this.loading = true;
      const res = await findAll();
      this.currentData = res.data || [];
      this.loading = false;
    },
    /**
     * @description: 新增按钮的事件
     * @param {*}
     * @return {*}
     */
    toAdd() {
      this.title = "新增轮播图";
      this.form = {};
      this.imageUrl = "";
      this.visible = true;
    },
    /**
     * @description: 修改按钮的事件
     * @param {*}
     * @return {*}
     */
    toEdit(row) {
      this.form = { ...row };
      this.title = "编辑轮播图";
      this.imageUrl = this.form.url;
      this.visible = true;
    },
    /**
     * @description: 预览按钮的事件
     * @param {*}
     * @return {*}
     */
    toPreview() {
      this.visibleYes = true;
    },
    /**
     * @description: 表单提交按钮的事件
     * @param {*}
     * @return {*}
     */
    submitForm() {
      this.$refs["carousel_form"].validate(async (valid) => {
        if (valid) {
          await saveOrUpdate(this.form);
          this.toClose();
          this.queryData(); // 重载数据
          this.$message.success(res.message); // 提示成功信息
        } else {
          return false;
        }
      });
    },
    /**
     * @description: 删除按钮的事件
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
        this.queryData(); // 重载数据
      });
    },
    /**
     * @description: 重置表单验证
     * @param {*}
     * @return {*}
     */
    toClose() {
      this.$refs["carousel_form"].resetFields();
      setTimeout(() => {
        this.visible = false;
      }, 100);
    },
  },
};
</script>
