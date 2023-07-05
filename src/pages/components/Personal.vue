<!--
 * @Description: 用户详情、顾客详情、员工详情页面
 * @Author: Ronda
 * @Date: 2020-10-25 09:38:46
 * @LastEditors: Ronda
 * @LastEditTime: 2021-05-27 17:06:38
-->
<template>
  <div class="user_details">
    <!-- 头像 -->
    <div class="userface">
      <div class="photo">
        <div class="box">
          <img :src="currentUser.userFace" alt />
        </div>
      </div>
      <div style="padding-top:50px;text-align:right">
        <el-button size="small" type="text" @click="updateIcon">修改头像</el-button>
      </div>
    </div>
    <div class="info">
      <el-form label-width="100" size="small">
        <el-form-item label="用户名:">{{ currentUser.username }}</el-form-item>
        <el-form-item label="用户姓名:">{{ currentUser.realname }}</el-form-item>
        <el-form-item label="用户手机号码:">{{ currentUser.telephone }}</el-form-item>
        <el-form-item label="用户性别:">
          <div v-if="currentUser.gender">
            <!-- female女male男 -->
            <!-- {{ currentUser.gender==='male'?'男':'女' }} -->
            <span v-if="currentUser.gender==='male'">男</span>
            <span v-else-if="currentUser.gender==='female'">男</span>
            <span v-else>--</span>
            <i v-if="currentUser.gender==='male'" class="el-icon-male green_info" />
            <i v-else-if="currentUser.gender==='female'" class="el-icon-female red_info" />
          </div>
          <div v-else>暂无</div>
        </el-form-item>
        <el-form-item label="用户角色:">{{ currentUser.role===0?'管理员':'普通用户' }}</el-form-item>
        <el-form-item label="用户出生日期:">{{ currentUser.dob?currentUser.dob.split(' ')[0]:'暂无' }}</el-form-item>
        <!-- <el-form-item label="用户注册时间:">{{ currentUser.registerTime || '暂无' }}</el-form-item> -->
        <el-form-item label="用户email:">{{ currentUser.email || '暂无' }}</el-form-item>
        <el-form-item label="用户当前状态:">
          <el-tag
            size="small"
            :type="currentUser.status=='正常'?'success':'danger'"
          >{{ currentUser.status }}</el-tag>
        </el-form-item>
      </el-form>
    </div>
    <div style="text-align:right;padding-right:200px;border-top:1px solid #f4f4f4">
      <el-button size="small" type="text" @click="updateInfo">修改个人信息</el-button>
    </div>
    <!-- 个人信息模态框 -->
    <el-dialog
      title="提示"
      :visible.sync="visible"
      width="50%"
      class="customer_modal"
      @close="clearValidate('personal_form')"
    >
      <el-form ref="personal_form" size="small" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="登录用户" prop="username">
          <el-input disabled :placeholder="form.username" />
        </el-form-item>
        <!-- <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" type="password"></el-input>
        </el-form-item>-->
        <el-form-item label="姓名" prop="realname">
          <el-input v-model="form.realname" />
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-radio-group v-model="form.gender">
            <el-radio label="male">男</el-radio>
            <el-radio label="female">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="用户手机" prop="telephone">
          <el-input v-model="form.telephone" />
        </el-form-item>
        <el-form-item label="用户邮箱" prop="email">
          <el-input v-model="form.email" />
        </el-form-item>
        <el-form-item label="出生日期" prop="dob">
          <el-date-picker
            v-model="form.dob"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="选择出生日期"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="visible = false">取 消</el-button>
        <el-button type="primary" size="small" @click="submitForm">确 定 修 改</el-button>
      </span>
    </el-dialog>
    <!-- /个人信息模态框 -->
    <!-- 更改头像模态框 -->
    <el-dialog
      ref="icon_form"
      :rules="rulesIcon"
      title="更改头像"
      :visible.sync="visibleIcon"
      width="50%"
      class="customer_modal"
      @close="clearValidate('icon_form')"
    >
      <div>
        <el-form
          ref="icon_form"
          size="small"
          :model="formIcon"
          :rules="rulesIcon"
          label-width="80px"
        >
          <!-- <el-form-item label="当前头像">
            <el-image style="height:200px;width:200px" :src="currentUser.userFace" fit="contain" />
          </el-form-item>-->
          <el-form-item label="头像" label-width="100px">
            <el-upload
              class="avatar-uploader"
              :action="uploadFileURL"
              :show-file-list="false"
              :on-success="uploadSuccess"
              :before-upload="beforeUpload"
            >
              <img v-if="imageUrl" :src="formIcon.userface" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon" />
            </el-upload>
            <!-- 图片地址：-->
            <!-- <el-input disabled :value="formIcon.userFace" readonly /> -->
          </el-form-item>
          <!-- <el-form-item label="头像地址" prop="userFace">
            <el-input v-model="formIcon.userFace" placeholder="请输入头像地址" />
          </el-form-item>-->
        </el-form>
        <!-- <div class="photo">
          <el-image style="height:200px;width:200px" :src="formIcon.userface" fit="contain" />
        </div>-->
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="visibleIcon = false">取 消</el-button>
        <el-button type="primary" size="small" @click="submitIconForm">确 定 修 改</el-button>
      </span>
    </el-dialog>
    <!-- /更改头像模态框 -->
  </div>
</template>
<script>
import { saveOrUpdate, alterUserface } from "@/api/user";
import { mapGetters, mapActions, mapState } from "vuex";
import { uploadFileURL, showFileURL } from "@/utils/config";
export default {
  name: "Personal",
  props: ["userid"],
  data() {
    return {
      uploadFileURL,
      imageUrl: "",
      // 展示的用户
      currentUser: {},
      form: {},
      formIcon: {},
      visible: false,
      visibleIcon: false,
      rules: {
        realname: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        gender: [{ required: true, message: "请选择性别", trigger: "change" }],
      },
      rulesIcon: {
        userFace: [
          { required: true, message: "请输入头像地址", trigger: "blur" },
        ],
      },
    };
  },
  computed: {
    ...mapGetters(["user"]),
    ...mapState("user", ["current_d"]),
  },
  async created() {
    if (this.userid) {
      // 通过id获取数据
      await this.findUserById({ id: this.userid });
      this.currentUser = this.current_d;
    } else {
      // 通过id获取数据
      await this.findUserById({ id: this.user.id });
      this.currentUser = this.current_d;
      // this.currentUser = this.user;
    }
  },
  methods: {
    ...mapActions("user", ["getInfo", "findUserById"]),
    /**
     * @description: 图片上传成功
     * @param {*} res
     * @param {*} file
     * @return {*}
     */
    uploadSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
      this.formIcon.userface = res.data.url;
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
     * @description: 更改个人信息按钮事件
     * @param {*}
     * @return {*}
     */
    updateInfo() {
      this.form = { ...this.currentUser };
      this.visible = true;
    },
    /**
     * @description: 更改头像按钮事件
     * @param {*}
     * @return {*}
     */
    updateIcon() {
      this.formIcon = {
        id: this.currentUser.id,
        userface: this.currentUser.userFace,
      };
      this.visibleIcon = true;
    },
    /**
     * @description: 提交头像
     * @param {*}
     * @return {*}
     */
    submitIconForm() {
      this.$refs["icon_form"].validate(async (valid) => {
        if (valid) {
          const res = await alterUserface(this.formIcon);
          this.visibleIcon = false;
          this.$message({ message: res.message, type: "success" });
          if (this.userid) {
            /* this.currentUser = {
              ...this.currentUser,
              userFace: this.formIcon.userface,
            }; */
            // 通过id获取数据
            await this.findUserById({ id: this.userid });
            this.currentUser = this.current_d;
          } else {
            this.getInfo().then(() => {
              this.currentUser = this.user;
            });
          }
        } else {
          return false;
        }
      });
    },
    /**
     * @description: 提交用户信息
     * @param {*}
     * @return {*}
     */
    submitForm() {
      this.$refs["personal_form"].validate(async (valid) => {
        if (valid) {
          const res = await saveOrUpdate(this.form);
          this.visible = false;
          this.$message({ message: res.message, type: "success" });
          if (this.userid) {
            this.currentUser = this.form;
          } else {
            this.getInfo().then(() => {
              this.currentUser = this.user;
            });
          }
        } else {
          return false;
        }
      });
    },
    // 重置表单校验
    clearValidate(form) {
      this.$refs[form].clearValidate();
    },
  },
};
</script>
<style lang="scss" scoped>
.userface {
  display: flex;
  padding: 1em 200px;
  & > div {
    flex: 1;
  }
  .photo {
    .box {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      overflow: hidden;
    }
    img {
      width: 100%;
      height: 100%;
    }
  }
  border-bottom: 2px solid #f4f4f4;
  margin-bottom: 1em;
}
.user_details{
  padding: 30px;
}
</style>
