<template>
  <div>
    <el-card shadow="always" :body-style="{ marginTop: '15px' }">
      <el-form :model="searchForm" ref="searchForm" label-width="80px" :inline="true">
      <el-form-item label="分类名称" prop="name" :rules="[{required:true, message: '名称不能为空',trigger: 'blur'}]">
        <el-input v-model.trim="searchForm.name" placeholder="请输入搜索内容"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" v-show="isShow" @click="searchCategory">查询</el-button>
        <el-button type="primary" v-show="!isShow" @click="recover">返回</el-button>
        <el-button type="primary" @click="addCategory">添加</el-button>
      </el-form-item>
     </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'categorySearch',
  data () {
    return {
      searchForm:{
        name:''
      },
      isShow:true,
    }
  },
  mounted() {
    
  },
  methods: {
    searchCategory(){
      if(this.searchForm.name == '') return
      this.$emit('sendSeachForm',this.searchForm)
      this.isShow = false
    },
    recover(){
      this.searchForm.name = ''
      this.isShow = false
      this.$emit('recover')
    },
    addCategory(){

    },
  },
}
</script>

<style lang='scss' scoped>

</style>
