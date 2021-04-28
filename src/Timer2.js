import useInterval from "@use-it/interval";
import {useState} from "react";

export default function Timer2() {
    const INTERVAL_UPDATE_APP_TO_BETSCOOP = 10000
    const INTERVAL_UPDATE_BETSCOOP_TO_BETDATA = 6000

    const [timer, setTimer] = useState(0)
    const [running, setRunning] = useState(false)
    const [cartel, setCartel] = useState(0)
    const [timeRemaining, setTimeRemaining] = useState("")
    const [relojInverso, setRelojInverso] = useState("")

    const [cartelBetscoop, setCartelBetscoop] = useState(0)
    const [timerBetscoop, setTimerBetscoop] = useState(0)
    const [runningBetscoop, setRunningBetscoop] = useState(false)
    const [timeRemainingBetscoop, setTimeRemainingBetscoop] = useState("")

    const [timerApp, setTimerApp] = useState(0)
    const [runningApp, setRunningApp] = useState(false)
    const [timeRemainingApp, setTimeRemainingApp] = useState("")

    const startTimer = () => {
        setRunning(true)
    }

    const stopTimer = () => {
        setRunning(false)
    }

// TICKER BETDATA
    useInterval(() => {
        if (running) {
            if (relojInverso)
                setTimer(old => --old)
            else
                setTimer(old => ++old)
        }
    }, 1000)

// TICKER APP
    useInterval(() => {
        if (runningApp) {
            if (relojInverso)
                setTimerApp(old => --old)
            else
                setTimerApp(old => ++old)
        }
        if (cartel > 0)
            setCartel(old => --old)
        if (cartelBetscoop > 0)
            setCartelBetscoop(old => --old)
    }, 1000)

    // FETCH APP FROM BETSCOOP
    useInterval(() => {
        setTimerApp(timerBetscoop)
        setRunningApp(runningBetscoop)
        setTimeRemainingApp(timeRemainingBetscoop)
        setCartelBetscoop(1)
    }, INTERVAL_UPDATE_APP_TO_BETSCOOP)

    // FETCH BETSCOOP FROM BETDATA
    useInterval(() => {
        setTimerBetscoop(timer)
        setRunningBetscoop(running)
        setTimeRemainingBetscoop(timeRemaining)
        setCartel(1)
    }, INTERVAL_UPDATE_BETSCOOP_TO_BETDATA)

    const parseTimeRemaining = num => {
        const minutes = Math.trunc(num / 60)
        const seconds = num % 60

        return `${timeRemaining} ${minutes}:${seconds}`
    }

    return (
        <div className="App">
            <div className="project">
                <h3>Betdata</h3>
                <input disabled={running} type="text" value={timeRemaining}
                       onChange={event => setTimeRemaining(event.target.value)}/>
                <input disabled={running} type="text" value={timer} onChange={event => setTimer(event.target.value)}/>
                <button onClick={startTimer}>Play</button>
                <button onClick={stopTimer}>Stop</button>
                <br/>
                <input disabled={running} type='checkbox'
                       onChange={event => setRelojInverso(event.target.checked)}/> Reloj Inverso
                <ul>
                    <li><b>Reloj inverso</b>: {relojInverso ? 'Si' : 'No'}</li>
                    <li><b>Timer</b>: {timer}</li>
                    <li><b>Time remaining</b>: {parseTimeRemaining(timer)}</li>
                    <li><b>Status</b>: {running ? 'Active' : 'Paused'}</li>
                </ul>
            </div>
            <div className="project">
                <h3>Betscoop {cartelBetscoop > 0 ? '(TICK)' : ''}</h3>
                <ul>
                    <li><b>Runs every: </b> {INTERVAL_UPDATE_BETSCOOP_TO_BETDATA / 1000} seconds</li>
                    <li><b>Timer</b>: {timerBetscoop}</li>
                    <li><b>Time remaining</b>: {parseTimeRemaining(timerBetscoop)}</li>
                    <li><b>Status</b>: {runningBetscoop ? "Active" : "Paused"}</li>
                </ul>
            </div>
            <div className="project">
                <h3>Mobile app {cartel > 0 ? '(TICK)' : ''}</h3>
                <ul>
                    <li><b>Runs every: </b> {INTERVAL_UPDATE_APP_TO_BETSCOOP / 1000} seconds</li>
                    <li><b>Timer</b>: {timerApp}</li>
                    <li><b>Time remaining</b>: {parseTimeRemaining(timerApp)}</li>
                    <li><b>Status</b>: {runningApp ? "Active" : "Paused"}</li>
                </ul>
            </div>
        </div>
    );
}