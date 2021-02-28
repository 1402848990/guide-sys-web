import React, { useState } from 'react'
import { Redirect } from 'react-router-dom'
import { Form, Icon, Input, Button, message, Spin, Tabs, Select } from 'antd'
import DocumentTitle from 'react-document-title'
import axios from '../../request/axiosConfig'
import api from '../../request/api/api_user'
import Cookie from 'js-cookie'
import { browserHistory } from 'react-router'
import {Department,Work} from '../../utils/enum'
import './index.less'

const { TabPane } = Tabs
// 科室选项
const DepartmentOpt = Department.map(item=><Select.Option key={item} value={item}>{item}</Select.Option>)
// 职称选项
const WorkOpt = Work.map(item=><Select.Option key={item} value={item}>{item}</Select.Option>)

const Login = (props) => {
  const { form, token, login, getUserInfo } = props
  const { getFieldDecorator } = form

  const [loading, setLoading] = useState(false)
  const [key, setKey] = useState('1')

  const handleSubmit = (event) => {
    // 阻止事件的默认行为
    event.preventDefault()

    // 对所有表单字段进行检验
    form.validateFields(async (err, values) => {
      console.log('err', err, 'values', values, key)
      // 检验成功
      if (!err) {
        if (key === '1') {
          console.log(111)
          const res = await axios({
            url: 'http://localhost:8088/interface/User/userLogin',
            method: 'post',
            data: {...values,from:'patient'},
          })
          console.log('res', res)
          const { userInfo } = res
          Cookie.set('userInfo', userInfo, {
            expires: new Date(new Date().getTime() + 1 * 60 * 60 * 1000),
          })
          message.success({content:'登录成功！'})
          setTimeout(() => {
            window.location.href = '/#userInfo'
          }, 1000);
          console.log('cookie',Cookie.get('userInfo'))
        } else {
          const res = await axios({
            url: api.registerUser,
            method: 'post',
            data: {...values,from:'pentient'},
          })
          if(res.success){
            message.success({content:'恭喜您~账户创建成功！'})
          }
          console.log('res', res)
        }
      }
    })
  }

  if (token) {
    return <Redirect to='/dashboard' />
  }
  return (
    <DocumentTitle title={'用户登录'}>
      <div className='login-container'>
        <div className='content'>
          <Spin spinning={loading} tip='登录中...'>
            <Tabs
              activeKey={key}
              defaultActiveKey='1'
              onChange={(e) => setKey(e)}
            >
              <TabPane tab='用户登录' key='1'>
                <Form onSubmit={handleSubmit}>
                  <Form.Item>
                    {getFieldDecorator('phone', {
                      rules: [
                        {
                          required: true,
                          whitespace: true,
                          message: '请输入手机号',
                        },
                      ],
                      initialValue: '16666666666', // 初始值
                    })(
                      <Input
                        prefix={
                          <Icon
                            type='user'
                            style={{ color: 'rgba(0,0,0,.25)' }}
                          />
                        }
                        placeholder='手机号'
                      />
                    )}
                  </Form.Item>
                  <Form.Item>
                    {getFieldDecorator('passWord', {
                      rules: [
                        {
                          required: true,
                          whitespace: true,
                          message: '请输入密码',
                        },
                      ],
                      initialValue: '123456', // 初始值
                    })(
                      <Input
                        prefix={
                          <Icon
                            type='lock'
                            style={{ color: 'rgba(0,0,0,.25)' }}
                          />
                        }
                        type='password'
                        placeholder='密码'
                      />
                    )}
                  </Form.Item>
                  <Form.Item>
                    <Button
                      type='primary'
                      onClick={handleSubmit}
                      className='login-form-button'
                    >
                      登录
                    </Button>
                  </Form.Item>
                </Form>
              </TabPane>
              {/* 注册模块 */}
              <TabPane tab='用户注册' key='2'>
                <Form onSubmit={handleSubmit}>
                  <Form.Item>
                    {getFieldDecorator('userName', {
                      rules: [
                        {
                          required: key === '2',
                          whitespace: true,
                          message: '请输入真实姓名',
                        },
                      ],
                    })(
                      <Input
                        prefix={
                          <Icon
                            type='user'
                            style={{ color: 'rgba(0,0,0,.25)' }}
                          />
                        }
                        placeholder='真实姓名'
                      />
                    )}
                  </Form.Item>
                  <Form.Item>
                    {getFieldDecorator('phone', {
                      rules: [
                        {
                          required: key === '2',
                          message: '请输入手机号',
                        },
                      ],
                    })(
                      <Input
                        prefix={
                          <Icon
                            type='lock'
                            style={{ color: 'rgba(0,0,0,.25)' }}
                          />
                        }
                        type='phone'
                        placeholder='手机号'
                      />
                    )}
                  </Form.Item>
                  <Form.Item>
                    {getFieldDecorator('passWord', {
                      rules: [
                        {
                          required: key === '2',
                          whitespace: true,
                          message: '请输入密码',
                        },
                      ],
                    })(
                      <Input
                        prefix={
                          <Icon
                            type='lock'
                            style={{ color: 'rgba(0,0,0,.25)' }}
                          />
                        }
                        type='password'
                        placeholder='密码'
                      />
                    )}
                  </Form.Item>
                  <Form.Item>
                    {getFieldDecorator('address', {
                      rules: [
                        {
                          required: key === '2',
                          message: '请输入地址',
                        },
                      ],
                    })(
                      <Input
                        prefix={
                          <Icon
                            type='lock'
                            style={{ color: 'rgba(0,0,0,.25)' }}
                          />
                        }
                        placeholder='地址'
                      />
                    )}
                  </Form.Item>
                  <Form.Item>
                    {getFieldDecorator('age', {
                      rules: [
                        {
                          required: key === '2',
                          message: '请输入年龄',
                        },
                      ],
                    })(
                      <Input
                        prefix={
                          <Icon
                            type='lock'
                            style={{ color: 'rgba(0,0,0,.25)' }}
                          />
                        }
                        placeholder='年龄'
                      />
                    )}
                  </Form.Item>
                  <Form.Item>
                    {getFieldDecorator('sex', {
                      rules: [
                        {
                          required: key === '2',
                          message: '请选择性别',
                        },
                      ],
                    })(
                      <Select placeholder='性别'>
                       <Select.Option value='1'>男</Select.Option>
                       <Select.Option value='2'>女</Select.Option>
                      </Select>
                    )}
                  </Form.Item>
                  <Form.Item>
                    {getFieldDecorator('work', {
                      rules: [
                        {
                          required: key === '2',
                          whitespace: true,
                          message: '请选择职业',
                        },
                      ],
                    })(
                      <Select 
                      placeholder='职业'>
                        {
                          WorkOpt
                        }
                      </Select>
                    )}
                  </Form.Item>
                  <Form.Item>
                    <Button
                      type='primary'
                      htmlType='submit'
                      className='login-form-button'
                    >
                      注册
                    </Button>
                  </Form.Item>
                </Form>
              </TabPane>
            </Tabs>
          </Spin>
        </div>
      </div>
    </DocumentTitle>
  )
}

const WrapLogin = Form.create()(Login)

export default WrapLogin
