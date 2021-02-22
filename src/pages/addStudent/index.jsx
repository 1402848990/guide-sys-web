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
import CourseTag from '../../components/CourseTag'
import BaseForm from '../../components/BaseForm'
import { DATE } from '../../utils/index'
import ExportExcel from '../../components/ExportExcel'
import { Line } from '@ant-design/charts'

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

  // 获取学生信息
  getUserInfo = async () => {
    if (ID) {
      const res = await axios({
        url: 'http://localhost:8088/interface/Stu/detail',
        method: 'post',
        data: { id: ID },
      })
      this.setState({
        userInfo: res.data,
      })
      console.log('res', res)
    }
  }

  // 获取成绩  课程列表
  getCourseList = async () => {
    const { data } = await axios.post(
      `http://localhost:8088/interface/Stu/examList`,
      {
        filter: { stuName: this.state.userInfo.name },
      }
    )
    const handledData = data.map((item) => {
      const content = JSON.parse(item.content)
      for (let i in content) {
        item[i] = content[i]
      }
      return item
    })
    const res = await axios({
      url: 'http://localhost:8088/interface/Stu/courseList',
      method: 'post',
      // data: { id: ID },
    })
    this.setState({
      courseList: res.data,
    })
    const columns = [
      {
        label: '学期',
        field: 'date',
        name: '学期',
        required: true,
        type: 'select',
        option: DATE,
      },
    ]
    res.data.forEach((item) => {
      columns.push({
        label: item.name,
        field: item.name,
        name: item.name,
        required: true,
      })
    })

    const _examContent = []
    const courseNameList = []

    res.data.forEach((item) => {
      courseNameList.push(item.name)
      _examContent.push({
        title: item.name,
        dataIndex: item.name,
        width: 180,
        date: item.tate,
        // render: (_, record) => JSON.parse(record.content)[item.name],
      })
    })

    this.setState({
      columns,
      examContent: _examContent,
      courseList: res.data,
      courseNameList,
      examList: handledData,
    })
  }

  columns = () => [
    {
      title: '学号',
      dataIndex: 'stuId',
      width: 80,
      sorter: (a, b) => +a.id - +b.id,
    },
    {
      title: '姓名',
      dataIndex: 'stuName',
      width: 180,
    },
    {
      title: '学期',
      dataIndex: 'date',
      width: 180,
    },
    ...this.state.examContent,
    {
      title: '班级',
      dataIndex: 'garde',
      width: 180,
      filters: [
        { text: '一班', value: '一班' },
        { text: '二班', value: '二班' },
        { text: '三班', value: '三班' },
      ],
      onFilter: (value, record) => record.garde === value,
    },
    {
      title: '性别',
      dataIndex: 'stuSex',
      width: 180,
      filters: [
        { text: '男', value: '男' },
        { text: '女', value: '女' },
      ],
      onFilter: (value, record) => record.sex === value,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      sorter: (a, b) => +a.createdAt - +b.createdAt,
      width: 200,
      render: (value) => moment(+value).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      sorter: (a, b) => +a.updatedAt - +b.updatedAt,
      width: 200,
      render: (value) => moment(+value).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '操作',
      fixed: 'right',
      dataIndex: 'action',
      width: 140,
      render: (_, record) => (
        <>
          <a onClick={() => this.clickDetail(record)}>查看</a>
          <Divider type='vertical' />
          <a onClick={() => this.clickEdit(record)}>编辑</a>
          <Divider type='vertical' />
          <a onClick={() => this.clickDelete(record)}>删除</a>
        </>
      ),
    },
  ]

  handlePicChange = (e) => {
    e.persist()
    console.log(e)
  }

  handleSubmit = () => {
    const { validateFields } = this.props.form
    const edit = hash.includes('edit')
    validateFields(async (err, values) => {
      values.date = values.date.valueOf()
      console.log('values', values)
      if (!err) {
        const res = await axios({
          url: `http://localhost:8088/interface/Stu/${edit ? 'update' : 'add'}`,
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

  // 添加成绩
  addExam = () => {
    const {
      validateFields,
      getFieldsValue,
      resetFields,
    } = this.baseFormRef.current
    const { userInfo } = this.state
    validateFields(async (err, values) => {
      console.log('values', values)
      const date = values.date
      delete values.date
      if (!err) {
        const res = await axios({
          url: `http://localhost:8088/interface/Stu/examAdd`,
          method: 'post',
          data: {
            content: JSON.stringify(values),
            stuName: userInfo.name,
            stuSex: userInfo.sex,
            garde: userInfo.garde,
            stuId: userInfo.stuId,
            date,
          },
        })
        if (res.success) {
          message.success({ content: '成绩录入成功！' })
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
      date,
      address,
      parentName,
      parentPhone,
      name,
      level,
      stuId,
    } = this.state.userInfo||{}
    const { courseNameList, examList = [] } = this.state
    const tHeader = ['学号', '姓名', '学期', '班级', '性别'].concat(
      courseNameList
    )
    const filterVal = ['stuId', 'stuName', 'date', 'garde', 'stuSex'].concat(
      courseNameList
    )
    const {
      form: { getFieldDecorator, getFieldValue },
    } = this.props
    const charData = []
    examList.forEach((item) => {
      Object.entries(item).forEach((ele) => {
        const [key, value] = ele
        if (courseNameList.includes(key)) {
          charData.push({
            name: key,
            value: +value,
            date: item.date,
          })
        }
      })
    })
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
        <Card title='学生信息'>
          <Avatar shape='square' size={240}>
            {getFieldValue('name') || '姓名'}
          </Avatar>
          <Form
            className='form'
            {...formItemLayout}
            // onSubmit={this.handleSubmit}
          >
            <Row>
              <Col span={11}>
                <Form.Item label='学号'>
                  {getFieldDecorator('stuId', {
                    initialValue: stuId || 101,
                    rules: [
                      {
                        required: true,
                        message: '请输入学号',
                      },
                    ],
                  })(
                    <Input
                      className={detail ? 'hideField' : ''}
                      placeholder='学号'
                    />
                  )}
                  {detail && <span className='stuValue'>{stuId}</span>}
                </Form.Item>
              </Col>
              <Col span={11}>
                <Form.Item label='姓名'>
                  {getFieldDecorator('name', {
                    initialValue: name || '张三',
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
                  {detail && <span className='stuValue'>{name}</span>}
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
                <Form.Item label='班级'>
                  {getFieldDecorator('garde', {
                    initialValue: garde,
                    rules: [
                      {
                        required: true,
                        whitespace: true,
                        message: '请选择班级',
                      },
                    ],
                  })(
                    <Select
                      className={detail ? 'hideField' : ''}
                      placeholder='班级'
                    >
                      <Select.Option value='一班'>一班</Select.Option>
                      <Select.Option value='二班'>二班</Select.Option>
                      <Select.Option value='三班'>三班</Select.Option>
                    </Select>
                  )}{' '}
                  {detail && <span className='stuValue'>{garde}</span>}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={11}>
                {' '}
                <Form.Item label='生日'>
                  {getFieldDecorator('date', {
                    initialValue: moment(+date),
                    rules: [
                      {
                        required: true,
                        message: '请选择生日',
                      },
                    ],
                  })(
                    <DatePicker
                      className={detail ? 'hideField' : ''}
                      style={{ width: '100%' }}
                    />
                  )}{' '}
                  {detail && (
                    <span className='stuValue'>
                      {moment(+date).format('YYYY-MM-DD')}
                    </span>
                  )}
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
                <Form.Item label='父母姓名'>
                  {getFieldDecorator('parentName', {
                    initialValue: parentName,
                  })(
                    <Input
                      className={detail ? 'hideField' : ''}
                      placeholder='父母姓名'
                    />
                  )}{' '}
                  {detail && (
                    <span className='stuValue'>{parentName || '-'}</span>
                  )}
                </Form.Item>
              </Col>
              <Col span={11}>
                <Form.Item label='父母手机号'>
                  {getFieldDecorator('parentPhone', {
                    initialValue: parentPhone,
                  })(
                    <Input
                      className={detail ? 'hideField' : ''}
                      placeholder='父母手机号'
                    />
                  )}{' '}
                  {detail && (
                    <span className='stuValue'>{parentPhone || '-'}</span>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={11}>
                <Form.Item label='籍贯'>
                  {getFieldDecorator('address', {
                    initialValue: address,
                    rules: [
                      {
                        required: true,
                        message: '请输入籍贯',
                      },
                    ],
                  })(
                    <Input
                      className={detail ? 'hideField' : ''}
                      placeholder='籍贯'
                    />
                  )}{' '}
                  {detail && <span className='stuValue'>{address || '-'}</span>}
                </Form.Item>
              </Col>
              <Col span={11}>
                <Form.Item label='职务'>
                  {getFieldDecorator('level', {
                    initialValue: level,
                  })(
                    <Input
                      className={detail ? 'hideField' : ''}
                      placeholder='职务'
                    />
                  )}{' '}
                  {detail && <span className='stuValue'>{level || '-'}</span>}
                </Form.Item>
              </Col>
            </Row>

            {/* <Form.Item label='注册时间'>
            {getFieldDecorator('createdAt', {
              initialValue: moment(createdAt).format('YYYY-MM-DD HH:mm:ss'),
            })(<Input disabled />)}
          </Form.Item>
          <Form.Item label='更新时间'>
            {getFieldDecorator('updatedAt', {
              initialValue: moment(updatedAt).format('YYYY-MM-DD HH:mm:ss'),
            })(<Input disabled />)}
          </Form.Item> */}
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
        {!add ?
        (
          <Card
            title={
              <>
                成绩管理&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <CourseTag />
              </>
            }
            extra={
              <>
                <Button
                  onClick={() => this.setState({ examRes: true })}
                  type='primary'
                >
                  录入成绩
                </Button>
              </>
            }
          >
            <ExportExcel
              // loading={loading}
              tHeader={tHeader}
              filterVal={filterVal}
              columns={this.columns()}
              data={examList}
            />
          </Card>
        ):null}

        {/* 录入成绩modal */}
        <Modal
          title='录入成绩'
          visible={this.state.examRes}
          onOk={this.addExam}
          onCancel={() => {
            this.setState({ examRes: false })
          }}
        >
          <BaseForm ref={this.baseFormRef} columns={this.state.columns} />
        </Modal>
        {!add && (
          <Card title='各科成绩分析图表' className='stuChar'>
            <Line {...config} />
          </Card>
        )}
      </div>
    )
  }
}

export default Form.create()(UserInfo)
