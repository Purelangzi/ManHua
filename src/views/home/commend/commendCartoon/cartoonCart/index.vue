<template>
  <div class="cartoonCart">
    <el-card shadow="hover" :body-style="{ padding: '20px' }">
      <div class="smallImg">
        <el-image :src="cartData.img_url" fit="cover" />
      </div>
      <div class="cartoonInfo">
        <p>漫画名：{{ cartData.name }}</p>
        <p>更新时间：{{ cartData.update_time }}</p>
      </div>
    </el-card>
  </div>

</template>

<script>
export default {
  name: 'CartoonCart',
  props: {
    cartData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {

    }
  },
  mounted() {

  },
  methods: {

  }
}
</script>

<style lang='scss' scoped>
.cartoonCart{
    width: 33.3%;
    ::v-deep .el-card__body{
        display: flex;
    }
    .smallImg{
        margin-right: 5px;
        .el-image{
            width: 100px;
            height: 100px;
        }

    }
    .cartoonInfo{
        font-size: 12px;
        display: flex;
        flex-wrap: wrap;
    }
}

</style>
