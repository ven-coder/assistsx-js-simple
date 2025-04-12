<script setup lang="ts">
import { onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import { useLogStore } from '../stores/logStore'
import { Step, useStepStore } from 'ax-web-dev'

const router = useRouter()
const logStore = useLogStore()
const stepStore = useStepStore()
const originalTitle = document.title

// 计算返回按钮是否显示
const showBackButton = computed(() => {
  return stepStore.status === 'completed' || stepStore.status === 'error'
})

// 返回首页
const goBack = () => {
  router.back()
}

// 页面挂载时修改标题
onMounted(() => {
  document.title = '执行日志'
})

// 页面卸载时恢复原标题
onUnmounted(() => {
  document.title = originalTitle
})

// 暴露方法给父组件
defineExpose({
  addLog: logStore.addLog,
  clearLogs: logStore.clearLogs
})

const stopStep = () => {
  Step.stop()
  logStore.addLog('主动停止')
}

</script>

<template>
  <div class="log-page">
    <div class="log-header">
      <div class="header-buttons">
        <button class="icon-button" @click="goBack" v-if="showBackButton">
          <Icon icon="mdi:arrow-left" width="24" />
        </button>
        <button @click="stopStep" style="background-color: red;" v-if="!showBackButton">停止</button>
        <button @click="logStore.clearLogs">清空日志</button>
      </div>
    </div>
    <div class="log-content">
      <div v-for="(log, index) in logStore.logs" :key="index" class="log-item">
        {{ log }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.log-page {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  color: #ffffff;
  overflow: hidden;
}

.log-header {
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-buttons {
  display: flex;
  gap: 10px;
  align-items: center;
}

.icon-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  background: transparent;
  border: none;
  cursor: pointer;
  color: #ffffff;
}

.icon-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.log-content {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
}

.log-item {
  font-family: monospace;
  padding: 4px 0;
  /* border-bottom: 1px solid #333; */
}

button {
  padding: 5px 10px;
  background-color: #646cff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #747bff;
}
</style>