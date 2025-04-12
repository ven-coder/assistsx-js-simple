<script setup lang="ts">
import { AssistsX, NodeClassValue, sleep, Step } from 'ax-web-dev'
import { CancelableTask, mainCollectAccountInfo } from './CollectWechatAccountInfo'

const targetPackageName = "com.tencent.mm"

let task: CancelableTask | null = null

const launchWechat = async (step: Step): Promise<Step | undefined> => {
  // 启动微信
  step.launchApp(targetPackageName);

  return step.next({ impl: checkWechatOpen, delay: 2000 })
}

const checkWechatOpen = async (step: Step): Promise<Step | undefined> => {
  const node = step.findById("com.miui.securitycore:id/app1");
  if (node[0]) {
    node[0].click();
  }
  return step.next({ impl: collectAccountInfo })
}

const collectAccountInfo = async (step: Step): Promise<Step | undefined> => {
  // 检查微信状态
  const packageName = step.getPackageName();
  if (packageName !== targetPackageName) {
    AssistsX.overlayToast("微信打开失败");
    return undefined
  }
  const nodes = step.findByTags(NodeClassValue.RelativeLayout, "", "com.tencent.mm:id/huj", "");
  if (nodes.length > 0) {
    const meNodes = step.findByTags(NodeClassValue.TextView, "我", "com.tencent.mm:id/icon_tv", "");
    if (meNodes.length > 0) {
      const node = meNodes[0].findFirstParentClickable();
      if (node) {
        node.click();
        await step.sleep(1000);

        // 获取账号信息
        const infoNodes = step.findById("com.tencent.mm:id/ouv");
        if (infoNodes.length > 0) {
          AssistsX.overlayToast(infoNodes[0].text);
          await step.sleep(2000);
        }
      }
    }
  } else {
    step.back();
  }
}

const startCollectAccountInfo = async () => {
  Step.run(launchWechat).then(() => {
    AssistsX.overlayToast('执行结束')
  }).catch((error) => {
    console.error(error)
    AssistsX.overlayToast('执行失败：' + error)
  })
}

const stopCollectAccountInfo = async () => {
  Step.stop()
  AssistsX.overlayToast('停止执行')
}

</script>

<template>
  <div class="container">
    <button type="button" @click="startCollectAccountInfo">抓取微信1账号信息</button>
    <button type="button" @click="stopCollectAccountInfo">停止执行</button>
  </div>
</template>

<style>
body {
  margin: 0;
  padding: 0;
}

.container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding: 0px;
  align-items: flex-start;
}

button {
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 4px;
  border: none;
  background-color: #646cff;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s;
  white-space: nowrap;
}

button:hover {
  background-color: #747bff;
}
</style>
