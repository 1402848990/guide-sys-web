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
  Icon,
} from 'antd'
import moment from 'moment'
import axios from '../../request/axiosConfig'
import './index.less'

const { confirm } = Modal
const { TextArea } = Input
const { Meta } = Card;

class Contact extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      list: [],
      visible: false,
      noteDetail: {},
    }
  }

  async componentDidMount() {
    this.getUserInfo()
  }

  // 获取备忘录信息
  getUserInfo = async () => {
    const res = await axios({
      url: 'http://localhost:8088/interface/User/noteList',
      method: 'post',
    })
    this.setState({
      list: res.data,
    })
    console.log('res', res)
  }

  // 提交
  handleSubmit = () => {
    console.log(this.state.noteDetail)
    const { validateFields, resetFields } = this.props.form
    const update = this.state.noteDetail.title
    const { id } = this.state.noteDetail
    validateFields(async (err, values) => {
      if (!err) {
        const res = await axios({
          url: update
            ? 'http://localhost:8088/interface/User/updateNote'
            : 'http://localhost:8088/interface/User/addNote',
          method: 'post',
          data: update ? { ...values, id } : values,
        })
        if (res.success) {
          message.success({
            content: update ? '备忘录更新成功！' : '备忘录添加成功！',
          })
          resetFields()
          this.setState(
            {
              noteDetail: {},
            },
            () => {
              this.setState({
                visible: false,
              })
            }
          )
          this.setState({
            noteDetail: {},
          })
          // 获取最新备忘录列表
          this.getUserInfo()
        }
      }
    })
  }

  renderTitle = () => (
    <Row type='flex' align='middle'>
      <Col span={18}>
        <h3>备忘录</h3>
      </Col>
      <Col style={{ textAlign: 'right' }} className='titleBtn' span={6}>
        <Button
          onClick={() => {
            this.setState({ noteDetail: {} }, () => {
              this.setState({
                visible: true,
              })
            })
          }}
          type='primary'
        >
          +添加备忘录
        </Button>
      </Col>
    </Row>
  )

  delete = (item) => {
    const _this = this
    confirm({
      title: `确定删除备忘录 ${item.title} 吗`,
      content: '',
      async onOk() {
        await axios({
          url: 'http://localhost:8088/interface/User/deleteNote',
          method: 'post',
          data: { id: item.id },
        })
        message.success('删除成功！')
        _this.getUserInfo()
      },
      onCancel() {
        console.log('Cancel')
      },
    })
  }

  edit = (item) => {
    this.setState(
      {
        noteDetail: item,
      },
      () => {
        this.setState({
          visible: true,
        })
      }
    )
  }

  render() {
    const { getFieldDecorator, resetFields } = this.props.form
    const { list, noteDetail } = this.state
    console.log('noteDetail', noteDetail)
    return (
      <div className='note'>
        <Card title={this.renderTitle()}>
          <List
            grid={{
              gutter: 16,
              xs: 1,
              sm: 2,
              md: 4,
              lg: 4,
              xl: 6,
              xxl: 6,
            }}
            className='demo-loadmore-list'
            // loading={initLoading}
            itemLayout='horizontal'
            pagination={{
              pageSize: 10,
            }}
            dataSource={list}
            renderItem={(item) => (
              <List.Item>
                <Card
                cover={
                  <img
                    alt="example"
                    src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                  />
                }
                  className='noteCard'
                  hoverable
                  actions={[
                    <Icon
                      style={{ color: '#009688' }}
                      type='edit'
                      key='edit'
                      onClick={() => this.edit(item)}
                    />,
                    <Icon
                      style={{ color: '#f35355' }}
                      type='delete'
                      key='delete'
                      onClick={() => this.delete(item)}
                    />,
                  ]}
                  title={item.title}
                >
                  {item.content}
                
                <Meta className='meta' description={moment(+item.updatedAt).format('YYYY-MM-DD HH:mm:ss')} />
                </Card>
              </List.Item>
            )}
          />
          <Modal
            title='备忘录'
            visible={this.state.visible}
            onOk={this.handleSubmit}
            onCancel={() => {
              this.setState({ visible: false, noteDetail: {} })
              resetFields()
            }}
          >
            <Form key={`${noteDetail.title}`} onSubmit={this.handleSubmit}>
              <Form.Item label='备忘录标题'>
                {getFieldDecorator('title', {
                  rules: [
                    {
                      required: true,
                      message: '请输入备忘录标题',
                    },
                  ],
                  initialValue: noteDetail.title,
                })(<Input placeholder='备忘录标题' />)}
              </Form.Item>
              <Form.Item label='备忘录内容'>
                {getFieldDecorator('content', {
                  rules: [
                    {
                      required: true,
                      message: '请输入备忘录内容',
                    },
                  ],
                  initialValue: noteDetail.content,
                })(<TextArea rows={6} placeholder='备忘录内容' />)}
              </Form.Item>
            </Form>
          </Modal>
        </Card>
      </div>
    )
  }
}
export default Form.create()(Contact)
