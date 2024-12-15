<template>
  <div class="app-container">
    <div>
        <h2 style="display: flex; align-items: center; ">视频服务器运行状态：<dict-tag
            style="margin-right:10px"
            :options="dict.type.bus_ai_service"
            :value="streamData.mediaServerState"
          />
            </h2>
    </div>
    <el-table
      v-loading="loading"
      :data="streamData.mediaList"
      @selection-change="handleSelectionChange"
    >
      
      <<el-table-column label="创建时间" align="center" >
        <template slot-scope="scope">
                    <span>{{ parseTime(scope.row.createStamp) }}</span>
        </template>
      </el-table-column>

      <el-table-column label="视频流" align="center" >
        <template slot-scope="scope">
          <span>{{scope.row.app }}/{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" >
        <template slot-scope="scope">
          <dict-tag
  
            :options="dict.type.bus_ai_stream"
            :value="scope.row.active"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="在线人数"
        align="center"
        prop="clients"
        width="160"
      >
        
      </el-table-column>
      <el-table-column
        label="入口带宽"
        align="center"
        prop="produceSpeed"
        width="160"
      >
    
      </el-table-column>
      <el-table-column label="视频信息" align="center" prop="video">
        
      </el-table-column>
      <el-table-column label="音频信息" align="center" prop="audio">
        
      </el-table-column>
      
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
            @click="see(scope.row)"

          >预览</el-button>

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
        <!-- <el-form-item label="${comment}" prop="imgPath">
          <el-input v-model="form.imgPath" placeholder="请输入${comment}" />
        </el-form-item> -->
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
} from "@/api/business/stream";

export default {
  name: "Info",
  dicts: ["bus_ai_service","bus_ai_stream"],
  data() {
    return {
      // 根路径
      baseURL: process.env.VUE_APP_BASE_API,
      
      streamData:{
        mediaList:[],
        mediaServerState:null
      },
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
        // location: [
        //   { required: true, message: "$comment不能为空", trigger: "blur" }
        // ],
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
      listInfo().then((response) => {
        this.streamData=response.data;
        this.loading = false;
      })
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
    see(row) {
      this.$router.push({ path: "/business/player?app="+row.app+"&name="+row.name }).catch((e)=>{
        console.log(e);
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
