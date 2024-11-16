<template>
    <div class="app-container">
      <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="98px">
        <el-form-item label="算法名称：" prop="name">
          <el-input
            v-model="queryParams.name"
            placeholder="请输入名称"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="模型名称：" prop="modelName">
          <el-input
            v-model="queryParams.modelName"
            placeholder="请输入模型名称"
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
            v-hasPermi="['business:algorithm:add']"
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
            v-hasPermi="['business:algorithm:edit']"
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
            v-hasPermi="['business:algorithm:remove']"
          >删除</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="warning"
            plain
            icon="el-icon-download"
            size="mini"
            @click="handleExport"
            v-hasPermi="['business:algorithm:export']"
          >导出</el-button>
        </el-col>
        <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>
  
      <el-table v-loading="loading" :data="algorithmList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="id" width="55" align="center" prop="id" />
        <el-table-column label="名称" align="center" prop="name" />
        <el-table-column label="算法编码" align="center" prop="algorithmCode" />
        <el-table-column label="识别物体" align="center" prop="objects" />
        <el-table-column label="描述" align="center" prop="description" />
        <el-table-column label="模型编码" align="center" prop="modelCode" />
        <el-table-column label="模型名称" align="center" prop="modelName" />
        <el-table-column label="模型地址" align="center" prop="modelPath" />
        <el-table-column label="运行设备" align="center" prop="device" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['business:algorithm:edit']"
            >修改</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['business:algorithm:remove']"
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
  
      <!-- 添加或修改algorithm对话框 -->
      <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
        <el-form ref="form" :model="form" :rules="rules" label-width="80px">
          <el-form-item label="排序" prop="sort">
            <el-input-number v-model="form.sort"  />
          </el-form-item>
          <el-form-item label="算法名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入名称" />
          </el-form-item>
          <el-form-item label="算法编码" prop="algorithmCode">
            <el-input v-model="form.algorithmCode" placeholder="请输入算法编码" />
          </el-form-item>
          <el-form-item label="描述" prop="description">
            <el-input v-model="form.description" type="textarea" placeholder="请输入内容" />
          </el-form-item>
          <el-form-item label="识别物体" prop="objects">
            <el-checkbox-group v-model="form.objects" size="medium">
            <el-checkbox v-for="item in objectOptions" :key="item.code" :label="item.code"
                     >{{item.name}}</el-checkbox>
                    </el-checkbox-group>
          </el-form-item>
          <el-form-item label="模型编码" prop="modelCode">
            <el-input v-model="form.modelCode" placeholder="请输入模型编码" />
          </el-form-item>
          <el-form-item label="模型名称" prop="modelName">
            <el-input v-model="form.modelName" placeholder="请输入模型名称" />
          </el-form-item>
          <el-form-item label="模型地址" prop="modelPath">
            <file-upload :file-type="['onnx', 'engine', 'pt']" :file-size="200" v-model="form.modelPath"/>
          </el-form-item>
          <el-form-item label="运行设备" prop="device">
            <el-input v-model="form.device" placeholder="请输入运行设备" />
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
  import { listAlgorithm, getAlgorithm, delAlgorithm, addAlgorithm, updateAlgorithm } from "@/api/business/algorithm";
  import { listAllObject } from "@/api/business/object";

  export default {
    name: "Algorithm",
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
        // algorithm表格数据
        algorithmList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          name: null,
          modelName: null,
        },
        // 表单参数
        form :{
          id: null,
          sort: null,
          name: null,
          algorithmCode: null,
          objects: [],
          description: null,
          modelCode: null,
          modelName: null,
          modelPath: null,
          device: null,
        },
        // 表单校验
        rules: {
          id: [
            { required: true, message: "id不能为空", trigger: "blur" }
          ],
          sort: [
            { required: true, message: "排序不能为空", trigger: "blur" }
          ],
          name: [
            { required: true, message: "名称不能为空", trigger: "blur" }
          ],
          algorithmCode: [
            { required: true, message: "算法编码不能为空", trigger: "blur" }
          ],
          objects: [
            { required: true, message: "识别物体不能为空", trigger: "blur" }
          ],
          description: [
            { required: true, message: "描述不能为空", trigger: "blur" }
          ],
          modelCode: [
            { required: true, message: "模型编码不能为空", trigger: "blur" }
          ],
          modelName: [
            { required: true, message: "模型名称不能为空", trigger: "blur" }
          ],
          modelPath: [
            { required: true, message: "模型地址不能为空", trigger: "blur" }
          ],
          device: [
            { required: true, message: "运行设备不能为空", trigger: "blur" }
          ],
        },
        objectOptions:[],
      };
    },
    created() {
      this.getList();
      this.getObjectList();
    },
    methods: {
      /** 查询algorithm列表 */
      getList() {
        this.loading = true;
        listAlgorithm(this.queryParams).then(response => {
          this.algorithmList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      },
      //查询所有可以添加的物体
      getObjectList(){
      listAllObject().then(response=>{
        this.objectOptions=response.data
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
          sort: null,
          name: null,
          algorithmCode: null,
          objects: [],
          description: null,
          modelCode: null,
          modelName: null,
          modelPath: null,
          device: null,
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
        this.
        this.title = "添加algorithm";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const id = row.id || this.ids
        getAlgorithm(id).then(response => {
          this.form = response.data;
          if (this.form.objects != null&&this.form.objects.length!=0) {
            this.form.objects = this.form.objects.split(","); 
          }else{
            this.form.objects = [];
          }
          //this.form.objects = this.form.objects.split(",");
          this.open = true;
          this.title = "修改algorithm";
        });
      },
      /** 提交按钮 */
      submitForm() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            
            if (this.form.id != null) {
                this.form.objects = this.form.objects.join(",");
              updateAlgorithm(this.form).then(response => {
                this.$modal.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              });
            } else {
                this.form.objects = this.form.objects.join(",");
              addAlgorithm(this.form).then(response => {
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
        this.$modal.confirm('是否确认删除algorithm编号为"' + ids + '"的数据项？').then(function() {
          return delAlgorithm(ids);
        }).then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        }).catch(() => {});
      },
      /** 导出按钮操作 */
      handleExport() {
        this.download('business/algorithm/export', {
          ...this.queryParams
        }, `algorithm_${new Date().getTime()}.xlsx`)
      }
    }
  };
  </script>
  