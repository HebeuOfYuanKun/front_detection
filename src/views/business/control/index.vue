<template>
  <div class="app-container">
    <div >
        <h2 style="display: flex; align-items: center; ">视频服务器运行状态：<el-tag style="margin-right:10px" v-if="mediaServerState"  size="medium">正在运行</el-tag>
            <el-tag style="margin-right:10px" v-else="mediaServerState"  size="medium" type="danger">停止运行</el-tag>
            视频分析器运行状态:
           <el-tag style="margin-left:10px" v-if="analyzerServerState"  size="medium">正在运行</el-tag>
            <el-tag style="margin-left:10px" v-else="analyzerServerState"  size="medium" type="danger">停止运行</el-tag>
            
            </h2>
    </div>
    <!-- <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="用户id" prop="userId">
        <el-input
          v-model="queryParams.userId"
          placeholder="请输入用户id"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input
          v-model="queryParams.sort"
          placeholder="请输入排序"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="编码" prop="code">
        <el-input
          v-model="queryParams.code"
          placeholder="请输入编码"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="流app" prop="streamApp">
        <el-input
          v-model="queryParams.streamApp"
          placeholder="请输入流app"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="流name" prop="streamName">
        <el-input
          v-model="queryParams.streamName"
          placeholder="请输入流name"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="视频信息" prop="streamVideo">
        <el-input
          v-model="queryParams.streamVideo"
          placeholder="请输入视频信息"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="音频信息" prop="streamAudio">
        <el-input
          v-model="queryParams.streamAudio"
          placeholder="请输入音频信息"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="识别物体码" prop="objectCode">
        <el-input
          v-model="queryParams.objectCode"
          placeholder="请输入识别物体码"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="算法码" prop="algorithmCode">
        <el-input
          v-model="queryParams.algorithmCode"
          placeholder="请输入算法码"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="最小报警时间间隔" prop="minInterval">
        <el-input
          v-model="queryParams.minInterval"
          placeholder="请输入最小报警时间间隔"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="置信度" prop="classThresh">
        <el-input
          v-model="queryParams.classThresh"
          placeholder="请输入置信度"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="阈值" prop="overlapThresh">
        <el-input
          v-model="queryParams.overlapThresh"
          placeholder="请输入阈值"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="推流地址" prop="pushStream">
        <el-input
          v-model="queryParams.pushStream"
          placeholder="请输入推流地址"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="推流app" prop="pushStreamApp">
        <el-input
          v-model="queryParams.pushStreamApp"
          placeholder="请输入推流app"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="推流name" prop="pushStreamName">
        <el-input
          v-model="queryParams.pushStreamName"
          placeholder="请输入推流name"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input
          v-model="queryParams.remark"
          placeholder="请输入备注"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="state">
        <el-input
          v-model="queryParams.state"
          placeholder="请输入状态"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

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
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['business:control:edit']"
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
          v-hasPermi="['business:control:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['business:control:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row> -->

    <el-table v-loading="loading" :data="controlList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
    
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
            <el-tag v-if="scope.row.state==0"  size="medium">未设置识别</el-tag>
            <el-tag v-if="scope.row.state==1"   type="success">正在识别</el-tag>
            <el-tag v-if="scope.row.state==5"  type="danger">识别中断</el-tag></el-tag>    
      </template>
      </el-table-column>
      <el-table-column label="在线" align="center" prop="state" >
        <template slot-scope="scope">        
            <el-tag v-if="scope.row.isActivated==false"  size="medium" type="danger">离线</el-tag>
            <el-tag v-if="scope.row.isActivated==true"   type="success">在线</el-tag>
              
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
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['business:control:edit']"
          >识别</el-button><el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['business:control:edit']"
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
                      :disabled="item.disabled">{{item.name}}</el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
        <el-form-item label="选择算法：" prop="algorithmCode">
                  <el-select v-model="form.algorithmCode" placeholder="请选择选择算法：" clearable
                    :style="{width: '100%'}">
                    <el-option v-for="(item, index) in field105Options" :key="index" :label="item.label"
                      :value="item.value" :disabled="item.disabled"></el-option>
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
import { listControl, getControl, delControl, addControl, updateControl } from "@/api/business/control";
import { listObject, listAllObject,getObject, delObject, addObject, updateObject } from "@/api/business/object";
export default {
  name: "Control",
  data() {
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
        objectCode: null,
        algorithmCode: null,
        minInterval: null,
        classThresh: null,
        overlapThresh: null,
        pushStream: null,
        pushStreamApp: null,
        pushStreamName: null,
        remark: null,
        state: null,
      },
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
        streamApp: [
          { required: true, message: "流app不能为空", trigger: "blur" }
        ],
        streamName: [
          { required: true, message: "流name不能为空", trigger: "blur" }
        ],
        streamVideo: [
          { required: true, message: "视频信息不能为空", trigger: "blur" }
        ],
        streamAudio: [
          { required: true, message: "音频信息不能为空", trigger: "blur" }
        ],
        objectCode: [
          { required: true, message: "识别物体码不能为空", trigger: "blur" }
        ],
        algorithmCode: [
          { required: true, message: "算法码不能为空", trigger: "blur" }
        ],
        minInterval: [
          { required: true, message: "最小报警时间间隔不能为空", trigger: "blur" }
        ],
        classThresh: [
          { required: true, message: "置信度不能为空", trigger: "blur" }
        ],
        overlapThresh: [
          { required: true, message: "阈值不能为空", trigger: "blur" }
        ],
        pushStream: [
          { required: true, message: "推流地址不能为空", trigger: "blur" }
        ],
        pushStreamApp: [
          { required: true, message: "推流app不能为空", trigger: "blur" }
        ],
        pushStreamName: [
          { required: true, message: "推流name不能为空", trigger: "blur" }
        ],
        remark: [
          { required: true, message: "备注不能为空", trigger: "blur" }
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
  },
  methods: {
    see(app,name) {
      this.$router.push({ path: "/business/player?app="+app+"&name="+name }).catch((e)=>{
        console.log(e);
      });
    },
    getObjectList(){
      listAllObject().then(response=>{
        this.objectOptions=response.data
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
        for(let i=0;i<this.controlList.length;i++){
            let control=this.controlList[i].objectCode.split(",")
          this.controlList[i].objectCode=control
        }
        console.log(this.controlList)
        this.mediaServerState=response.mediaServerState
        this.analyzerServerState=response.analyzerServerState
        //this.total = response.total;
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
        id: null,
        userId: null,
        sort: null,
        code: null,
        streamApp: null,
        streamName: null,
        streamVideo: null,
        streamAudio: null,
        objectCode: null,
        algorithmCode: null,
        minInterval: null,
        classThresh: null,
        overlapThresh: null,
        pushStream: null,
        pushStreamApp: null,
        pushStreamName: null,
        remark: null,
        state: null,
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
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加control";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getControl(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改control";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateControl(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
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
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除control编号为"' + ids + '"的数据项？').then(function() {
        return delControl(ids);
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
