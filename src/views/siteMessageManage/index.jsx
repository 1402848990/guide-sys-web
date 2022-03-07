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
  Switch,
} from 'antd'
import axios from '../../request/axiosConfig'
import './index.less'

const { confirm } = Modal

class Message extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      list: [],
      visible: false,
      messageDetail: {},
    }
  }

  async componentDidMount() {
    this.getUserInfo()
  }

  // 获取站点通告信息
  getUserInfo = async () => {
    const res = await axios({
      url: 'http://localhost:8088/interface/User/messageList',
      method: 'post',
    })
    this.setState({
      list: res.data,
    })
    console.log('res', res)
  }

  // 提交
  handleSubmit = () => {
    console.log(this.state.messageDetail)
    const { validateFields, resetFields } = this.props.form
    const update = this.state.messageDetail.name
    const { id } = this.state.messageDetail
    validateFields(async (err, values) => {
      if (!err) {
        const res = await axios({
          url: update
            ? 'http://localhost:8088/interface/User/updateMessage'
            : 'http://localhost:8088/interface/User/addMessage',
          method: 'post',
          data: update ? { ...values, id } : values,
        })
        if (res.success) {
          message.success({
            content: update ? '站点通告更新成功！' : '站点通告创建成功！',
          })
          resetFields()
          this.setState(
            {
              messageDetail: {},
            },
            () => {
              this.setState({
                visible: false,
              })
            }
          )
          this.setState({
            messageDetail: {},
          })
          // 获取最新站点通告列表
          this.getUserInfo()
        }
      }
    })
  }

  renderTitle = () => (
    <Row type='flex' align='middle'>
      <Col span={18}>
        <h3>站点通告</h3>
      </Col>
      <Col style={{ textAlign: 'right' }} className='titleBtn' span={6}>
        <Button
          onClick={() => {
            this.setState({ messageDetail: {} }, () => {
              this.setState({
                visible: true,
              })
            })
          }}
          type='primary'
        >
          +新建站点通告
        </Button>
      </Col>
    </Row>
  )

  delete = (item) => {
    const _this = this
    confirm({
      title: `确定删除站点通告 ${item.id} 吗`,
      content: '',
      async onOk() {
        await axios({
          url: 'http://localhost:8088/interface/User/deleteMessage',
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
        messageDetail: item,
      },
      () => {
        this.setState({
          visible: true,
        })
      }
    )
  }

  handleCheck = async (checked, id) => {
    await axios({
      url: 'http://localhost:8088/interface/User/startMessage',
      method: 'post',
      data: { id: id },
    })
    message.success('站点通告启用成功！')
    this.getUserInfo()
  }

  render() {
    const { getFieldDecorator, resetFields } = this.props.form
    const { list, messageDetail } = this.state
    console.log('messageDetail', messageDetail)
    return (
      <div className='message'>
        <Card title={this.renderTitle()}>
          <List
            className='demo-loadmore-list'
            // loading={initLoading}
            itemLayout='horizontal'
            pagination={{
              pageSize: 15,
            }}
            dataSource={list}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <a key='list-loadmore-edit' onClick={() => this.edit(item)}>
                    编辑
                  </a>,
                  <a key='list-loadmore-more' onClick={() => this.delete(item)}>
                    删除
                  </a>,
                ]}
              >
                <Skeleton avatar title={false} loading={item.loading} active>
                  <List.Item.Meta
                    avatar={
                      <Avatar style={{ backgroundColor: '#87d068' }} size={48}>
                        {item.id}
                      </Avatar>
                    }
                    title={<a href=''>{`${item.content}`}</a>}
                    description={
                      <Row>
                        <Col span={12}>{`${item.remark || '-'}`}</Col>
                      </Row>
                    }
                  />
                  <div>
                    <Switch
                      checked={item.status}
                      onChange={(checked) => this.handleCheck(checked, item.id)}
                      checkedChildren='开启'
                      unCheckedChildren='关闭'
                    />
                  </div>
                </Skeleton>
              </List.Item>
            )}
          />
          <Modal
            width={800}
            title='新建站点通告'
            visible={this.state.visible}
            onOk={this.handleSubmit}
            onCancel={() => {
              this.setState({ visible: false, messageDetail: {} })
              resetFields()
            }}
          >
            <Form key={`${messageDetail.name}`} onSubmit={this.handleSubmit}>
              <Row gutter={40}>
                <Col span={24}>
                  {' '}
                  <Form.Item label='通告内容'>
                    {getFieldDecorator('content', {
                      rules: [
                        {
                          required: true,
                          message: '通告内容',
                        },
                      ],
                      initialValue: messageDetail.content,
                    })(<Input.TextArea placeholder='通告内容' />)}
                  </Form.Item>
                </Col>
                <Col span={24}>
                  {' '}
                  <Form.Item label='通告备注'>
                    {getFieldDecorator('remark', {
                      rules: [
                        {
                          required: true,
                          message: '请输入通告备注',
                        },
                      ],
                      initialValue: messageDetail.remark,
                    })(<Input placeholder='通告备注' />)}
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Modal>
        </Card>
      </div>
    )
  }
}
export default Form.create()(Message)
