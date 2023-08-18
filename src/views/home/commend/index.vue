<template>
  <div class="commend">
    <commendCartoon ref="commendCartoon" :cartoon-data="cartoonData" @getMore="getMore" />
    <commendImg />
  </div>
</template>

<script>
import commendCartoon from './commendCartoon/'
import commendImg from './commendImg'
import { formatDate } from '@/utils'
export default {
  name: 'Commend',
  components: { commendCartoon, commendImg },
  data() {
    return {
      page: '',
      pageSize: 9,
      cartoonData: []
    }
  },
  created() {
    this.getCommendData()
  },
  methods: {
    async getCommendData() {
      this.page = Math.floor(Math.random() * 69) + 1
      const { page, pageSize } = this
      const { data } = await this.$API.home.getCartoonList({ page, pageSize })
      data.data.forEach(el => {
        el.create_time = formatDate(el.create_time)
        el.update_time = formatDate(el.update_time)
      })
      this.cartoonData = data.data
      this.$refs.commendCartoon.loading = false
    },
    getMore() {
      this.getCommendData()
    }
  }
}
</script>

<style lang='scss' scoped>
.commend{
    display: flex;
    margin-top: 10px;
    ::v-deep .el-card__header{
      padding: 10px 20px;
    }
}
</style>
