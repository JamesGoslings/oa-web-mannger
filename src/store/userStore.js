/*
  存储用户信息的pinia 
*/
import { defineStore } from "pinia";
import { getToken } from "@/utils/auth";

export const useUserStore = defineStore(
  'user',
  {
    state :()=>{
      return {
        token: getToken(),
        name: '',
        avatar: '',
        id: 0,
    
        // 权限信息
        buttons: [],
        menus: []
      }
    }
  }
)
