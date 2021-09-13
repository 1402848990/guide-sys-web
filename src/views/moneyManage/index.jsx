/* eslint-disable no-unused-expressions */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react'
import './form.less'
import moment from 'moment'
import axios from '../../request/axiosConfig'
import { Row, Col, Input, Card, Checkbox, Radio } from 'antd'
import ExportExcel from '../../components/ExportExcel'
import { DATE } from '../../utils/index'
import { orderBy } from 'lodash'

const Search = Input.Search

const HOST = 'http://localhost:8088/interface'

const tHeader = ['学号', '姓名', '班级', '性别']
const filterVal = ['stuId', 'stuName', 'garde', 'sex']

export default class UForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      filter: {},
      dataSource: [],
      loading: true,
      CourseOpts: [],
      selectCourse: ['JAVA', '数据结构', '高数'],
      currDate: '大一上学期',
      topConfig: {
        first: 2,
        second: 4,
        third: 6,
      },
      handledData: [],
      examContent: [],
      courseNameList: [],
    }
  }

  // 获取数据
  getData = async () => {
    const res = await axios.post(`${HOST}/Stu/list`, {
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

  // 获取成绩列表
  getExam = async () => {
    const { data } = await axios.post(`${HOST}/Stu/examList`, {
      filter: this.state.filter,
    })
    const handledData = data.map((item) => {
      const content = JSON.parse(item.content)
      for (let i in content) {
        item[i] = content[i]
      }
      return item
    })
    this.setState({
      handledData,
    })
  }

  // 将成绩按照一定的顺序排序
  handleExam = (_handledData) => {
    const { currDate, topConfig, selectCourse } = this.state
    // 各个班级当前学期的成绩
    const oneClass = _handledData.filter(
      (item) => item.garde === '一班' && item.date === currDate
    )
    const twoClass = _handledData.filter(
      (item) => item.garde === '二班' && item.date === currDate
    )
    const threeClass = _handledData.filter(
      (item) => item.garde === '三班' && item.date === currDate
    )
    console.log('oneClass', oneClass)

    const oneExam = []
    const twoExam = []
    const threeExam = []
    oneClass.forEach((item) => {
      let add = 0
      let low = false
      Object.entries(item).forEach((ele) => {
        const [course, courseVal] = ele
       
        if (selectCourse.includes(course)) {
          courseVal < 60 ? (low = true) : null
          add = add + Number(courseVal)
        }
      })
      item.average = low ? 0 : +(add / selectCourse.length).toFixed(2)
      oneExam.push(item)
    })

    twoClass.forEach((item) => {
      let add = 0
      let low = false
      Object.entries(item).forEach((ele) => {
        const [course, courseVal] = ele
        if (selectCourse.includes(course)) {
          courseVal < 60 ? (low = true) : null
          add = add + Number(courseVal)
        }
      })
      item.average = low ? 0 : +(add / selectCourse.length).toFixed(2)
      twoExam.push(item)
    })

    threeClass.forEach((item) => {
      let add = 0
      let low = false
      Object.entries(item).forEach((ele) => {
        const [course, courseVal] = ele
        if (selectCourse.includes(course)) {
          courseVal < 60 ? (low = true) : null
          add = add + Number(courseVal)
        }
      })
      item.average = low ? 0 : +(add / selectCourse.length).toFixed(2)
      threeExam.push(item)
    })
    // 根据平均分倒序排序
    return {
      oneExamOrder: orderBy(oneExam, ['average'], ['desc']).slice(
        0,
        topConfig.third
      ),
      twoExamOrder: orderBy(twoExam, ['average'], ['desc']).slice(
        0,
        topConfig.third
      ),
      threeExamOrder: orderBy(threeExam, ['average', ['desc']]).slice(
        0,
        topConfig.third
      ),
    }
  }

  //姓名输入
  onChangeTopConfig = (e, field) => {
    if (e) {
      const value = !e?.target ? e : e?.target?.value
      const _pre = this.state.topConfig
      this.setState({
        topConfig: {
          ..._pre,
          [field]: value,
        },
      })
    }
  }

  // 获取学科列表
  getCourse = async () => {
    const { data: courseList } = await axios({
      url: 'http://localhost:8088/interface/Stu/courseList',
      method: 'post',
    })
    console.log('courseList', courseList)
    const _examContent = []
    const CourseOpts = []
    const courseNameList = []

    courseList.forEach((item) => {
      courseNameList.push(item.name)
      _examContent.push({
        title: item.name,
        dataIndex: item.name,
        width: 180,
      })
    })

    courseList.forEach((item) => {
      CourseOpts.push({
        label: item.name,
        value: item.name,
      })
    })
    console.log('_examContent', _examContent)
    this.setState({
      CourseOpts,
      examContent: _examContent,
      courseNameList,
    })
  }

  //渲染
  componentDidMount() {
    this.getData()
    this.getCourse()
    this.getExam()
  }

  clickDetail = (record) => {
    window.open(`#addStudent?id=${record.stuId}`)
  }

  columns = () => [
    {
      title: '名次',
      dataIndex: '',
      width: 80,
      render: (_, record, index) => index + 1,
    },
    {
      title: '奖学金等级',
      dataIndex: '',
      width: 150,
      render: (_, record, index) => {
        console.log('index', index)
        return index + 1 <= +this.state.topConfig.first
          ? '一等奖学金'
          : index + 1 > +this.state.topConfig.first &&
            index + 1 <= +this.state.topConfig.second
          ? '二等奖学金'
          : '三等奖学金'
      },
    },
    {
      title: '学号',
      dataIndex: 'stuId',
      width: 120,
      sorter: (a, b) => +a.id - +b.id,
    },
    {
      title: '姓名',
      dataIndex: 'stuName',
      width: 120,
    },
    {
      title: '平均分',
      dataIndex: 'average',
      width: 80,
    },
    ...this.state.examContent,
    {
      title: '班级',
      dataIndex: 'garde',
      width: 100,
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
      width: 100,
      filters: [
        { text: '男', value: '男' },
        { text: '女', value: '女' },
      ],
      onFilter: (value, record) => record.sex === value,
    },
    {
      title: '操作',
      fixed: 'right',
      dataIndex: 'action',
      width: 140,
      render: (_, record) => (
        <>
          <a onClick={() => this.clickDetail(record)}>查看此学生</a>
        </>
      ),
    },
  ]

  render() {
    const {
      filter,
      dataSource,
      loading,
      CourseOpts,
      currDate,
      topConfig,
      selectCourse,
      handledData,
      courseNameList,
    } = this.state
    // 获取各班级排序后的成绩列表
    const { oneExamOrder, twoExamOrder, threeExamOrder } = this.handleExam(
      handledData
    )
    const tHeader = ['学号', '姓名', '班级', '性别', '学期', '平均分'].concat(
      courseNameList
    )
    const filterVal = [
      'stuId',
      'stuName',
      'garde',
      'stuSex',
      'date',
      'average',
    ].concat(courseNameList)
    console.log(oneExamOrder)
    return (
      <div>
        <Card title='参与奖学金计算的学科'>
          <>
            <Checkbox.Group
              options={CourseOpts}
              value={selectCourse}
              onChange={(arr) => {
                this.setState({ selectCourse: arr })
              }}
            />
            <br />
            <br />
            <h4>选择学期</h4>
            <Radio.Group
              type='primary'
              value={currDate}
              onChange={(e) => this.setState({ currDate: e.target.value })}
            >
              {DATE.map((item) => (
                <Radio.Button value={item.value}>{item.label}</Radio.Button>
              ))}
            </Radio.Group>
          </>
        </Card>
        <div className='formBody'>
          <Row gutter={16}>
            <Col className='gutter-row' sm={8}>
              <span style={{ color: 'red' }} className='filterTitle'>
                一等奖学金：
              </span>
              <Input
                addonBefore='前'
                addonAfter='名'
                value={topConfig.first}
                onChange={(e) => this.onChangeTopConfig(e, 'first')}
              />
            </Col>
            <Col className='gutter-row' sm={8}>
              <span style={{ color: '#9C27B0' }} className='filterTitle'>
                二等奖学金：
              </span>
              <Input
                addonBefore='前'
                addonAfter='名'
                value={topConfig.second}
                onChange={(e) => this.onChangeTopConfig(e, 'second')}
              />
            </Col>
            <Col className='gutter-row' sm={8}>
              <span style={{ color: '#795548' }} className='filterTitle'>
                三等奖学金：
              </span>
              <Input
                addonBefore='前'
                addonAfter='名'
                value={topConfig.third}
                onChange={(e) => this.onChangeTopConfig(e, 'third')}
              />
            </Col>
          </Row>
          <Row gutter={16}>
            {/* <Button
              type='primary'
              onClick={() => {
                window.open('#addStudent')
              }}
              style={{ marginLeft: '8px' }}
            >
              添加学生
            </Button> */}
          </Row>
          <Card title='一班奖学金获奖名单'>
            <ExportExcel
              loading={loading}
              tHeader={tHeader}
              filterVal={filterVal}
              columns={this.columns()}
              data={oneExamOrder.filter((i) => i.average >= 60)}
            />
          </Card>
          <Card title='二班奖学金获奖名单'>
            <ExportExcel
              loading={loading}
              tHeader={tHeader}
              filterVal={filterVal}
              columns={this.columns()}
              data={twoExamOrder.filter((i) => i.average >= 60)}
            />
          </Card>
          <Card title='三班奖学金获奖名单'>
            <ExportExcel
              loading={loading}
              tHeader={tHeader}
              filterVal={filterVal}
              columns={this.columns()}
              data={threeExamOrder.filter((i) => i.average >= 60)}
            />
          </Card>
        </div>
      </div>
    )
  }
}
