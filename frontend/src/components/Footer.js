/** @format */

import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { CURRENT_VERSION } from "../constants/enviromentConstants";

const Footer = () => {
  return (
    <footer id="main-footer">
      <Container>
        <Row>
          <Col className="text-center py-3">
            Esta version es un DEMO para probar la automatización. <br />
            Oncare Encuestas version {CURRENT_VERSION}
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
