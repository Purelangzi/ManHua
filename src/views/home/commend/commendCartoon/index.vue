<template>
  <div class="commendCartoon">
    <el-card shadow="always" :body-style="{ padding: '0px' }">
      <div slot="header">
        <span>推荐</span>
        <el-button type="text" style="float: right;margin-right: 10px;" @click="getMore">更多</el-button>
      </div>
      <div class="cartoonContent">
        <cartoonCart v-for="cartData in cartoonData" :key="cartData.id" :cartData="cartData" />
      </div>
    </el-card>
  </div>
  
  
</template>

<script>
import cartoonCart from './cartoonCart'
export default {
  props:{
    cartoonData:{
      type:Array,
      require:true
    }
  },
  name: 'commendCartoon',
  components:{cartoonCart},
  data () {
    return {
        
    }
  },
  mounted() {
  },
  methods: {
    getMore(){
      this.$emit('getMore')
    }
  },
}
</script>

<style lang='scss' scoped>
.commendCartoon{
  width: 70%;
  margin-right: 10px;
  ::v-deep .el-card__header{
     div{
      display: flex;
      justify-content: space-between;
      align-items: center;
      
    }
  }
  .cartoonContent{
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    ::v-deep .el-card{
      margin-right: 0;
    }
  }
}
</style>
