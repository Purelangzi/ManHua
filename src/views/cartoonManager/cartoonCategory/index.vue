<template>
  <div class="cartoonCategory">
    <categorySearch @sendSeachForm="receiveSearchForm" @recover="recover" />
    <categoryTable ref="categoryTable" :requestParams=requestParams :categoryName="categoryName" :sendRowData="acceptRowData" />
    <categoryDialog :rowData="rowData"/>
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
      requestParams:{
        page:1,
        pageSize:10,
        name:''
      },
      // 哪个分类
      categoryName:'cartoon',
      rowData:{}
      
    }
  },
  mounted() {
    
  },
  methods: {
    // 接收搜索数据
    receiveSearchForm(form){
      this.requestParams.name = form.name
      
    },
    // 返回全部列表
    recover(){
      this.requestParams = {}
    },
    // 接收对应行的数据
    acceptRowData(row){
      
    }
  },
}
</script>

<style lang='scss' scoped>

</style>
