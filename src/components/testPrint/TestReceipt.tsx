import React from "react";
import { printContent } from "./content";

import { useCommon } from "../../contexts/CommonContext";
import { printReceipt } from "../../utils/printUtils";

const TestReceipt = () => {
  const { testSelected } = useCommon();
  const printerName = testSelected.name;
  const htmlContent = printContent || "<h1>Receipt</h1>";

  return (
    <>
      <button
        className="btn primary white"
        onClick={() =>
          printReceipt({ html: htmlContent, printerName, copies: 1 })
        }>
        Test Print
      </button>
      {/* <div dangerouslySetInnerHTML={{__html:printContent}}></div> */}
    </>
  );
};

export default TestReceipt;
