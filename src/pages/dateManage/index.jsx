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
} from 'antd'
import moment from 'moment'
import axios from '../../request/axiosConfig'
import './index.less'

const { confirm } = Modal

class Contact extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      list: [],
      visible: false,
      contactDetail: {},
      value: moment(),
      selectedValue: moment(),
    }
  }

  getListData = (value) => {
    const { list } = this.state
    console.log('date', value.format('YYYY-MM-DD'))
    // 匹配当前日期
    const listData = list.filter(
      (item) => item.date === value.format('YYYY-MM-DD')
    )
    let renderList = []
     listData.forEach((item) => {
      if (item.num) {
        renderList.push(
          {
            type: 'error',
            content: `已设定：${item.num} 人`,
            key:item.id
          },
          {
            type: 'warning',
            content: `已预约：${item.orderNum || 0} 人`,
            key:item.id
          },
          {
            type: 'success',
            content: `可预约：${item.num - item.orderNum} 人`,
            key:item.id
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
    console.log('listData', listData)
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

  async componentDidMount() {
    this.getDateList()
  }

  // 获取排班列表
  getDateList = async () => {
    const res = await axios({
      url: 'http://localhost:8088/interface/User/dateList',
      method: 'post',
    })
    this.setState({
      list: res.data,
    })
    console.log('res', res)
  }

  // 提交
  handleSubmit = () => {
    const { validateFields, resetFields } = this.props.form
    validateFields(async (err, values) => {
      if (!err) {
        const res = await axios({
          url: 'http://localhost:8088/interface/User/addDate',
          method: 'post',
          data: {
            ...values,
            date: this.state.selectedValue.format('YYYY-MM-DD'),
          },
        })
        if (res.success) {
          message.success({
            content: '排班设定成功~',
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
    const { list, contactDetail, value, selectedValue } = this.state
    console.log('contactDetail', contactDetail)
    return (
      <div className='contact'>
        <Card title='排班设定'>
          {/* 日历 */}
          <Calendar
            value={value}
            onSelect={this.onSelect}
            onPanelChange={this.onPanelChange}
            dateCellRender={this.dateCellRender}
          />
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
            <Form onSubmit={this.handleSubmit}>
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
            </Form>
          </Modal>
        </Card>
      </div>
    )
  }
}
export default Form.create()(Contact)
