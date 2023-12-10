/** @format */

import React from "react";
import { Pagination } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { LogThis, LoggerSettings, L3 } from "../libs/Logger";

const PaginateGeneric = ({
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
      <Pagination>
        {[...Array(pages).keys()].map((x) => (
          <LinkContainer
            key={x + 1}
            to={
              keyword
                ? `/admin/surveyoutput/survey/${selectedSurveyIndex}/keyword/${keyword}/page/${
                    x + 1
                  }`
                : `/admin/surveyoutput/survey/${selectedSurveyIndex}/page/${
                    x + 1
                  }`
            }
          >
            <Pagination.Item activeLabel="" active={x + 1 === page}>
              {x + 1}
            </Pagination.Item>
          </LinkContainer>
        ))}
      </Pagination>
    )
  );
};

export default PaginateGeneric;
