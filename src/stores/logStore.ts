import { defineStore } from 'pinia'

// 定义日志项的类型
export interface LogContent {
    type: 'text' | 'image';
    content: string;
}

export interface LogItem {
    time: string;
    contents: LogContent[];
}

export const useLogStore = defineStore('logs', {
    state: () => ({
        logs: [] as LogItem[]
    }),
    actions: {
        addTextLog(message: string) {
            this.logs.unshift({
                time: new Date().toLocaleTimeString(),
                contents: [{
                    type: 'text',
                    content: message
                }]
            })
        },
        addImageLog(base64: string) {
            this.logs.unshift({
                time: new Date().toLocaleTimeString(),
                contents: [{
                    type: 'image',
                    content: base64
                }]
            })
        },
        addMixedLog(contents: LogContent[]) {
            this.logs.unshift({
                time: new Date().toLocaleTimeString(),
                contents
            })
        },
        clearLogs() {
            this.logs = []
        }
    }
}) 