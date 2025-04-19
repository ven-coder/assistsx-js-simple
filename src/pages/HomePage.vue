<script setup lang="ts">
import { AssistsX, NodeClassValue, sleep, Step } from 'ax-web-dev'
import { useRouter } from 'vue-router'
import { useStepStore } from 'ax-web-dev'
import { useLogStore } from '@/stores/logStore'
import { start as startAccountInfo } from '@/core/WechatCollectAccountInfo'
import { start as startMoment } from '@/core/WechatCollectMoment'

const router = useRouter()
const stepStore = useStepStore()

const startCollectAccountInfo = async () => {
  startAccountInfo()
  goToLogs()
}

const startCollectMoment = async () => {
  startMoment()
  goToLogs()
}

const goToLogs = () => {
  router.push('/logs')
}

const test = async () => {
  const allNodes = AssistsX.getAllNodes()
  const screenshot = await allNodes[0].takeScreenshot()
  console.log(screenshot)
}
</script>

<template>
  <div class="container">
    <button type="button" @click="startCollectAccountInfo">获取微信账号信息</button>
    <button type="button" @click="startCollectMoment">收集朋友圈</button>
    <button type="button" @click="startCollectAccountInfo">批量取关公众号</button>
    <button type="button" @click="test">测试</button>
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