import { NodeClassValue, Step } from "ax-web-dev";
import { useLogStore } from "../stores/logStore";
import { setWechatEnterNext, launchWechat, wechatPackageName } from "./WechatEnter";

export const start = () => {
    useLogStore().clearLogs()
    setWechatEnterNext(async (step: Step) => {
        return step.next(switchDiscover)
    })
    Step.run(launchWechat, { delayMs: 1000 }).then(() => {
        useLogStore().addTextLog('执行结束')
    }).catch((error) => {
        useLogStore().addTextLog('执行失败：' + error)
    })
}

const switchDiscover = async (step: Step): Promise<Step | undefined> => {
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

    const meNode = bottomBarNode.findByTags(NodeClassValue.TextView, { filterText: "发现", filterViewId: "com.tencent.mm:id/icon_tv", })[0];
    const result = meNode.findFirstParentClickable().click();
    if (result) {
        useLogStore().addTextLog('点击"发现"')
    } else {
        useLogStore().addTextLog('点击"发现"失败')
    }
    return step.next(collectMoment)
}

export const collectMoment = async (step: Step): Promise<Step | undefined> => {
    const accountNode = step.findById("com.tencent.mm:id/gxv")[0]

    const nickName = accountNode.findById("com.tencent.mm:id/kbb")[0].text
    useLogStore().addTextLog("昵称：" + nickName)

    const wechatNo = accountNode.findById("com.tencent.mm:id/ouv")[0].text;
    useLogStore().addTextLog(wechatNo)

    const avatarBase64 = accountNode.findById("com.tencent.mm:id/a_4")[0].takeScreenshot()
    useLogStore().addMixedLog([{ type: "text", content: "头像" }, { type: "image", content: avatarBase64 }])

    return undefined
}