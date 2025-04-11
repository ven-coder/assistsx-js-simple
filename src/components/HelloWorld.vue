<script setup lang="ts">
import { AssistsX, NodeClassValue } from 'ax-web-dev';
import { ref, onMounted } from 'vue'

// 定义props的类型接口
interface Props {
  msg: string
}

// 使用类型声明定义props
defineProps<Props>()

onMounted(() => {

})

const handleClick = () => {
  getAllNodes()
}

const getAllNodes = async () => {
  const res = await AssistsX.getAllNodes()
  res.forEach(async node => {
    if (node.className === NodeClassValue.EditText) {
      console.log("设置文本")
      const result = await node.setNodeText("web端设置的文本")
      console.log("设置文本结果：" + result)
    }
    console.log(node.text)
  })
}
</script>

<template>
  <div class="container">
    <button type="button" @click="handleClick">获取所有节点</button>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
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
}

button:hover {
  background-color: #747bff;
}
</style>
