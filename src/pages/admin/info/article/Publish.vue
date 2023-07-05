<!--
 * @Description: 发布资讯
 * @Author: Ronda
 * @Date: 2021-05-12 17:23:55
 * @LastEditors: Ronda
 * @LastEditTime: 2021-05-26 17:49:31
-->
<template>
  <div>
    <el-form ref="article_form" :model="form" label-width="60px" :rules="rules">
      <el-row>
        <el-col :span="16">
          <el-form-item label="标题" prop="title">
            <el-input v-model="form.title" />
          </el-form-item>
          <el-form-item label="分类" prop="categoryId">
            <el-select v-model="form.categoryId">
              <el-option v-for="c in categories" :key="c.id" :label="c.name" :value="c.id" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="封皮" >
            <el-upload
              class="upload-demo"
              list-type="picture-card"
              :action="uploadFileURL"
              :on-success="uploadSuccessHandler"
              :limit="1"
              :file-list="fileList"
              v-model="form.cover"
            >
              <!-- <el-button size="small" type="primary">点击上传</el-button> -->
              <i class="el-icon-plus" />
              <div slot="tip" class="el-upload__tip">文件大小不允许超过3M</div>
            </el-upload>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="正文" prop="content">
        <tinymce v-model="form.content" :height="240" />
      </el-form-item>

      <el-form-item>
        <div style="text-align:right">
          <el-button type="text" @click="back">返回</el-button>
          <el-button type="primary" @click="toSubmit">发布</el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import Tinymce from "@/components/Tinymce";
import { mapGetters } from "vuex";
import { uploadFileURL, showFileURL } from "@/utils/config";
import { findAll } from "@/api/infoCategory";
import { saveOrUpdate } from "@/api/article";
export default {
  data() {
    return {
      uploadFileURL,
      form: {},
      categories: [],
      fileList: [],
      rules: {
        categoryId: [
          { required: true, message: "请选择栏目", trigger: "change" },
        ],
        title: [
          { required: true, message: "请输入文章标题", trigger: "change" },
        ],
        content: [
          { required: true, message: "请输入文章内容", trigger: "change" },
        ],
      },
    };
  },
  created() {
    this.form = this.$route.query;
    this.loadCategories();
  },
  computed: {
    ...mapGetters(["user"]),
  },
  components: { Tinymce },
  methods: {
    /**
     * @description: 返回
     * @param {*}
     * @return {*}
     */
    back() {
      this.$router.go(-1);
    },
    /**
     * @description: 获取资讯栏目数据
     * @param {*}
     * @return {*}
     */
    async loadCategories() {
      this.loading = true;
      let res = await findAll();
      this.categories = res.data;
      this.loading = false;
    },
    /**
     * @description: 发布资讯
     * @param {*}
     * @return {*}
     */
    toSubmit() {
      this.form.authorId = this.user.id; // 用户
      this.$refs["article_form"].validate(async (valid) => {
        if (valid) {
          let res = await saveOrUpdate(this.form);
          // 提示成功
          this.$message({ message: res.message, type: "success" });
          // 返回列表页
          this.back();
        } else {
          return false;
        }
      });
    },
    /**
     * @description: 上传成功
     * @param {*} response
     * @return {*}
     */
    uploadSuccessHandler(response) {
      if (response.status == 200) {
        this.$set(this.form, "cover", response.data.url);
      } else {
        this.$message({ type: "error", message: "附件服务器异常！" });
        this.visible = false;
      }
    },
  },
};
</script>
<style scoped>
.editor-content {
  margin-top: 20px;
}
</style>
