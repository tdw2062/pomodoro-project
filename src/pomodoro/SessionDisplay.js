import React, { useState } from "react";
import classNames from "../utils/class-names";
import useInterval from "../utils/useInterval";
import {
  secondsToDuration,
  minutesToDuration,
} from "../utils/duration/index.js";
import ProgressBar from "./ProgressBar";

function SessionDisplay({ session, breakDuration, focusDuration }) {
  //Only return html if the session is not null
  if (session !== null) {
    return (
      <div>
        {/*This area displays only when there is an active focus or break - i.e. the session is running or is paused */}
        <div className="row mb-2">
          <div className="col">
            {/*Updates message below to include current session (Focusing or On Break) total duration */}
            <h2 data-testid="session-title">
              {session?.label} for{" "}
              {minutesToDuration(
                session?.label === "Focusing" ? focusDuration : breakDuration
              )}{" "}
              minutes
            </h2>
            {/*Updates message below correctly format the time remaining in the current session */}
            <p className="lead" data-testid="session-sub-title">
              {secondsToDuration(session?.timeRemaining)} remaining
            </p>
          </div>
        </div>
        {/*Display Progress Bar*/}
        <ProgressBar
          session={session}
          breakDuration={breakDuration}
          focusDuration={focusDuration}
        />
      </div>
    );
  } else {
    return null;
  }
}

export default SessionDisplay;
