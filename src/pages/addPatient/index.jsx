/* eslint-disable no-unused-expressions */
/**
 * @description 学生信息
 */
import React, { useState, useEffect } from 'react'
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
  DatePicker,
  Modal,
  Divider,
} from 'antd'
import axios from '../../request/axiosConfig'
import styles from './index.less'
import moment from 'moment'
import BaseForm from '../../components/BaseForm'
import { DATE } from '../../utils/index'
import ExportExcel from '../../components/ExportExcel'
import { Line } from '@ant-design/charts'
import TextArea from 'antd/lib/input/TextArea'
import { useRouteMatch } from 'react-router-dom/cjs/react-router-dom.min'

const hash = window.location.hash
const ID = +hash.split('=')[1]
const detail = hash.includes('id') && !hash.includes('edit')

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
}
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 4,
      // offset: 7,
    },
  },
}

const add = !window.location.hash.includes('id')

class UserInfo extends React.Component {
  constructor(props) {
    super(props)
    this.baseFormRef = React.createRef()
    this.state = {
      userInfo: {},
      courseList: [],
      examRes: false,
      columns: [],
      examContent: [],
    }
  }

  async componentDidMount() {
    console.log('props', this.props)
    !add ? await this.getUserInfo() : null
    !add ? await this.getCourseList() : null
  }

  getUserInfo = async () => {
    if (ID) {
      const res = await axios({
        url: 'http://localhost:8088/interface/Patient/detail',
        method: 'post',
        data: { id: ID },
      })
      this.setState({
        userInfo: res.data,
      })
      console.log('res', res)
    }
  }

  getCourseList = async () => {
    const { data } = await axios.post(
      `http://localhost:8088/interface/Patient/seeDoctorList`,
      {
        filter: { patientId: ID },
      }
    )
    const { data: list } = await axios.post(
      `http://localhost:8088/interface/Drugs/drugsList`
    )
    const dList = list.map((item) => (
      <Select.Option disabled={item.num <= 0} value={item.name} key={item.name}>
        {item.name}_{item.factory}_{item.num}
      </Select.Option>
    ))
    const columns = [
      {
        label: '病情概况',
        field: 'content',
        name: '病情概况',
        required: true,
      },
      {
        label: '治疗方式',
        field: 'methods',
        name: '治疗方式',
        required: true,
      },
      {
        label: '所用药品',
        field: 'drugs',
        name: '药品',
        required: true,
        type: 'select',
        render: dList,
        mode: 'multiple',
      },
      {
        label: '备注',
        field: 'remark',
        name: '备注',
        required: true,
      },
    ]

    this.setState({
      columns,
      seeList: data,
    })
  }

  columns = () => [
    {
      title: '就诊时间',
      dataIndex: 'createdAt',
      sorter: (a, b) => +a.createdAt - +b.createdAt,
      width: 220,
      render: (value) => moment(+value).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '病情概况',
      dataIndex: 'content',
      width: 240,
    },
    {
      title: '治疗方式',
      dataIndex: 'methods',
      width: 240,
    },
    {
      title: '用药列表',
      dataIndex: 'drugs',
      // width: 240,
    },
    {
      title: '备注',
      dataIndex: 'remark',
      width: 180,
    },
  ]

  handlePicChange = (e) => {
    e.persist()
    console.log(e)
  }

  // 提交
  handleSubmit = () => {
    const { validateFields } = this.props.form
    const edit = hash.includes('edit')
    validateFields(async (err, values) => {
      console.log('values', values)
      if (!err) {
        const res = await axios({
          url: `http://localhost:8088/interface/Patient/${
            edit ? 'update' : 'add'
          }`,
          method: 'post',
          data: !edit ? values : { ...values, id: ID },
        })
        if (res.success) {
          message.success({ content: '操作成功！' })
          // 获取最新用户信息
          this.getUserInfo()
        }
      }
    })
  }

  addSeeList = () => {
    const { validateFields, resetFields } = this.baseFormRef.current
    const { userInfo } = this.state
    validateFields(async (err, values) => {
      console.log('values', values)
      if (!err) {
        const res = await axios({
          url: `http://localhost:8088/interface/Patient/addSeeList`,
          method: 'post',
          data: {
            ...values,
            patientId: ID,
          },
        })
        if (res.success) {
          message.success({ content: '就诊记录添加成功！' })
          this.setState({
            examRes: false,
          })
          resetFields()
          this.getCourseList()
          // 获取最新用户信息
          // this.getUserInfo()
        }
      }
    })
  }

  render() {
    const {
      phone,
      createdAt,
      updatedAt,
      sex,
      address,
      allergicHistory,
      remark,
      content,
      age,
      patientName,
      userId,
      patientId,
    } = this.state.userInfo || {}
    const { courseNameList, seeList = [] } = this.state
    const tHeader = ['病情概况', '治疗方式', '用药列表', '备注'].concat(
      courseNameList
    )
    const filterVal = ['content', 'methods', 'drugs', 'remark'].concat(
      courseNameList
    )
    const {
      form: { getFieldDecorator, getFieldValue },
    } = this.props
    const charData = []
    console.log('charData', charData, 'courseNameList', courseNameList)
    const config = {
      data: charData.reverse(),
      xField: 'date',
      yField: 'value',
      seriesField: 'name',
      yAxis: {
        label: {
          formatter: function formatter(v) {
            return `${v}分`
          },
        },
      },
      legend: { position: 'top' },
      smooth: true,
      animation: {
        appear: {
          animation: 'path-in',
          duration: 5000,
        },
      },
    }
    return (
      <div className='student'>
        <Card title='患者档案'>
          <Avatar
            style={{ backgroundColor: '#87d068' }}
            shape='square'
            size={240}
          >
            {getFieldValue('patientName') || '姓名'}
          </Avatar>
          <Form
            className='form'
            {...formItemLayout}
            // onSubmit={this.handleSubmit}
          >
            <Row>
              <Col span={11}>
                <Form.Item label='患者ID'>
                  {getFieldDecorator('patientId', {
                    initialValue: patientId || 101,
                    rules: [
                      {
                        required: true,
                        message: '请输入患者ID',
                      },
                    ],
                  })(
                    <Input
                      className={detail ? 'hideField' : ''}
                      placeholder='患者ID'
                    />
                  )}
                  {detail && <span className='stuValue'>{patientId}</span>}
                </Form.Item>
              </Col>
              <Col span={11}>
                <Form.Item label='姓名'>
                  {getFieldDecorator('patientName', {
                    initialValue: patientName || '张三',
                    rules: [
                      {
                        required: true,
                        message: '请输入姓名',
                      },
                    ],
                  })(
                    <Input
                      className={detail ? 'hideField' : ''}
                      placeholder='姓名'
                    />
                  )}
                  {detail && <span className='stuValue'>{patientName}</span>}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={11}>
                {' '}
                <Form.Item label='性别'>
                  {getFieldDecorator('sex', {
                    rules: [
                      {
                        required: true,
                        message: '请选择性别',
                      },
                    ],
                    initialValue: sex || '男',
                  })(
                    <Select
                      className={detail ? 'hideField' : ''}
                      placeholder='性别'
                    >
                      <Select.Option value='男'>男</Select.Option>
                      <Select.Option value='女'>女</Select.Option>
                    </Select>
                  )}{' '}
                  {detail && <span className='stuValue'>{sex}</span>}
                </Form.Item>
              </Col>
              <Col span={11}>
                <Form.Item label='住址'>
                  {getFieldDecorator('address', {
                    initialValue: address,
                    rules: [
                      {
                        required: true,
                        message: '请输入住址',
                      },
                    ],
                  })(
                    <Input
                      className={detail ? 'hideField' : ''}
                      placeholder='住址'
                    />
                  )}{' '}
                  {detail && <span className='stuValue'>{address || '-'}</span>}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={11}>
                <Form.Item label='年龄'>
                  {getFieldDecorator('age', {
                    initialValue: age,
                    rules: [
                      {
                        required: true,
                        message: '请输入年龄',
                      },
                    ],
                  })(
                    <Input
                      className={detail ? 'hideField' : ''}
                      placeholder='年龄'
                    />
                  )}{' '}
                  {detail && <span className='stuValue'>{age || '-'}</span>}
                </Form.Item>
              </Col>
              <Col span={11}>
                <Form.Item label='手机号'>
                  {getFieldDecorator('phone', {
                    initialValue: phone,
                    rules: [
                      {
                        required: true,
                        message: '请输入手机号',
                      },
                    ],
                  })(
                    <Input
                      className={detail ? 'hideField' : ''}
                      placeholder='手机号'
                    />
                  )}{' '}
                  {detail && <span className='stuValue'>{phone || '-'}</span>}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={11}>
                {' '}
                <Form.Item label='病情概述'>
                  {getFieldDecorator('content', {
                    initialValue: content,
                  })(
                    <Input
                      className={detail ? 'hideField' : ''}
                      placeholder='病情概述'
                    />
                  )}{' '}
                  {detail && <span className='stuValue'>{content || '-'}</span>}
                </Form.Item>
              </Col>
              <Col span={11}>
                <Form.Item label='过敏史'>
                  {getFieldDecorator('allergicHistory', {
                    initialValue: allergicHistory,
                  })(
                    <Input
                      className={detail ? 'hideField' : ''}
                      placeholder='过敏史'
                    />
                  )}{' '}
                  {detail && (
                    <span className='stuValue'>{allergicHistory || '-'}</span>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={11}>
                <Form.Item label='备注'>
                  {getFieldDecorator('remark', {
                    initialValue: remark,
                  })(
                    <TextArea
                      autoSize={{ minRows: 6 }}
                      className={detail ? 'hideField' : ''}
                      placeholder='备注'
                    />
                  )}{' '}
                  {detail && <span className='stuValue'>{remark || '-'}</span>}
                </Form.Item>
              </Col>
            </Row>
            {!detail && (
              <Form.Item {...tailFormItemLayout}>
                <Button
                  style={{ width: '100%' }}
                  type='primary'
                  onClick={this.handleSubmit}
                >
                  提交
                </Button>
              </Form.Item>
            )}
          </Form>
        </Card>
        {!add ? (
          <Card
            title={
              <>
                就诊记录&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              </>
            }
            extra={
              <>
                <Button
                  onClick={() => this.setState({ examRes: true })}
                  type='primary'
                >
                  添加就诊记录
                </Button>
              </>
            }
          >
            <ExportExcel
              // loading={loading}
              tHeader={tHeader}
              filterVal={filterVal}
              columns={this.columns()}
              data={seeList}
            />
          </Card>
        ) : null}
        <Modal
          title='就诊记录'
          visible={this.state.examRes}
          onOk={this.addSeeList}
          onCancel={() => {
            this.setState({ examRes: false })
          }}
        >
          <BaseForm ref={this.baseFormRef} columns={this.state.columns} />
        </Modal>
      </div>
    )
  }
}

export default Form.create()(UserInfo)
