import {
        HTTP
} from '../utils/httpUtil.js'

class UserModel extends HTTP {
        getTokenByCode(userInfo) {
                return this.request({
                        url: '/wx/code',
                        data: {
                                nickname: userInfo.nickName,
                                sex: userInfo.gender,
                                userLogo: userInfo.avatarUrl,
                                code: userInfo.code,
                                city: userInfo.city,
                                province: userInfo.province,
                                country: userInfo.country
                        },
                        method: 'POST'
                });
        }
        getUserInfo() {
                return this.request({
                        url: '/user/info'
                });
        }
        getUserDetailInfo() {
                return this.request({
                        url: '/user/detail'
                });
        }
        editUserDetailInfo(sex, birthDay) {
                return this.request({
                        url: '/user/info',
                        data: {

                                sex,
                                birthday: birthDay
                        },
                        method: 'POST'
                });
        }
}

export {
        UserModel
}