import { NodeClassValue, Step } from "ax-web-dev";
import { useLogStore } from "../stores/logStore";

const wechatPackageName = "com.tencent.mm"

export const launchWechat = async (step: Step): Promise<Step | undefined> => {
    useLogStore().addTextLog('开始执行')
    await step.delay(1000)
    step.launchApp(wechatPackageName);
    useLogStore().addTextLog('启动微信')
    return step.next(checkDoubleWechatOpen, { delayMs: 2000 })
}

export const checkDoubleWechatOpen = async (step: Step): Promise<Step | undefined> => {
    const node = step.findById("com.miui.securitycore:id/app1");
    if (node[0]) {
        node[0].click();
        useLogStore().addTextLog('微信双开，选择微信1')
        return step.next(switchMe, { delayMs: 2000 })
    }
    return step.next(switchMe, { delayMs: 1000 })
}

const switchMe = async (step: Step): Promise<Step | undefined> => {
    const packageName = step.getPackageName();
    if (packageName !== wechatPackageName) {
        useLogStore().addTextLog('微信打开失败')
        return undefined
    }

    const bottomBarNode = step.findByTags(NodeClassValue.RelativeLayout, { filterViewId: "com.tencent.mm:id/huj" })[0];
    if (!bottomBarNode) {

        useLogStore().addTextLog('微信底部栏未找到，尝试返回重试')

        step.back();

        return step.repeat()
    }

    const meNode = bottomBarNode.findByTags(NodeClassValue.TextView, { filterText: "我", filterViewId: "com.tencent.mm:id/icon_tv", })[0];
    const result = meNode.findFirstParentClickable().click();
    if (result) {
        useLogStore().addTextLog('点击"我"')
    } else {
        useLogStore().addTextLog('点击"我"失败')
    }
    return step.next(collectAccountInfo)
}

export const collectAccountInfo = async (step: Step): Promise<Step | undefined> => {

    const accountNode = step.findById("com.tencent.mm:id/gxv")[0]


    const nickName = accountNode.findById("com.tencent.mm:id/kbb")[0].text
    useLogStore().addTextLog("昵称：" + nickName)

    const wechatNo = accountNode.findById("com.tencent.mm:id/ouv")[0].text;
    useLogStore().addTextLog(wechatNo)

    const avatarBase64 = accountNode.findById("com.tencent.mm:id/a_4")[0].takeScreenshot()
    useLogStore().addMixedLog([{ type: "text", content: "头像" }, { type: "image", content: avatarBase64 }])

    return undefined
}