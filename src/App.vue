<script setup lang="ts">
import { AssistsX, NodeClassValue, sleep, Step } from 'ax-web-dev'
import { ref, watch } from 'vue'
import LogPage from './pages/LogPage.vue'
import { useRouter } from 'vue-router'
import { useNavigationStore } from './stores/navigationStore'

const targetPackageName = "com.tencent.mm"
const showLogs = ref(false)
const logRef = ref()
const router = useRouter()
const navigationStore = useNavigationStore()

const launchWechat = async (step: Step): Promise<Step | undefined> => {
  // 启动微信
  step.launchApp(targetPackageName);
  logRef.value?.addLog('启动微信')
  return step.next(checkWechatOpen, { delay: 2000 })
}

const checkWechatOpen = async (step: Step): Promise<Step | undefined> => {
  const node = step.findById("com.miui.securitycore:id/app1");
  if (node[0]) {
    node[0].click();
    logRef.value?.addLog('点击微信图标')
  }
  return step.next(collectAccountInfo)
}

const collectAccountInfo = async (step: Step): Promise<Step | undefined> => {
  // 检查微信状态
  const packageName = step.getPackageName();
  if (packageName !== targetPackageName) {
    AssistsX.overlayToast("微信打开失败");
    logRef.value?.addLog('微信打开失败')
    return undefined
  }

  const nodes = step.findByTags(NodeClassValue.RelativeLayout, "", "com.tencent.mm:id/huj", "");
  if (nodes.length > 0) {
    const meNodes = step.findByTags(NodeClassValue.TextView, "我", "com.tencent.mm:id/icon_tv", "");
    if (meNodes.length > 0) {
      const node = meNodes[0].findFirstParentClickable();
      if (node) {
        node.click();
        logRef.value?.addLog('点击"我"')
        await step.sleep(1000);

        // 获取账号信息
        const infoNodes = step.findById("com.tencent.mm:id/ouv");
        if (infoNodes.length > 0) {
          AssistsX.overlayToast(infoNodes[0].text);
          logRef.value?.addLog('获取到账号信息：' + infoNodes[0].text)
          await step.sleep(2000);
        }
      }
    }
  } else {
    step.back();
    logRef.value?.addLog('返回上一页')
  }
}

const startCollectAccountInfo = async () => {
  Step.run(launchWechat).then(() => {
    AssistsX.overlayToast('执行结束')
    logRef.value?.addLog('执行结束')
  }).catch((error) => {
    console.error(error)
    AssistsX.overlayToast('执行失败：' + error)
    logRef.value?.addLog('执行失败：' + error)
  })
}

const stopCollectAccountInfo = async () => {
  Step.stop()
  AssistsX.overlayToast('停止执行')
  logRef.value?.addLog('停止执行')
}

const openLogs = () => {
  showLogs.value = true
  logRef.value?.clearLogs()
}

const closeLogs = () => {
  showLogs.value = false
}

watch(() => navigationStore.targetRoute, (newRoute) => {
  if (newRoute) {
    router.push(newRoute)
    navigationStore.setTargetRoute('')
  }
})
</script>

<template>
  <router-view />
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body,
#app {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}
</style>
