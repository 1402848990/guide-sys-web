import React from 'react'
import { Tag, Button, Modal, Form, Input, message } from 'antd'
import axios from '../../request/axiosConfig'
import './index.less'

const COLOR = [
  'magenta',
  'blue',
  'red',
  'volcano',
  'cyan',
  'purple',
  'geekblue',
  'lime',
]

class Index extends React.Component {
  state = {
    courseList: [],
    visible: false,
  }

  async componentDidMount() {
    await this.getCourseList()
  }

  // 获取课程列表
  getCourseList = async () => {
    const res = await axios({
      url: 'http://localhost:8088/interface/Stu/courseList',
      method: 'post',
      // data: { id: ID },
    })
    this.setState({
      courseList: res.data,
    })
    console.log('res', res)
  }

  // 删除课程
  del = async (id) => {
    const res = await axios({
      url: 'http://localhost:8088/interface/Stu/deleteCourse',
      method: 'post',
      data: { id },
    })
    if(res.success){
      message.success({ content: '课程删除成功！' })
    }
  }

  // 添加课程
  handleSubmit = async () => {
    const res = await axios({
      url: 'http://localhost:8088/interface/Stu/courseAdd',
      method: 'post',
      data: { name: this.props.form.getFieldValue('name') },
    })
    if (res.success) {
      message.success({ content: '课程添加成功！' })
      this.setState({
        visible: false,
      })
      this.getCourseList()
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { courseList } = this.state
    return (
      <>
        {courseList.map((item, index) => (
          <Tag
            // style={{fontSize:'20px'}}
            key={item.id}
            closable
            onClose={() => this.del(item.id)}
            color={COLOR[index]}
          >
            {item.name}
          </Tag>
        ))}
        <Button
          type='dashed'
          onClick={() => {
            this.setState({ visible: true })
          }}
        >
          +添加
        </Button>
        <Modal
          title='备忘录'
          visible={this.state.visible}
          onOk={this.handleSubmit}
          onCancel={() => {
            this.setState({ visible: false })
          }}
        >
          <Form onSubmit={this.handleSubmit}>
            <Form.Item label='课程名'>
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: '请输入课程名',
                  },
                ],
              })(<Input placeholder='课程名' />)}
            </Form.Item>
          </Form>
        </Modal>
      </>
    )
  }
}

export default Form.create()(Index)
