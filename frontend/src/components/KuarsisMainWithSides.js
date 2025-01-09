import React from 'react'
import { PageSettings } from '../database'
import { Col, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'

const KuarsisMainWithSides = ({ pageToDisplay }) => {
  const pageSettings = PageSettings.find(
    (page) => page.pageName === pageToDisplay
  )

  return (
    <div>
      <Row>
        <Col xs={8} className=''>
          <h1>{pageSettings.title1}</h1>
          <p>{pageSettings.description1}</p>
          <h1>{pageSettings.title2}</h1>
          <p>{pageSettings.description2}</p>
          <h1>{pageSettings.title3}</h1>
          <ul>
            {pageSettings.description3.map((description) => (
              <li key={description.descId}>{description.desc.toString()}</li>
            ))}
          </ul>
        </Col>
        <Col>
          <div className='sidebar'>
            {pageSettings.sidebar.map((sidebar) => (
              <div key={sidebar.sidebarId}>
                {sidebar.sidebarText.toString()}
                <br />
                <br />
              </div>
            ))}
            {/* <div> */}
            {/* {pageSettings.linkToCompanyWebsite ? (
              <p>
                To visit {pageSettings.pageName} webpage click{' '}
                <Link
                  to={pageSettings.linkToCompanyWebsite}
                  className='sidebarLink'
                >
                  here
                </Link>{' '}
              </p>
            ) : (
              ''
            )} */}
            {/* </div> */}
          </div>
        </Col>
      </Row>
    </div>
  )
}

export default KuarsisMainWithSides
