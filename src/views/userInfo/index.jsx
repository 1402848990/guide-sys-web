/**
 * @description 用户资料
 */
import React from 'react'
import { Card, Avatar, Button, Input, Form, Row, Col } from 'antd'
// import { UserOutlined, EditOutlined } from '@ant-design/icons';
// import EditPassWord from './children/editPassWord';
// import axios from '@/request/axiosConfig';
// import api from '@/request/api/api_user';
// import LoginLog from './children/loginLog';
import styles from './index.less'
import moment from 'moment'

const { Item } = Form
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
}
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
}

class UserInfo extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      userInfo: {},
      changeName: '',
      nameEdit: false,
      visible: false,
    }
  }

  async componentDidMount() {
    console.log('props',this.props)
    // await this.getUserInfo();
  }

  handlePicChange = (e) => {
    e.persist()
    console.log(e)
  }

  render() {
    const {
      userName,
      phone,
      createdAt,
      updatedAt,
      version,
      id,
      remark,
    } = this.state.userInfo
    const {
      form: { getFieldDecorator },
    } = this.props
    return (
      <div className='userInfo'>
        <Form {...formItemLayout} onSubmit={this.handleSubmit}>
        <Form.Item label='用户名'>
                {getFieldDecorator('regUserName', {
                  rules: [
                    {
                      required:true,
                      whitespace: true,
                      message: '请输入用户名',
                    },
                  ],
                })(
                  <Input
                    placeholder='用户名'
                  />
                )}
              </Form.Item>
              <Form.Item label='用户名'>
                {getFieldDecorator('regUserName', {
                  rules: [
                    {
                      required:true,
                      whitespace: true,
                      message: '请输入真实姓名',
                    },
                  ],
                })(
                  <Input
                    placeholder='用户名'
                  />
                )}
              </Form.Item>
              <Form.Item label='用户名'>
                {getFieldDecorator('regPassWord', {
                  rules: [
                    {
                      required:true,
                      whitespace: true,
                      message: '请输入密码',
                    },
                  ],
                })(
                  <Input
                    type='password'
                    placeholder='密码'
                  />
                )}
              </Form.Item>
              <Form.Item label='用户名'>
                {getFieldDecorator('regEmail', {
                  rules: [
                    {
                      required:true,
                      message: '请输入邮箱',
                    },
                  ],
                })(
                  <Input
                    type='password'
                    placeholder='邮箱'
                  />
                )}
              </Form.Item>
              <Form.Item label='用户名'>
                {getFieldDecorator('regPassWord', {
                  rules: [
                    {
                      required:true,
                      whitespace: true,
                      message: '请输入密码',
                    },
                  ],
                })(
                  <Input
                    type='password'
                    placeholder='密码'
                  />
                )}
              </Form.Item>
              <Form.Item label='用户名'>
                {getFieldDecorator('regPassWord', {
                  rules: [
                    {
                      required:true,
                      whitespace: true,
                      message: '请输入年级',
                    },
                  ],
                })(
                  <Input
                    type='garde'
                    placeholder='年级'
                  />
                )}
              </Form.Item>
          <Form.Item {...tailFormItemLayout}>
            <Button type='primary' htmlType='submit'>
              修改
            </Button>
          </Form.Item>
        </Form>
      </div>
    )
  }
}

export default Form.create()(UserInfo)
