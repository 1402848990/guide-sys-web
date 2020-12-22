import * as types from "../action-types";
import Cookie from 'js-cookie'

export const getUserInfo = (token) => (dispatch) => {
  console.log(11)
  return new Promise((resolve, reject) => {

    const userInfo =  Cookie.get('userInfo')
    const user = JSON.parse(userInfo)
    user.id = user.userName
    user.name = user.reallyName
    user.role = 'admin'
    user.avatar = "https://s1.ax1x.com/2020/04/28/J5hUaT.jpg"
    console.log('user',user)
          dispatch(setUserInfo(user));
          resolve(userInfo);
  
  });
};

export const setUserToken = (token) => {
  return {
    type: types.USER_SET_USER_TOKEN,
    token,
  };
};

export const setUserInfo = (userInfo) => {
  console.log('userInfo',userInfo)
  return {
    type: types.USER_SET_USER_INFO,
    ...userInfo,
  };
};

export const resetUser = () => {
  return {
    type: types.USER_RESET_USER,
  };
};
