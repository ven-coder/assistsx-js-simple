<script setup lang="ts">
import { AssistsX, NodeClassValue, sleep, Step } from 'ax-web-dev'
import { useRouter } from 'vue-router'
import { useStepStore } from 'ax-web-dev'
import { launchWechat } from '../core/WechatCollectAccountInfo'
import { useLogStore } from '@/stores/logStore'

const router = useRouter()
const stepStore = useStepStore()

const startCollectAccountInfo = async () => {
  useLogStore().clearLogs()
  Step.run(launchWechat).then(() => {
    useLogStore().addTextLog('执行结束')
  }).catch((error) => {
    useLogStore().addTextLog('执行失败：' + error)
  })
  goToLogs()
}

const goToLogs = () => {
  router.push('/logs')
}
</script>

<template>
  <div class="container">
    <button type="button" @click="startCollectAccountInfo">执行</button>
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