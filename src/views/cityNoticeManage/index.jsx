/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react'
import './form.less'
import moment from 'moment'
import axios from '../../request/axiosConfig'
import { AREA_LIST } from '@/utils'
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
  Tag,
} from 'antd'

import BaseTable from '../../components/BaseTable'

const Search = Input.Search
const { CheckableTag } = Tag

const HOST = 'http://localhost:8088/interface'

export default class UForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      filter: {},
      dataSource: [],
      loading: true,
      selectedTags: [],
    }
  }
  // 获取数据
  getData = async () => {
    const res = await axios.post(`${HOST}/User/cityNoticeList`, {
      filter:  {...this.state.filter,areaName:this.state.selectedTags.join(',')} ,
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

  handleChange = (tag, checked) => {
    const nextSelectedTags = checked
      ? [tag]
      : this.state.selectedTags.filter((t) => t !== tag)
    this.setState({
      selectedTags: nextSelectedTags,
    })
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
        selectedTags:[]
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
      title: `确定删除城市疫情播报吗`,
      content: '',
      async onOk() {
        await axios({
          url: 'http://localhost:8088/interface/User/deleteCityNotice',
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
      title: '疫情播报标题',
      dataIndex: 'title',
      width: 180,
    },
    {
      title: '播报地区',
      dataIndex: 'areaName',
      width: 180,
    },
    {
      title: '乐观等级',
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
          <a onClick={() => this.clickEdit(record)}>修改</a>
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
                placeholder='请输入疫情播报标题名'
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
          <Row>
            <Col span={24}>
              <h1 style={{ marginTop: '10px' }}>选择播报地区：</h1>
              <div>
                {AREA_LIST().map((tag) => (
                  <CheckableTag
                    style={{
                      cursor: 'pointer',
                      fontSize: '14px',
                      marginBottom: '8px',
                    }}
                    key={tag}
                    checked={this.state.selectedTags.indexOf(tag) > -1}
                    onChange={(checked) => this.handleChange(tag, checked)}
                  >
                    {tag}
                  </CheckableTag>
                ))}
              </div>
            </Col>
          </Row>
          <br />
          <Row gutter={16}>
            <Button
              type='primary'
              onClick={() => {
                window.open('#baseWorkPlan')
              }}
              style={{ marginLeft: '8px' }}
            >
              添加城市播报
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
