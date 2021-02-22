/**
 * @description 用户资料
 */
import React from 'react'
import { Card, Avatar, Button, Input, Form, Row, Col,message } from 'antd'
import axios from '../../request/axiosConfig'
import api from '../../request/api/api_user'
import styles from './index.less'
import moment from 'moment'

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
      span: 8,
      offset: 7,
    },
  },
}

class UserInfo extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      userInfo: {},
    }
  }

  async componentDidMount() {
    console.log('props', this.props)
    await this.getUserInfo()
  }

  // 获取用户信息
  getUserInfo = async () => {
    const res = await axios({
      url: 'http://localhost:8088/interface/User/getUserInfo',
      method: 'post',
    })
    this.setState({
      userInfo: res.info,
    })
    console.log('res', res)
  }

  handlePicChange = (e) => {
    e.persist()
    console.log(e)
  }

  handleSubmit = () => {
    const { validateFields } = this.props.form
    validateFields(async (err, values) => {
      delete values.createdAt
      delete values.updatedAt
      delete values.id
      delete values.sex
      if (!err) {
        const res = await axios({
          url: 'http://localhost:8088/interface/User/editUserInfo',
          method: 'post',
          data: { changeData: values },
        })
        if(res.success){
          message.success({content:'信息修改成功！'})
          // 获取最新用户信息
          this.getUserInfo()
        }
      }
    })
  }

  render() {
    const {
      userName,
      reallyName,
      email,
      garde,
      phone,
      passWord,
      createdAt,
      updatedAt,
      sex,
      id,
      age,
    } = this.state.userInfo
    const {
      form: { getFieldDecorator },
    } = this.props
    return (
      <div className='userInfo'>
        <Form {...formItemLayout} onSubmit={this.handleSubmit}>
          <Form.Item label='ID'>
            {getFieldDecorator('id', {
              initialValue: id,
            })(<Input disabled placeholder='用户名' />)}
          </Form.Item>
          <Form.Item label='性别'>
            {getFieldDecorator('sex', {
              initialValue: +sex === 1 ? '男' : '女',
            })(<Input disabled placeholder='性别' />)}
          </Form.Item>
          <Form.Item label='年龄'>
            {getFieldDecorator('age', {
              initialValue: age,
              rules: [
                {
                  required: true,
                  message: '请输入年龄',
                },
              ],
            })(<Input placeholder='年龄' />)}
          </Form.Item>
          <Form.Item label='用户名'>
            {getFieldDecorator('userName', {
              initialValue: userName,
              rules: [
                {
                  required: true,
                  whitespace: true,
                  message: '请输入用户名',
                },
              ],
            })(<Input placeholder='用户名' />)}
          </Form.Item>
          <Form.Item label='真实姓名'>
            {getFieldDecorator('reallyName', {
              initialValue: reallyName,
              rules: [
                {
                  required: true,
                  whitespace: true,
                  message: '请输入真实姓名',
                },
              ],
            })(<Input placeholder='真实姓名' />)}
          </Form.Item>
          <Form.Item label='密码'>
            {getFieldDecorator('passWord', {
              initialValue: passWord,
              rules: [
                {
                  required: true,
                  whitespace: true,
                  message: '请输入密码',
                },
              ],
            })(<Input type='password' placeholder='密码' />)}
          </Form.Item>
          <Form.Item label='邮箱'>
            {getFieldDecorator('email', {
              initialValue: email,
              rules: [
                {
                  required: true,
                  message: '请输入邮箱',
                },
              ],
            })(<Input type='eamil' placeholder='邮箱' />)}
          </Form.Item>
          <Form.Item label='年级'>
            {getFieldDecorator('garde', {
              initialValue: garde,
              rules: [
                {
                  required: true,
                  whitespace: true,
                  message: '请输入年级',
                },
              ],
            })(<Input placeholder='年级' />)}
          </Form.Item>
          <Form.Item label='手机号'>
            {getFieldDecorator('phone', {
              initialValue: phone,
              rules: [
                {
                  required: true,
                  message: '请输入手机号',
                },
              ],
            })(<Input type='phone' placeholder='手机号' />)}
          </Form.Item>
          <Form.Item label='注册时间'>
            {getFieldDecorator('createdAt', {
              initialValue: moment(createdAt).format('YYYY-MM-DD HH:mm:ss'),
            })(<Input disabled />)}
          </Form.Item>
          <Form.Item label='更新时间'>
            {getFieldDecorator('updatedAt', {
              initialValue: moment(updatedAt).format('YYYY-MM-DD HH:mm:ss'),
            })(<Input disabled />)}
          </Form.Item>
          <Form.Item {...tailFormItemLayout}>
            <Button style={{ width: '100%' }} type='primary' htmlType='submit'>
              修改
            </Button>
          </Form.Item>
        </Form>
      </div>
    )
  }
}

export default Form.create()(UserInfo)
