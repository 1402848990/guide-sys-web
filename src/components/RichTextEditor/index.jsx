import React, { useState, useEffect } from 'react'
import {
  Card,
  Row,
  Col,
  Input,
  Button,
  Rate,
  message,
  Descriptions,
  Icon,
  Select,
} from 'antd'
import { Section } from '../../utils/enum'
import axios from '../../request/axiosConfig'
import { EditorState, convertToRaw, ContentBlock, ContentState } from 'draft-js'
import { Editor } from 'react-draft-wysiwyg'
import draftToHtml from 'draftjs-to-html'
import draftToMarkdown from 'draftjs-to-markdown'
import htmlToDraft from 'html-to-draftjs'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import './index.less'
import moment from 'moment'
import Item from 'antd/lib/list/Item'

const HOST = 'http://localhost:8088/interface'
const sectionOpt = Section.map((item) => (
  <Select.Option value={item}>{item}</Select.Option>
))

const RichTextEditor = () => {
  // 标题
  const [title, setTitle] = useState('')
  // 版块
  const [section, setSection] = useState('')
  // 内容
  const [editorState, setEditorState] = useState(EditorState.createEmpty())
  // 重要等级
  const [level, setLevel] = useState(1)
  const [detail, setDetail] = useState(null)
  const [edit, setEdit] = useState(false)
  const [show, setShow] = useState(false)

  // 获取数据
  const getDetail = async (id) => {
    // const
    const res = await axios.post(`${HOST}/User/detailPlan`, {
      id,
    })
    return res.data
  }

  useEffect(() => {
    async function fun() {
      const hash = window.location.hash
      console.log(hash)
      if (hash.includes('id')) {
        // 如果是编辑
        if (hash.includes('edit')) {
          // console.log(decodeURI(hash.split('=')[1]))
          const id = decodeURI(hash.split('=')[1].split('&')[0])
          const record = await getDetail(id)
          console.log('record', record)
          const contentBlock = htmlToDraft(record.content)
          const contentState = ContentState.createFromBlockArray(
            contentBlock.contentBlocks
          )
          setTitle(record.title)
          setSection(record.section)
          setLevel(record.level)
          setEditorState(EditorState.createWithContent(contentState))
          setDetail(record)
          setEdit(true)
        } else {
          // 如果是查看
          try {
            const id = decodeURI(hash.split('=')[1])
            const record = await getDetail(id)
            const contentBlock = htmlToDraft(record.content)
            const contentState = ContentState.createFromBlockArray(
              contentBlock.contentBlocks
            )
            setTitle(record.title)
            setSection(record.section)
            setLevel(record.level)
            setEditorState(EditorState.createWithContent(contentState))
            setDetail(record)
            setShow(true)
          } catch (err) {
            console.log('err', err)
          }
        }
      }
    }
    fun()
  }, [])

  const onEditorStateChange = (editorState) => setEditorState(editorState)

  const submit = async () => {
    const res = await axios({
      url: edit
        ? 'http://localhost:8088/interface/User/updatePlan'
        : 'http://localhost:8088/interface/User/addNews',
      method: 'post',
      data: edit
        ? {
            id: detail.id,
            section,
            title,
            level,
            content: draftToHtml(convertToRaw(editorState.getCurrentContent())),
          }
        : {
            title,
            section,
            level,
            content: draftToHtml(convertToRaw(editorState.getCurrentContent())),
          },
    })
    if (res.success) {
      message.success({ content: `提交成功！` })
    }
  }

  return (
    <div>
      <Card bordered={false} title='我的资讯'>
        {show ? (
          <Descriptions title='资讯基本信息'>
            <Descriptions.Item label='发布人'>{detail.userName}</Descriptions.Item>
            <Descriptions.Item label='创建时间'>
              {moment(+detail.createdAt).format('YYYY-MM-DD HH:mm:ss')}
            </Descriptions.Item>
            <Descriptions.Item label='更新时间'>
              {moment(+detail.updatedAt).format('YYYY-MM-DD HH:mm:ss')}
            </Descriptions.Item>
          </Descriptions>
        ) : null}
        <h1>资讯标题：</h1>
        {show ? (
          title
        ) : (
          <Input
            value={title}
            onChange={(e) => {
              setTitle(e.target.value)
            }}
          />
        )}
        <h1 style={{marginTop:'20px'}}>所属版块：</h1>
        {show ? (
          section
        ) : (
          <Select value={section} style={{width:'100%'}} onChange={(e) => setSection(e)}>{sectionOpt}</Select>
        )}
        {/* 富文本编辑器 */}
        {!show && (
          <>
            <h1 style={{ marginTop: '20px' }}>资讯内容：</h1>
            <Editor
              editorState={editorState}
              onEditorStateChange={onEditorStateChange}
              wrapperClassName='wrapper-class'
              editorClassName='editor-class'
              toolbarClassName='toolbar-class'
              localization={{ locale: 'zh' }}
            />
          </>
        )}
        {show && (
          <>
            <h1 style={{ marginTop: '10px' }}>资讯内容：</h1>
            <div
              dangerouslySetInnerHTML={{
                __html: draftToHtml(
                  convertToRaw(editorState.getCurrentContent())
                ),
              }}
            ></div>
          </>
        )}
        {/* 重要等级 */}
        <h1 style={{ marginTop: '10px' }}>推荐指数：</h1>
        <Rate
          character={<Icon type='heart' />}
          value={level}
          onChange={(val) => {
            setLevel(val)
          }}
        />
        <br />
        {!show && (
          <Button
            type='primary'
            onClick={submit}
            style={{ marginTop: '20px', width: '200px',float:'right',height:'40px' }}
          >
            确认发布
          </Button>
        )}
      </Card>
      <br />
      {/* <Row gutter={10}>
        <Col span={12}>
          <Card
            title='同步转换HTML'
            bordered={false}
            style={{ minHeight: 200 }}
          >
            {editorState &&
              draftToHtml(convertToRaw(editorState.getCurrentContent()))}
          </Card>
        </Col>
      </Row> */}
    </div>
  )
}

export default RichTextEditor
