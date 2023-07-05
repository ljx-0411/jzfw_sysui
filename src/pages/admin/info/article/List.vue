<!--
 * @Description: 资讯列表
 * @Author: Ronda
 * @Date: 2021-05-12 17:23:55
 * @LastEditors: Ronda
 * @LastEditTime: 2021-05-26 17:32:39
-->
<template>
  <div class="my_article">
    <!-- 搜索表单 -->
    <div class="btns">
      <el-row>
        <el-col :span="18">
          <el-form :inline="true" :model="searchForm" size="small">
            <el-form-item>
              <el-select placeholder="状态" v-model="searchForm.status" clearable>
                <el-option label="未审核" value="未审核" />
                <el-option label="审核通过" value="审核通过" />
                <el-option label="审核不通过" value="审核不通过" />
                <el-option label="推荐" value="推荐" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-input placeholder="标题" v-model="searchForm.title" clearable />
            </el-form-item>
            <el-form-item>
              <el-select v-model="searchForm.categoryId" clearable placeholder="请选择栏目">
                <el-option
                  v-for="c in categories.filter(item=>!item.parentId)"
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
        </el-col>
        <el-col :span="6" style="text-align:right">
          <el-button type="primary" size="small" @click="toPublishArticle">发布</el-button>
        </el-col>
      </el-row>
    </div>
    <!-- 表格 -->
    <el-table
      v-loading="loading"
      :data="currentData"
      style="width: 100%"
      size="mini"
      @row-click="toDetails"
    >
      <el-table-column type="index" :index="1" label="序号" />
      <el-table-column label="封面" width="150">
        <template slot-scope="scope">
          <img :src="scope.row.cover" alt style="width:100%" />
        </template>
      </el-table-column>
      <el-table-column label="风采">
        <template slot-scope="scope">
          <div style="font-weight:bold">{{ scope.row.title }}</div>
          <div>{{ scope.row.baseUser && scope.row.baseUser.realname }}</div>
          <div>{{ scope.row.category && scope.row.category.name }}</div>
          {{ moment(scope.row.publishTime).format("YYYY-MM-DD") }}
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" width="100">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === '审核通过'" type="success">{{ scope.row.status }}</el-tag>
          <el-tag v-else-if="scope.row.status === '审核不通过'" type="danger">{{ scope.row.status }}</el-tag>
          <el-tag v-else-if="scope.row.status === '推荐'" type="warning">{{ scope.row.status }}</el-tag>
          <el-tag v-else type="info">{{ scope.row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" align="center" width="140">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click.stop="recommendHandler(scope.row.id)">推荐</el-button>
          <!-- :disabled="scope.row.status !== '未审核'" -->
          <!-- v-if="scope.row.status == '未审核'" -->
          <el-button
            type="text"
            size="mini"
            @click.stop="toCheckArticle(scope.row)"
            class="blue_info"
          >审核</el-button>
          <el-button class="red_info" type="text" size="mini" @click.stop="toDelete(scope.row)">删除</el-button>
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
    <!-- 审核 -->
    <el-dialog class="customer_modal" title="审核风采信息" :visible.sync="visible" width="60%">
      <div>
        <div style="text-align:center;font-size:18px; line-height:2em">{{ article.title }}</div>
        <div v-html="article.content" />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click="toChangeStatus(article.id,'审核不通过')">审核不通过</el-button>
        <el-button type="primary" @click="toChangeStatus(article.id,'审核通过')">审核通过</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import moment from "moment";
import { mapGetters } from "vuex";
import { pageQuery, deleteById, changeStatus } from "@/api/article";
import { findAll } from "@/api/infoCategory";
export default {
  // 模板中要用到的变量
  data() {
    return {
      visible: false,
      currentData: [],
      total: 0,
      loading: false,
      categories: [],
      params: {
        page: 1,
        pageSize: 10,
      },
      searchForm: {},
      article: {},
    };
  },
  // 声明周期钩子函数
  created() {
    // 查询所有资讯信息
    this.queryData();
    // 查询栏目信息
    this.loadCategories();
  },
  computed: {
    ...mapGetters(["user"]),
  },
  watch: {
    params: {
      handler: function () {
        this.queryData();
      },
      deep: true,
    },
  },
  methods: {
    moment,
    /**
     * @description: 发布资讯
     * @param {*}
     * @return {*}
     */
    toPublishArticle() {
      // 跳转页面
      this.$router.push({
        path: "/admin/info/article/Publish",
      });
    },
    // 推荐
    recommendHandler(id) {
      this.$confirm("您确定要推荐此资讯吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        let res = await changeStatus({ id: id, status: "推荐" });
        this.$message.success(res.message);
        this.queryData();
      });
    },
    /**
     * @description: 审核
     * @param {*} id
     * @param {*} status
     * @return {*}
     */
    async toChangeStatus(id, status) {
      // const url = "/article/check";
      const data = { id, status };
      let res = await changeStatus(data);
      this.$message({ type: "success", message: res.message });
      this.visible = false;
      this.queryData();
    },
    // 查看详情
    toDetails(row) {
      this.$router.push({
        path: "/info/article/Details",
        query: { id: row.id },
      });
    },
    /**
     * @description: 通过id删除
     * @param {*} row
     * @return {*}
     */
    toDelete(row) {
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        let res = await deleteById({ id: row.id });
        this.$message({ type: "success", message: res.message });
        this.queryData();
      });
    },
    /**
     * @description: 加载栏目信息
     * @param {*}
     * @return {*}
     */
    async loadCategories() {
      let res = await findAll();
      this.categories = res.data;
    },
    /**
     * @description: 分页获取资讯信息
     * @param {*}
     * @return {*}
     */
    async queryData() {
      this.loading = true;
      // this.param.authorId = this.user.id;
      for (const key in this.searchForm) {
        if (!this.searchForm[key]) {
          delete this.searchForm[key];
        }
      }
      let res = await pageQuery({ ...this.params, ...this.searchForm });
      this.currentData = res.data.list;
      this.total = res.data.total;
      this.loading = false;
    },
    toCheckArticle(row) {
      this.visible = true;
      this.article = row;
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
    toSearch() {
      this.params.page = 1;
      this.queryData();
    },
  },
};
</script>
