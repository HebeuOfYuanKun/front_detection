<template>
    <div class="app-container">
      <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" >
        <el-form-item label="无人机品牌" prop="uavBrand">
          <el-input
            v-model="queryParams.uavBrand"
            placeholder="请输入无人机品牌"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="无人机型号" prop="uavModel">
          <el-input
            v-model="queryParams.uavModel"
            placeholder="请输入无人机型号"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="状态" prop="state">
            <el-select v-model="queryParams.state" placeholder="请选择状态" clearable filterable>
          <el-option
            v-for="dict in dict.type.uav_state"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
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
            v-hasPermi="['business:uavConfig:add']"
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
            v-hasPermi="['business:uavConfig:edit']"
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
            v-hasPermi="['business:uavConfig:remove']"
          >删除</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="warning"
            plain
            icon="el-icon-download"
            size="mini"
            @click="handleExport"
            v-hasPermi="['business:uavConfig:export']"
          >导出</el-button>
        </el-col>
        <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>
  
      <el-table v-loading="loading" :data="uavConfigList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        
        <el-table-column label="连接id" align="center" prop="uavClient" />
        <el-table-column label="无人机编号" align="center" prop="uavId" />
        <el-table-column label="无人机品牌" align="center" prop="uavBrand" />
        <el-table-column label="无人机型号" align="center" prop="uavModel" />
        <el-table-column label="无人机图片" align="center" prop="uavImage" width="100">
          <template slot-scope="scope">
            <image-preview :src="scope.row.uavImage" :width="50" :height="50"/>
          </template>
        </el-table-column>
        <el-table-column label="连接用户名" align="center" prop="username" />
        <el-table-column label="连接地址" align="center" prop="address" />
        <el-table-column label="连接端口" align="center" prop="port" />
        <el-table-column label="订阅消息" align="center" prop="messageTopic" />
        <el-table-column label="服务状态" align="center" prop="state">
          <template slot-scope="scope">
            <dict-tag :options="dict.type.state" :value="scope.row.state"/>
          </template>
        </el-table-column>
        <el-table-column label="无人机状态" align="center" prop="uavState">
          <template slot-scope="scope">
            <dict-tag :options="dict.type.uav_state" :value="scope.row.uavState"/>
          </template>
        </el-table-column>
        <el-table-column label="识别状态" align="center" prop="uavAiState">
          <template slot-scope="scope">
            <dict-tag :options="dict.type.bus_ai_detection" :value="scope.row.uavAiState"/>
          </template>
        </el-table-column>
        <el-table-column label="开启的布控" align="center" prop="uavControlName">
        </el-table-column>
        <el-table-column label="备注" align="center" prop="remark" />
        
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            
            <el-button
              v-if="!scope.row.state"
              size="mini"
              type="text"
              icon="el-icon-switch-button"
              @click="connectuav(scope.row)"
              v-hasPermi="['uav:uavConfig:connect']"
            >开始连接</el-button>
            <el-button
              v-else
              size="mini"
              type="text"
              icon="el-icon-switch-button"
              @click="disconnectuav(scope.row)"
              v-hasPermi="['uav:uavConfig:disconnect']"
            >关闭连接</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['uav:uavConfig:edit']"
            >修改</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['uav:uavConfig:remove']"
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
  
      <!-- 添加或修改无人机配置信息对话框 -->
      <el-dialog :title="title" :visible.sync="open" width="700px" append-to-body label-position="left">
        <el-form ref="form" :model="form" :rules="rules" >
          <el-form-item label="连接id" prop="uavClient">
            <el-input v-model="form.uavClient" placeholder="请输入连接id，可以设定任意值，但不可冲突" />
          </el-form-item>
          <el-form-item label="无人机编号" prop="uavId">
            <el-input v-model="form.uavId" placeholder="请输入无人机编号" />
          </el-form-item>
          <el-form-item label="无人机品牌" prop="uavBrand">
            <el-input v-model="form.uavBrand" placeholder="请输入无人机品牌" />
          </el-form-item>
          <el-form-item label="无人机型号" prop="uavModel">
            <el-input v-model="form.uavModel" placeholder="请输入无人机型号" />
          </el-form-item>
          <el-form-item label="无人机图片" prop="uavImage">
            <image-upload v-model="form.uavImage"/>
          </el-form-item>
          <el-form-item label="连接用户名" prop="username">
            <el-input v-model="form.username" placeholder="请输入连接用户名" />
          </el-form-item>
          <el-form-item label="连接密码" prop="password">
            <el-input v-model="form.password" placeholder="请输入连接密码" />
          </el-form-item>
          <el-form-item label="连接地址" prop="address">
            <el-input v-model="form.address" placeholder="请输入连接地址" />
          </el-form-item>
          <el-form-item label="连接端口" prop="port">
            <el-input v-model.number="form.port" placeholder="请输入连接端口" />
          </el-form-item>
          <el-form-item label="添加订阅信息" prop="messageTopic">
            <el-input v-model="form.messageTopic" placeholder="请输入订阅信息用,分隔" />
          </el-form-item>
          <el-form-item label="开启的布控" prop="uavControlId">
                  <el-checkbox-group v-model="form.uavControlId" size="medium">
                    <el-checkbox v-for="item in ControlOptions" :key="item.id" :label="item.id"
                     >{{item.name}}</el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
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
  import { listUavConfig, getUavConfig, delUavConfig, addUavConfig, updateUavConfig, connectUav, disconnectUav } from "@/api/uav/uavConfig";
  import { listAllControl } from "@/api/business/control"
  
  export default {
    name: "UavConfig",
    dicts: ['uav_state','state','bus_ai_detection'],
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
        // 无人机配置信息表格数据
        uavConfigList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        //布控列表
        ControlOptions:[],
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          uavModel: null,
          uavImage: null,
          state: null,
          uavBrand: null
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {
          uavClient: [
            { required: true, message: "连接id不能为空", trigger: "blur" }
          ],
          uavId: [
            { required: true, message: "无人机编号不能为空", trigger: "blur" }
          ],
          messageTopic: [
            { required: true, message: "无人机订阅信息不能为空", trigger: "blur" }
          ],
          uavModel: [
            { required: true, message: "无人机型号不能为空", trigger: "blur" }
          ],
          username: [
            { required: true, message: "连接用户名不能为空", trigger: "blur" }
          ],
          password: [
            { required: true, message: "连接密码不能为空", trigger: "blur" }
          ],
          address: [
            { required: true, message: "连接地址不能为空", trigger: "blur" }
          ],
          port: [
            { required: true, message: "连接端口不能为空", trigger: "blur" },
            { type: 'number', message: '连接端口应为数字值'}
          ],
          uavBrand: [
            { required: true, message: "无人机品牌不能为空", trigger: "blur" }
          ]
        }
      };
    },
    created() {
      this.getList();
      this.getControlOptions();
    },
    methods: {
      /** 查询无人机配置信息列表 */
      getList() {
        this.loading = true;
        listUavConfig(this.queryParams).then(response => {
          this.uavConfigList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      },
      getControlOptions(){
        listAllControl().then(response =>{
          this.ControlOptions = response.data;
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
          id: null,
          uavClient: null,
          uavModel: null,
          uavImage: null,
          username: null,
          password: null,
          address: null,
          port: null,
          state: null,
          remark: null,
          uavBrand: null,
          uavControlId:[],
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
        this.title = "添加无人机配置信息";
      },
      /** 获取单个无人机配置信息 */
      getUavConfigInfo(id){
        getUavConfig(id).then(response => {
          if(response.data.uavControlId!=null&&response.data.uavControlId.length!=0){
            response.data.uavControlId=response.data.uavControlId.split(',').map(element => {
            return parseInt(element)
          });
          }else{
            response.data.uavControlId=[]
          }
          
          console.log(response.data.uavControlId)
          this.form = response.data;
          this.open = true;
          this.title = "修改无人机配置信息";
        });
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const id = row.id || this.ids
        this.getUavConfigInfo(id)
      },
      /** 提交按钮 */
      submitForm() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if(this.form.uavControlId.length>0){
              if(Array.isArray(this.form.uavControlId)){
                this.form.uavControlId=this.form.uavControlId.join(',')
              }
                
            }else{
              this.form.uavControlId=""
            }
            
            if (this.form.id != null) {
              
              updateUavConfig(this.form).then(response => {
                this.$modal.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }).catch(res => {
                this.getUavConfigInfo(this.form.id)
              });
            } else {
              addUavConfig(this.form).then(response => {
                this.$modal.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              });
            }
          }
        });
      },
      /** 连接按钮 */
      connectuav(row){
        connectUav(row.id).then(response => {
            this.$modal.msgSuccess("连接成功");
            this.getList();
        })
      },
      /** 断开连接按钮 */
      disconnectuav(row){
        disconnectUav(row.id).then(response => {
            this.$modal.msgSuccess("关闭连接成功");
            this.getList();
        })
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        const ids = row.id || this.ids;
        this.$modal.confirm('是否确认删除无人机配置信息编号为"' + ids + '"的数据项？').then(function() {
          return delUavConfig(ids);
        }).then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        }).catch(() => {});
      },
      /** 导出按钮操作 */
      handleExport() {
        this.download('uav/uavConfig/export', {
          ...this.queryParams
        }, `uavConfig_${new Date().getTime()}.xlsx`)
      }
    }
  };
  </script>
  