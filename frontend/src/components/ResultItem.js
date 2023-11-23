import { useState } from 'react'
import MoreInfoModal from './MoreInfoModal'

const ResultItem = ({ viewMorePossible, headings, entries }) => {
  const [ showInfoModal, setShowInfoModal ] = useState(false)
  const img = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60'
  const [ info, setInfo ] = useState(null)

  if (headings == null) {
    headings = ['Company', 'Position', 'Year Applied']
  }

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

    return (
      <div className="flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {headings?.map((header) => 
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                    )}
                    {/* <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Position
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Year Applied
                    </th> */}
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {entries?.map((entry) => (
                    <tr key={entry.company_name}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img className="h-10 w-10 rounded-full" src={img} alt="" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{entry.company_name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{entry.position}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.year_applied}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {viewMorePossible && <a onClick={() => handleViewMore(entry.doc_id)} href="#" className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-indigo-600 hover:text-indigo-900">
                          View More
                        </a>}
                        {!viewMorePossible && entry.doc_id}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {showInfoModal && <MoreInfoModal input={info} showModal={showInfoModal} setShowModal={setShowInfoModal} />}
      </div>
    )
  }

export default ResultItem