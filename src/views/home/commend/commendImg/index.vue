<template>
  <div class="commendImg">
    <el-card>
      <div slot="header">
          <span>推荐</span>
          <el-button type="text" style="float: right;margin-right: 10px;">更多</el-button>
      </div>
      <div class="commendAvatar">

        <el-card v-for="item in 9" :key="item"  shadow="hover" >
            <el-avatar :size="90" shape="circle" :src="require('@/assets/images/mmm'+item+'.jpeg')" fit="fill">
              <img :src="require('@/assets/images/defaultUserImg.png')" />
            </el-avatar>
        </el-card>
      </div>
    </el-card>
  </div>
  
</template>

<script>
export default {
  name: 'commendImg',
  data () {
    return {
       
    }
  },
  methods: {
  },
}
</script>

<style lang='scss' scoped>
.commendImg{
  width: 30%;
  ::v-deep .el-card__header{
     div{
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
  ::v-deep .el-card__body{
    padding: 0;
  }
  .commendAvatar{
    display: flex;
    flex-wrap: wrap;
    .el-card{
      width: 33.3%;
      display: flex;
      justify-content: center;
      padding: 24px;
    }
  }
}
</style>
