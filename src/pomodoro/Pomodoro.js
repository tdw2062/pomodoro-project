import React, { useState } from "react";
import classNames from "../utils/class-names";
import useInterval from "../utils/useInterval";
import SessionDisplay from "./SessionDisplay";
import { minutesToDuration } from "../utils/duration/index.js";

// These functions are defined outside of the component to insure they do not have access to state
// and are, therefore more likely to be pure.

/**
 * Update the session state with new state after each tick of the interval.
 * @param prevState
 *  the previous session state
 * @returns
 *  new session state with timing information updated.
 */
function nextTick(prevState) {
  const timeRemaining = Math.max(0, prevState.timeRemaining - 1);
  return {
    ...prevState,
    timeRemaining,
  };
}

/**
 * Higher order function that returns a function to update the session state with the next session type upon timeout.
 * @param focusDuration
 *    the current focus duration
 * @param breakDuration
 *    the current break duration
 * @returns
 *  function to update the session state.
 * /
 
 
 */

function nextSession(focusDuration, breakDuration) {
  /**
   * State function to transition the current session type to the next session. e.g. On Break -> Focusing or Focusing -> On Break
   */
  return (currentSession) => {
    if (currentSession.label === "Focusing") {
      return {
        label: "On Break",
        timeRemaining: breakDuration * 60,
      };
    }

    return {
      label: "Focusing",
      timeRemaining: focusDuration * 60,
    };
  };
}

function Pomodoro() {
  // Timer starts out paused
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  // The current session - null where there is no session running
  const [session, setSession] = useState(null);

  //Allows the user to adjust the focus and break duration.
  const [focusDuration, setFocusDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);

  //These four functions will work to allow the buttons to change the focus and break durations
  function incrFocusDuration() {
    setFocusDuration((current) => Math.min(current + 5, 60));
  }

  function decrFocusDuration() {
    setFocusDuration((current) => Math.max(current - 5, 5));
  }

  function incrBreakDuration() {
    setBreakDuration((current) => Math.min(current + 1, 15));
  }

  function decrBreakDuration() {
    setBreakDuration((current) => Math.max(current - 1, 1));
  }

  //Create states for the stop btn and to change focus and break durations
  const [toggleStopBtn, setToggleStopBtn] = useState(true);
  const [toggleAdjusters, setToggleAdjusters] = useState(false);

  //This function turns off the active session and toggles the stop button as well as the focus/break adjusters
  function toggleActiveSession() {
    setSession(null);
    setIsTimerRunning(false);
    setToggleStopBtn(true);
    setToggleAdjusters(false);
  }

  /**
   * Custom hook that invokes the callback function every second
   *
   * NOTE: You will not need to make changes to the callback function
   */
  useInterval(
    () => {
      if (session.timeRemaining === 0) {
        new Audio("https://bigsoundbank.com/UPLOAD/mp3/1482.mp3").play();
        return setSession(nextSession(focusDuration, breakDuration));
      }
      return setSession(nextTick);
    },
    isTimerRunning ? 1000 : null
  );

  /**
   * Called whenever the play/pause button is clicked.
   */
  function playPause() {
    setIsTimerRunning((prevState) => {
      const nextState = !prevState;
      if (nextState) {
        setSession((prevStateSession) => {
          // If the timer is starting and the previous session is null,
          // start a focusing session.
          if (prevStateSession === null) {
            //Before starting focusing session, first toggle the disabled state of stop button and focus/break adjusters
            setToggleStopBtn(false);
            setToggleAdjusters(true);
            return {
              label: "Focusing",
              timeRemaining: focusDuration * 60,
            };
          }
          return prevStateSession;
        });
      }
      return nextState;
    });
  }

  return (
    <div className="pomodoro">
      <div className="row">
        <div className="col">
          <div className="input-group input-group-lg mb-2">
            <span className="input-group-text" data-testid="duration-focus">
              {/* Updates text to display the current focus session duration */}
              Focus Duration: {minutesToDuration(focusDuration)}
            </span>
            <div className="input-group-append">
              {/*Implements decreasing focus duration and disable during a focus or break session */}
              <button
                type="button"
                className="btn btn-secondary"
                data-testid="decrease-focus"
                onClick={decrFocusDuration}
                disabled={toggleAdjusters}
              >
                <span className="oi oi-minus" />
              </button>
              {/*Implements increasing focus duration  and disable during a focus or break session */}
              <button
                type="button"
                className="btn btn-secondary"
                data-testid="increase-focus"
                onClick={incrFocusDuration}
                disabled={toggleAdjusters}
              >
                <span className="oi oi-plus" />
              </button>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="float-right">
            <div className="input-group input-group-lg mb-2">
              <span className="input-group-text" data-testid="duration-break">
                {/*Updates this text to display the current break session duration */}
                Break Duration: {minutesToDuration(breakDuration)}
              </span>
              <div className="input-group-append">
                {/*Implements decreasing break duration and disable during a focus or break session*/}
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-testid="decrease-break"
                  onClick={decrBreakDuration}
                  disabled={toggleAdjusters}
                >
                  <span className="oi oi-minus" />
                </button>
                {/*Implements increasing break duration and disable during a focus or break session*/}
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-testid="increase-break"
                  onClick={incrBreakDuration}
                  disabled={toggleAdjusters}
                >
                  <span className="oi oi-plus" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <div
            className="btn-group btn-group-lg mb-2"
            role="group"
            aria-label="Timer controls"
          >
            <button
              type="button"
              className="btn btn-primary"
              data-testid="play-pause"
              title="Start or pause timer"
              onClick={playPause}
            >
              <span
                className={classNames({
                  oi: true,
                  "oi-media-play": !isTimerRunning,
                  "oi-media-pause": isTimerRunning,
                })}
              />
            </button>
            {/*Implements stopping the current focus or break session. and disable the stop button when there is no active session */}
            {/*Disables the stop button when there is no active session */}
            <button
              type="button"
              className="btn btn-secondary"
              data-testid="stop"
              title="Stop the session"
              onClick={toggleActiveSession}
              disabled={toggleStopBtn}
            >
              <span className="oi oi-media-stop" />
            </button>
          </div>
        </div>
      </div>
      {/*Display title, subtitle, and progress bar to show time remaining*/}
      <div>
        <SessionDisplay
          session={session}
          breakDuration={breakDuration}
          focusDuration={focusDuration}
        />
      </div>
    </div>
  );
}

export default Pomodoro;
