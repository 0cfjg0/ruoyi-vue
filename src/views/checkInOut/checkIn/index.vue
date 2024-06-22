<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="姓名" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入老人姓名"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="身份证号" prop="idCardNo">
        <el-input
          v-model="queryParams.idCardNo"
          placeholder="请输入身份证号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="Plus"
          @click="handleAdd"
          v-hasPermi="['checkInOut:checkIn:add']"
        >发起入住申请</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="checkInList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" align="center" prop="id" />
      <!-- <el-table-column label="编号" align="center" prop="checkInCode" /> -->
      <el-table-column label="老人姓名" align="center" prop="name" />
      <el-table-column label="老人身份证号" align="center" prop="idCardNo" />
      <el-table-column label="入住床位" align="center" prop="bedNumber" />
      <!-- <el-table-column label="入住时间" align="center" prop="checkInTime" width="180"> -->
      <el-table-column label="护理等级" align="center" prop="nursingLevelName" />
      <el-table-column label="入住期限" align="center" prop="checkTime">
        <!-- <template #default="scope">
          <span>{{ parseTime(scope.row.checkInStartTime, '{y}-{m}-{d}') }} {{ parseTime(scope.row.checkInEndTime, '{y}-{m}-{d}') }}</span>
        </template> -->
      </el-table-column>
      <!-- <el-table-column label="备注" align="center" prop="remark" /> -->
      <el-table-column label="创建人" align="center" prop="applicat" />
      <!-- <el-table-column label="申请人id" align="center" prop="applicatId" /> -->
      <!-- <el-table-column label="入住状态，0：入住中，1：已退住" align="center" prop="status" /> -->
      <!-- <el-table-column label="其他申请信息" align="center" prop="otherApplyInfo" /> -->
      <el-table-column label="创建时间" align="center" prop="createTime" >
        <template #default="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d} {h}:{m}:{s}') }}</span>
        </template>
      </el-table-column>  
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="search" @click="handleCheck(scope.row)" v-hasPermi="['checkInOut:checkIn:check']">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改checkIn对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="checkInRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="编号" prop="checkInCode">
          <el-input v-model="form.checkInCode" placeholder="请输入编号" />
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="老人id" prop="elderId">
          <el-input v-model="form.elderId" placeholder="请输入老人id" />
        </el-form-item>
        <el-form-item label="入住时间" prop="checkInTime">
          <el-date-picker clearable
            v-model="form.checkInTime"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择入住时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注" />
        </el-form-item>
        <el-form-item label="申请人" prop="applicat">
          <el-input v-model="form.applicat" placeholder="请输入申请人" />
        </el-form-item>
        <el-form-item label="申请人id" prop="applicatId">
          <el-input v-model="form.applicatId" placeholder="请输入申请人id" />
        </el-form-item>
        <el-form-item label="入住状态" prop="status">
          <el-input v-model="form.status" placeholder="请输入入住状态，0：入住中，1：已退住" />
        </el-form-item>
        <!-- <el-form-item label="其他申请信息" prop="otherApplyInfo">
          <el-input v-model="form.otherApplyInfo" type="textarea" placeholder="请输入内容" />
        </el-form-item> -->
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>


    <!-- 查看checkIn对话框 -->
    <el-dialog :title="title" v-model="check" width="500px" append-to-body>
      <el-form ref="checkInRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="序号" prop="id">
          <el-input v-model="form.id" disabled />
        </el-form-item>
        <el-form-item label="老人姓名" prop="name">
          <el-input v-model="form.name" disabled />
        </el-form-item>
        <el-form-item label="身份证号" prop="idCardNo">
          <el-input v-model="form.idCardNo" disabled />
        </el-form-item>
        <el-form-item label="入住床位" prop="bedNumber">
          <el-input v-model="form.bedNumber" disabled />
        </el-form-item>
        <el-form-item label="护理等级" prop="nursingLevelName">
          <el-input v-model="form.nursingLevelName" disabled />
        </el-form-item>
        <el-form-item label="入住期限" prop="checkTime">
          <el-input v-model="form.checkTime" disabled />
        </el-form-item>
        <el-form-item label="创建人" prop="applicat">
          <el-input v-model="form.applicat" disabled />
        </el-form-item>
        <el-form-item label="创建时间" prop="createTime">
          <el-date-picker disabled
            v-model="form.createTime"
            type="date"
            value-format="YYYY-MM-DD">
          </el-date-picker>
        </el-form-item>
        <!-- <el-form-item label="其他申请信息" prop="otherApplyInfo">
          <el-input v-model="form.otherApplyInfo" type="textarea" placeholder="请输入内容" />
        </el-form-item> -->
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup name="CheckIn">
import { listCheckIn, getCheckIn, delCheckIn, addCheckIn, updateCheckIn } from "@/api/checkInOut/checkIn";

const { proxy } = getCurrentInstance();

const checkInList = ref([]);
const open = ref(false);
const check = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    checkInCode: null,
    title: null,
    elderId: null,
    checkInTime: null,
    applicat: null,
    applicatId: null,
    status: null,
    otherApplyInfo: null,
    idCardNo: null,
    bedNumber: null,
    nursingLevelName: null,
    checkInStartTime: null,
    checkInEndTime: null,
    checkTime: null,
    createTime: null
  },
  rules: {
    checkInCode: [
      { required: true, message: "编号不能为空", trigger: "blur" }
    ],
    title: [
      { required: true, message: "标题不能为空", trigger: "blur" }
    ],
    elderId: [
      { required: true, message: "老人id不能为空", trigger: "blur" }
    ],
    applicat: [
      { required: true, message: "申请人不能为空", trigger: "blur" }
    ],
    applicatId: [
      { required: true, message: "申请人id不能为空", trigger: "blur" }
    ],
    createTime: [
      { required: true, message: "创建时间不能为空", trigger: "blur" }
    ],
    status: [
      { required: true, message: "入住状态，0：入住中，1：已退住不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询checkIn列表 */
function getList() {
  loading.value = true;
  listCheckIn(queryParams.value).then(response => {
    checkInList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

// 取消按钮
function cancel() {
  open.value = false;
  reset();
}

// 表单重置
function reset() {
  form.value = {
    id: null,
    checkInCode: null,
    title: null,
    elderId: null,
    checkInTime: null,
    remark: null,
    applicat: null,
    applicatId: null,
    createTime: null,
    status: null,
    otherApplyInfo: null,
    updateTime: null,
    createBy: null,
    updateBy: null
  };
  proxy.resetForm("checkInRef");
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  handleQuery();
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd(row) {
  reset();
  open.value = true;
  title.value = "添加checkIn";
}

/** 查看操作 */
function handleCheck(row){
  reset();
  const _id = row.id || ids.value
  getCheckIn(_id).then(response => {
    form.value = response.data;
    check.value = true;
    title.value = "查看详情";
  });
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getCheckIn(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改checkIn";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["checkInRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateCheckIn(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addCheckIn(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
}

/** 删除按钮操作 */
function handleDelete(row) {
  const _ids = row.id || ids.value;
  proxy.$modal.confirm('是否确认删除checkIn编号为"' + _ids + '"的数据项？').then(function() {
    return delCheckIn(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('checkInOut/checkIn/export', {
    ...queryParams.value
  }, `checkIn_${new Date().getTime()}.xlsx`)
}

getList();
</script>
