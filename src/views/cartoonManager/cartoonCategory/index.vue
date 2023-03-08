<template>
  <div class="cartoonCategory">
    <categorySearch @sendSeachForm="receiveSearchForm" @recover="recover" />
    <categoryTable ref="categoryTable" :requestParams=requestParams :categoryName="categoryName" />
    
  </div>
</template>

<script>

import categorySearch from '@/components/categorySearch'
import categoryTable from '@/components/categoryTable'
export default {
  name: 'cartoonCategory',
  components:{categorySearch,categoryTable},
  data () {
    return {
      requestParams:{
        page:1,
        pageSize:10,
        name:''
      },
      // 哪个分类
      categoryName:'cartoon',
      
    }
  },
  mounted() {
    
  },
  methods: {
    receiveSearchForm(form){
      this.requestParams.name = form.name
      
    },
    recover(){
      this.requestParams = {}
    }
  },
}
</script>

<style lang='scss' scoped>

</style>
