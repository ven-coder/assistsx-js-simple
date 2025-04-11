<script setup lang="ts">
import { AssistsX, NodeClassValue, sleep, Step, StepManager } from 'ax-web-dev'
import { CancelableTask, mainCollectAccountInfo } from './CollectWechatAccountInfo'

const targetPackageName = "com.tencent.mm"

let task: CancelableTask | null = null
const collectAccountInfo = async () => {


  const steps = new Map([
    ["1", async (step: Step) => {
      // 启动微信
      AssistsX.launchApp(targetPackageName);
      return step.next("2")
    }],
    ["2", async (step: Step) => {
      // 检查微信是否打开
      for (let i = 0; i < 5; i++) {
        const packageName = AssistsX.getPackageName();
        if (packageName === targetPackageName) {
          break;
        }

        const node = AssistsX.findById("com.miui.securitycore:id/app1");
        if (node[0]) {
          node[0].click();
          break;
        }

        await step.sleep(1000)
      }
      return step.next("3")
    }],
    ["3", async (step: Step) => {
      // 检查微信状态
      const packageName = AssistsX.getPackageName();
      if (packageName !== targetPackageName) {
        AssistsX.overlayToast("微信打开失败");
        return step.next("3")
      }
      return step.next("4")
    }],
    ["4", async (step: Step) => {
      const nodes = AssistsX.findByTags(NodeClassValue.RelativeLayout, "", "com.tencent.mm:id/huj", "");
      if (nodes.length > 0) {
        const meNodes = AssistsX.findByTags(NodeClassValue.TextView, "我", "com.tencent.mm:id/icon_tv", "");
        if (meNodes.length > 0) {
          const node = meNodes[0].findFirstParentClickable();
          if (node) {
            node.click();
            await step.sleep(1000);

            // 获取账号信息
            const infoNodes = AssistsX.findById("com.tencent.mm:id/ouv");
            if (infoNodes.length > 0) {
              AssistsX.overlayToast(infoNodes[0].text);
            }
          }
        }
      } else {
        AssistsX.back();
      }
      return step.next("5")
    }],
  ])
  StepManager.register(steps)

  try {
    await StepManager.run("1")
  } catch (error) {
    console.error(error)
  }

  AssistsX.overlayToast('开始执行')
}

const stopCollectAccountInfo = async () => {
  AssistsX.overlayToast('停止执行')
}

</script>

<template>
  <div class="container">
    <button type="button" @click="collectAccountInfo">抓取微信1账号信息</button>
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
