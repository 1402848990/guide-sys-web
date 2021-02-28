/**
 * @description 用户资料
 */
import React from 'react'
import {
  Card,
  Avatar,
  Button,
  Input,
  Form,
  Row,
  Col,
  message,
  Select,
} from 'antd'
import axios from '../../request/axiosConfig'
import api from '../../request/api/api_user'
import styles from './index.less'
import moment from 'moment'
import { Department, Work } from '../../utils/enum'

// 科室选项
const DepartmentOpt = Department.map((item) => (
  <Select.Option key={item} value={item}>
    {item}
  </Select.Option>
))
// 职称选项
const WorkOpt = Work.map((item) => (
  <Select.Option key={item} value={item}>
    {item}
  </Select.Option>
))

const formItemLayout = {
  labelCol: {
    xs: { span: 20 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 20 },
    sm: { span: 6 },
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
      offset: 3,
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
      data:{from:'pentient'}
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
          data: { changeData: values,from:'pentient' },
        })
        if (res.success) {
          message.success({ content: '信息修改成功！' })
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
      address,
      department,
      work,
    } = this.state.userInfo
    const {
      form: { getFieldDecorator },
    } = this.props
    return (
      <div className='userInfo'>
        <Form {...formItemLayout} onSubmit={this.handleSubmit}>
          <Card title='个人信息' bordered={false} style={{}}>
          <Form.Item label='姓名'>
              {getFieldDecorator('userName', {
                initialValue: userName,
                rules: [
                  {
                    required: true,
                    whitespace: true,
                    message: '请输入姓名',
                  },
                ],
              })(<Input placeholder='姓名' />)}
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
            <Form.Item label='住址'>
              {getFieldDecorator('address', {
                initialValue: address,
                rules: [
                  {
                    required: true,
                    whitespace: true,
                    message: '请输入住址',
                  },
                ],
              })(<Input placeholder='住址' />)}
            </Form.Item>
          </Card>
          <Card title='职业信息' bordered={false} style={{}}>
            <Form.Item label='职业'>
              {getFieldDecorator('work', {
                initialValue: work,
                rules: [
                  {
                    required: true,
                    whitespace: true,
                    message: '请输入职业',
                  },
                ],
              })(<Select placeholder='职业'>{WorkOpt}</Select>)}
            </Form.Item>
          </Card>
          <Card title='账号信息' bordered={false} style={{}}>
            <Form.Item label='ID'>
              {getFieldDecorator('id', {
                initialValue: id,
              })(<Input disabled />)}
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
          </Card>

          <Form.Item {...tailFormItemLayout}>
            <Button style={{ width: '100%',height:'40px' }} type='primary' htmlType='submit'>
              修改
            </Button>
          </Form.Item>
        </Form>
      </div>
    )
  }
}

export default Form.create()(UserInfo)
