import React, { useState } from "react";
import classNames from "../utils/class-names";
import useInterval from "../utils/useInterval";
import { secondsToDuration } from "../utils/duration/index.js";

function ProgressBar({ session, breakDuration, focusDuration }) {
  //Calculate Percent Complete to use in Progress Bar
  let percentComplete =
    100 -
    Math.floor(
      (session?.timeRemaining * 100) /
        ((session?.label === "Focusing" ? focusDuration : breakDuration) * 60)
    );

  return (
    <div className="row mb-2">
      <div className="col">
        <div className="progress" style={{ height: "20px" }}>
          <div
            className="progress-bar"
            role="progressbar"
            aria-valuemin="0"
            aria-valuemax="100"
            aria-valuenow={`${percentComplete}`} //Increases aria-valuenow as elapsed time increases
            style={{ width: `${percentComplete}%` }} //Increases width % as elapsed time increases
          />
        </div>
      </div>
    </div>
  );
}

export default ProgressBar;
