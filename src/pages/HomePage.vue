<script setup lang="ts">
import { AssistsX, NodeClassValue, sleep, Step } from 'ax-web-dev'
import { useRouter } from 'vue-router'
import { useLogStore } from '../stores/logStore'

const router = useRouter()
const logStore = useLogStore()
const targetPackageName = "com.tencent.mm"

const launchWechat = async (step: Step): Promise<Step | undefined> => {
  step.launchApp(targetPackageName);
  logStore.addLog('启动微信')
  return step.next(checkWechatOpen, { delay: 2000 })
}

const checkWechatOpen = async (step: Step): Promise<Step | undefined> => {
  const node = step.findById("com.miui.securitycore:id/app1");
  if (node[0]) {
    node[0].click();
    logStore.addLog('点击微信图标')
  }
  return step.next(collectAccountInfo)
}

const collectAccountInfo = async (step: Step): Promise<Step | undefined> => {
  const packageName = step.getPackageName();
  if (packageName !== targetPackageName) {
    logStore.addLog('微信打开失败')
    return undefined
  }

  const nodes = step.findByTags(NodeClassValue.RelativeLayout, "", "com.tencent.mm:id/huj", "");
  if (nodes.length > 0) {
    const meNodes = step.findByTags(NodeClassValue.TextView, "我", "com.tencent.mm:id/icon_tv", "");
    if (meNodes.length > 0) {
      const node = meNodes[0].findFirstParentClickable();
      if (node) {
        node.click();
        logStore.addLog('点击"我"')
        await step.sleep(1000);

        const infoNodes = step.findById("com.tencent.mm:id/ouv");
        if (infoNodes.length > 0) {
          logStore.addLog('获取到账号信息：' + infoNodes[0].text)
          await step.sleep(2000);
        }
      }
    }
  } else {
    step.back();
    logStore.addLog('返回上一页')
  }
}

const startCollectAccountInfo = async () => {
  logStore.clearLogs()
  Step.run(launchWechat).then(() => {
    logStore.addLog('执行结束')
  }).catch((error) => {
    logStore.addLog('执行异常：' + error)
  })
  goToLogs()
}

const stopCollectAccountInfo = async () => {
  Step.stop()
  logStore.addLog('停止执行')
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