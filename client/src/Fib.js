import { useEffect, useState } from 'react'
import axios from 'axios'

export default function Fib() {
  const [seenIndexes, setSeenIndexes] = useState([])
  const [values, setValues] = useState({})
  const [index, setIndex] = useState('')

  const fetchValues = async () => {
    const values = await axios.get('/api/values/current')
    setValues(values.data)
  }

  const fetchIndexes = async () => {
    const { data } = await axios.get('/api/values/all')
    setSeenIndexes(data)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    await axios.post('/api/values', {
      index
    })

    setIndex('')
  }

  useEffect(() => {
    async function fetchData() {
      await fetchValues()
      await fetchIndexes()
    }

    fetchData()
  }, [])

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="">Enter your index: &nbsp;</label>
        <input
          type="text"
          value={index}
          onChange={(e) => setIndex(e.target.value)}
        />
        <button>Submit</button>
      </form>

      <h3>Indexes I have seen:</h3>
      {
        seenIndexes.map(({ number }) => number).join(', ')
      }
      <h3>Calculated values:</h3>
      {
        Object.keys(values).map(key => <div key={key}>
          For index {key} I calculated {values[key]}
        </div>)
      }
    </div>
  )
}