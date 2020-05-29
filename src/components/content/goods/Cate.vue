<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="addCate">添加分类</el-button>
        </el-col>
      </el-row>
    </el-card>

    <!-- 表格 -->
    <el-table :data="cateList" style="width: 100%" row-key="cat_id" border>
      <el-table-column prop="cat_name" label="分类名称" width="180"></el-table-column>
      <el-table-column label="是否有效" width="180">
        <template v-slot="scope">
          <el-button
            v-if="scope.row.cat_deleted===false"
            type="success"
            icon="el-icon-check"
            circle
          ></el-button>
          <el-button v-else type="danger" icon="el-icon-close" circle></el-button>
        </template>
      </el-table-column>
      <el-table-column label="排序">
        <template v-slot="scope">
          <el-tag v-if="scope.row.cat_level===0">一级</el-tag>
          <el-tag v-if="scope.row.cat_level===1" type="success">二级</el-tag>
          <el-tag v-if="scope.row.cat_level===2" type="warning">三级</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="操作">
        <template v-slot="scope">
          <el-button type="primary" icon="el-icon-edit" @click="editCateClick(scope.row)">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" @click="removeCateClick(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[3, 5, 7, 10]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>

    <!-- 添加分类对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCatDialogVisible"
      width="40%"
      @close="addCatDialogClosed"
    >
      <!-- 添加分类表单 -->
      <el-form
        ref="addCateFormRef"
        :model="addCateForm"
        label-width="80px"
        :rules="addCateFormRules"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <!-- 级联选择器 -->
          <el-cascader
            v-model="selectKeys"
            :options="parentCateList"
            :props="{ expandTrigger: 'hover',
            value:'cat_id',label:'cat_name',children:'children' ,checkStrictly:'true'}"
            @change="parentCateChange"
            :clearable="true"
          ></el-cascader>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addCatDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCateInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑分类对话框 -->
    <el-dialog title="编辑分类" :visible.sync="editCateDialogVisible" width="30%">
      <el-form ref="form" :model="editCateList" label-width="80px">
        <el-form-item label="分类名称">
          <el-input v-model="editCateList.cat_name"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCateSubmit()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "",
  data() {
    return {
      cateList: [], //获取商品数据列表
      total: 0, //总条数
      // 获取参数条件
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      parentCateList: [], //父级分类的数据列表
      selectKeys: [], //选中的父级分类的id数组
      addCatDialogVisible: false, //添加分类对话框的显示
      editCateDialogVisible: false, // 编辑分类对话框的显示
      editCateList: {}, //编辑分类对话框内容
      //添加分类的表单数据对象
      addCateForm: {
        cat_name: "",
        cat_pid: 0,
        cat_level: 0
      },
      //   添加分类的验证规则
      addCateFormRules: {
        cat_name: [
          {
            required: true,
            message: "请输入分类名称",
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    //   获取数据
    async getCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: this.queryInfo
      });
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg);
      }
      this.cateList = res.data.result;
      this.total = res.data.total;
      console.log(res);
    },
    // 分页
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getCateList();
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getCateList();
    },
    // 添加分类的对话框显示
    addCate() {
      this.getParentCateList();
      this.addCatDialogVisible = true;
    },
    // 获取父级分类的数据列表
    async getParentCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: { type: 2 }
      });
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg);
      }
      this.parentCateList = res.data;
    },
    //选择分类时出发这个函数
    parentCateChange() {
      console.log(this.selectKeys);
      if (this.selectKeys.length > 0) {
        //   父级分类的id
        this.addCateForm.cat_pid = this.selectKeys[this.selectKeys.length - 1];
        // 当前分类等级
        this.addCateForm.cat_level = this.selectKeys.length;
      } else {
        this.addCateForm.cate_pid = 0;
        // 当前分类等级
        this.addCateForm.cat_level = 0;
      }
    },
    addCateInfo() {
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.post(
          "categories",
          this.addCateForm
        );
        console.log(res);

        if (res.meta.status !== 201) {
          return this.$message.error(res.meta.msg);
        }
        this.$message.success(res.meta.msg);
        this.getCateList();
        this.addCatDialogVisible = false;
      });
      console.log(this.addCateForm);
    },
    // 监听对话框的关闭
    addCatDialogClosed() {
      this.selectKeys = [];
      this.$refs.addCateFormRef.resetFields();
      this.addCateForm.cate_pid = 0;
      this.addCateForm.cat_level = 0;
    },
    // 编辑分类对话框显示
    async editCateClick(cateInfo) {
      const { data: res } = await this.$http.get(
        "categories/" + cateInfo.cat_id
      );
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg);
      }
      this.editCateDialogVisible = true;
      this.editCateList = res.data;
      console.log(res);
    },
    // 编辑分类对话框确定
    async editCateSubmit(cateInfo) {
      console.log(this.editCateList);

      const { data: res } = await this.$http.put(
        "categories/" + this.editCateList.cat_id,
        { cat_name: this.editCateList.cat_name }
      );
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg);
      }
      this.$message.success(res.meta.msg);
      this.getCateList();
      this.editCateDialogVisible = false;
    },
    // 删除分类
    removeCateClick(cateInfo) {
      this.$confirm("此操作将永久删除该分类, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http.delete("categories/" + cateInfo.cat_id).then(res => {
            if (res.data.meta.status !== 200) {
              return this.$message.error(res.data.meta.msg);
            }

            this.$message.success(res.data.meta.msg);
            this.getCateList();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  }
};
</script>

<style scoped>
.el-cascader {
  width: 100%;
}
</style>