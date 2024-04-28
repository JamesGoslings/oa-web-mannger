/*
* 存待显示路由的路径的仓库
*/
import { defineStore } from "pinia";

export const usePathStore = defineStore(
  'path',
  {
    state :()=>{
      return {
        isChange: false,
        isChoose: false
      }
    }
  }
)