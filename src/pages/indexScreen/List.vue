<!--
 * @Description: 首页轮播图管理
 * @Author: Ronda
 * @Date: 2021-05-12 17:23:55
 * @LastEditors: Ronda
 * @LastEditTime: 2021-05-26 14:56:58
-->

<template>
  <div class>
    <!-- 按钮 -->
    <el-button type="primary" size="small" @click="toAdd">新增</el-button>
    <el-button type="primary" size="small" @click="toPreview">预览</el-button>
    <!-- /按钮 -->
    <!-- 表格 -->
    <el-table v-loading="loading" :data="carousel" size="mini">
      <el-table-column type="index" :index="1" label="序号" width="55" align="center" />
      <el-table-column prop="name" label="轮播图名称" align="center" />
      <el-table-column prop="introduce" label="介绍" align="center" />
      <el-table-column prop="url" label="地址" align="center">
        <template slot-scope="scope">
          <el-image style="height:100px" :src="scope.row.url" fit="contain" />
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" align="center" width="120">
        <template slot-scope="scope">
          <a type="text" size="small" @click.prevent="toEdit(scope.row)">编辑</a>
          <a type="text" size="small" @click.prevent="toDelete(scope.row.id)">删除</a>
        </template>
      </el-table-column>
    </el-table>
    <!-- /表格 -->
    <!-- 模态框 -->
    <el-dialog :title="title" :visible.sync="visible">
      <el-form ref="carousel_form" :model="form" :rules="rules">
        <el-form-item label="轮播图名称" label-width="100px" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="轮播图介绍" label-width="100px" prop="introduce">
          <el-input v-model="form.introduce" type="textarea" />
        </el-form-item>
        <el-form-item label="轮播图上传" label-width="100px" prop="url">
          <!-- 改上传地址  localhost -->
          <el-upload
            class="avatar-uploader"
            action="http://localhost:8002/file/upload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
          >
            <img v-if="form.url" :src="form.url" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="visible = false">取 消</el-button>
        <el-button type="primary" size="small" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>
    <!-- /模态框 -->
    <!-- 预览模态框 -->
    <el-dialog title="大屏预览" :visible.sync="visible2" width="80%">
      <el-carousel :interval="5000" arrow="always">
        <el-carousel-item v-for="item in carousel" :key="item.id">
          <el-image :src="item.url" fit="contain" />
        </el-carousel-item>
      </el-carousel>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="visible2 = false">关 闭</el-button>
      </div>
    </el-dialog>
    <!-- /预览模态框 -->
  </div>
</template>

<script>
import request from "@/utils/request";
import qs from "querystring";
import _ from "lodash";
import { log } from '@antv/g2plot/lib/utils';
export default {
  // 组件名称
  name: "Demo",
  // 组件参数 接收来自父组件的数据
  props: {},
  // 组件状态值
  data() {
    return {
      carousel: [],
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
      visible2: false,
      form: {},
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
    this.findAllCarousel(); // 查询所有轮播图
  },
  /**
   * el 被新创建的 vm.$ el 替换，并挂载到实例上去之后调用该钩子。
   * 如果 root 实例挂载了一个文档内元素，当 mounted 被调用时 vm.$ el 也在文档内。
   */
  mounted() {},
  // 组件方法
  methods: {
    // 查询所有轮播图
    findAllCarousel() {
      this.loading = true;
      request.get("/carousel/findAll").then((res) => {
        this.carousel = res.data;
        this.loading = false;
      });
    },
    // 图片成功上传回调
    handleAvatarSuccess(res, file) {
      if (res.status === 200) {
        this.$set(
          this.form,
          "url",
          // 改拼接方式！！！
          res.data.url
        );
        console.log(  url)
      } else {
        this.$message({ type: "error", message: "附件服务器异常！" });
      }
    },
    // 新增按钮
    toAdd() {
      this.title = "新增轮播图";
      this.form = {};
      this.visible = true;
    },
    // 预览按钮
    toPreview() {
      this.visible2 = true;
    },
    // 表单提交按钮
    submitForm() {
      this.$refs["carousel_form"].validate((valid) => {
        if (valid) {
          request
            .request({
              url: "/carousel/saveOrUpdate",
              method: "post",
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
              },
              data: qs.stringify(this.form),
            })
            .then((res) => {
              this.findAllCarousel(); // 重载数据
              this.visible = false; // 关闭模态框
              this.$message.success(res.message); // 提示成功信息
            });
        } else {
          return false;
        }
      });
    },
    // 修改
    toEdit(row) {
      this.form = {};
      this.form = _.clone(row);
      this.visible = true;
    },
    // 删除
    toDelete(id) {
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        request.get("/carousel/deleteById", { id }).then((response) => {
          this.$message({ type: "success", message: response.message });
          this.findAllCarousel(); // 重载数据
        });
      });
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
  width: 100%;
  height: 178px;
  display: block;
}
</style>
