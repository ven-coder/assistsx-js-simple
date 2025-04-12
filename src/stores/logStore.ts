import { defineStore } from 'pinia'

export const useLogStore = defineStore('logs', {
    state: () => ({
        logs: [] as string[]
    }),
    actions: {
        addLog(message: string) {
            this.logs.push(`${new Date().toLocaleTimeString()}: ${message}`)
        },
        clearLogs() {
            this.logs = []
        }
    }
}) 