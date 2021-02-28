/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import {
  Button,
  List,
  Skeleton,
  Avatar,
  Card,
  Row,
  Col,
  Tag,
  Modal,
  Form,
  Input,
  Select,
  message,
  Calendar,
  Badge,
  Steps,
} from 'antd'
import moment from 'moment'
import axios from '../../request/axiosConfig'
import { Department } from '../../utils/enum'
import './index.less'

const { confirm } = Modal
const { Step } = Steps

// 科室选项
const DepartmentOpt = Department.map((item) => (
  <Select.Option key={item} value={item}>
    {item}
  </Select.Option>
))

class Contact extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      list: [],
      visible: false,
      contactDetail: {},
      value: moment(),
      selectedValue: moment(),
      current: 0,
      department: '',
      doctorList: [],
      doctor: null,
    }
  }

  // 获取医生列表
  getDoctorList = async () => {
    const { department } = this.state
    const res = await axios({
      url: 'http://localhost:8088/interface/User/userList',
      method: 'post',
      data: {
        filter: {
          department,
        },
      },
    })
    this.setState({
      doctorList: res.data,
    })
    console.log('res', res)
  }

  // 获取医生排班
  getDateList = async () => {
    const { doctor } = this.state
    const res = await axios({
      url: 'http://localhost:8088/interface/User/dateList',
      method: 'post',
      data: {
        filter: {
          userId: doctor,
        },
        from: 'patient',
      },
    })
    this.setState({
      list: res.data,
    })
    console.log('res', res)
  }

  handleSelect = (e) => {
    this.setState(
      {
        department: e,
      },
      () => {
        this.getDoctorList()
      }
    )
  }

  handleSelectDoc = (e) => {
    this.setState(
      {
        doctor: e,
      },
      () => {
        this.getDateList()
      }
    )
  }

  prev() {
    const current = this.state.current - 1
    this.setState({ current })
  }

  steps = () => {
    const { doctorList, doctor, department, value, list } = this.state
    return [
      {
        title: '1.选择科室',
        content: (
          <>
            <Select
              placeholder='选择科室'
              value={department}
              style={{
                display: 'block',
                width: '50%',
                margin: '0 auto',
                marginTop: '100px',
              }}
              onChange={this.handleSelect}
            >
              {DepartmentOpt}
            </Select>
          </>
        ),
      },
      {
        title: '2.选择医生',
        content: (
          <>
            <Select
              value={doctor}
              key='111'
              placeholder='选择医生'
              style={{
                display: 'block',
                width: '50%',
                margin: '0 auto',
                marginTop: '100px',
              }}
              onChange={this.handleSelectDoc}
            >
              {doctorList?.map((item) => (
                <Select.Option value={item.id}>
                  {item.userName}——{item.level}——{item.sex === 1 ? '男' : '女'}
                  ——{item.age}
                </Select.Option>
              ))}
            </Select>
          </>
        ),
      },
      {
        title: '选择日期',
        content: (
          <Calendar
            style={{ marginTop: '20px' }}
            value={value}
            onSelect={this.onSelect}
            onPanelChange={this.onPanelChange}
            dateCellRender={this.dateCellRender}
          />
        ),
      },
    ]
  }

  next() {
    const current = this.state.current + 1
    this.setState({ current })
  }

  getListData = (value) => {
    const { list } = this.state
    console.log('date', value.format('YYYY-MM-DD'))
    // 匹配当前日期
    const listData = list.filter(
      (item) => item.date === value.format('YYYY-MM-DD')
    )
    console.log('listData', listData)
    let renderList = []
    listData.forEach((item) => {
      if (item.num) {
        renderList.push(
          {
            type: 'error',
            content: `已设定：${item.num} 人`,
            key: item.id,
          },
          {
            type: 'warning',
            content: `已预约：${item.orderNum || 0} 人`,
            key: item.id,
          },
          {
            type: 'success',
            content: `可预约：${item.num - item.orderNum} 人`,
            key: item.id,
          }
        )
      }
    })
    return renderList.length > 0
      ? renderList
      : [
          {
            type: 'error',
            content: `暂未设定`,
          },
        ]
  }

  dateCellRender = (value) => {
    // console.log('value---',value)
    const listData = this.getListData(value)
    // console.log('listData', listData)
    return (
      <ul className='events'>
        {listData?.map((item) => (
          <Badge status={item.type} text={item.content} />
        ))}
      </ul>
    )
  }

  // 选中日期
  onSelect = (value) => {
    console.log('value', value, value.format('YYYY-MM-DD'))
    this.setState({
      visible: true,
      value,
      selectedValue: value,
    })
  }

  onPanelChange = (value) => {
    this.setState({ value })
  }

  // async componentDidMount() {
  //   this.getDateList()
  // }

  // 提交
  handleSubmit = () => {
    const { validateFields, resetFields } = this.props.form
    validateFields(async (err, values) => {
      if (!err) {
        const res = await axios({
          url: 'http://localhost:8088/interface/User/orderDate',
          method: 'post',
          data: {
            orderDate: this.state.selectedValue.format('YYYY-MM-DD'), // 预约的日期
            doctorId:this.state.doctor
          },
        })
        if (res.success) {
          message.success({
            content: '预约成功~',
          })
          resetFields()
          this.setState({
            visible: false,
          })
          this.getDateList()
        }
      }
    })
  }

  render() {
    const { getFieldDecorator, resetFields } = this.props.form
    const { list, contactDetail, value, selectedValue, current } = this.state
    console.log('contactDetail', contactDetail)
    const steps = this.steps()
    return (
      <div className='contact'>
        <Card title='排班设定'>
          <div>
            <Steps current={current}>
              {steps.map((item) => (
                <Step key={item.title} title={item.title} />
              ))}
            </Steps>
            <div className='steps-content'>{steps[current].content}</div>
            <div className='steps-action'>
              {current < steps.length - 1 && (
                <Button type='primary' onClick={() => this.next()}>
                  下一步
                </Button>
              )}
              {current > 0 && (
                <Button style={{ marginLeft: 8 }} onClick={() => this.prev()}>
                  上一步
                </Button>
              )}
            </div>
          </div>
          {/* 日历 */}
          {/* 弹窗 */}
          <Modal
            title='设置当天可预约人数'
            visible={this.state.visible}
            onOk={this.handleSubmit}
            onCancel={() => {
              this.setState({ visible: false })
              resetFields()
            }}
          >
            确定预约吗？
            {/* <Form onSubmit={this.handleSubmit}>
              <Form.Item label='人数'>
                {getFieldDecorator('num', {
                  rules: [
                    {
                      required: true,
                      message: '请输入人数',
                    },
                  ],
                })(<Input placeholder='人数' />)}
              </Form.Item>
            </Form> */}
          </Modal>
        </Card>
      </div>
    )
  }
}
export default Form.create()(Contact)
