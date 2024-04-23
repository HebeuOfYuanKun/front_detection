<template>
  <div class="app-container">
    <div >
        <h2 style="display: flex; align-items: center; ">视频服务器运行状态：
          <!-- <el-tag style="margin-right:10px" v-if="mediaServerState"  size="medium">正在运行</el-tag>
          <el-tag style="margin-right:10px" v-else="mediaServerState"  size="medium" type="danger">停止运行</el-tag> -->
          <dict-tag
            style="margin-right:10px"
            :options="dict.type.bus_ai_service"
            :value="mediaServerState"
          />
            视频分析器运行状态:
           
            <dict-tag
            style="margin-left:10px"
            :options="dict.type.bus_ai_service"
            :value="analyzerServerState"
          />
            </h2>
    </div>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['business:control:add']"
        >新增</el-button>
      </el-col>
      
     
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-refresh"
          size="mini"
          @click="handleRefreshCache"
          v-hasPermi="['business:control:remove']"
        >刷新</el-button>
      </el-col>
    </el-row>
    <el-table v-loading="loading" :data="controlList" >
    
      <el-table-column label="编码" align="center" prop="code" />
      
      <el-table-column label="未检测视频流" align="center" prop="streamName" >
        <template slot-scope="scope">
          <el-button v-if="scope.row.isActivated"
            size="mini"
            type="text"
            
            @click="see(scope.row.streamApp,scope.row.streamName)"

          >预览</el-button>
          <span v-else="scope.row.isActivated">无</span>

        </template>
      </el-table-column>
      <el-table-column label="视频信息" align="center" prop="streamVideo" />
      
      <el-table-column label="识别物体码" align="center" prop="objectCode" />
      
      
      
      <el-table-column label="检测视频流" align="center"  >
        <template slot-scope="scope">
          <el-button v-if="scope.row.state==1"
            size="mini"
            type="text"
            
            @click="see(scope.row.pushStreamApp,scope.row.pushStreamName)"

          >预览</el-button>
          <span v-else="scope.row.state!=1">无</span>

        </template>
      </el-table-column>
      
      <el-table-column label="帧数" align="center" prop="checkFps" />
      <el-table-column label="识别状态" align="center" prop="state" >
        <template slot-scope="scope">        
          <dict-tag
  
  :options="dict.type.bus_ai_detection"
  :value="scope.row.state"
/>
      </template>
      </el-table-column>
      <el-table-column label="在线" align="center"  >
        <template slot-scope="scope">        
          <dict-tag
  :options="dict.type.bus_ai_stream"
  :value="scope.row.isActivated+''"
/>
              
      </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['business:control:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-video-play"
            @click="addDetection(scope.row)"
            v-hasPermi="['business:control:detection']"
          >加入识别</el-button><el-button
            size="mini"
            type="text"
            icon="el-icon-video-pause"
            @click="cancelDetection(scope.row)"
            v-hasPermi="['business:control:cancel']"
          >取消识别</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['business:control:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改control对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="700px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="150px" label-position="left">
  
       <el-form-item label="排序：" prop="sort">
                  <el-input-number v-model="form.sort" placeholder="序号排序："></el-input-number>
                </el-form-item>
        
        <el-form-item label="识别物体：" prop="objectCode">
                  <el-checkbox-group v-model="form.objectCode" size="medium">
                    <el-checkbox v-for="item in objectOptions" :key="item.code" :label="item.code"
                     >{{item.name}}</el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
        <el-form-item label="选择算法：" prop="algorithmCode">
                  <el-select v-model="form.algorithmCode" placeholder="请选择选择算法：" clearable
                    :style="{width: '100%'}" :disabled="disabled.algorithmCode">
                    <el-option v-for="item  in algorithmOptions" :key="item.code" :label="item.name"
                      :value="item.code" ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="选择视频流：" prop="liveStream" >
                  <el-select v-model="form.liveStream" placeholder="请选择视频流：" clearable
                    :style="{width: '100%'}" :disabled="disabled.liveStream">
                    <el-option v-for="item in liveOptions" :key="item.app" :label="item.app+`/`+item.name"
                      :value="item" ></el-option>
                  </el-select>
                </el-form-item>
        <el-form-item label="最小报警时间间隔：" prop="minInterval" >
                  <el-input-number v-model="form.minInterval" placeholder="最小报警时间间隔"></el-input-number>
                </el-form-item>
        <el-form-item label="置信度：" prop="classThresh">
                  <el-input-number v-model="form.classThresh" placeholder="置信度" :precision='2'>
                  </el-input-number>
                </el-form-item>
        <el-form-item label="备注：" prop="remark">
                  <el-input v-model="form.remark" type="textarea" placeholder="备注"
                    :autosize="{minRows: 4, maxRows: 4}" :style="{width: '100%'}"></el-input>
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
import { listControl, getControl, delControl, addControl, updateControl,addDetectionBy,deleteDetection } from "@/api/business/control";
import { listAllObject } from "@/api/business/object";
import { listAllInfo } from "@/api/business/stream";
import { listAllAlgorithm } from "@/api/business/algorithm";
export default {
  name: "Control",
  dicts: ["bus_ai_service","bus_ai_stream","bus_ai_detection"],
  data() {

    /////尚未完成表单效验
    // var checkAge = (rule, value, callback) => {
    //     if (!value) {
    //       return callback(new Error('年龄不能为空'));
    //     }
    //     setTimeout(() => {
    //       if (!Number.isInteger(value)) {
    //         callback(new Error('请输入数字值'));
    //       } else {
    //         if (value < 18) {
    //           callback(new Error('必须年满18岁'));
    //         } else {
    //           callback();
    //         }
    //       }
    //     }, 1000);
    //   };
    return {
      //分析器和流媒体运行状态
      analyzerServerState:"",
      mediaServerState:"",
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
      // control表格数据
      controlList: [],
      // 弹出层标题
      title: "",
      //在线视频流列表选项
      liveOptions:[],
      //算法选项
      algorithmOptions:[],
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        userId: null,
        sort: null,
        code: null,
        streamApp: null,
        streamName: null,
        streamVideo: null,
        streamAudio: null,
        objectCode: [],
        algorithmCode: null,
        liveStream:[],
        minInterval: null,
        classThresh: null,
        overlapThresh: null,
        pushStream: null,
        pushStreamApp: null,
        pushStreamName: null,
        remark: null,
        state: null,
        
      },
      disabled:{},
      objectOptions:[],
      // 表单参数
      form: {},
      
      // 表单校验
      rules: {
        id: [
          { required: true, message: "不能为空", trigger: "blur" }
        ],
        userId: [
          { required: true, message: "用户id不能为空", trigger: "blur" }
        ],
        sort: [
          { required: true, message: "排序不能为空", trigger: "blur" }
        ],
        code: [
          { required: true, message: "编码不能为空", trigger: "blur" }
        ],
      
        liveStream: [
          { required: true, message: "视频信息不能为空", trigger: "blur" }
        ],
        objectCode: [
          { required: true, message: "识别物体码不能为空", trigger: "blur" }
        ],
        algorithmCode: [
          { required: true, message: "算法码不能为空", trigger: "blur" },
          
        ],
        minInterval: [
          { required: true, message: "最小报警时间间隔不能为空", trigger: "blur" }
        ],
        classThresh: [
          { required: true, message: "置信度不能为空", trigger: "blur" }
        ],

        state: [
          { required: true, message: "状态不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
    this.getObjectList();
    this.getStreamList();
    this.getAlgorithmList()
  },
  methods: {
    see(app,name) {
      this.$router.push({ path: "/business/player?app="+app+"&name="+name }).catch((e)=>{
        console.log(e);
      });
    },
    getStreamList(){
      listAllInfo().then(response=>{
        this.liveOptions=response.data.mediaList
        //this.liveOptions
      })
    },
    getObjectList(){
      listAllObject().then(response=>{
        this.objectOptions=response.data
      })
    },
    /** 查询算法列表 */
    getAlgorithmList(){
      listAllAlgorithm().then(response=>{
        this.algorithmOptions=response.data
      })
    },
    /** 查询control列表 */
    getList() {
      //console.log(this.baseURL)
      this.loading = true;
      listControl(this.queryParams).then(response => {
        this.controlList = response.data;
        // this.controlList.forEach(element => {
        //   element.objectCode=element.objectCode.split(",")
        // });
        
        //console.log(this.controlList)
        this.mediaServerState=response.mediaServerState+""
        this.analyzerServerState=response.analyzerServerState+""
        //this.total = response.total;
        this.loading = false;
         //console.log(this.form.objectCode)
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    //刷新
    handleRefreshCache(){
      this.getList()
    },

    // 表单重置
    reset() {
      this.form = {
        id: null,
        userId: null,
        sort: null,
        code: null,
        streamApp: null,
        streamName: null,
        streamVideo: null,
        streamAudio: null,
        objectCode: [],
        algorithmCode: null,
        minInterval: null,
        classThresh: null,
        overlapThresh: null,
        pushStream: null,
        pushStreamApp: null,
        pushStreamName: null,
        remark: null,
        state: 0,
      };
      //this.resetForm("form");
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

    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加布控";
      this.disabled={"liveStream":false,"algorithmCode":false}
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getControl(id).then(response => {
        this.form = response.data;
        this.form.objectCode=this.form.objectCode.split(",");
        this.form.liveStream=this.form.streamApp+"/"+this.form.streamName
        this.open = true;
        this.title = "修改识别参数";
        this.disabled={"liveStream":true,"algorithmCode":true}
      });
    },
    /** 加入识别操作 */
    addDetection(row) {  
      const id = row.id
      addDetectionBy(id).then(response => {
        response.code==200?this.$modal.msgSuccess("识别加入成功"):this.$modal.msgError(response.msg)
        this.getList();
        //this.$modal.msgSuccess("识别加入成功");
      });
    },
    /** 取消识别操作 */
    cancelDetection(row) {  
      const id = row.id
      deleteDetection(id).then(response => {
         response.code==200?this.$modal.msgSuccess("识别取消成功"):this.$modal.msgError(response.msg)
         this.getList();
        //this.$modal.msgSuccess("识别取消成功");
      });
    },
  
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          
          if (this.form.id != null) {
            
            this.form.objectCode=this.form.objectCode.join(",");
            updateControl(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            
            this.form.objectCode=this.form.objectCode.join(",");
            this.form.streamVideo=this.form.liveStream.video
            this.form.streamAudio=this.form.liveStream.audio
            this.form.streamApp=this.form.liveStream.app  
            this.form.streamName=this.form.liveStream.name
            addControl(this.form).then(response => {
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
      const code = row.code;
      this.$modal.confirm('是否确认删除布控编号为"' + code + '"的数据项？').then(function() {
        return delControl(row.id);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('business/control/export', {
        ...this.queryParams
      }, `control_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
