import React, { useEffect, useState } from "react";
import { UdMessageNotification } from "..";
import { centerMsgBus, http, udConfigProvider } from "../../../..";
import { BASE_TAG_AND_TOPIC, PROJECT_CODES } from "../ModalMessageCard/constants";

// udConfigProvider.http.requestBefore = (data) => {
//   data.headers.authorization =
//     "eyJhbGciOiJIUzI1NiIsInppcCI6IkRFRiJ9.eNpUjssKwjAURP_lrhtI09ok3RURcaG4cBmQmF4kokloU7QU_934Al3POTMzAd4C1HlV0pxXlM8y0MHu4xgQalg3m2a5gAx6e3T7aC_4RAspuWAJpmUGxruILiZ4Uk91l0wFtfq4CjIFvR86g9vOn9DEuW_fwKD1T9qEcLZGR-vdNyVHHfGqxxdlzjbNrNo_deixc_ry7hO0YEJQBfd0-BRtumQkYsslJabAgpQzXhEhpCB5dWC5Zi3jBwH3BwAAAP__.0cIFmcyXNhgSXiOW5leoimK5LqzDOa_seLe0b4QgSBI";
//   return data;
// };

const Demo = () => {
  const [isInit, setIsInit] = useState<boolean>(false)
  useEffect(() => {
    const initOptions = {
      baseURL: "https://cp-tbs-test.1919.cn",
      clientType: "ManageUser",
      projectCode: "uaa",
      username: "8032880",
      checkOrigin: () => {
        return true;
      },
    };
    // centerMsgBus.init(initOptions);
    // setIsInit(true)
  }, []);

  return (
    <div>
      {isInit &&
      <UdMessageNotification
        getProjectCodes={() => PROJECT_CODES}
        msgModel={{...BASE_TAG_AND_TOPIC, autoCreateTopic: true, tag: '8032880'}}
      />}
    </div>
  );
};

export default Demo;
