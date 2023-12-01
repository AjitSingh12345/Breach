import { useEffect, useState } from 'react'
import MoreInfoModal from './Search Page/MoreInfoModal'
import {  
  Space, 
  Table, 
  Tag,
  Button
} from 'antd';

const ResultItem = ({ viewMorePossible, headings, entries, docTitles, getDocTitles }) => {
  const [ showInfoModal, setShowInfoModal ] = useState(false)
  const img = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60'
  const [ info, setInfo ] = useState(null)

  // console.log("vmi: ", viewMorePossible, docTitles)

  const handleViewMore = async (doc_id) => {
    // get doc info
    console.log("view more of doc: ", doc_id)

    if (doc_id != null) {
      // fetch req 
      try {
        const resp = await fetch(`${process.env.REACT_APP_SERVERURL}/documents/byId/${doc_id}`)
        const json = await resp.json()
        setInfo(json)
        console.log('aa: ', info, " json: ", json)
      } catch (err) {
        console.error(err)
        console.log('bb: ', err)
      }
    } else {
      setInfo(null) // ???
    }

    setShowInfoModal(true)
  }

  // console.log("dttt2: ", docTitles)

  const columns = [
    {
      title: 'Company Name',
      dataIndex: 'company_name',
      key: 'company_name',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Position',
      dataIndex: 'position',
      key: 'position',
    },
    {
      title: 'Year Applied',
      dataIndex: 'year_applied',
      key: 'year_applied',
    },
    {
      title: 'Tags',
      key: 'tags',
      dataIndex: 'tags',
      render: (_, { tags }) => (
        <>
          {['Job'].map((tag) => {
            let color = tag.length > 5 ? 'geekblue' : 'green';
            if (tag === 'loser') {
              color = 'volcano';
            }
            return (
              <Tag color={color} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: viewMorePossible ? 'Action' : 'Document Used',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          {viewMorePossible && <Button 
            type="dashed" 
            style={{ 
              background: "#13c2c2", 
              borderColor: "grey",
              color: "black"
            }}
            onClick={() => handleViewMore(record.doc_id)}
          >
            View More
          </Button>}
          {!viewMorePossible && <p>{docTitles[record.doc_id]}</p>}
        </Space>
      ),
    },
  ];
  
  const data = [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
      tags: ['nice', 'developer'],
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
      tags: ['loser'],
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sydney No. 1 Lake Park',
      tags: ['cool', 'teacher'],
    },
  ];
  
  return (
    <>
      <Table columns={columns} dataSource={entries} />
      {showInfoModal && <MoreInfoModal input={info} showModal={showInfoModal} setShowModal={setShowInfoModal} />}
    </>
  )  
}

export default ResultItem