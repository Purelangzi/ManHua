<template>
  <div>
    <div class="header">
      <div class="search">
        <el-form :model="Searchform" label-width="80px" :inline=true>
          <el-form-item label="角色名称">
            <el-input v-model.trim="Searchform.role_name"  @keyup.enter.native="onSeach" placeholder="请输入角色名"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSeach"  v-show="isBtnDisabled" size="medium">搜索</el-button>
            <el-button type="warning " @click="onReturn" v-show="!isBtnDisabled" size="medium">返回</el-button>
            <el-button type="primary" @click="addList"  v-show="isBtnDisabled" size="medium">新增角色</el-button>
            <el-button type="danger " @click="moreDelete" size="medium">批量删除</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="content">
      <el-table v-loading="loading" :data="listData" @selection-change="selectChange" ref="listTable" border height="calc(100vh - 340px )">
        <el-table-column type="index" label="序号" width="60" align="center">
          <template v-slot="{$index}">
            <span>{{ (page-1)*pageSize+($index+1) }}</span>
          </template>
        </el-table-column>
        <el-table-column type="selection" fixed="left"></el-table-column>
        <div v-for="(col, index) in columns" :key="index">
          <el-table-column v-if="col.isSlot" :label="col.label" align="center" show-overflow-tooltip>
            <template v-slot="{row,$index}">
              <div v-if="col.prop == 'role_status'">
                <el-switch v-model="row.role_status" active-text="已启用" inactive-text="已禁用" class="switchStyle" 
                @change="roleStatusChange(row.role_status,$index)">
                </el-switch>
              </div>
            </template>
          </el-table-column>
          <el-table-column v-else :prop="col.prop" :label="col.label" align="center" show-overflow-tooltip></el-table-column>
          
        </div>
        <el-table-column label="操作" align="center" width="250">
          <template v-slot="{row}">
            <el-button type="primary" round icon="el-icon-edit" size="small" @click="editList(row)">编辑</el-button>
            <el-button type="danger" round icon="el-icon-delete"  size="small" @click="deleteList(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

     <el-drawer :title="listTitle==1?'添加角色':'修改角色'" :visible.sync="dialogEditVisible" size="30%" ref="drawer" custom-class="drawer"
      :before-close="handleClose" :show-close="true" :wrapperClosable="true">
      <div class="drawer__content">
        <el-form :model="roleForm"  ref="roleForm" :rules="roleFormRuels" style="width: 80%;">
          <el-form-item label="角色名称" prop="role_name">
            <el-input v-model="roleForm.role_name" placeholder="请输入角色名称"></el-input>
          </el-form-item>
          <el-form-item label="角色值" prop="role_value">
            <el-input v-model="roleForm.role_value" placeholder="请输入角色值"></el-input>
          </el-form-item>
          <el-form-item label="状态" class="statusStyle">
            <el-switch v-model="roleForm.role_status" active-text="已启用" inactive-text="已禁用" class="switchStyle"></el-switch>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input v-model="roleForm.remark" type="textarea" ></el-input>
          </el-form-item>
          <el-form-item label="菜单分配" prop="menus">
            <el-tree
              v-if="listTitle==1"
              ref="tree"
              :data="treeData.menus"
              :props="defaultProps"
              :default-expand-all="false"
              show-checkbox
              node-key="id"
              highlight-current
              @check-change="treeChange">
            </el-tree>
            <el-tree
              v-if="listTitle==0"
              ref="tree"
              :data="treeData.menus"
              :default-checked-keys="treeData.menusId"
              :default-expand-all="false"
              :props="defaultProps"
              show-checkbox
              node-key="id"
              highlight-current
              @check-change="treeChange">
            </el-tree>
          </el-form-item>
        </el-form>
        <div class="drawer__footer">
          <el-button type="primary" @click="submitAddOrUpdate" :loading="loading">{{ listTitle==1?'添加':'修改' }}</el-button>
          <el-button @click="$refs.drawer.closeDrawer()">取 消</el-button>
        </div>
      </div>
     </el-drawer>
     
      
      
      <el-pagination
        style="text-align: right;padding: 20px;"
        @size-change="sizeChange"
        @current-change="currentChange"
        :current-page.sync="page"
        :page-sizes="[20, 40, 80, 100]"
        :page-size="pageSize"
        layout="sizes, prev, pager, next, jumper, total"
        :total="totalNum" background>
      </el-pagination>
    </div>
  </div>
</template>

<script>
import {getMenus} from '@/utils/auth'
export default {
  name: 'role',
  data () {
    return {
      loading:true,
      loadingBtn:false,
      isBtnDisabled:true,
      dialogEditVisible:false,
      // 搜索表单
      Searchform:{
        role_name:'',
      },
      // 列表数据
      listData:[],
      // 已选择的多选框数据
      selectListOption:[],
      // 批量删除的id
      ids:'',
      // 已选择的批量修改的分类id
      selectMoreUpdateCtId:'',
      // 当前选择的角色id，
      detailId:'',
      // 添加角色的表单
      roleForm:{
        role_name:'',
        role_value:'',
        role_status:'',
        remark:'',
        menus:''
      },
      // 角色列表的表头
      columns:[
        {isSlot:false,prop:'role_name',label:'角色名称'},
        {isSlot:false,prop:'role_value',label:'角色名值'},
        {isSlot:true,prop:'role_status',label:'状态'},
        {isSlot:false,prop:'create_time',label:'创建时间'},
        {isSlot:false,prop:'remark',label:'备注'},
      ],
      listTitle:1,// 1添加角色 0修改角色
      roleFormRuels:{
        role_name:[ { required: true, message: '请选择输入用户名', trigger: 'blur' }],
        role_value:[ { required: true, message: '请选择输入密码', trigger: 'blur' }],
        remark:[ { required: true, message: '请选择输入邮箱', trigger: 'blur' }],
      },
      // 菜单权限树形规则
      defaultProps:{
        children: 'children',
        label: 'name'
      },
      // 修改角色的数据
      treeData:{
        menus:[], //菜单数据
        menusId:[5], // 选中的菜单id
        id:'' // 对应的角色id
      },
      
      // 当前页
      page:1,
      // 每页显示的条数
      pageSize:20,
      // 总条数
      totalNum:0,
    }
  },
  mounted() {
    this.getList()
    this.treeData.menus = getMenus()
  },
  methods: {
    // 获取角色列表数据
    async getList(){
      const {page,pageSize} = this
      const {role_name} = this.Searchform
      let res = await this.$API['system'].getRoleList({page,pageSize,role_name})
      if(res.code == 200){
        this.listData = res.data.data
        this.totalNum = res.data.total
        this.listData.forEach(el=>{
          el.role_status = el.role_status==0?true:false
        })
      }
      this.loading = false
    },

    // 搜索
    onSeach(){
      if(!this.Searchform.role_name) return
      this.getList()
      this.isBtnDisabled = false

    },
    // 返回列表
    onReturn(){
      this.isBtnDisabled = true
      this.Searchform.role_name = ''
      this.getList()
    },
    // 多选框改变时
    selectChange(selection){
      this.selectListOption = selection
    },
    // 批量删除
    moreDelete(){
      if(!this.selectListOption.length){
        this.$message.warning('请在下面选择要删除的列表')
        return
      }
      // ids = '1,2,44'
      this.ids = this.selectListOption.map(el=>el.id).join(',')
      this.dropList(this.ids)
    },
    // switch开关，角色状态改变
    async roleStatusChange(status,index){
      let roleRow = this.listData[index] 
      delete roleRow.sort
      delete roleRow.create_time
      delete roleRow.update_time
      delete roleRow.menus
      roleRow.role_status =status?0:1
      try {
        await this.$API.system.editRole(roleRow)
        await this.getList()
      } catch (error) {
      }
    },
    // 添加列表
    addList(){
      this.listTitle = 1
      this.dialogEditVisible = true
      delete this.roleForm.id
    },
    // 编辑列表
    editList(row){
      this.listTitle = 0
      const rowData = {...row}
      delete rowData.create_time
      delete rowData.update_time
      delete rowData.sort
      this.roleForm = rowData
      this.treeData.id = row.id
      // "12,13,14" ==>['12', '13', '14'] ==>[12, 13, 14, 15, 16, 17, 18, 19]
      this.treeData.menusId = row.menus.split(',').map(Number)
      
      this.dialogEditVisible = true
      
    },
    // 删除列表
    async deleteList(row){
      this.ids = row.id
      this.dropList(this.ids,row.role_name)
    },
    // 角色详情对话框关闭前的回调
    handleClose(done){
      this.$refs.roleForm.clearValidate()
      this.$data.roleForm = JSON.parse(JSON.stringify(this.$options.data().roleForm))
      this.listTitle = 1
      // 重置勾选的节点
      this.$refs.tree.setCheckedKeys([])
      done()
    },
    // 添加角色或修改角色
    submitAddOrUpdate(){
      this.$refs.roleForm.validate(async (valid)=>{
        if(valid){
          this.loadingBtn = true
          this.roleForm.role_status=this.roleForm.role_status?0:1
          const res = await this.$API.system[this.listTitle == 1 ? 'addRole' : 'editRole'](this.roleForm)
          if (res.code == 200) {
            this.$message.success(res.msg)
            this.getList()
          } else {
            this.$message.error(res.msg)
          }
          this.loadingBtn = false
  
          this.$refs.drawer.closeDrawer()
          
        }
      })
      
      
    },
    // 角色表单的菜单分配
    treeChange(){
      // 被选中的节点的 key 所组成的数组
      this.treeData.menusId = this.$refs.tree.getCheckedKeys()
    },

    // 删除方法
    dropList(ids,name){
      this.$confirm(`确定要${name?'删除 '+ name : '批量删除' } 吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          const data = await this.$API.system.deleteRole({ids})
          if(data.code == 200) this.$message.success('删除成功')
          if(this.listData.length<=1){
            this.page = this.page - 1
          }
          this.ids = ''
          this.$refs.listTable.clearSelection()
          this.getList()
        }).catch(() => {
          this.$message.info('已取消删除')
          this.ids = ''
          this.$refs.listTable.clearSelection()
        });
     
    },
    // 每页显示的条数改变时
    sizeChange(pageSize){
      this.pageSize = pageSize
      this.getList()
    },
    // 当前页改变时
    currentChange(page){
      this.page = page
      this.getList()
    }
  },
}
</script>

<style lang='scss' scoped>
.header{
  display: flex;
  justify-content: space-between;
  margin: 20px;
  padding-top: 20px;
  border-bottom: 1px solid #ebeef5;
  min-width: 850px;
  background-color: #fff;
  .search{
    display: flex;
  }
}
.content{
  margin: 20px;
  background-color: #fff;
  ::v-deep .el-drawer__body{
    padding: 35px;
    .drawer__content{
      .el-form-item__label{
        width: 80px;
      }
      .el-form-item__content{
        display: flex;
      }
      .statusStyle{
        .el-form-item__content{
          display: inherit;
        }
      }
      .drawer__footer{
        padding-top: 50px;
        padding-left: 30px;
      }
    }
  }
  
}

</style>
<style lang="scss">
.switchStyle{
  .el-switch__label--left {
    position: relative;
    left: 70px;
    color: #fff;
    z-index: -1111;
    span {
      display: inline-block;
    }
  }
  .el-switch__label--right {
    position: relative;
    right: 70px;
    color: #fff;
    z-index: -1111;
    span {
      display: inline-block;
    }
  }
  .el-switch__core {
    width: 70px !important;
  }
  .el-switch__label--right.is-active {
    z-index: 10;
    color: #fff !important;
  }
  .el-switch__label--left.is-active {
    z-index: 10;
    color: #9c9c9c !important;
  }
}

</style>
