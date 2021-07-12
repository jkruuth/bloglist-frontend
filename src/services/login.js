import axios from 'axios'
const baseUrl = '/api/login'

const login = async cresentials => {
  const response = await axios.post(baseUrl, cresentials)
  return response.data
}

export default { login }