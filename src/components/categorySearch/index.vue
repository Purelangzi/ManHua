<template>
  <div>
    <el-card shadow="always" :body-style="{ marginTop: '15px' }">
      <el-form ref="searchForm" :model="searchForm" label-width="auto" :inline="true">
        <el-form-item label="分类名称" prop="name" :rules="[{required:true, message: '名称不能为空',trigger: 'blur'}]">
          <el-input v-model.trim="searchForm.name" :disabled="isDisabled" placeholder="请输入搜索内容" />
        </el-form-item>
        <el-form-item>
          <el-button v-show="isShow" type="primary" @click="searchCategory">查询</el-button>
          <el-button v-show="!isShow" type="primary" @click="recover">返回</el-button>
          <el-button type="primary" @click="addCategory">添加</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'CategorySearch',
  data() {
    return {
      searchForm: {
        name: ''
      },
      isShow: true,
      isDisabled: false
    }
  },
  mounted() {

  },
  methods: {
    // 搜索分类名称
    searchCategory() {
      if (this.searchForm.name === '') {
        this.$message.error('请检查表单是否填写正确')
        return
      }
      this.isDisabled = true
      // 触发父组件发送搜索分类的事件，并传递表单数据
      this.$emit('sendSeachForm', this.searchForm)
      this.isShow = false
    },
    // 返回分类表格
    recover() {
      this.searchForm.name = ''
      this.isShow = true
      this.isDisabled = false
      this.$emit('recover')
    },
    // 添加分类
    addCategory() {
      this.$emit('addCategory')
    }
  }
}
</script>

<style lang='scss' scoped>

</style>
