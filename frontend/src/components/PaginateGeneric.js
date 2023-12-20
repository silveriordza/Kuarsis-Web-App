/** @format */

import React from "react";
import { Pagination } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { LogThis, LoggerSettings, L3, L1 } from "../libs/Logger";

const PaginateGeneric = ({
  onClick,
  selectedSurveyIndex,
  pages,
  page,
  keyword = "",
}) => {
  const log = new LoggerSettings("PaginateGeneric.js", "PaginateGeneric");
  LogThis(
    log,
    `selectedSurveyIndex=${selectedSurveyIndex}; pages=${pages}; page=${page}; keyword=${keyword}`,
    L3
  );
  return (
    pages > 1 && (
      <div className="pagination-container">
        <div>Páginas: </div>
        <Pagination>
          {[...Array(pages).keys()].map((x) => (
            <LinkContainer
              key={x + 1}
              to={`/admin/surveyoutput/survey/${selectedSurveyIndex}/page/${
                x + 1
              }`}
            >
              <Pagination.Item
                onClick={onClick}
                activeLabel=""
                active={x + 1 === page}
              >
                {x + 1}
              </Pagination.Item>
            </LinkContainer>
          ))}
        </Pagination>
      </div>
    )
  );
};

export default PaginateGeneric;
