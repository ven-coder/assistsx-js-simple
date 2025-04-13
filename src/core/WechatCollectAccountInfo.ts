import { NodeClassValue, Step } from "ax-web-dev";
import { useLogStore } from "../stores/logStore";

const wechatPackageName = "com.tencent.mm"

export const launchWechat = async (step: Step): Promise<Step | undefined> => {
    step.launchApp(wechatPackageName);
    useLogStore().addTextLog('启动微信')
    return step.next(checkWechatOpen, { delay: 2000 })
}

export const checkWechatOpen = async (step: Step): Promise<Step | undefined> => {
    const node = step.findById("com.miui.securitycore:id/app1");
    if (node[0]) {
        node[0].click();
        useLogStore().addTextLog('点击微信图标')
    }
    return step.next(collectAccountInfo)
}

export const collectAccountInfo = async (step: Step): Promise<Step | undefined> => {
    const packageName = step.getPackageName();
    if (packageName !== wechatPackageName) {
        useLogStore().addTextLog('微信打开失败')
        return undefined
    }

    const nodes = step.findByTags(NodeClassValue.RelativeLayout, "", "com.tencent.mm:id/huj", "");
    if (nodes.length > 0) {
        const meNodes = step.findByTags(NodeClassValue.TextView, "我", "com.tencent.mm:id/icon_tv", "");
        if (meNodes.length > 0) {
            const node = meNodes[0].findFirstParentClickable();
            if (node) {
                node.click();
                useLogStore().addTextLog('点击"我"')
                await step.sleep(1000);

                const accountNode = step.findById("com.tencent.mm:id/gxv")[0]
                const avatarBase64 = accountNode.findById("com.tencent.mm:id/a_4")[0].takeScreenshot()
                useLogStore().addMixedLog([{ type: "text", content: "头像" }, { type: "image", content: avatarBase64 }])

                const wechatNo = accountNode.findById("com.tencent.mm:id/ouv")[0].text;
                useLogStore().addTextLog(wechatNo)

                const nickName = accountNode.findById("com.tencent.mm:id/kbb")[0].text
                useLogStore().addTextLog("昵称：" + nickName)

                await step.sleep(1000);
            }
        }
    } else {
        step.back();
        useLogStore().addTextLog('返回上一页')
    }
}