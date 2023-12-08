/** @format */

import React from "react";
import KuarsisCarousel from "../components/KuarsisCarousel";
import KuarsisMainWithSides from "../components/KuarsisMainWithSides";

const BusinessInformationScreen = () => {
  return (
    <section>
      <section>
        <KuarsisCarousel pageToDisplay="Sistema-Encuestas" />
      </section>
      <section className="mt-2">
        <KuarsisMainWithSides pageToDisplay="Sistema-Encuestas" />
      </section>
    </section>
  );
};

export default BusinessInformationScreen;
