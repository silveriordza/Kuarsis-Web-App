import React from 'react'
import { BusinessConfigurations } from '../businessconfigurations'
import { Col, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'

const KuarsisMainWithSides = ({ pageToDisplay }) => {
  const businessConfiguration = BusinessConfigurations.find(
    (page) => page.pageName === pageToDisplay
  )

  return (
    <div>
      <Row>
        <Col xs={8} className=''>
          <h1>{businessConfiguration.title1}</h1>
          <p>{businessConfiguration.description1}</p>
          <h1>{businessConfiguration.title2}</h1>
          <p>{businessConfiguration.description2}</p>
          <h1>{businessConfiguration.title3}</h1>
          <ul>
            {businessConfiguration.description3.map((description) => (
              <li key={description.descId}>{description.desc.toString()}</li>
            ))}
          </ul>
        </Col>
        <Col>
          <div className='sidebar'>
            {businessConfiguration.sidebar.map((sidebar) => (
              <div key={sidebar.sidebarId}>
                {sidebar.sidebarText.toString()}
                <br />
                <br />
              </div>
            ))}
            {/* <div> */}
            {businessConfiguration.linkToCompanyWebsite ? (
              <p>
                To visit {businessConfiguration.pageName} webpage click{' '}
                <Link
                  to={businessConfiguration.linkToCompanyWebsite}
                  className='sidebarLink'
                >
                  here
                </Link>{' '}
              </p>
            ) : (
              ''
            )}
            {/* </div> */}
          </div>
        </Col>
      </Row>
    </div>
  )
}

export default KuarsisMainWithSides
