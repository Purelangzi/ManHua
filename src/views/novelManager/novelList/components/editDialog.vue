<template>
  <el-tabs v-model="activeName" class="editDialog">
    <el-tab-pane v-loading="loading" label="小说详情" name="first">
      <div class="editContent">
        <div class="detail">
          <el-image v-if="editForm.cover_lateral" :src="editForm.cover_lateral" fit="fill" class="detailImg" lazy />
          <div class="dataRight">
            <h1>{{ editForm.name }}</h1>
            <div class="author">
              <span>作者：{{ editForm.author }}</span>
            </div>
            <div class="author">
              <span>分类：</span>
              <el-select v-model="editForm.category_id" size="small">
                <el-option
                  v-for="item in categoryData"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </div>
            <div class="status">
              <div class="text">
                <span>阅读量:</span>
                <el-input v-model="editForm.read" class="inputText" size="mini" />
              </div>
              <div class="text">
                <span>点赞量:</span>
                <el-input v-model="editForm.fabulous" class="inputText" size="mini" />
              </div>
              <div class="text">
                <span>是否收费:</span>
                <el-select v-model="editForm.status" class="inputText" size="mini">
                  <el-option
                    v-for="item in statusArr"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </div>
              <div v-show="editForm.status==1" class="text">
                <span>价格</span>
                <el-input v-model="editForm.price" class="inputText" size="mini" />
              </div>

            </div>
            <div class="introduce">
              <span>简介：</span>
              <el-input v-model="editForm.intro" type="textarea" :rows="4" placeholder="请输入简介内容" />

            </div>
            <div class="handler">
              <el-button type="success" round style="margin-right: 30px;" @click="saveDetail">保存小说</el-button>
              <el-upload action="#" :before-upload="beforeAvatarUpload" :show-file-list="false">
                <el-button type="primary" round>选择封面</el-button>
              </el-upload>
            </div>
          </div>
        </div>
      </div>
    </el-tab-pane>
    <el-tab-pane label="添加章节" name="second">
      <div class="chapterContainer">
        <el-form ref="chapterForm" :model="chapterForm" :rules="chapterRules" label-width="80px" :inline="true" class="chapterForm">
          <el-form-item label="章节名称" prop="title">
            <el-input v-model="chapterForm.title" placeholder="请输入章节名称" />
          </el-form-item>
          <el-form-item label="章节别名" prop="title_alias">
            <el-input v-model="chapterForm.title_alias" type="number" :min="1" />
          </el-form-item>
          <el-form-item label="是否付费">
            <el-select v-model="chapterForm.is_vip" class="inputText">
              <el-option
                v-for="item in statusArrOther"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <div class="saveAndImport">
            <el-button type="primary" style="margin-right: 15px;" size="medium" @click="onSaveChapter">保存章节</el-button>
            <el-button type="primary" :disabled="newChapterBtn" style="margin-right: 15px;" size="medium" @click="getMoreNewChapter">一键获取最新章节</el-button>
          </div>
        </el-form>
        <div class="log">
          <span>执行日志</span>
          <el-input v-model="logData" type="textarea" resize="none" disabled :rows="5" />
        </div>
      </div>
    </el-tab-pane>

    <div v-if="chapterList.length" class="chapterList">
      <div class="chapterTitle">
        <div v-if="editForm.update_time||chapterList.length" class="series">
          <span class="seriesTitle">连载</span>
          <span class="seriesDate">{{ seriesDate }}</span>
        </div>
        <div class="flashBack">
          <span @click="flashBack">{{ isFlashBack?'倒叙':'顺叙' }}</span>
        </div>
      </div>
      <div class="chapterContent">
        <span v-for="item in chapterList" :key="item.chapter_id">{{ item.title }}</span>
      </div>
    </div>
  </el-tabs>
</template>

<script>
import { formatDate } from '@/utils'
export default {
  name: 'EditDialog',
  props: {
    detailId: {
      type: String,
      default: ''
    },
    categoryData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      activeName: 'first',
      loading: true,
      statusArr: [{ label: '收费', value: 1 }, { label: '免费', value: 0 }],
      statusArrOther: [{ label: '收费', value: 1 }, { label: '免费', value: 0 }],
      // 小说id
      id: undefined,
      // 小说详情表单
      editForm: {},
      // 小说章节列表
      chapterList: [],
      // 倒叙还是顺序
      isFlashBack: true,
      chapterForm: {
        comic_id: this.detailId, // 小说id,父级id
        title: '', // 章节名称
        title_alias: 1, // 章节别名
        is_vip: 0 // 是否付费0/1
      },
      logData: '',
      newChapterBtn: false,
      chapterRules: {
        title: [{ required: true, message: '章节名称不能为空', trigger: 'change' }],
        title_alias: [{ required: true, message: '章节别名不能为空', trigger: 'change' }]
      },
      // 临时上传的详情封面数据
      editFileRaw: undefined
    }
  },
  computed: {
    seriesDate() {
      return formatDate(
        this.editForm.update_time ? this.editForm.update_time : this.chapterList[this.chapterList.length - 1].create_time
      )
    }
  },
  watch: {
    'detailId': {
      immediate: true,
      handler(newVal) {
        this.id = newVal
        this.getDetail()
        this.getChapterList()
      }
    }
  },
  methods: {
    // 根据传过来的id获取漫画详情
    async getDetail() {
      if (!this.id) return
      const res = await this.$API.novel.getDetail({ id: this.id })
      if (res.code === 200) {
        this.editForm = res.data
      }
      this.loading = false
    },
    // 根据id获取漫画章节列表
    async getChapterList() {
      if (!this.id) return
      const res = await this.$API.novel.getChapterList({ comic_id: this.id, isAll: true })
      if (res.code === 200) {
        this.chapterList = res.data.data
      }
    },
    // 保存小说
    async saveDetail() {
      if (this.editFileRaw) await this.imgUpload()
      const { editForm } = this
      const res = await this.$API.novel.updateList(editForm)
      if (res.code === 200) {
        this.$message.success(res.msg)
        this.$emit('getList')
      } else {
        this.$message.error(res.msg)
      }
    },
    // 上传漫画封面前的回调,检查格式，实时预览
    beforeAvatarUpload(file) {
      this.editFileRaw = file // 存储的临时详情图片数据
      try {
        // 判断图片类型
        const typeArr = ['image/png', 'image/jpg', 'image/jpeg']
        const flag = typeArr.includes(file.type)
        const isLt2M = file.size / 1024 / 1024 < 2
        if (!flag) {
          this.$message.error('上传图片只能是 PNG、JPG、JPEG 格式!')
          return false
        }
        if (!isLt2M) {
          this.$message.error('上传图片大小不能超过 2MB!')
          return false
        }
        const reader = new FileReader()
        // readAsDataURL方法将图片转为base64格式存储于result中
        reader.readAsDataURL(file)
        reader.onload = (e) => {
          // 拿到上传文件后的url字符串base64编码
          const txt = e.target.result
          // 预览图片
          this.editForm.cover_lateral = txt
        }
        return flag && isLt2M
      } catch (error) {
        console.log(error)
      }
    },
    // 上传小说封面到服务器
    async imgUpload() {
      // 创建一个表单对象
      const formData = new FormData()
      // 追加图片数据,files为请求参数名
      formData.append('files', this.editFileRaw)
      const res = await this.$API.common.uploadFile(formData)
      if (res.code === 200) {
        // 替换回接口返回的url地址
        this.editForm.cover_lateral = res.data.url
      } else {
        this.$message.error(res.msg)
      }
    },
    // 保存章节
    onSaveChapter() {
      this.$refs.chapterForm.validate(async(valid) => {
        if (valid) {
          const res = await this.$API.novel.addChapter(this.chapterForm)
          if (res.code === 200) {
            this.$message.success(`${res.msg}`)
            this.getDetail()
            this.getChapterList()
          }
        } else {
          this.$message.warning('输入不符合规则')
        }
      })
    },

    // 一键获取最新章节并上传最新章节
    async getMoreNewChapter() {
      const params = {
        pageId: this.editForm.pageId,
        comicId: this.editForm.platform_comic,
        type: 1
      }
      this.newChapterBtn = true
      const res = await this.$API.common.queryNovelDetail(params)

      if (res.code === 200) {
        const chapterLength = res.data.length
        if (!chapterLength) {
          this.newChapterBtn = false
          return this.$message.warning('数据为空，无最新章节')
        }
        this.logData = `开始上传章节...`

        for (let index = 0; index < res.data.length; index++) {
          const item = res.data[index]
          item.comic_id = this.editForm.id
          delete item.platform_comic
          const res1 = await this.$API.novel.addChapter(item)
          if (res1.code === 200) {
            this.logData = `${index + 1}/${chapterLength}导入成功\n` + this.logData
          } else {
            this.logData = `${index + 1}/${chapterLength}导入失败,${res1.msg}\n` + this.logData
          }
        }
        this.logData = `导入完成\n` + this.logData
        this.getDetail()
        this.getChapterList()
      } else {
        this.$message.error('IP限制,需要梯子')
      }
      this.newChapterBtn = false
    },

    // 倒叙
    flashBack() {
      this.isFlashBack = !this.isFlashBack
      this.chapterList.reverse()
    }

  }
}
</script>

<style lang='scss' scoped>
.editDialog{
  height: 600px;
  overflow-y: auto;
  .editContent{
    .detail{
      display: flex;
      .detailImg{
        min-width: 295px;
        height: 395px;
        border: 10px solid #fff;
        box-shadow: 0 1px 10px #0000001a;
        ::v-deep img{
          width: 295px;
        }
      }
      .dataRight{
        margin-left: 35px;
        .author{
          margin-top: 15px;
          color: #863b13;
          font-size: 12px;
        }
        .status{
          display: flex;
          flex-wrap: wrap;
          margin-top: 30px;
          .text{
            display: flex;
            align-items: center;
            margin-right: 35px;
            color:#999;
            span{
              min-width: 60px;
            }
            .inputText{
              margin-left: 10px;
              ::v-deep .el-input__inner{
                width: 100px;
              }
            }
          }
        }
        .introduce{
          display: flex;
          margin-top: 20px;
          span{
            width: 45px;
            height: 45px;
            font-size: 12px;
            height: 15px;
            color:#999;
          }
        }
        .handler{
          margin: 40px 0px 0px 20px;
          display: flex;
          height: 40px;
        }
      }
    }
  }
  .chapterContainer{
    display: flex;
    .chapterForm{
      margin-left: 40px;
      color: #606266;
      .saveAndImport{
        display: flex;
      }
    }
    .log{
      margin-left: 10px;
      margin-right: 20px;
      width: 600px;
    }
  }
  .chapterList{
    margin: 50px 20px 0 10px;

    .chapterTitle{
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;
      .seriesTitle{
        font-size: 24px;
        color: #606266;
      }
      .seriesDate{
        margin-left: 10px;
        color: #666;
        font-size: 13px;
      }
      .flashBack{
        color: #606266;
        cursor: pointer;
      }
    }
    .chapterContent{
      display: flex;
      flex-wrap: wrap;
      span{
        margin:0 20px 10px 0;
        padding: 0 15px;
        font-size: 12px;
        width: 184px;
        height: 22px;
        line-height: 22px;
        background-color: #fbfbfb;
        white-space:nowrap;
        overflow: hidden;
      }
    }
  }
}
::v-deep .el-upload-list__item{
  display: none;
  transition:none !important;
  -webkit-transition:nonne !important;
}
::v-deep .el-upload-list__item-name{
  display: none;
  transition:none !important;
  -webkit-transition:nonne !important;
}
</style>
