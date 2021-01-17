/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react'
import './form.less'
import moment from 'moment'
import axios from '../../request/axiosConfig'
import {
  Row,
  Col,
  Input,
  Icon,
  Button,
  Divider,
  Rate,
  Modal,
  message,
  Select,
} from 'antd'

import BaseTable from '../../components/BaseTable'

const Search = Input.Search

const HOST = 'http://localhost:8088/interface'

export default class UForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      filter: {},
      dataSource: [],
      loading: true,
    }
  }
  // 获取数据
  getData = async () => {
    const res = await axios.post(`${HOST}/User/planList`, {
      filter: this.state.filter,
    })
    this.setState(
      {
        dataSource: res.data,
      },
      () => {
        this.setState({
          loading: false,
        })
      }
    )
  }
  //姓名输入
  onChangeUserName = (e, field) => {
    console.log(e)
    if (e) {
      const value = !isNaN(+e) ? e : e?.target?.value
      const _filter = this.state.filter
      this.setState({
        filter: {
          ..._filter,
          [field]: value,
        },
      })
    }
  }

  //渲染
  componentDidMount() {
    this.getData()
  }
  //搜索按钮
  btnSearch_Click = () => {
    this.getData()
  }
  //重置按钮
  btnClear_Click = () => {
    this.setState(
      {
        filter: {},
      },
      () => {
        this.getData()
      }
    )
  }

  //单选框改变选择
  checkChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys: selectedRowKeys })
  }

  clickDetail = (record) => {
    window.open(`#baseWorkPlan?id=${record.id}`)
  }

  clickEdit = (record) => {
    window.open(`#baseWorkPlan?id=${record.id}&edit`)
  }

  clickDelete = (item) => {
    const _this = this
    Modal.confirm({
      title: `确定删除工作计划吗`,
      content: '',
      async onOk() {
        await axios({
          url: 'http://localhost:8088/interface/User/deletePlan',
          method: 'post',
          data: { id: item.id },
        })
        message.success('删除成功！')
        _this.getData()
      },
      onCancel() {
        console.log('Cancel')
      },
    })
  }

  columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 80,
      sorter: (a, b) => +a.id - +b.id,
    },
    {
      title: '计划名',
      dataIndex: 'title',
      width: 180,
    },
    {
      title: '重要等级',
      dataIndex: 'level',
      width: 150,
      render: (value) => <Rate disabled value={value} />,
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

  render() {
    const { filter, dataSource, loading } = this.state
    console.log(filter)
    return (
      <div>
        <div className='formBody'>
          <Row gutter={16}>
            <Col className='gutter-row' sm={8}>
              <Search
                placeholder='请输入计划名'
                prefix={<Icon type='user' />}
                value={filter.title}
                onChange={(e) => this.onChangeUserName(e, 'title')}
              />
            </Col>
            <Col className='gutter-row' sm={8}>
              <Select
                placeholder='请选择重要等级'
                style={{ width: '100%' }}
                prefix={<Icon type='user' />}
                value={filter.level}
                onChange={(e) => this.onChangeUserName(e, 'level')}
              >
                <Select.Option value={1}>1</Select.Option>
                <Select.Option value={2}>2</Select.Option>
                <Select.Option value={3}>3</Select.Option>
                <Select.Option value={4}>4</Select.Option>
                <Select.Option value={5}>5</Select.Option>
              </Select>
            </Col>
          </Row>
          <Row gutter={16}>
            <Button
              type='primary'
              onClick={() => {
                window.open('#baseWorkPlan')
              }}
              style={{ marginLeft: '8px' }}
            >
              新建工作计划
            </Button>
            <div className='btnOpera'>
              <Button
                type='primary'
                onClick={this.btnSearch_Click}
                style={{ marginRight: '10px' }}
              >
                查询
              </Button>
              <Button
                type='primary'
                onClick={this.btnClear_Click}
                style={{
                  background: '#f8f8f8',
                  color: '#108ee9',
                  marginRight: '10px',
                }}
              >
                重置
              </Button>
            </div>
          </Row>
          <BaseTable
            columns={this.columns}
            dataSource={dataSource}
            checkChange={this.checkChange}
            onDelete={this.onDelete}
            editClick={this.editClick}
            loading={loading}
          />
        </div>
      </div>
    )
  }
}
