<script setup lang="ts">
import { AssistsX, NodeClassValue, sleep, Step } from 'assistsx-js'
import { useRouter } from 'vue-router'
import { useStepStore } from 'assistsx-js'
import { useLogStore } from '@/stores/logStore'
import { start as startAccountInfo } from '@/core/WechatCollectAccountInfo'
import { start as startMoment } from '@/core/WechatCollectMoment'
import { start as startWechatUnfollowOfficialAccount } from '@/core/WechatUnfollowOfficialAccount'
import { start as startWechatCollectOfficialAccount } from '@/core/WechatCollectOfficialAccount'
import { useNavigationStore } from '@/stores/navigationStore'
import { onMounted } from 'vue'

const router = useRouter()
const stepStore = useStepStore()

// 页面挂载时修改标题
onMounted(() => {
  document.title = 'Assists Web示例'
})

const startCollectAccountInfo = async () => {
  startAccountInfo()
  goToLogs()
}

const startCollectMoment = async () => {
  startMoment()
  goToLogs()
}
const startUnfollowOfficialAccount = async () => {
  startWechatCollectOfficialAccount()
  goToLogs()
}

const goToLogs = () => {
  router.push('/logs')
}

const test = async () => {
  useLogStore().clearLogs()
  useNavigationStore().setTargetRoute('/logs')
  const node = AssistsX.findByTextAllMatch('微信助手')[0]
  useLogStore().add({ images: [], text: node?.text })
}
</script>
·
<template>
  <div style="color: #ffffff;">
    当前页面及子页面都是通过vite构建的html页面
    <div class="container">
      <button type="button" @click="startCollectAccountInfo">获取微信账号信息</button>
      <button type="button" @click="startCollectMoment">收集朋友圈</button>
      <button type="button" @click="startUnfollowOfficialAccount">批量取关公众号</button>
      <button type="button" @click="test">测试</button>
    </div>
  </div>
</template>

<style scoped>
.container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding: 10px;
  /* background-color: #000000; */
  align-items: flex-start;
  align-content: flex-start;
}

button {
  padding: 5px 10px;
  /* font-size: 16px; */
  border-radius: 4px;
  border: none;
  background-color: #646cff;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #747bff;
}
</style>