<template>

<div class="catoonTable">
    <el-table :data="categoryData" border stripe>
        <el-table-column label="序号" type="index" width="100" align="center">
        </el-table-column>
        <el-table-column label="分类名称" prop="name">
        </el-table-column>
        <el-table-column label="封面">
            <el-image :src="defaultCategoryImg" style="width: 56px;height: 56px;" fit="fill"></el-image>
        </el-table-column>
        <el-table-column label="创建时间" prop="create_time" align="center">
        </el-table-column>
        <el-table-column label="状态" align="center">
            <template v-slot="{row}">
            <el-tag :type="row.status==1?'success':'danger'"  effect="dark" size="medium">{{ row.status==1?'上架':'下架' }}</el-tag>
            </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
            <template v-slot="{row}">
            <el-button type="primary" icon="el-icon-edit" @click="addOrUpdateCategory(row)" >编辑</el-button>
            <el-button type="danger " icon="el-icon-delete" @click="deleteCategory(row)" >删除</el-button>
            </template>
        </el-table-column>
    </el-table>
</div>
</template>

<script>
import defaultCategoryImg from '@/assets/images/defaultCategoryImg.jpg'
export default {
  name: 'categoryTable', 
  props:{
    // 请求参数
    requestParams:{
        type:Object,
        required:true,
        // 数组或对象的默认得用工厂函数返回
        default:()=>{return {page:1,pageSize:10,name:''}}
    },
    // 请求哪个分类
    categoryName:{
      type:String,
      required:true
    }
  },  
  data () {
    return {
        defaultCategoryImg,
        categoryData:[],
    }
  },
  mounted() {
    this.getCategoryData()
  },
  methods: {
    async getCategoryData(){
      const {categoryName} = this
      const {data} = await this.$API[categoryName].getCategory(this.requestParams)
      this.categoryData = data.data
    },
    addOrUpdateCategory(row){
      this.$emit('sendRowData',row)
    },
    deleteCategory(row){
      this.$confirm(`确认删除 ${row.name} ?`,'提示',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const {categoryName} = this
        await this.$API[categoryName].deleteCategory({ids:row.id})
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
  },
  watch: {
    // 监听父组件传递过来的请求参数的变化
    'requestParams':{
      deep:true,
      handler(newVal,oldVal){
        this.getCategoryData()
      }
    }
  },
}
</script>

<style lang='scss' scoped>
.catoonTable{
  margin: 20px;
}
</style>
