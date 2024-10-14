import { useState, useEffect } from 'react'

function App() {
  const [time, setTime] = useState({ hours: 0, minutes: 0, seconds: 0 })
  const [countdown, setCountdown] = useState(null)
  const [isRunning, setIsRunning] = useState(false)

  useEffect(() => {
    const savedCountdown = localStorage.getItem('countdown')
    const savedIsRunning = localStorage.getItem('isRunning')
    if (savedCountdown && savedIsRunning) {
      setCountdown(parseInt(savedCountdown))
      setIsRunning(savedIsRunning === 'true')
    }
  }, [])

  useEffect(() => {
    let timer
    if (isRunning && countdown > 0) {
      timer = setInterval(() => {
        setCountdown(prev => {
          const newValue = prev - 1
          localStorage.setItem('countdown', newValue.toString())
          return newValue
        })
      }, 1000)
    } else if (countdown === 0) {
      setIsRunning(false)
      localStorage.removeItem('countdown')
      localStorage.removeItem('isRunning')
    }
    return () => clearInterval(timer)
  }, [isRunning, countdown])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setTime(prev => ({ ...prev, [name]: parseInt(value) || 0 }))
  }

  const startCountdown = () => {
    const totalSeconds = time.hours * 3600 + time.minutes * 60 + time.seconds
    if (totalSeconds > 0) {
      setCountdown(totalSeconds)
      setIsRunning(true)
      localStorage.setItem('countdown', totalSeconds.toString())
      localStorage.setItem('isRunning', 'true')
    }
  }

  const stopCountdown = () => {
    setIsRunning(false)
    localStorage.removeItem('countdown')
    localStorage.removeItem('isRunning')
  }

  const formatTime = (timeInSeconds) => {
    const hours = Math.floor(timeInSeconds / 3600)
    const minutes = Math.floor((timeInSeconds % 3600) / 60)
    const seconds = timeInSeconds % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="app">
      <div className="content">
        <h1 className="main-heading">Stay Focused</h1>
        <p className="motivation">Every second counts. Make it happen!</p>
        {!isRunning ? (
          <div className="input-container">
            <input
              type="number"
              name="hours"
              value={time.hours}
              onChange={handleInputChange}
              placeholder="Hours"
              min="0"
            />
            <input
              type="number"
              name="minutes"
              value={time.minutes}
              onChange={handleInputChange}
              placeholder="Minutes"
              min="0"
              max="59"
            />
            <input
              type="number"
              name="seconds"
              value={time.seconds}
              onChange={handleInputChange}
              placeholder="Seconds"
              min="0"
              max="59"
            />
            <button onClick={startCountdown}>Start Countdown</button>
          </div>
        ) : (
          <div className="countdown">
            <h2 className="countdown-heading">Time Remaining</h2>
            <h1>{formatTime(countdown)}</h1>
            <p className="motivation">Stay focused, you've got this!</p>
            <button onClick={stopCountdown} className="stop-button">Stop</button>
          </div>
        )}
      </div>
      <footer className="footer">
        Made by Akshat Jangid
      </footer>
    </div>
  )
}

export default App