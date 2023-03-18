<template>
  <div>
    <div class="header">
      <div class="search">
        <el-form :model="Searchform" label-width="80px" :inline=true>
          <el-form-item label="用户名">
            <el-input v-model.trim="Searchform.username"  @keyup.enter.native="onSeach" placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item label="手机号码">
            <el-input v-model.trim="Searchform.phone" @keyup.enter.native="onSeach" placeholder="请输入手机号码"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSeach"  v-show="isBtnDisabled" size="medium">搜索</el-button>
            <el-button type="warning " @click="onReturn" v-show="!isBtnDisabled" size="medium">返回</el-button>
            <el-button type="primary" @click="addList"  v-show="isBtnDisabled" size="medium">新增账号</el-button>
            <el-button type="danger " @click="moreDelete" size="medium">批量删除</el-button>
          </el-form-item>
        </el-form>

      </div>

    </div>
    <div class="content">
      <el-table v-loading="loading" :data="listData" @selection-change="selectChange" ref="listTable" border :height="600">
        <el-table-column type="index" label="序号" width="60" align="center">
          <template v-slot="{$index}">
            <span>{{ (page-1)*pageSize+($index+1) }}</span>
          </template>
        </el-table-column>
        <el-table-column type="selection" fixed="left"></el-table-column>
        <div v-for="(col, index) in columns" :key="index">
          <el-table-column v-if="col.isSlot" :label="col.label" align="center" show-overflow-tooltip>
            <template v-slot="{row}">
              <div v-if="col.prop == 'role_id'">
                <el-tag v-if="row.role_id==1" >超级管理员</el-tag>
                <el-tag  v-if="row.role_id==3" type="success">管理员</el-tag>
                <el-tag  v-if="row.role_id==6" type="info">小说用户</el-tag>
                <el-tag  v-if="row.role_id==2|| row.role_id==0" type="warning">普通用户</el-tag>
                <el-tag  v-if="row.role_id==5" type="danger">视频用户</el-tag>
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

     <el-drawer :title="listTitle==1?'添加账号':'修改账号'" :visible.sync="dialogEditVisible" size="30%" ref="drawer" custom-class="demo-drawer"
      :before-close="handleClose" :show-close="true" :wrapperClosable="true">
      <div class="demo-drawer__content">
        <el-form :model="accountForm"  ref="accountForm" style="width: 80%;">
          <el-form-item label="用户名" prop="username" class="drwaerItem">
            <el-input v-model="accountForm.username" placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password"  class="drwaerItem">
            <el-input v-model="accountForm.password" show-password placeholder="请输入密码"></el-input>
          </el-form-item>
          <el-form-item label="角色" prop="role_id"  class="drwaerItem">
            <el-select v-model="accountForm.role_id" placeholder="请选择角色">
              <el-option v-for="item in roleColumns" :label="item.label" :value="item.value" :key="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="手机" prop="phone"  class="drwaerItem">
            <el-input v-model="accountForm.phone" show-password placeholder="请输入手机号"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email"  class="drwaerItem">
            <el-input v-model="accountForm.email" show-password placeholder="请输入邮箱"></el-input>
          </el-form-item>

        </el-form>
        <div class="demo-drawer__footer">
          <el-button type="primary" @click="submitAddOrUpdate" :loading="loading">{{ loading ? ' ...' : '确 定' }}</el-button>
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
export default {
  name: 'account',
  data () {
    return {
      loading:true,
      isBtnDisabled:true,
      dialogEditVisible:false,
      // 搜索表单
      Searchform:{
        username:'',
        phone:''
      },
      // 列表数据
      listData:[],
      // 已选择的多选框数据
      selectListOption:[],
      // 批量删除的id
      ids:'',
      // 已选择的批量修改的分类id
      selectMoreUpdateCtId:'',
      // 当前选择的账号id，
      detailId:'',
      // 添加或修改账号的表单
      accountForm:{
        username:'',
        password:'',
        role_id:'',
        phone:'',
        email:'',
        // avatar:''
      },
      // 账号列表的表头
      columns:[
        {isSlot:false,prop:'username',label:'用户名'},
        {isSlot:false,prop:'email',label:'邮箱'},
        {isSlot:false,prop:'phone',label:'电话'},
        {isSlot:true,prop:'role_id',label:'角色'},
        {isSlot:false,prop:'create_time',label:'创建时间'},
      ],
      // 编辑或添加账号表单的表头
      roleColumns:[
        {label:'超级管理员',value:1},{label:'管理员',value:3},
        {label:'影视用户',value:5},{label:'小说用户',value:6}
      ],
      listTitle:1,// 1添加账号 0修改账号
      // 当前页
      page:1,
      // 每页显示的条数
      pageSize:20,
      // 总条数
      totalNum:0

    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    // 获取账号列表数据
    async getList(){
      console.log(2);
      const {page,pageSize} = this
      const {username,phone} = this.Searchform
      let res = await this.$API['system'].getAccountList({page,pageSize,username,phone})
      if(res.code == 200){
        this.listData = res.data.data
        this.totalNum = res.data.total
      }
      this.loading = false

    },

    // 搜索
    onSeach(){
      if(!this.Searchform.username && !this.Searchform.phone) return
      this.getList()
      this.isBtnDisabled = false

    },
    // 返回列表
    onReturn(){
      this.isBtnDisabled = true
      this.Searchform.username = ''
      this.Searchform.phone = ''
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
    // 添加列表
    addList(){
      this.listTitle = 1
      this.dialogEditVisible = true
    },
    // 编辑列表
    editList(row){
      this.listTitle = 0
      this.accountForm = {...row}
      this.dialogEditVisible = true
      
    },
    // 删除列表
    async deleteList(row){
      this.ids = row.id
      this.dropList(this.ids,row.name)
    },
    // 账号详情对话框关闭前的回调
    handleClose(done){
      // 由于row数据的属性多过accountForm，用Object.assing深拷贝会覆盖从而accountForm多出属性
      // Object.assign(this.$data.accountForm,this.$options.data().accountForm)
      this.$data.accountForm = JSON.parse(JSON.stringify(this.$options.data().accountForm))
      done()
    },
    // 添加账号或修改账号
    async submitAddOrUpdate(){
      const res = await this.$API.system[this.listTitle==1?'addAccount':'editAccount'](this.accountForm)
      if(res.code==200){
        this.$message.success(res.msg)
      }else{
        this.$message.error(res.msg)
      }
      this.$refs.drawer.closeDrawer()
      this.$nextTick(()=>{
        console.log(1);
        this.page = Math.ceil((this.totalNum+1) / this.pageSize)
        this.getList()
      })
      
    },

    // 删除方法
    dropList(ids,name){
      this.$confirm(`确定要${name?'删除 '+ name : '批量删除' } 吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          const data = await this.$API.system.deleteAccount({ids})
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
    .demo-drawer__content{
      .el-form-item__label{
        width: 54px;
      }
      .el-form-item__content{
        display: flex;
      }
    }
  }
  
}

</style>
