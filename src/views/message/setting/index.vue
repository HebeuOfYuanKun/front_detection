<template>
<div class="app-container">
  <h3>参数设定后，将在下次起飞生效，灵敏度越大检测效果越灵敏，误报几率也会越大。</h3>
      <!-- <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="推流间隔" prop="gap">
        <el-input
          v-model="queryParams.gap"
          placeholder="请输入推流间隔"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="灵敏度" prop="confidence">
        <el-input
          v-model="queryParams.confidence"
          placeholder="请输入灵敏度"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form> -->

    <!-- <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['setting:setting:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['setting:setting:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['setting:setting:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['setting:setting:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row> -->

    <el-table v-loading="loading" :data="settingList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="参数id" align="center" prop="setid" />
      <el-table-column label="识别类型" align="center" prop="eveType" />
      <el-table-column label="推流间隔" align="center" prop="gap" />
      <el-table-column label="状态"  align="center" prop="status" >
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_normal_disable" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="灵敏度" align="center" prop="confidence" />
      <el-table-column label="更新时间" align="center" prop="updateTime" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['message:setting:edit']"
          >修改</el-button>
          <!-- <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['setting:setting:remove']"
          >删除</el-button> -->
        </template>
      </el-table-column>
    </el-table>

    <!-- <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    /> -->

    <!-- 添加或修改参数设定对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        
        <el-form-item label="推流间隔" prop="gap">
          <el-input v-model="form.gap" placeholder="请输入推流间隔" />
        </el-form-item>
        <el-form-item label="识别类型" prop="gap">
          <el-checkbox-group v-model="form.eveType">
          <el-checkbox-button
            label="未戴安全帽"
            name="type"
          ></el-checkbox-button>
          <el-checkbox-button label="摔倒" name="type"></el-checkbox-button>
          <el-checkbox-button
            label="烟情"
            name="type"
          ></el-checkbox-button>
          <el-checkbox-button
            label="火情"
            name="type"
          ></el-checkbox-button>
        </el-checkbox-group>
        </el-form-item>
        <el-form-item label="灵敏度" prop="confidence">
          <el-input v-model="form.confidence" placeholder="请输入灵敏度" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listSetting, getSetting, delSetting, addSetting, updateSetting } from "@/api/message/setting";

export default {
  name: "Setting",
  dicts: ['sys_normal_disable'],
  data() {
    return {
      // 根路径
      baseURL: process.env.VUE_APP_BASE_API,
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 参数设定表格数据
      settingList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        eveType: [],
        gap: null,
        status: null,
        confidence: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        setid: [
          { required: true, message: "参数id不能为空", trigger: "blur" }
        ],
        eveType: [
          { required: true, message: "识别类型不能为空", trigger: "blur" }
        ],
        gap: [
          { required: true, message: "推流间隔不能为空", trigger: "blur" }
        ],
        status: [
          { required: true, message: "状态不能为空", trigger: "blur" }
        ],
        confidence: [
          { required: true, message: "灵敏度不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {

    this.getList();
  },
  methods: {
    /** 查询参数设定列表 */
    // 获取列表数据
getList() {
  // 设置加载状态为true，表示开始加载数据
  this.loading = true;
  // 调用listSetting函数，传入queryParams参数，获取返回的promise
  listSetting(this.queryParams).then(response => {
    // 将返回的数据中的rows属性赋值给settingList属性
    this.settingList = response.rows;
    // 将返回的数据中的total属性赋值给total属性
    this.total = response.total;
    // 设置加载状态为false，表示数据加载完成
    this.loading = false;
  });
},
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        setid: null,
        eveType: [],
        gap: null,
        status: 0,
        confidence: null,
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.setid)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加参数设定";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const setid = row.setid || this.ids
      getSetting(setid).then(response => {
        this.form = response.data;
        if(this.form.eveType!=null&&this.form.eveType!=""&&this.form.eveType.length!=0){
          this.form.eveType = this.form.eveType.split(";");
      }
      if(this.form.eveType==null||this.form.eveType==""){
        this.form.eveType=[]
      }
        //this.form.eveType = this.form.eveType.split(",");
        this.open = true;
        this.title = "修改参数设定";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.form.eveType = this.form.eveType.join(";");
          if (this.form.setid != null) {
            updateSetting(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addSetting(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const setids = row.setid || this.ids;
      this.$modal.confirm('是否确认删除参数设定编号为"' + setids + '"的数据项？').then(function() {
        return delSetting(setids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('message/setting/export', {
        ...this.queryParams
      }, `setting_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
