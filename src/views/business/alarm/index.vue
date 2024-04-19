<template>
  <div class="app-container home">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
      label-width="80px"
    >
      <el-form-item label="创建时间:">
        <el-date-picker
          v-model="dateRange"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="事件类型" prop="category">
        <el-checkbox-group v-model="queryParams.category">
          <el-checkbox-button
            label="person"
          >未戴安全帽</el-checkbox-button>
          <el-checkbox-button label="smoke" name="type">烟情</el-checkbox-button></el-checkbox-button>
          <el-checkbox-button label="fire" name="type">火情</el-checkbox-button>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="事件状态" prop="state">
        <!-- <el-select
          v-model="queryParams.state"
          placeholder="当前状态"
          clearable
          style="width: 240px"
        >
          <el-option
            v-for="dict in state"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select> -->
        <el-select v-model="queryParams.state" placeholder="请选择状态" filterable clearable>
            <el-option
              v-for="dict in dict.type.bus_ai_alarm_state"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            ></el-option>
          </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
          >重置</el-button
        >
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['message:warning:remove']"
          >删除</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['message:warning:export']"
          >导出</el-button
        >
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="infoList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" align="center" width="85" prop="id" />

      <el-table-column label="视频" align="center">
        <template slot-scope="scope">
          <video
            controls
            muted
            loop
            preload="none"
            style="width: 100%; display: block"
            :poster="scope.row.imagePath"
            :src="scope.row.videoPath"></video>
        </template>
      </el-table-column>
      <el-table-column
        label="发生时间"
        align="center"
        prop="createTime"
        width="160"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作时间"
        align="center"
        prop="updateTime"
        width="160"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.updateTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="报警等级" align="center" prop="grade">
        <template slot-scope="scope">
          <dict-tag
            :options="dict.type.bus_ai_alarm"
            :value="scope.row.grade"
          />
        </template>
      </el-table-column>
      <el-table-column label="当前状态" align="center" prop="state">
        <template slot-scope="scope">
          <dict-tag
            :options="dict.type.bus_ai_alarm_state"
            :value="scope.row.state"
          />
        </template>
      </el-table-column>
      <el-table-column label="事件类型" align="center" prop="remark" />
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['business:alarm:edit']"
          >修改</el-button>

          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['business:alarm:remove']"
            >删除</el-button
          >

        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改【请填写功能名称】对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="90px">
        <el-form-item label="当前状态:" prop="curState">
          <el-select
            v-model="form.curState"
            placeholder="当前状态"
            clearable
            style="width: 240px"
          >
            <el-option
              v-for="dict in dict.type"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="位置:" prop="location">
          <el-input v-model="form.location" placeholder="请输入位置" />
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
import {
  listInfo,
  getInfo,
  delInfo,
  addInfo,
  updateInfo,
  downloadFile,
} from "@/api/business/alarm"
export default {
  name: "index",
  dicts: ["bus_ai_alarm","bus_ai_alarm_state","sys_normal_disable"],
  data() {
    return {
      // 根路径
      baseURL: process.env.VUE_APP_BASE_API,
      state: [
        { label: "未处理", value: "1" },
        { label: "已处理", value: "2" },
        { label: "已忽略", value: "3" },
      ],
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
      type: [],
      // 日期范围
      dateRange: [],
      // 【请填写功能名称】表格数据
      infoList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      // dict: {
      //   type: [
      //     { label: "未检验", value: "未检验" },
      //     { label: "已检验", value: "已检验" },
      //   ],
      // },
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        curState: null,
        imgPath: null,
        location: null,
        category: [],
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        unsafeid: [
          { required: true, message: "状态不能为空", trigger: "blur" },
        ],
        curState: [
          { required: true, message: "$comment不能为空", trigger: "blur" },
        ],
        imgPath: [
          { required: true, message: "$comment不能为空", trigger: "blur" },
        ],

        eveType: [
          { required: true, message: "$comment不能为空", trigger: "change" },
        ],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询【请填写功能名称】列表 */
    getList() {
      this.loading = true;
      if (this.queryParams.category.length != 0) {
        this.queryParams.category = this.queryParams.category.join(",");
      }

    //console.log(this.dateRange)
      listInfo(this.addDateRange(this.queryParams, this.dateRange)).then(
        (response) => {
          this.infoList = response.rows;
          this.total = response.total;
          this.loading = false;
        }
      );
      if (this.queryParams.category.length != 0) {
        this.queryParams.category = this.queryParams.category.split(",");
      }
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        unsafeid: null,
        curState: null,
        imgPath: null,
        location: null,
        eveType: null,
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      // if (this.queryParams.category.length != 0) {
      //   this.queryParams.category = this.queryParams.category.join(",");
      // }

      this.queryParams.pageNum = 1;
      this.getList();
    // if (this.queryParams.category.length != 0) {
    //     this.queryParams.category = this.queryParams.category.split(",");
    //   }
      
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const unsafeid = row.unsafeid || this.ids;
      getInfo(unsafeid).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.unsafeid != null) {
            updateInfo(this.form).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addInfo(this.form).then((response) => {
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
      const unsafeids = row.id || this.ids;
      this.$modal
        .confirm('是否确认删除警情预测编号为"' + unsafeids + '"的数据项？')
        .then(function () {
          return delInfo(unsafeids);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
    downloadImage(id) {
      //this.download('message/warning/downloadImage/'+id, `info_${new Date().getTime()}.jpg`)
      //queryInfoById(id).then((res) => {});
      downloadFile(id).then((res) => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        "business/alarm/export",
        {
          ...this.queryParams,
        },
        `info_${new Date().getTime()}.xlsx`
      );
    },
  },
};
</script>
