<template>
  <el-tabs v-model="activeName" class="editDialog">
    <el-tab-pane v-loading="loading" label="漫画详情" name="first">
      <div class="editContent">
        <div class="detail">
          <el-image v-if="editForm.img_url" :src="editForm.img_url" fit="fill" class="detailImg" lazy />
          <el-image v-else :src="defaultCategoryImg" fit="fill" class="detailImg" lazy />

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
              <el-input v-model="editForm.cartoon_introduction" type="textarea" :rows="4" placeholder="请输入简介内容" />

            </div>
            <div class="handler">
              <el-button type="success" round style="margin-right: 30px;" @click="saveDetail">保存漫画</el-button>
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
        <el-upload action="#" class="avatar-uploader" :before-upload="beforeAvatarUpload">
          <i v-if="!chapterForm.cover" class="el-icon-plus avatar-uploader-icon" />
          <img v-else :src="chapterForm.cover" style="width: 148px;height: 170px;">
          <div slot="tip" class="el-upload__tip">
            <p>只能上传jpg/png/jpeg图片，且不超过2M</p>
          </div>
        </el-upload>
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
          <el-form-item v-show="chapterForm.is_vip==1" label="价格" prop="price">
            <el-input v-model="chapterForm.price" />
          </el-form-item>
          <div class="saveAndImport">
            <el-button type="primary" style="margin-right: 15px;" @click="onSaveChapter">保存章节</el-button>
            <el-upload
              action="https://jsonplaceholder.typicode.com/posts/"
              accept=".xls,.xlsx"
              :on-change="importExcChapter"
              :show-file-list="false"
              :auto-upload="false"
            >
              <el-button>批量导入章节</el-button>
            </el-upload>
          </div>
        </el-form>
        <div class="log">
          <span>执行日志</span>
          <el-input v-model="logData" type="textarea" resize="none" disabled :rows="5" />
        </div>
      </div>
    </el-tab-pane>

    <!-- 连载 -->
    <div v-if="chapterList.length" class="chapterList">
      <div class="chapterTitle">
        <div class="series">
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
import defaultCategoryImg from '@/assets/images/defaultCategoryImg.jpg'
import { ImportXlsx } from '@/utils/file'
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
      // 漫画id
      id: undefined,
      // 漫画详情表单
      editForm: {},
      // 漫画章节列表
      chapterList: [],
      // 倒叙还是顺序
      isFlashBack: true,
      // chapterImg:'',
      chapterForm: {
        comic_id: this.detailId, // 漫画id,父级id
        cover: '', // 封面
        title: '', // 章节名称
        title_alias: 1, // 章节别名
        is_vip: 0, // 是否付费0/1
        price: 0
      },
      logData: '',
      chapterRules: {
        title: [{ required: true, message: '章节名称不能为空', trigger: 'blur' }],
        title_alias: [{ required: true, message: '章节别名不能为空', trigger: 'blur' }]
      },
      // 临时上传的章节封面数据
      chapterFileRaw: undefined,
      // 临时上传的详情封面数据
      editFileRaw: undefined,
      defaultCategoryImg
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
      const res = await this.$API.cartoon.getDetail({ id: this.id })
      if (res.code === 200) {
        this.editForm = res.data
      }
      this.loading = false
    },
    // 根据id获取漫画章节列表
    async getChapterList() {
      if (!this.id) return
      const res = await this.$API.cartoon.getChapterList({ comic_id: this.id, isAll: true })
      if (res.code === 200) {
        this.chapterList = res.data.data
      }
    },
    // 保存漫画
    async saveDetail() {
      // 已经上传封面，才确定上传漫画封面到阿里云,加await就是等待这个结果才往下执行
      if (this.editFileRaw) await this.imgUpload()
      const res1 = await this.$API.cartoon.updateList(this.editForm)
      if (res1.code === 200) {
        this.$message.success(res1.msg)
        this.$emit('getList')
      } else {
        this.$message.error(res1.msg)
      }
    },

    // 上传漫画封面或章节封面前的回调,检查格式，实时预览
    beforeAvatarUpload(file) {
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
          if (this.activeName === 'first') {
            this.editForm.img_url = txt
            this.editFileRaw = file // 存储的临时详情图片数据
          } else {
            this.chapterForm.cover = txt
            this.chapterFileRaw = file // 存储的临时章节图片数据
          }
        }
        return flag && isLt2M
      } catch (error) {
        console.log(error)
      }
    },
    // 上传漫画封面或小说封面到服务器
    async imgUpload() {
      // 创建一个表单对象
      const formData = new FormData()

      if (this.activeName === 'first') {
        // 追加图片数据,files为请求参数名
        formData.append('files', this.editFileRaw)
      } else {
        formData.append('files', this.chapterFileRaw)
      }
      const res = await this.$API.common.uploadFile(formData)
      if (res.code === 200) {
        // 替换回接口返回的url地址
        if (this.activeName === 'first') {
          this.editForm.img_url = res.data.url
        } else {
          this.chapterForm.cover = res.data.url
        }
      } else {
        this.$message.error(res.msg)
      }
    },
    // 保存章节
    onSaveChapter() {
      this.$refs.chapterForm.validate(async(valid) => {
        if (valid) {
          // 已上传封面，才确定上传小说封面到服务器
          if (!this.chapterFileRaw) {
            return this.$message.warning('请上传小说封面！')
          }

          await this.imgUpload()
          const res = await this.$API.cartoon.addChapter(this.chapterForm)
          if (res.code === 200) {
            this.$message.success(`${res.msg}`)
            this.getChapterList()
            // 不请求详情数据，保留详情临时上传的图片数据，因为请求详情会引起详情封面的重置
            if (this.editFileRaw) return
            this.getDetail()
          } else {
            this.$message.error(`${res.msg}`)
          }
        }
      })
    },
    // 批量导入章节
    async importExcChapter(file) {
      this.logData = ''
      try {
        const res = await ImportXlsx(file)
        const head = {
          章节名称: 'title',
          封面: 'cover',
          章节别名: 'title_alias',
          价格: 'price',
          是否vip: 'is_vip',
          上家ID: 'platform_chapter',
          上家漫画ID: 'comicId'
        }
        const list = res.map(item => {
          const obj = {}
          for (const k in item) {
            if (head[k]) {
              obj[head[k]] = item[k]
            }
          }
          return obj
        })
        const listLength = list.length

        if (list[0].comicId !== this.editForm.platform_comic) {
          this.$message.warning(`当前要批量导入的章节不属于 ${this.editForm.name} 漫画`)
          return
        }

        for (let i = 0; i < list.length; i++) {
          const item = list[i]
          // 浅拷贝,准备请求对象
          const params = { ...item }
          // 请求对象添加章节所属漫画的id并赋值
          params.comic_id = this.detailId
          // 删除比较的请求参数
          delete params.comicId
          const res = await this.$API.cartoon.addChapter(params)
          if (res.code === 200) {
            this.logData = `${i + 1}/${listLength}导入成功\n` + this.logData
          } else {
            this.logData = `${i + 1}/${listLength}导入失败,${res.msg}\n` + this.logData
          }
        }
      } catch (error) {
        this.logData = `导入失败\n` + this.logData
      }
      this.logData += `导入完成\n`
      this.getDetail()
      this.getChapterList()
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
    ::v-deep .avatar-uploader {
      .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
      }
      .el-upload:hover {
        border-color: #409EFF;
      }
    }
    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 148px;
      height: 148px;
      line-height: 148px;
      text-align: center;
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
