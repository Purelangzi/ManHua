<template>
  <div class="cartoonCategory">
    <categorySearch ref="categorySearch" @sendSeachForm="receiveSearchForm" @recover="recover" @addCategory="addCategory" />
    <categoryTable ref="categoryTable" :requestParams='requestParams' :categoryName="categoryName" @sendRowData="acceptRowData" />
    <categoryDialog ref="categoryDialog" :categoryName="categoryName" :categoryData="categoryData" @onLoadTable="onLoadTable" />
  </div>
</template>
<script>

import categorySearch from '@/components/categorySearch'
import categoryTable from '@/components/categoryTable'
import categoryDialog from '@/components/categoryDialog'
export default {
  name: 'cartoonCategory',
  components:{categorySearch,categoryTable,categoryDialog},
  data () {
    return {
      // requestParams数据一变化，表格组件监听器就发送获取数据的请求
      requestParams:{
        page:1,
        pageSize:10,
        name:''
      },
      // 哪个分类
      categoryName:'cartoon',
      categoryData:[]
    }
  },
  mounted() {
  },
  methods: {
    // 接收搜索组件的分类名字
    receiveSearchForm(form){
      this.requestParams.name = form.name
    },
    // 返回全部列表
    recover(){
      // 恢复初始原始数据
      this.requestParams = this.$options.data().requestParams
    },
    // 从表格组件接收对应行的数据
    acceptRowData(row){
      // 获取分类数据，传给子组件做添加或修改的检验
      if(!this.categoryData.length){
        this.categoryData = this.$refs['categoryTable'].categoryData
      }
      // 浅拷贝把数据给对话框组件
      this.$refs.categoryDialog.updateForm = {...row}
      // 对话框显示
      this.$refs.categoryDialog.isShow = true
    },
    // 添加分类
    addCategory(){
      this.$refs['categoryTable'].params.name=''
      // 控制对话框隐藏
      this.$refs.categoryDialog.isShow = true
      // 获取分类数据，传给子组件做添加或修改的检验,分类数据不存在才传递
      if(!this.categoryData.length){
        this.categoryData = this.$refs['categoryTable'].categoryData
      }
      
    },
    // 添加或修改完成后请求表格数据
    onLoadTable(){
      // 控制输入框禁用，清空搜索框，控制查询和返回按钮的显隐
      this.$refs.categorySearch.isDisabled = false
      this.$refs.categorySearch.searchForm.name = ''
      this.$refs.categorySearch.isShow = true
      // 查询参数存在，赋name为空，引起监听器变化从而请求表格数据
      if(this.requestParams.name){
          this.requestParams.name = ''
      // 如果没存在直接请求表格数据
      }else{
        this.$refs.categoryTable.getCategoryData()
      }
    },
  },
}
</script>

<style lang='scss' scoped>

</style>
